"use client";

import { useState } from "react";
import BlackjackSimulation from "@/components/BlackjackSimulation";
import SimulationForm from "@/components/SimulationForm";
import { InitialData, SimulationParams } from "@/components/types";
import { CustomProgressBar } from "@/components";
import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { SocialMediaIcons } from "@/components";
import { InitialBettingValues } from "@/constants";
import { InfoIcon, ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { runClientSimulation } from "@/runSimulationClient";
import type { StreamEvent } from "@/simulationStream";

const initialData: InitialData = {
  numGames: 300,
  initialBankroll: 10000,
  numSimulations: 1000,
  results: null,
  aggregate: null,
  totalBankruptcies: 0,
  percentDoneSimulating: 0,
  bettingSpread: InitialBettingValues,
  numberOfDecks: 1,
};

async function consumeNdjsonStream(
  response: Response,
  onProgress: (pct: number, label?: string) => void
): Promise<{
  results: Record<string, number[]>;
  aggregate: Record<string, number[]>[];
  totalBankruptcies: number;
  compareResults?: Record<string, number[]>;
  compareTotalBankruptcies?: number;
  compareAggregate?: Record<string, number[]>[];
}> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";
  let results: Record<string, number[]> | null = null;
  let compareResults: Record<string, number[]> | undefined;
  let totalBankruptcies = 0;
  let compareTotalBankruptcies: number | undefined;
  let compareAggregate: Record<string, number[]>[] | undefined;
  const aggregate: Record<string, number[]>[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let newline: number;
    while ((newline = buffer.indexOf("\n")) !== -1) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;

      const event = JSON.parse(line) as StreamEvent;
      if (event.type === "progress") {
        onProgress((event.completed / event.total) * 100, event.label);
      } else if (event.type === "chunk") {
        aggregate.push(event.data);
      } else if (event.type === "complete") {
        results = event.results;
        totalBankruptcies = event.totalBankruptcies;
        compareResults = event.compareResults;
        compareTotalBankruptcies = event.compareTotalBankruptcies;
        compareAggregate = event.compareAggregate;
      }
    }
  }

  if (!results) throw new Error("Simulation did not return results");
  return {
    results,
    aggregate,
    totalBankruptcies,
    compareResults,
    compareTotalBankruptcies,
    compareAggregate,
  };
}

export default function Simulator() {
  const [results, setResults] = useState<any>(initialData.results);
  const [compareResults, setCompareResults] = useState<any>(null);
  const [compareAggregate, setCompareAggregate] = useState<any>(null);
  const [aggregate, setAggregate] = useState<any>(initialData.aggregate);
  const [totalBankruptcies, setTotalBankruptcies] = useState<number>(
    initialData.totalBankruptcies
  );
  const [compareTotalBankruptcies, setCompareTotalBankruptcies] =
    useState<number>(0);
  const [percentDoneSimulating, setPercentDoneSimulating] = useState<number>(
    initialData.percentDoneSimulating
  );
  const [progressLabel, setProgressLabel] = useState<string>("");
  const [simulating, setSimulating] = useState<boolean>(false);
  const [lastParams, setLastParams] = useState<SimulationParams | null>(null);
  const [simulationError, setSimulationError] = useState<string>("");

  const handleRunSimulation = async (simulationParams: SimulationParams) => {
    setPercentDoneSimulating(0);
    setProgressLabel("");
    setSimulating(true);
    setSimulationError("");
    setLastParams(simulationParams);
    setResults(null);
    setCompareResults(null);

    const onProgress = (pct: number, label?: string) => {
      setPercentDoneSimulating(Math.min(99, pct));
      if (label) setProgressLabel(`Spread ${label}`);
    };

    try {
      if (simulationParams.useClientWorkers) {
        const { BET_MULTIPLIER } = await import("@/constants");
        const base = {
          numGames: simulationParams.numGames,
          baseBet: simulationParams.initialBankroll * BET_MULTIPLIER,
          initialBankroll: simulationParams.initialBankroll,
          numberOfDecks: simulationParams.numberOfDecks,
          penetration: simulationParams.penetration,
        };
        const outcome = await runClientSimulation(
          {
            ...base,
            bettingSpread: simulationParams.bettingSpread ?? InitialBettingValues,
          },
          simulationParams.numSimulations,
          simulationParams.compareBettingSpread
            ? {
                ...base,
                bettingSpread: simulationParams.compareBettingSpread,
              }
            : null,
          (completed, total, label) =>
            onProgress((completed / total) * 100, label)
        );
        setResults(outcome.results);
        setAggregate(outcome.aggregate);
        setTotalBankruptcies(outcome.totalBankruptcies);
        setCompareResults(outcome.compareResults ?? null);
        setCompareTotalBankruptcies(outcome.compareTotalBankruptcies ?? 0);
        setCompareAggregate(outcome.compareAggregate ?? null);
      } else {
        const response = await fetch("/api/runSimulation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(simulationParams),
        });
        if (!response.ok) throw new Error("Simulation request failed");
        const outcome = await consumeNdjsonStream(response, onProgress);
        setResults(outcome.results);
        setAggregate(outcome.aggregate);
        setTotalBankruptcies(outcome.totalBankruptcies);
        setCompareResults(outcome.compareResults ?? null);
        setCompareTotalBankruptcies(outcome.compareTotalBankruptcies ?? 0);
        setCompareAggregate(outcome.compareAggregate ?? null);
      }
      setPercentDoneSimulating(100);
    } catch (error) {
      console.error("Error running simulation:", error);
      setSimulationError("Simulation failed. Try fewer games or disable Web Workers.");
      setPercentDoneSimulating(0);
    } finally {
      setSimulating(false);
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const showForm = percentDoneSimulating !== 100 || !results;

  return (
    <div className="flex items-center flex-col min-w-width h-full bg-bg-grey">
      {showForm && (
        <>
          <Link href="/" className="absolute top-5 left-5">
            <IconButton aria-label="back" icon={<ArrowBackIcon />} />
          </Link>
          <div className="bg-light-grey justify-center flex flex-col rounded-2xl p-4 md:p-16 shadow-2xl w-4/5 md:w-1/2 mt-20">
            <div className="flex justify-end">
              <IconButton aria-label="info" icon={<InfoIcon />} onClick={onOpen} />
            </div>
            <p className="text-2xl text-white font-bold text-center">Simulate</p>

            <div className="items-center justify-center flex">
              <SimulationForm
                initialData={initialData}
                onSubmit={handleRunSimulation}
                disabled={simulating}
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
              <div className="flex flex-col justify-center items-center mt-4 w-full px-4">
                <Text className="text-white mb-2">
                  Simulating… {progressLabel && `(${progressLabel})`}
                </Text>
                <CustomProgressBar progress={percentDoneSimulating} />
              </div>
            )}
            {simulationError && (
              <Text color="red.400" mt={4} textAlign="center">
                {simulationError}
              </Text>
            )}
          </div>
        </>
      )}
      {results && aggregate && lastParams && percentDoneSimulating === 100 && (
        <BlackjackSimulation
          initialData={{ ...initialData, ...lastParams }}
          results={results}
          aggregate={aggregate}
          totalBankruptcies={totalBankruptcies}
          compareResults={compareResults}
          compareTotalBankruptcies={compareTotalBankruptcies}
          compareAggregate={compareAggregate}
        />
      )}
      <Modal onClose={onClose} size="md" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rules</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            - Player plays based on basic strategy.
            <br />
            - Player uses Hi-Lo true count for bet sizing (count ÷ decks remaining).
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
            - Running count resets when shoe penetration is reached (default 75%).
            <br />
            - Base bet is 0.1% of initial bankroll.
            <br />
            - Optional A/B spread comparison and browser Web Worker parallel runs.
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
