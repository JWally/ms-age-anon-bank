// helpers/constants.ts

// Secret name in AWS Secrets Manager
export const SECURITY_KEY_NAME = "age-verification-keys";

// Cache duration: 15 minutes (configurable)
export const KEY_CACHE_DURATION: number = 1000 * 60 * 15;

// Default security headers for API responses
export const DEFAULT_HEADERS = {
  "Content-Security-Policy": "default-src 'self'",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Download-Options": "noopen",
  "X-Frame-Options": "DENY",
  "X-Permitted-Cross-Domain-Policies": "none",
  "Referrer-Policy": "no-referrer",
  "X-XSS-Protection": "1; mode=block",
} as const;

// List of allowed headers for CORS
export const ALLOWED_HEADERS = [
  "Content-Type",
  "X-Amz-Date",
  "Authorization",
  "X-Api-Key",
  "X-Amz-Security-Token",
  "X-Amz-User-Agent",
  "Accept",
  "Accept-Language",
  "Content-Language",
  "Origin",
  "X-Requested-With",
];

// CORS configuration
export const HARDENED_ORIGIN = "*"; // Update this to specific domains in production

// Warmup event for Lambda keepalive
export const WARMUP_EVENT = {
  source: "serverless-plugin-warmup",
  event: {
    source: "warmup",
    type: "keepalive",
  },
};

// Error messages
export const ERROR_STRINGS = {
  KEY_ARN_NOT_SET: "Environment variable SECRET_ARN must be set",
  CANNOT_PARSE_JSON: "Cannot parse JSON data",
  CANNOT_VERIFY_SIGNATURE: "Cannot verify signature",
  INVALID_KEY_ID: "Invalid or expired key ID",
  NO_IP_ADDRESS: "No IP address in request context",
  NO_BODY: "Request body is required",
};

// Environment variable names
export const SECRET_ARN: string | undefined = process.env.SECRET_ARN;
export const POWERTOOLS_METRICS_NAMESPACE: string | undefined =
  process.env.POWERTOOLS_METRICS_NAMESPACE;
export const POWERTOOLS_SERVICE_NAME: string | undefined =
  process.env.POWERTOOLS_SERVICE_NAME || "age-verification-service";

// Key rotation settings
export const KEY_ROTATION_DAYS = 90; // Rotate every 90 days
export const KEY_GRACE_PERIOD_DAYS = 30; // Keep old key for 30 days
