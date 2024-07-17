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
import { SocialMediaIcons } from "@/components";
import { InitialBettingValues } from "@/constants";
import { InfoIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";

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
        <>
          <Link href="/" className="absolute top-5 left-5">
            <IconButton aria-label="info" icon={<ArrowBackIcon />} />
          </Link>
          <div className="bg-light-grey justify-center flex flex-col rounded-2xl p-16 shadow-2xl w-4/5 md:w-1/2 mt-20">
            <div className="flex justify-end">
              <IconButton
                aria-label="info"
                icon={<InfoIcon />}
                onClick={onOpen}
              />{" "}
            </div>
            <p className="text-2xl text-white font-bold text-center">
              Simulate
            </p>

            <div className="items-center justify-center flex">
              <SimulationForm
                initialData={initialData}
                onSubmit={handleRunSimulation}
              />
            </div>
            <SocialMediaIcons
              position={{ base: "static", md: "absolute" }}
              left={{ base: "auto", md: 2 }}
              top={{ base: "auto", md: "50%" }}
              transform={{ base: "none", md: "translateY(-50%)" }}
              mt={{ base: 4, md: 0 }}
              mb={{ base: 4, md: 0 }}
              showFeedback={true}
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
        </>
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
            - Player plays based on basic strategy.
            <br />
            - Player uses Hi-Lo method.
            <br />
            - Dealer stands on soft 17.
            <br />
            - 1 Hour of gameplay equates to 200 games.
            <br />
            - Blackjack pays 3:2.
            <br />
            - Player can double down on any two cards.
            <br />
            - Player can split pairs.
            <br />
            - No re-splitting of aces.
            <br />
            - Dealer peeks for blackjack on ace or ten.
            <br />
            - Insurance is offered when the dealer shows an ace.
            <br />
            - Surrender is not allowed.
            <br />
            - If the player busts, the dealer wins regardless of the
            dealer&#39;s hand.
            <br />
            - Running count is reset when there are 15 or fewer cards in the
            deck.
            <br />
            - Base bet is 0.1% of initial bankroll.
            <br />
            - Betting amount is adjusted based on the running count.
            <br />
            - Bankroll management: If bankroll is less than the bet amount, the
            simulation ends.
            <br />
            - Bankroll is tracked over time to observe performance trends.
            <br />
            - The simulation tracks the number of bankruptcies.
            <br />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
