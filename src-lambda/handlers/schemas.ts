// helpers/schemas.ts

import { JsonSchema, JsonSchemaType } from "aws-cdk-lib/aws-apigateway";

// Schema for age verification endpoint - accepts any JSON payload
export const ageVerificationSchemaForAPIGW: JsonSchema = {
  type: JsonSchemaType.OBJECT,
  additionalProperties: true, // Allow any properties
  properties: {
    // Minimal validation - we accept arbitrary JSON payloads
    // The actual validation happens in the Lambda if needed
  },
};

// That's it - we only need this one schema
