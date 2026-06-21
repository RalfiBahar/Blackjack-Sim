import runSimulation, { type RunSimulationOptions } from "../run_simulation";

export type WorkerJob = RunSimulationOptions & { jobId: number };

export type WorkerResult = {
  jobId: number;
  result: ReturnType<typeof runSimulation>;
};

self.onmessage = (event: MessageEvent<WorkerJob>) => {
  const { jobId, ...options } = event.data;
  const result = runSimulation(options);
  const payload: WorkerResult = { jobId, result };
  self.postMessage(payload);
};

export {};
