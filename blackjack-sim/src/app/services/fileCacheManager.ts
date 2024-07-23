import AWS from "aws-sdk";
import { BettingValues } from "@/components/types";
import {
  initiateMultipartUpload,
  uploadPart,
  completeMultipartUpload,
} from "./multipartUpload";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const BUCKET_NAME = "blackjack-sim-cache";

export const generateCacheKey = (
  numGames: number,
  initialBankroll: number,
  numSimulations: number,
  bettingSpread: BettingValues,
  numberOfDecks: number
) => {
  return `${numGames}-${initialBankroll}-${numSimulations}-${Object.values(
    bettingSpread
  ).join("-")}`;
};

export const refreshCache = async () => {
  try {
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: "cache/",
    };
    const { Contents } = await s3.listObjectsV2(listParams).promise();
    if (Contents && Contents.length > 0) {
      const objectsToDelete = Contents.map(({ Key }) => ({ Key })).filter(
        (obj) => obj.Key !== undefined
      ) as { Key: string }[];

      if (objectsToDelete.length > 0) {
        const deleteParams = {
          Bucket: BUCKET_NAME,
          Delete: {
            Objects: objectsToDelete,
          },
        };
        await s3.deleteObjects(deleteParams).promise();
      }
    }
    console.log("Cache refreshed successfully");
  } catch (error) {
    console.error("Error refreshing cache:", error);
  }
};

export const getRandomCacheEntry = async (
  cacheKey: string
): Promise<string | null> => {
  try {
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `cache/${cacheKey}`,
    };
    const { Contents } = await s3.listObjectsV2(listParams).promise();
    if (Contents && Contents.length > 0) {
      if (Contents.length < 5) {
        return null;
      }
      const randomFile =
        Contents[Math.floor(Math.random() * Contents.length)].Key;
      if (randomFile) {
        const getParams = {
          Bucket: BUCKET_NAME,
          Key: randomFile,
        };
        const data = await s3.getObject(getParams).promise();
        return data.Body?.toString("utf-8") || null;
      }
    }
  } catch (error) {
    console.error("Error getting cache entry:", error);
  }
  return null;
};

export const addCacheEntry = async (cacheKey: string, data: string) => {
  try {
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `cache/${cacheKey}`,
    };
    const { Contents } = await s3.listObjectsV2(listParams).promise();
    console.log("len", Contents?.length);
    const textEncoder = new TextEncoder();
    console.log("size", textEncoder.encode(data).length);
    if (Contents && Contents.length < 5) {
      const putParams = {
        Bucket: BUCKET_NAME,
        Key: `cache/${cacheKey}-${Date.now()}.json`,
        Body: data,
        ContentType: "application/json",
      };
      await s3.putObject(putParams).promise();
    }
  } catch (error) {
    console.error("Error adding cache entry:", error);
  }
};

export const addLargeCacheEntry = async (cacheKey: string, data: string) => {
  try {
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `cache/${cacheKey}`,
    };
    const { Contents } = await s3.listObjectsV2(listParams).promise();

    if (Contents && Contents.length < 5) {
      const key = `cache/${cacheKey}-${Date.now()}.json`;
      const uploadId = await initiateMultipartUpload(key);
      if (!uploadId) {
        throw new Error("Failed to initiate multipart upload.");
      }
      console.log("Upload ID", uploadId);
      const chunkSize = 5 * 1024 * 1024; // 5MB per part
      const parts: { ETag: string; PartNumber: number }[] = [];
      let partNumber = 1;

      for (let start = 0; start < data.length; start += chunkSize) {
        const chunk = data.slice(start, start + chunkSize);
        const partData = Buffer.from(chunk);
        const ETag = await uploadPart(key, uploadId, partNumber, partData);
        if (!ETag) {
          throw new Error("Failed to initiate multipart upload.");
        }
        parts.push({ ETag, PartNumber: partNumber });
        partNumber++;
      }

      await completeMultipartUpload(key, uploadId, parts);
    }
  } catch (error) {
    console.error("Error adding large cache entry:", error);
  }
};
