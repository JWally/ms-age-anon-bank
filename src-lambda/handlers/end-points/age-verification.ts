// handlers/end-points/age-verification.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createHash, randomBytes } from "crypto";
import createHttpError from "http-errors";

import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";

import middy from "@middy/core";
import httpHeaderNormalizer from "@middy/http-header-normalizer";
import httpErrorHandler from "@middy/http-error-handler";
import warmup from "@middy/warmup";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import cors from "@middy/http-cors";

import { isWarmingUp, onWarmup } from "../../helpers/middy-helpers";
import { POWERTOOLS_SERVICE_NAME } from "../../helpers/constants";
import { signPayload, getCurrentKeyId } from "../../services/key-management";

// Powertools
const TOOL_NAME = `${POWERTOOLS_SERVICE_NAME}-age-verification`;

// Initialize Powertools
export const logger = new Logger({ serviceName: TOOL_NAME });
export const metrics = new Metrics({
  namespace: POWERTOOLS_SERVICE_NAME,
  serviceName: TOOL_NAME,
});

interface AgeVerificationPayload {
  over_18: boolean;
  over_21: boolean;
  nonce: string;
  ipAddressHash: string;
  payload: unknown;
  timestamp: number;
}

// This is the actual handler
export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    // Extract body and ipAddress
    const { body } = event;
    const ipAddress = event.requestContext.identity.sourceIp;

    if (!ipAddress) throw new Error("No IP address on identity");
    if (!body) throw new Error("No body provided on event");

    // we're ok with a stupid string here
    // we really don't care what we're signing
    // if the customer wants us to sign it and return it to them
    // we'll do it
    const userPayload = body;

    // Generate nonce and create the verification payload
    const nonce = randomBytes(32).toString("hex");

    // Hash IP address with nonce for privacy
    const ipAddressHash = createHash("sha256")
      .update(nonce + ipAddress)
      .digest("hex");

    const verificationPayload: AgeVerificationPayload = {
      over_18: true,
      over_21: true,
      nonce,
      ipAddressHash,
      payload: userPayload,
      timestamp: Date.now(),
    };

    // Base64 encode the payload
    const payloadJson = JSON.stringify(verificationPayload);
    const base64Payload = Buffer.from(payloadJson, "utf8").toString("base64");

    // Sign the payload and get current key ID
    const signature = await signPayload(base64Payload);
    const keyId = await getCurrentKeyId();

    logger.info("Successfully processed age verification request", {
      ipAddressHash,
      keyId,
      nonceLength: nonce.length,
      payloadSize: payloadJson.length,
    });

    metrics.addMetric("SignatureCreated", "Count", 1);
    metrics.addMetadata("KeyId", keyId);

    // Return the signed response with key ID
    return {
      statusCode: 200,
      body: JSON.stringify({
        target: base64Payload,
        signature,
        keyId, // Include key ID for verification
      }),
    };
  } catch (error) {
    logger.error("Error processing age verification request", { error });
    metrics.addMetric("SignatureError", "Count", 1);
    throw createHttpError(500, "Internal Server Error");
  }
};

// Configure middleware stack - minimal validation since we accept any JSON
export const handler = middy(lambdaHandler)
  .use(warmup({ isWarmingUp, onWarmup }))
  .use(httpHeaderNormalizer())
  .use(cors({ origin: "*", credentials: true }))
  .use(
    httpErrorHandler({
      fallbackMessage: "An unexpected error occurred",
      logger: (error) => logger.error("HTTP error", { error }),
    }),
  );
