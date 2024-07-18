import { NextRequest, NextResponse } from "next/server";
import {
  generateCacheKey,
  getRandomCacheEntry,
  addCacheEntry,
  addLargeCacheEntry,
} from "../../services/fileCacheManager";
import { processSimulation } from "../../services/simulationProcessor";
import { BettingValues } from "@/components/types";

export async function POST(req: NextRequest) {
  try {
    const {
      numGames,
      initialBankroll,
      numSimulations,
      bettingSpread,
    }: {
      numGames: number;
      initialBankroll: number;
      numSimulations: number;
      bettingSpread: BettingValues;
    } = await req.json();
    const cacheKey = generateCacheKey(
      numGames,
      initialBankroll,
      numSimulations,
      bettingSpread
    );

    // Check if cache exists
    let cachedData = await getRandomCacheEntry(cacheKey);
    // perform caching only if computation is big
    /*
    if (numGames * numSimulations < 400000) {
      cachedData = null;
    }
    */
    if (cachedData) {
      console.log("Retrieving from cached.");
      const responseStream = new ReadableStream({
        start(controller) {
          controller.enqueue(cachedData);
          controller.close();
        },
      });
      return new NextResponse(responseStream, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const { stream, totalBankruptcies } = await processSimulation(
      numGames,
      initialBankroll,
      numSimulations,
      bettingSpread
    );

    const resultData = await streamToString(stream);

    // In the background & if large computation
    if (numGames * numSimulations >= 400000) {
      addLargeCacheEntry(cacheKey, resultData)
        .then(() => {
          console.log("Added cache: ", cacheKey);
        })
        .catch((error) => {
          console.error("Error adding cache entry:", error);
        });
    }

    const responseStream = new ReadableStream({
      start(controller) {
        controller.enqueue(resultData);
        controller.close();
      },
    });

    return new NextResponse(responseStream, {
      headers: {
        "Content-Type": "application/json",
        "Total-Bankruptcies": totalBankruptcies.toString(),
      },
    });
  } catch (error) {
    console.error("Error running simulation:", error);
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}

const streamToString = async (stream: ReadableStream): Promise<string> => {
  const reader = stream.getReader();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      result += value;
    }
  }

  return result;
};
