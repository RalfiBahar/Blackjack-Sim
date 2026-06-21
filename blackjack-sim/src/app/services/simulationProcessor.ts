import runSimulation, { type RunSimulationOptions } from "../../run_simulation";
import {
  aggregateSimulationData,
  encodeStreamEvent,
  type StreamEvent,
} from "../../simulationStream";
import { BET_MULTIPLIER, DEFAULT_PENETRATION } from "../../constants";
import { BettingValues, type BettingValues as BettingValuesType } from "@/components/types";

export interface ProcessSimulationParams {
  numGames: number;
  initialBankroll: number;
  numSimulations: number;
  bettingSpread: BettingValues;
  numberOfDecks: number;
  penetration?: number;
  compareBettingSpread?: BettingValues;
}

function buildOptions(
  params: ProcessSimulationParams,
  spread: BettingValues
): RunSimulationOptions {
  return {
    numGames: params.numGames,
    baseBet: params.initialBankroll * BET_MULTIPLIER,
    initialBankroll: params.initialBankroll,
    bettingSpread: spread,
    numberOfDecks: params.numberOfDecks,
    penetration: params.penetration ?? DEFAULT_PENETRATION,
  };
}

function runBatch(
  options: RunSimulationOptions,
  numSimulations: number,
  onProgress: (completed: number, total: number) => void,
  onChunk: (data: Record<string, number[]>) => void
): { aggregate: Record<string, number[]>[]; totalBankruptcies: number } {
  const aggregate: Record<string, number[]>[] = [];
  let totalBankruptcies = 0;

  for (let i = 0; i < numSimulations; i++) {
    const result = runSimulation(options);
    totalBankruptcies += result.summary.numBankruptcies;
    aggregate.push(result.data);
    onChunk(result.data);
    onProgress(i + 1, numSimulations);
  }

  return { aggregate, totalBankruptcies };
}

export function processSimulation(
  params: ProcessSimulationParams
): ReadableStream<Uint8Array> {
  const {
    numSimulations,
    bettingSpread,
    compareBettingSpread,
    penetration = DEFAULT_PENETRATION,
  } = params;

  const primaryOptions = buildOptions({ ...params, penetration }, bettingSpread);
  const compareOptions = compareBettingSpread
    ? buildOptions({ ...params, penetration }, compareBettingSpread)
    : null;

  const encoder = new TextEncoder();
  const totalSteps = compareOptions ? numSimulations * 2 : numSimulations;

  return new ReadableStream({
    start(controller) {
      const enqueue = (event: StreamEvent) => {
        controller.enqueue(encoder.encode(encodeStreamEvent(event)));
      };

      try {
        let offset = 0;
        const reportProgress = (completed: number, label?: string) => {
          const globalCompleted = compareOptions
            ? label === "B"
              ? numSimulations + completed
              : completed
            : completed;
          enqueue({
            type: "progress",
            completed: globalCompleted,
            total: totalSteps,
            label,
          });
        };

        const primary = runBatch(
          primaryOptions,
          numSimulations,
          (c) => reportProgress(c, compareOptions ? "A" : undefined),
          (data) => enqueue({ type: "chunk", data })
        );

        let compareResults: Record<string, number[]> | undefined;
        let compareTotalBankruptcies: number | undefined;
        let compareAggregate: Record<string, number[]>[] | undefined;

        if (compareOptions) {
          const compare = runBatch(
            compareOptions,
            numSimulations,
            (c) => reportProgress(c, "B"),
            (data) => enqueue({ type: "chunk", data })
          );
          compareResults = aggregateSimulationData(compare.aggregate, numSimulations);
          compareTotalBankruptcies = compare.totalBankruptcies;
          compareAggregate = compare.aggregate;
        }

        enqueue({
          type: "complete",
          results: aggregateSimulationData(primary.aggregate, numSimulations),
          totalBankruptcies: primary.totalBankruptcies,
          compareResults,
          compareTotalBankruptcies,
          compareAggregate,
        });
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });
}
