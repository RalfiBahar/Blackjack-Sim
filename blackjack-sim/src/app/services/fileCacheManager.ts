import { promises as fs } from "fs";
import path from "path";
import { BettingValues } from "@/components/types";
import { json } from "stream/consumers";

const CACHE_DIR = path.join(process.cwd(), "cache");

type CacheEntry = {
  data: string;
  timestamp: number;
};

// Ensure cache directory exists
const ensureCacheDir = async () => {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating cache directory:", error);
  }
};

export const generateCacheKey = (
  numGames: number,
  initialBankroll: number,
  numSimulations: number,
  bettingSpread: BettingValues
) => {
  return `${numGames}-${initialBankroll}-${numSimulations}-${Object.values(
    bettingSpread
  ).join("-")}`;
};

export const refreshCache = async () => {
  try {
    await ensureCacheDir();
    console.log("Refreshing cache at", new Date().toISOString());
    const files = await fs.readdir(CACHE_DIR);
    for (const file of files) {
      await fs.unlink(path.join(CACHE_DIR, file));
    }
    console.log("Cache refreshed successfully at", new Date().toISOString());
  } catch (error) {
    console.error("Error refreshing cache:", error);
  }
};

export const getRandomCacheEntry = async (
  cacheKey: string
): Promise<string | null> => {
  try {
    await ensureCacheDir();
    const cacheFiles = await fs.readdir(CACHE_DIR);
    const matchingFiles = cacheFiles.filter((file) =>
      file.startsWith(cacheKey)
    );
    if (matchingFiles.length > 0) {
      if (matchingFiles.length < 5) {
        //console.log("lenfiles", matchingFiles.length);
        return null;
      }
      const randomFile =
        matchingFiles[Math.floor(Math.random() * matchingFiles.length)];
      const data = await fs.readFile(path.join(CACHE_DIR, randomFile), "utf-8");
      const jsonData = JSON.parse(data);
      return jsonData.data;
    }
  } catch (error) {
    console.error("Error getting cache entry:", error);
  }
  return null;
};

export const addCacheEntry = async (cacheKey: string, data: string) => {
  try {
    await ensureCacheDir();
    const cacheFiles = await fs.readdir(CACHE_DIR);
    const matchingFiles = cacheFiles.filter((file) =>
      file.startsWith(cacheKey)
    );
    if (matchingFiles.length < 5) {
      const filePath = path.join(CACHE_DIR, `${cacheKey}-${Date.now()}.json`);
      await fs.writeFile(filePath, JSON.stringify({ data }), "utf-8");
    }
  } catch (error) {
    console.error("Error adding cache entry:", error);
  }
};
