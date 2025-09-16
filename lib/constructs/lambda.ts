// constructs/lambda.ts

import * as path from "path";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import { Duration } from "aws-cdk-lib";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { SecretConstruct } from "./secrets";

interface LambdaConstructProps {
  environment: string;
  stackName: string;
  stage: string;
  projectName: string;
  secretConstruct: SecretConstruct;
  domain: string;
}

/**
 * LambdaConstruct
 * Creates two Lambda functions for age verification service:
 *  - Age verification function (signs payloads)
 *  - Public key function (serves public keys for verification)
 */
export class LambdaConstruct extends Construct {
  public readonly ageVerificationFunction: lambda.NodejsFunction;
  public readonly publicKeyFunction: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    const { environment, stackName, secretConstruct, domain } = props;

    // Common Lambda configuration
    const commonConfig = {
      runtime: Runtime.NODEJS_20_X,
      memorySize: 512, // Reduced from 1024 - these are simple operations
      timeout: Duration.seconds(10), // Reduced from 30 - signing is fast
      bundling: {
        minify: true,
        sourceMap: false, // Disable in production for smaller packages
        target: "node20",
        keepNames: true,
        format: OutputFormat.CJS,
        mainFields: ["module", "main"],
        environment: { NODE_ENV: "production" },
      },
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
        ENVIRONMENT: environment,
        POWERTOOLS_SERVICE_NAME: stackName,
        POWERTOOLS_METRICS_NAMESPACE: stackName,
        LOG_LEVEL: environment === "prod" ? "INFO" : "DEBUG",
        SECRET_ARN: secretConstruct.secret.secretArn,
        KEY_CACHE_DURATION_MS: "900000", // 15 minutes
        DOMAIN: domain,
      },
      tracing: Tracing.ACTIVE,
      logRetention: RetentionDays.TWO_WEEKS,
    };

    // Create age verification Lambda
    this.ageVerificationFunction = new lambda.NodejsFunction(
      this,
      `${stackName}-age-verification`,
      {
        ...commonConfig,
        entry: path.join(
          __dirname,
          "../../src-lambda/handlers/end-points/age-verification.ts",
        ),
        functionName: `${stackName}-age-verification`,
        description: "Handles age verification requests with payload signing",
        reservedConcurrentExecutions: 10, // Prevent runaway scaling
      },
    );

    // Create public key Lambda
    this.publicKeyFunction = new lambda.NodejsFunction(
      this,
      `${stackName}-public-key`,
      {
        ...commonConfig,
        entry: path.join(
          __dirname,
          "../../src-lambda/handlers/end-points/public-key.ts",
        ),
        functionName: `${stackName}-public-key`,
        description: "Serves public keys for signature verification",
        memorySize: 256, // Even smaller for this simple function
        reservedConcurrentExecutions: 5, // Lower concurrency for read-only endpoint
      },
    );

    // Grant secrets read access to both functions
    secretConstruct.secret.grantRead(this.ageVerificationFunction);
    secretConstruct.secret.grantRead(this.publicKeyFunction);

    // Create alarms for monitoring
    this.createAlarms();
  }

  /**
   * Create CloudWatch alarms for monitoring
   */
  private createAlarms() {
    // Age verification function alarms
    new cloudwatch.Alarm(this, "AgeVerificationErrors", {
      metric: this.ageVerificationFunction.metricErrors({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
      threshold: 10,
      evaluationPeriods: 1,
      alarmDescription: `Age verification function has >10 errors in 5 minutes`,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    new cloudwatch.Alarm(this, "AgeVerificationThrottles", {
      metric: this.ageVerificationFunction.metricThrottles({
        period: Duration.minutes(5),
        statistic: "Sum",
      }),
      threshold: 5,
      evaluationPeriods: 1,
      alarmDescription: `Age verification function is being throttled`,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    new cloudwatch.Alarm(this, "AgeVerificationDuration", {
      metric: this.ageVerificationFunction.metricDuration({
        period: Duration.minutes(5),
        statistic: "p95",
      }),
      threshold: 2000, // 2 seconds
      evaluationPeriods: 2,
      alarmDescription: `Age verification p95 latency >2s`,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // Public key function alarms (simpler, less critical)
    new cloudwatch.Alarm(this, "PublicKeyErrors", {
      metric: this.publicKeyFunction.metricErrors({
        period: Duration.minutes(15),
        statistic: "Sum",
      }),
      threshold: 5,
      evaluationPeriods: 1,
      alarmDescription: `Public key function has errors`,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
  }
}
