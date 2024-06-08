import React from "react";
import SimulationForm from "../components/SimulationForm";
import { InitialData, SimulationParams } from "./types";
import {
  GeneralStats,
  TotalNetProfitDistributionChart,
  CumulativeNetProfitChart,
  CurrNetProfitDistributionChart,
  RunningCountDistributionChart,
  RunningCountDistributionStatistics,
  RunningCountStatistics,
  CurrNetProfitPerBetChart,
  BetAmountFrequencyChart,
  CountCurrNetProfitChart,
  CurrentBankrollChart,
} from "../components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import CustomProgressBar from "../components/CustomProgressBar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BlackjackSimulationProps {
  initialData: InitialData;
  results: any;
  aggregate: any;
  totalBankruptcies: number;
}

const BlackjackSimulation: React.FC<BlackjackSimulationProps> = ({
  initialData,
  results,
  aggregate,
  totalBankruptcies,
}) => {
  return (
    <div className="w-full">
      <h1>Blackjack Simulation Analysis</h1>
      {results && aggregate && (
        <div>
          <h1 className="text-xl">Simulation Results</h1>
          <GeneralStats
            results={results}
            totalBankruptcies={totalBankruptcies}
            numGames={initialData.numGames}
            numSimulations={initialData.numSimulations}
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
          <RunningCountDistributionStatistics data={aggregate} />
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
