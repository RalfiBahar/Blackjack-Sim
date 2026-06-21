export type StreamEvent =
  | { type: "progress"; completed: number; total: number; label?: string }
  | { type: "chunk"; data: Record<string, number[]> }
  | {
      type: "complete";
      results: Record<string, number[]>;
      totalBankruptcies: number;
      compareResults?: Record<string, number[]>;
      compareTotalBankruptcies?: number;
      compareAggregate?: Record<string, number[]>[];
    };

export function encodeStreamEvent(event: StreamEvent): string {
  return JSON.stringify(event) + "\n";
}

export function aggregateSimulationData(
  aggregatedData: Record<string, number[]>[],
  numSimulations: number
): Record<string, number[]> {
  if (aggregatedData.length === 0) return {};
  const keys = Object.keys(aggregatedData[0]);
  const combined = keys.reduce(
    (acc, key) => {
      acc[key] = aggregatedData.reduce((sum: number[], data) => {
        return sum.map((val, index) => val + (data[key]?.[index] ?? 0));
      }, new Array(aggregatedData[0][key].length).fill(0));
      return acc;
    },
    {} as Record<string, number[]>
  );

  Object.keys(combined).forEach((key) => {
    combined[key] = combined[key].map((val) => val / numSimulations);
  });
  return combined;
}
