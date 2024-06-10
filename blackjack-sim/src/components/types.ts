export interface SimulationParams {
  numGames: number;
  initialBankroll: number;
  numSimulations: number;
}

export interface InitialData extends SimulationParams {
  results: any;
  aggregate: any;
  totalBankruptcies: number;
  percentDoneSimulating: number;
}
