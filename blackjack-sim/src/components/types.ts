export interface SimulationParams {
  numGames: number;
  initialBankroll: number;
  numSimulations: number;
  bettingSpread: BettingValues | undefined;
  numberOfDecks: number;
  /** Shoe penetration 0.5–0.95 (fraction of shoe dealt before reshuffle). */
  penetration?: number;
  /** Optional second spread for A/B comparison. */
  compareBettingSpread?: BettingValues;
  /** Run Monte Carlo in browser Web Worker pool (parallel). */
  useClientWorkers?: boolean;
}

export interface InitialData extends SimulationParams {
  results: any;
  aggregate: any;
  totalBankruptcies: number;
  percentDoneSimulating: number;
}

export type BettingValues = {
  "-1": number;
  "0": number;
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
  "6-9": number;
  "10": number;
};
