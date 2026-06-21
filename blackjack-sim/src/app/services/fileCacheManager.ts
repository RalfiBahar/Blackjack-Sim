import { BettingValues } from "@/components/types";

// S3 cache is disabled. To re-enable: set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
// AWS_REGION in environment and migrate to @aws-sdk/client-s3 (v3).

export const generateCacheKey = (
  numGames: number,
  initialBankroll: number,
  numSimulations: number,
  bettingSpread: BettingValues,
  numberOfDecks: number
) => {
  return `${numGames}-${initialBankroll}-${numSimulations}-${numberOfDecks}-${Object.values(
    bettingSpread
  ).join("-")}`;
};

export const refreshCache = async (): Promise<void> => {
  if (!process.env.AWS_ACCESS_KEY_ID) return;
};

export const getRandomCacheEntry = async (
  _cacheKey: string
): Promise<string | null> => {
  if (!process.env.AWS_ACCESS_KEY_ID) return null;
  return null;
};

export const addCacheEntry = async (
  _cacheKey: string,
  _data: string
): Promise<void> => {
  if (!process.env.AWS_ACCESS_KEY_ID) return;
};

export const addLargeCacheEntry = async (
  _cacheKey: string,
  _data: string
): Promise<void> => {
  if (!process.env.AWS_ACCESS_KEY_ID) return;
};
