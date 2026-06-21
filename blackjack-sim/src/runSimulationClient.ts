import runSimulation, {
  type RunSimulationOptions,
  type SimulationResult,
} from "./run_simulation";
import { aggregateSimulationData } from "./simulationStream";

const DEFAULT_POOL = 4;

function poolSize(): number {
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    return Math.min(navigator.hardwareConcurrency, 8);
  }
  return DEFAULT_POOL;
}

async function runJob(
  worker: Worker,
  options: RunSimulationOptions,
  jobId: number
): Promise<SimulationResult> {
  return new Promise((resolve, reject) => {
    const handler = (event: MessageEvent) => {
      if (event.data?.jobId !== jobId) return;
      worker.removeEventListener("message", handler);
      worker.removeEventListener("error", onError);
      resolve(event.data.result);
    };
    const onError = (err: ErrorEvent) => {
      worker.removeEventListener("message", handler);
      worker.removeEventListener("error", onError);
      reject(err.error ?? err.message);
    };
    worker.addEventListener("message", handler);
    worker.addEventListener("error", onError);
    worker.postMessage({ jobId, ...options });
  });
}

export async function runSimulationsInWorkerPool(
  options: RunSimulationOptions,
  numSimulations: number,
  onProgress?: (completed: number, total: number) => void
): Promise<{ data: Record<string, number[]>[]; totalBankruptcies: number }> {
  const size = poolSize();
  const workers = Array.from({ length: size }, () =>
    new Worker(new URL("./workers/simulation.client.worker.ts", import.meta.url))
  );

  const aggregatedData: Record<string, number[]>[] = [];
  let totalBankruptcies = 0;
  let completed = 0;
  let nextJob = 0;

  try {
    await Promise.all(
      workers.map(async (worker) => {
        while (nextJob < numSimulations) {
          const jobId = nextJob++;
          const result = await runJob(worker, options, jobId);
          aggregatedData.push(result.data);
          totalBankruptcies += result.summary.numBankruptcies;
          completed++;
          onProgress?.(completed, numSimulations);
        }
      })
    );
  } finally {
    workers.forEach((w) => w.terminate());
  }

  return { data: aggregatedData, totalBankruptcies };
}

export async function runClientSimulation(
  options: RunSimulationOptions,
  numSimulations: number,
  compareOptions: RunSimulationOptions | null,
  onProgress?: (completed: number, total: number, label?: string) => void
): Promise<{
  results: Record<string, number[]>;
  totalBankruptcies: number;
  compareResults?: Record<string, number[]>;
  compareTotalBankruptcies?: number;
  aggregate: Record<string, number[]>[];
  compareAggregate?: Record<string, number[]>[];
}> {
  const totalSteps = compareOptions ? numSimulations * 2 : numSimulations;
  let globalCompleted = 0;

  const report = (local: number, localTotal: number, label?: string) => {
    globalCompleted = compareOptions
      ? label === "B"
        ? numSimulations + local
        : local
      : local;
    onProgress?.(globalCompleted, totalSteps, label);
  };

  const primary = await runSimulationsInWorkerPool(
    options,
    numSimulations,
    (c, t) => report(c, t, compareOptions ? "A" : undefined)
  );

  let compare: {
    data: Record<string, number[]>[];
    totalBankruptcies: number;
  } | null = null;

  if (compareOptions) {
    compare = await runSimulationsInWorkerPool(
      compareOptions,
      numSimulations,
      (c, t) => report(c, t, "B")
    );
  }

  return {
    results: aggregateSimulationData(primary.data, numSimulations),
    totalBankruptcies: primary.totalBankruptcies,
    compareResults: compare
      ? aggregateSimulationData(compare.data, numSimulations)
      : undefined,
    compareTotalBankruptcies: compare?.totalBankruptcies,
    aggregate: primary.data,
    compareAggregate: compare?.data,
  };
}
