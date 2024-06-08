"use client";

import { useState } from "react";
import BlackjackSimulation from "@/components/BlackjackSimulation";
import SimulationForm from "@/components/SimulationForm";
import { InitialData, SimulationParams } from "@/components/types";
import { CustomProgressBar } from "@/components";

const initialData: InitialData = {
  numGames: 1000,
  initialBankroll: 1000,
  numSimulations: 10,
  results: null,
  aggregate: null,
  totalBankruptcies: 0,
  percentDoneSimulating: 0,
};

export default function Simulator() {
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
            try {
              const parsedChunk = JSON.parse(jsonString);
              if (parsedChunk.results) {
                combinedResults = parsedChunk.results;
                setTotalBankruptcies(parsedChunk.totalBankruptcies);
              } else {
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
            aggregatedData.push(parsedChunk);
          }
        } catch (error) {
          console.error("Error parsing final JSON object:", error);
        }
      }

      setResults(combinedResults);
      setAggregate(aggregatedData);
      setPercentDoneSimulating(100);
    } catch (error) {
      console.error("Error running simulation:", error);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-w-width">
      <p className="text-xl">BLACssKJACKKKKKK</p>
      <SimulationForm
        initialData={initialData}
        onSubmit={handleRunSimulation}
      />
      <div>
        <CustomProgressBar progress={percentDoneSimulating} />
      </div>
      {results && aggregate && (
        <BlackjackSimulation
          initialData={initialData}
          results={results}
          aggregate={aggregate}
          totalBankruptcies={totalBankruptcies}
        />
      )}
    </div>
  );
}
