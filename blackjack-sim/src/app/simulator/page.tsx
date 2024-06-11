"use client";

import { useState } from "react";
import BlackjackSimulation from "@/components/BlackjackSimulation";
import SimulationForm from "@/components/SimulationForm";
import { InitialData, SimulationParams } from "@/components/types";
import { CustomProgressBar } from "@/components";
import {
  Spinner,
  IconButton,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { AdvancedSettingsAccordion } from "@/components";
import { InitialBettingValues } from "@/constants";
import { InfoIcon } from "@chakra-ui/icons";

const initialData: InitialData = {
  numGames: 300,
  initialBankroll: 10000,
  numSimulations: 1000,
  results: null,
  aggregate: null,
  totalBankruptcies: 0,
  percentDoneSimulating: 0,
  bettingSpread: InitialBettingValues,
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
  const [simulating, setSimulating] = useState<boolean>(false);
  const [numGames, setNumGames] = useState<number>(initialData.numGames);
  const [numSims, setNumSims] = useState<number>(initialData.numSimulations);

  const handleRunSimulation = async (simulationParams: SimulationParams) => {
    setPercentDoneSimulating(0);
    setSimulating(true);
    setNumGames(simulationParams.numGames);
    setNumSims(simulationParams.numSimulations);

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
      setSimulating(false);
    } catch (error) {
      console.error("Error running simulation:", error);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="flex items-center flex-col min-w-width h-full bg-bg-grey">
      {percentDoneSimulating !== 100 && (
        <div className="bg-light-grey justify-center flex flex-col rounded-2xl p-16 shadow-2xl w-4/5 md:w-1/2 mt-20">
          <div className="flex justify-end">
            <IconButton
              aria-label="info"
              icon={<InfoIcon />}
              onClick={onOpen}
            />{" "}
          </div>

          <p className="text-2xl text-white font-bold text-center">Simulate</p>
          <SimulationForm
            initialData={initialData}
            onSubmit={handleRunSimulation}
          />
          {simulating && (
            <div className="flex flex-col justify-center items-center">
              <Spinner
                thickness="5px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                m={6}
              />
              <span className="text-xl text-white">Simulating...</span>
              {numGames * numSims > 1000000 && (
                <span className="text-lg- text-white">
                  (This might take a while)
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {results && aggregate && (
        <BlackjackSimulation
          initialData={initialData}
          results={results}
          aggregate={aggregate}
          totalBankruptcies={totalBankruptcies}
        />
      )}
      <Modal onClose={onClose} size="md" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rules</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* TODO: Write rules*/}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut eum
            dolores non. A commodi natus impedit, temporibus at explicabo?
            Possimus nisi officiis consectetur, architecto perspiciatis
            similique odit delectus quas recusandae.
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
