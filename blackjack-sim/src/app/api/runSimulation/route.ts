import { NextRequest, NextResponse } from "next/server";
import runSimulation from "../../../run_simulation";
import { BET_MULTIPLIER } from "../../../constants";

export async function POST(req: NextRequest) {
  try {
    const { numGames, initialBankroll, numSimulations } = await req.json();

    const baseBet = initialBankroll * BET_MULTIPLIER;
    const aggregatedData: any[] = [];
    let totalBankruptcies = 0;
    let combinedResults: any = {};

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < numSimulations; i++) {
          const result = runSimulation(numGames, baseBet, initialBankroll);
          totalBankruptcies += result.summary.numBankruptcies;
          aggregatedData.push(result.data);

          // Stream the current result data
          controller.enqueue(JSON.stringify(result.data));
        }

        // Once all data is processed, aggregate results
        if (aggregatedData.length > 0) {
          const keys = Object.keys(aggregatedData[0]);
          combinedResults = keys.reduce((acc: any, key: string) => {
            acc[key] = aggregatedData.reduce((sum: number[], data: any) => {
              return sum.map((val, index) => val + data[key][index]);
            }, new Array(aggregatedData[0][key].length).fill(0));
            return acc;
          }, {});

          // Calculate averages
          Object.keys(combinedResults).forEach((key: string) => {
            combinedResults[key] = combinedResults[key].map(
              (val: number) => val / numSimulations
            );
          });
        }

        // Enqueue the final aggregated data
        controller.enqueue(
          JSON.stringify({ results: combinedResults, totalBankruptcies })
        );

        controller.close();
      },
    });

    return new NextResponse(stream, {
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
