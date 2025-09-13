// handlers/schemas.ts

export const ageVerificationSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      // Allow any properties in the body since we accept arbitrary payloads
      additionalProperties: true,
    },
  },
  required: ["body"],
};

// API Gateway schema (separate from middleware schema)
// helpers/schemas.ts

import { JsonSchema, JsonSchemaType } from "aws-cdk-lib/aws-apigateway";

// Schema for age verification endpoint - accepts any JSON payload
export const ageVerificationSchemaForAPIGW: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  additionalProperties: true, // Allow any properties
  properties: {
    // We don't require specific properties since we accept arbitrary payloads
    // The validation is minimal to allow flexibility
  },
};
