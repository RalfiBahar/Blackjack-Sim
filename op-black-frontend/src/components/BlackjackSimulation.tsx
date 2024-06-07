"use client";

import React, { useState } from "react";
import runSimulation from "../run_simulation";
import { GAMES_PLAYED_PER_HOUR, BET_MULTIPLIER } from "../constants";
import { calculateRequiredGames } from "../utils";
import { Line, Bar, Scatter } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import {
  CurrentBankrollChart,
  CountCurrNetProfitChart,
  BetAmountFrequencyChart,
  CurrNetProfitPerBetChart,
  CumulativeNetProfitChart,
  RunningCountStatistics,
  RunningCountDistributionChart,
  RunningCountDistributionStatistics,
  CurrNetProfitDistributionChart,
  TotalNetProfitDistributionChart,
  GeneralStats,
} from ".";

import CustomProgressBar from "./CustomProgressBar";

Chart.register(...registerables);

const BlackjackSimulation: React.FC = () => {
  const [numGames, setNumGames] = useState<number>(5000);
  const [initialBankroll, setInitialBankroll] = useState<number>(10000);
  const [numSimulations, setNumSimulations] = useState<number>(5000);
  const [results, setResults] = useState<any>(null);
  const [aggregate, setAggregate] = useState<any>(null);
  const [totalBankruptcies, setTotalBankruptcies] = useState<number>(0);
  const [percentDoneSimulating, setPercentDoneSimulating] = useState<number>(0);

  const handleRunSimulation = async () => {
    const baseBet = initialBankroll * BET_MULTIPLIER;
    const aggregatedData: any[] = [];
    let totalBankruptcies = 0;
    let combinedResults: any = {};

    for (let i = 0; i < numSimulations; i++) {
      const result = runSimulation(numGames, baseBet, initialBankroll);
      setPercentDoneSimulating(((i + 1) / numSimulations) * 100);
      totalBankruptcies += result.summary.numBankruptcies;
      aggregatedData.push(result.data);
    }
    setAggregate(aggregatedData);
    // Aggregate data
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

    setResults(combinedResults);
    setTotalBankruptcies(totalBankruptcies);
  };

  return (
    <div>
      <h1>Blackjack Simulation Analysis</h1>
      <div>
        <label>Number of Games to Simulate</label>
        <input
          type="number"
          value={numGames}
          onChange={(e) => setNumGames(Number(e.target.value))}
          min={1}
          max={1000000}
        />
      </div>
      <div>
        <label>Initial Bankroll</label>
        <input
          type="number"
          value={initialBankroll}
          onChange={(e) => setInitialBankroll(Number(e.target.value))}
          min={1}
          max={1000000}
        />
      </div>
      <div>
        <label>Number of Simulations</label>
        <input
          type="number"
          value={numSimulations}
          onChange={(e) => setNumSimulations(Number(e.target.value))}
          min={1}
          max={100000}
        />
      </div>
      <div>
        <CustomProgressBar progress={percentDoneSimulating} />{" "}
        {/* Use the custom progress bar */}
      </div>
      <button onClick={handleRunSimulation}>Run Simulation</button>
      {results && aggregate && (
        <div>
          <h1 className="text-xl">Simulation Results</h1>
          <GeneralStats
            results={results}
            totalBankruptcies={totalBankruptcies}
            numGames={numGames}
            numSimulations={numSimulations}
          />
          <div className="flex gap-4">
            <div className="w-1/2">
              <TotalNetProfitDistributionChart data={results} />
            </div>
            <div className="w-1/2">
              <CumulativeNetProfitChart data={results} />
            </div>
          </div>
          <CurrNetProfitDistributionChart data={results} />
          <RunningCountDistributionChart data={aggregate} />
          <RunningCountDistributionStatistics data={aggregate} />*
          <RunningCountStatistics data={aggregate} />
          <CurrNetProfitPerBetChart data={aggregate} />
          <BetAmountFrequencyChart data={aggregate} />
          <CountCurrNetProfitChart data={aggregate} />
          <CurrentBankrollChart data={results} />
        </div>
      )}
    </div>
  );
};

export default BlackjackSimulation;
