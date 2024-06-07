"use client";

import React, { useState } from "react";
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
}

const BlackjackSimulation: React.FC<BlackjackSimulationProps> = ({
  initialData,
}) => {
  const [results, setResults] = useState<any>(initialData.results);
  const [aggregate, setAggregate] = useState<any>(initialData.aggregate);
  const [totalBankruptcies, setTotalBankruptcies] = useState<number>(
    initialData.totalBankruptcies
  );
  const [percentDoneSimulating, setPercentDoneSimulating] = useState<number>(
    initialData.percentDoneSimulating
  );

  const handleRunSimulation = async (simulationParams: SimulationParams) => {
    setPercentDoneSimulating(0);

    try {
      const response = await fetch("/api/runSimulation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(simulationParams),
      });

      if (!response.ok) {
        console.error("Failed to fetch simulation results");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        console.error("Failed to get reader from response body");
        return;
      }

      const textDecoder = new TextDecoder();
      let done = false;
      let partialData = "";
      let combinedResults = null;
      const aggregatedData = [];

      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          partialData += textDecoder.decode(value, { stream: true });

          let boundaryIndex;
          while ((boundaryIndex = partialData.indexOf("}{")) !== -1) {
            const jsonString = partialData.slice(0, boundaryIndex + 1);
            partialData = partialData.slice(boundaryIndex + 1);
            //console.log(jsonString);
            try {
              const parsedChunk = JSON.parse(jsonString);
              if (parsedChunk.results) {
                combinedResults = parsedChunk.results;
                setTotalBankruptcies(parsedChunk.totalBankruptcies);
              } else {
                // Intermediate data
                aggregatedData.push(parsedChunk);
              }
            } catch (error) {
              console.error("Error parsing JSON:", error);
            }
          }
        }
      }

      if (partialData.length > 0) {
        try {
          const parsedChunk = JSON.parse(partialData);
          if (parsedChunk.results) {
            combinedResults = parsedChunk.results;
            setTotalBankruptcies(parsedChunk.totalBankruptcies);
          } else {
            // Intermediate data
            aggregatedData.push(parsedChunk);
          }
        } catch (error) {
          console.error("Error parsing final JSON object:", error);
        }
      }

      setResults(combinedResults);
      setAggregate(aggregatedData);
      setPercentDoneSimulating(100);

      //console.log("Results:", combinedResults);
      //console.log("Aggregate:", aggregatedData);
      //console.log("Total Bankruptcies:", totalBankruptcies);
    } catch (error) {
      console.error("Error running simulation:", error);
    }
  };
  return (
    <div className="w-full">
      <h1>Blackjack Simulation Analysis</h1>
      <SimulationForm
        initialData={initialData}
        onSubmit={handleRunSimulation}
      />
      <div>
        <CustomProgressBar progress={percentDoneSimulating} />{" "}
        {/* Use the custom progress bar */}
      </div>
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
