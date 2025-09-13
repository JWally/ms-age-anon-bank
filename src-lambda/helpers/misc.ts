// helpers/misc.ts

/**
 * Get current timestamp in ISO format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Get current timestamp in milliseconds
 */
export const getCurrentTimestampMs = (): number => {
  return Date.now();
};

/**
 * Validate if a key ID is expired based on rotation schedule
 * @param keyId - Key ID in format "sig-{timestamp}"
 * @param maxAgeMs - Maximum age in milliseconds (default 120 days)
 */
export const isKeyExpired = (
  keyId: string,
  maxAgeMs: number = 120 * 24 * 60 * 60 * 1000,
): boolean => {
  try {
    const timestamp = parseInt(keyId.replace("sig-", ""));
    if (isNaN(timestamp)) {
      return true; // Invalid format, consider expired
    }

    const age = Date.now() - timestamp;
    return age > maxAgeMs;
  } catch {
    return true; // Error parsing, consider expired
  }
};

/**
 * Format bytes to human readable string
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Sanitize user input for logging (remove sensitive data)
 */
export const sanitizeForLogging = (obj: any, maxLength: number = 100): any => {
  if (typeof obj === "string") {
    return obj.length > maxLength ? obj.substring(0, maxLength) + "..." : obj;
  }

  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  const sanitized: any = {};
  for (const key in obj) {
    if (
      key.toLowerCase().includes("key") ||
      key.toLowerCase().includes("secret") ||
      key.toLowerCase().includes("password") ||
      key.toLowerCase().includes("token")
    ) {
      sanitized[key] = "[REDACTED]";
    } else {
      sanitized[key] = sanitizeForLogging(obj[key], maxLength);
    }
  }

  return sanitized;
};
