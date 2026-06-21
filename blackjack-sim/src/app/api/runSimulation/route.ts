import { NextRequest, NextResponse } from "next/server";
import { processSimulation } from "../../services/simulationProcessor";
import { BettingValues } from "@/components/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      numGames,
      initialBankroll,
      numSimulations,
      bettingSpread,
      numberOfDecks,
      penetration,
      compareBettingSpread,
      useClientWorkers,
    }: {
      numGames: number;
      initialBankroll: number;
      numSimulations: number;
      bettingSpread: BettingValues;
      numberOfDecks: number;
      penetration?: number;
      compareBettingSpread?: BettingValues;
      useClientWorkers?: boolean;
    } = body;

    if (useClientWorkers) {
      return NextResponse.json(
        { error: "Client-side workers should run in the browser." },
        { status: 400 }
      );
    }

    const stream = processSimulation({
      numGames,
      initialBankroll,
      numSimulations,
      bettingSpread,
      numberOfDecks,
      penetration,
      compareBettingSpread,
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "application/x-ndjson",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error running simulation:", error);
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 });
  }
}
