// handlers/end-points/public-key.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import createHttpError from "http-errors";

import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";

import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import warmup from "@middy/warmup";
import cors from "@middy/http-cors";

import { isWarmingUp, onWarmup } from "../../helpers/middy-helpers";
import { POWERTOOLS_SERVICE_NAME } from "../../helpers/constants";
import { getPublicKeys, getCacheStats } from "../../services/key-management";

// Powertools
const TOOL_NAME = `${POWERTOOLS_SERVICE_NAME}-public-key`;

// Initialize Powertools
export const logger = new Logger({ serviceName: TOOL_NAME });
export const metrics = new Metrics({
  namespace: POWERTOOLS_SERVICE_NAME,
  serviceName: TOOL_NAME,
});

interface PublicKeyInfo {
  keyId: string;
  publicKey: string;
  status: "current" | "previous";
  createdAt?: number;
}

// This is the actual handler
export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Get all public keys (current and previous for verification)
    const keys = await getPublicKeys();

    // Get cache stats for monitoring
    const cacheStats = getCacheStats();

    // Format the response with all available keys
    const response: { keys: PublicKeyInfo[] } = {
      keys: keys.map((key) => ({
        keyId: key.keyId,
        publicKey: key.publicKey,
        status: key.status,
        createdAt: key.createdAt,
      })),
    };

    logger.info("Successfully served public keys", {
      keysCount: keys.length,
      currentKeyId: keys.find((k) => k.status === "current")?.keyId,
      ...cacheStats,
    });
    metrics.addMetric("PublicKeysServed", "Count", 1);

    // Return all public keys in JSON format
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        "X-Key-Cache-Hit": cacheStats.isCached ? "true" : "false",
      },
      body: JSON.stringify(response, null, 2),
    };
  } catch (error) {
    logger.error("Error serving public keys", { error });
    metrics.addMetric("PublicKeyError", "Count", 1);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Configure middleware stack (simpler for public key endpoint)
export const handler = middy(lambdaHandler)
  .use(warmup({ isWarmingUp, onWarmup }))
  .use(httpHeaderNormalizer())
  .use(
    cors({
      origin: "*",
      credentials: false, // No credentials needed for public key
      methods: "GET",
    }),
  )
  .use(
    httpErrorHandler({
      fallbackMessage: "An unexpected error occurred",
      logger: (error) => logger.error("HTTP error", { error }),
    }),
  );
