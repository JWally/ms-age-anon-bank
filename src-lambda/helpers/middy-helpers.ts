// helpers/middy-helpers.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { MiddlewareObj } from "@middy/core";
import { LRUCache } from "lru-cache";
import createError from "http-errors";

export interface MiddyEvent {
  source: string;
  warmup?: boolean;
}

export const isWarmingUp = (event: MiddyEvent) => {
  return (
    event.source === "serverless-plugin-warmup" ||
    event.source === "warmup-plugin" ||
    event?.warmup === true
  );
};

export const onWarmup = async () => {
  try {
    // Pre-warm the key cache by fetching keys
    const { getCachedKeys } = await import("../services/key-management");
    await getCachedKeys();
    console.log("Warmup completed successfully");
  } catch (error) {
    console.error("Warmup failed:", { error });
  }
};

// Global LRU cache instance for deduplication
const cache = new LRUCache<string, number>({
  max: 1000,
  ttl: 30_000, // 30 seconds
});

/**
 * Helper to clear the LRU cache.
 */
export const _clearDeduplicateCache = (): void => {
  cache.clear();
};

/**
 * Deduplicate middleware to prevent duplicate requests
 */
export const deduplicateMiddleware = (): MiddlewareObj<
  APIGatewayProxyEvent,
  APIGatewayProxyResult
> => {
  return {
    before: (request) => {
      const { event } = request;

      // If no body, no deduplication needed
      if (!event.body) return;

      // Use the first 256 characters as the cache key
      const key = event.body.slice(0, 256);

      // If we already have this key, reject with 429
      if (cache.has(key)) {
        const hitCount: number = cache.get(key) || 0;
        cache.set(key, hitCount + 1);

        // Log potential abuse after multiple hits
        if (hitCount % 10 === 0) {
          console.warn("Repeated duplicate requests detected", {
            hitCount: hitCount + 1,
            keyPrefix: key.slice(0, 50),
          });
        }

        throw new createError.TooManyRequests(`Duplicate request detected`);
      }

      // Set the key in the cache to prevent future duplicates
      cache.set(key, 1);
    },
  };
};
