// constructs/api.ts

import { Construct } from "constructs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as logs from "aws-cdk-lib/aws-logs";
import { LambdaConstruct } from "./lambda";
import { ageVerificationSchemaForAPIGW } from "../helpers/schemas";

/**
 * ApiGatewayConstruct
 * Creates a REST API with two endpoints:
 *   - POST /v1/verify (age verification)
 *   - GET /.well-known/keys (public keys for verification)
 */
export class ApiGatewayConstruct extends Construct {
  public readonly api: apigateway.RestApi;

  constructor(
    scope: Construct,
    id: string,
    lambdaConstruct: LambdaConstruct,
    stackName: string,
  ) {
    super(scope, id);

    // Create the log group for access logs
    const logGroup = new logs.LogGroup(this, `${stackName}-api-logs`, {
      retention: logs.RetentionDays.TWO_WEEKS,
    });

    // Create the API Gateway
    this.api = new apigateway.RestApi(this, stackName, {
      restApiName: stackName,
      cloudWatchRole: true,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"], // Update to specific domains in production
        allowMethods: ["GET", "POST", "OPTIONS"],
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
      deployOptions: {
        stageName: "prod",
        tracingEnabled: true,
        dataTraceEnabled: false,
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
        accessLogFormat: apigateway.AccessLogFormat.jsonWithStandardFields(),
        throttlingBurstLimit: 100,
        throttlingRateLimit: 50,
      },
    });

    // Setup validation models
    const { bodyValidator, ageVerificationModel } = this.setupValidation();

    // Configure CORS for 4xx/5xx responses
    this.setupErrorResponses();

    // Create /v1 resource
    const v1 = this.api.root.addResource("v1");

    // Age verification endpoint: POST /v1/verify
    // Age verification endpoint: POST /v1/verify
    const verifyResource = v1.addResource("verify");
    verifyResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(
        lambdaConstruct.ageVerificationFunction,
        {
          passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
          integrationResponses: [
            {
              statusCode: "200",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'",
                "method.response.header.Access-Control-Allow-Headers": "'*'",
                "method.response.header.Access-Control-Allow-Methods":
                  "'OPTIONS,POST'",
              },
            },
            // Add error response integration
            {
              statusCode: "400",
              responseParameters: {
                "method.response.header.Access-Control-Allow-Origin": "'*'",
                "method.response.header.Access-Control-Allow-Headers": "'*'",
                "method.response.header.Access-Control-Allow-Methods":
                  "'OPTIONS,POST'",
              },
            },
          ],
        },
      ),
      {
        // requestValidator: bodyValidator,
        // requestModels: {
        //   "application/json": ageVerificationModel,
        // },
        requestParameters: {
          "method.request.header.Content-Type": true,
        },
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
          },
          {
            statusCode: "400",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Origin": true,
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Methods": true,
            },
          },
        ],
      },
    );

    // Create /.well-known resource
    const wellKnown = this.api.root.addResource(".well-known");

    // Public keys endpoint: GET /.well-known/keys
    const keys = wellKnown.addResource("keys");
    keys.addMethod(
      "GET",
      new apigateway.LambdaIntegration(lambdaConstruct.publicKeyFunction, {
        passthroughBehavior: apigateway.PassthroughBehavior.WHEN_NO_MATCH,
      }),
    );

    // Optional: Add a health check endpoint
    const health = this.api.root.addResource("health");
    health.addMethod(
      "GET",
      new apigateway.MockIntegration({
        integrationResponses: [
          {
            statusCode: "200",
            responseTemplates: {
              "application/json": JSON.stringify({ status: "healthy" }),
            },
          },
        ],
        passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
        requestTemplates: {
          "application/json": '{"statusCode": 200}',
        },
      }),
      {
        methodResponses: [{ statusCode: "200" }],
      },
    );
  }

  /**
   * Setup request validation models
   */
  private setupValidation() {
    const bodyValidator = new apigateway.RequestValidator(
      this,
      "BodyValidator",
      {
        restApi: this.api,
        validateRequestBody: true,
        validateRequestParameters: false,
      },
    );

    const ageVerificationModel = new apigateway.Model(
      this,
      "AgeVerificationModel",
      {
        restApi: this.api,
        contentType: "application/json",
        schema: ageVerificationSchemaForAPIGW,
        modelName: "AgeVerificationModel",
      },
    );

    return { ageVerificationModel, bodyValidator };
  }

  /**
   * Setup CORS for error responses
   */
  private setupErrorResponses() {
    this.api.addGatewayResponse("Default4xx", {
      type: apigateway.ResponseType.DEFAULT_4XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Headers": "'Content-Type,Authorization'",
        "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
      },
    });

    this.api.addGatewayResponse("Default5xx", {
      type: apigateway.ResponseType.DEFAULT_5XX,
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
        "Access-Control-Allow-Headers": "'Content-Type,Authorization'",
        "Access-Control-Allow-Methods": "'OPTIONS,POST,GET'",
      },
    });
  }
}
