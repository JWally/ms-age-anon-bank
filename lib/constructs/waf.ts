// constructs/waf.ts

import * as cdk from "aws-cdk-lib";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";

interface WafConstructProps {
  environment: string;
  apiGateway: cdk.aws_apigateway.RestApi;
}

/**
 * WafConstruct
 * Provides Web Application Firewall protection for the age verification API
 */
export class WafConstruct extends Construct {
  public readonly webAcl: wafv2.CfnWebACL;

  constructor(scope: Construct, id: string, props: WafConstructProps) {
    super(scope, id);

    const { environment, apiGateway } = props;

    // Create WAF ACL with sensible rules for age verification service
    this.webAcl = new wafv2.CfnWebACL(this, `${environment}-age-verify-waf`, {
      defaultAction: { allow: {} },
      scope: "REGIONAL",
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: `${environment}-age-verify-waf-metrics`,
        sampledRequestsEnabled: true,
      },
      rules: [
        // 1) Rate limiting per IP (prevent abuse)
        {
          name: "RateLimitPerIP",
          priority: 1,
          statement: {
            rateBasedStatement: {
              limit: 100, // 100 requests per 5 minutes per IP
              aggregateKeyType: "IP",
            },
          },
          action: {
            block: {
              customResponse: {
                responseCode: 429,
                customResponseBodyKey: "RateLimitExceeded",
              },
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${environment}-RateLimit`,
          },
        },

        // 2) Body size limit (prevent DoS via large payloads)
        {
          name: "MaxBodySize",
          priority: 2,
          statement: {
            sizeConstraintStatement: {
              fieldToMatch: { body: { oversizeHandling: "CONTINUE" } },
              textTransformations: [{ priority: 0, type: "NONE" }],
              comparisonOperator: "GT",
              size: 10240, // 10 KB max body size
            },
          },
          action: {
            block: {
              customResponse: {
                responseCode: 413,
                customResponseBodyKey: "PayloadTooLarge",
              },
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${environment}-BodySizeLimit`,
          },
        },

        // 3) Block requests without proper content-type for POST
        {
          name: "RequireJsonContentType",
          priority: 3,
          statement: {
            andStatement: {
              statements: [
                {
                  byteMatchStatement: {
                    fieldToMatch: { method: {} },
                    positionalConstraint: "EXACTLY",
                    searchString: "POST",
                    textTransformations: [{ priority: 0, type: "NONE" }],
                  },
                },
                {
                  notStatement: {
                    statement: {
                      byteMatchStatement: {
                        fieldToMatch: {
                          singleHeader: { name: "content-type" },
                        },
                        positionalConstraint: "CONTAINS",
                        searchString: "application/json",
                        textTransformations: [
                          { priority: 0, type: "LOWERCASE" },
                        ],
                      },
                    },
                  },
                },
              ],
            },
          },
          action: {
            block: {
              customResponse: {
                responseCode: 415,
                customResponseBodyKey: "UnsupportedMediaType",
              },
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${environment}-ContentTypeCheck`,
          },
        },

        // 4) Geo-blocking (optional - uncomment and modify as needed)
        /*
        {
          name: "GeoBlock",
          priority: 4,
          statement: {
            geoMatchStatement: {
              countryCodes: ["CN", "RU", "KP"], // Example blocked countries
            },
          },
          action: { 
            block: {
              customResponse: {
                responseCode: 403,
                customResponseBodyKey: "GeoBlocked",
              },
            },
          },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: `${environment}-GeoBlock`,
          },
        },
        */
      ],

      customResponseBodies: {
        RateLimitExceeded: {
          content: '{"error":"Rate limit exceeded. Please try again later."}',
          contentType: "APPLICATION_JSON",
        },
        PayloadTooLarge: {
          content:
            '{"error":"Request payload too large. Maximum size is 10KB."}',
          contentType: "APPLICATION_JSON",
        },
        UnsupportedMediaType: {
          content: '{"error":"Content-Type must be application/json"}',
          contentType: "APPLICATION_JSON",
        },
        GeoBlocked: {
          content: '{"error":"Service not available in your region"}',
          contentType: "APPLICATION_JSON",
        },
      },
    });

    // Associate WAF with API Gateway
    new wafv2.CfnWebACLAssociation(this, `${environment}-waf-association`, {
      resourceArn: apiGateway.deploymentStage.stageArn,
      webAclArn: this.webAcl.attrArn,
    });
  }
}
