"use client";

import React, { useState } from "react";
import { BettingValues, InitialData, SimulationParams } from "./types";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { AdvancedSettingsAccordion } from ".";
import { InitialBettingValues } from "@/constants";

interface SimulationFormProps {
  initialData: InitialData;
  onSubmit: (data: SimulationParams) => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [numGames, setNumGames] = useState<number>(initialData.numGames);
  const [initialBankroll, setInitialBankroll] = useState<number>(
    initialData.initialBankroll
  );
  const [numSimulations, setNumSimulations] = useState<number>(
    initialData.numSimulations
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const [bettingSpread, setBettingValues] =
    useState<BettingValues>(InitialBettingValues);
  const [numberOfDecks, setNumberOfDecks] = useState<number>(1);
  const [warning, setWarning] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numGames * numSimulations > 3000000) {
      setWarning(
        "The product of numGames and numSimulations must not exceed 3,000,000."
      );
      return;
    }
    setWarning("");
    onSubmit({
      numGames,
      initialBankroll,
      numSimulations,
      bettingSpread,
      numberOfDecks,
    });
    setDisabled(true);
  };

  const handleBettingValuesChange = (values: BettingValues) => {
    setBettingValues(values);
  };

  const handleDecksChange = (value: number) => {
    setNumberOfDecks(value);
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      p={4}
      m={4}
      borderWidth={5}
      borderRadius="md"
      boxShadow="md"
      className={`border-white transition-all duration-300 w-full`}
    >
      <FormControl id="numGames" mb={4}>
        <FormLabel className="text-white">
          Number of Games to Simulate
        </FormLabel>
        <Input
          type="number"
          value={numGames}
          onChange={(e) => setNumGames(Number(e.target.value))}
          min={1}
          max={1000000}
          className="text-white"
        />
      </FormControl>
      <FormControl id="initialBankroll" mb={4}>
        <FormLabel className="text-white">Initial Bankroll</FormLabel>
        <Input
          type="number"
          value={initialBankroll}
          onChange={(e) => setInitialBankroll(Number(e.target.value))}
          min={1}
          className="text-white"
          max={1000000}
        />
      </FormControl>
      <FormControl id="numSimulations" mb={4}>
        <FormLabel className="text-white">Number of Simulations</FormLabel>
        <Input
          type="number"
          value={numSimulations}
          onChange={(e) => setNumSimulations(Number(e.target.value))}
          min={1}
          max={100000}
          className="text-white"
        />
      </FormControl>
      {warning && (
        <Text color="red.500" mb={4}>
          {warning}
        </Text>
      )}
      <Button
        type="submit"
        colorScheme="blue"
        mt={4}
        className="text-white"
        isDisabled={disabled}
      >
        Run Simulation
      </Button>
      <div className="hidden md:block">
        <AdvancedSettingsAccordion
          onToggle={setIsAccordionOpen}
          sendBettingValues={(values: BettingValues) => {
            handleBettingValuesChange(values);
          }}
          sendNumberOfDecks={handleDecksChange}
        />
      </div>
    </Box>
  );
};

export default SimulationForm;
