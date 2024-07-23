"use client";
import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  AccordionProps,
  Text,
  Input,
  FormLabel,
} from "@chakra-ui/react";
import { EditibleBettingSpreadTable } from ".";
import { BettingValues } from "./types";
import { InitialBettingValues } from "@/constants";

interface AdvancedSettingsAccordionProps {
  onToggle: (isOpen: boolean) => void;
  sendBettingValues: any;
  sendNumberOfDecks: (value: number) => void;
}

const AdvancedSettingsAccordion: React.FC<AdvancedSettingsAccordionProps> = ({
  onToggle,
  sendBettingValues,
  sendNumberOfDecks,
}) => {
  const [bettingValues, setBettingValues] =
    useState<BettingValues>(InitialBettingValues);
  const [numberOfDecks, setNumberOfDecks] = useState<number>(1);

  const [warning, setWarning] = useState<string | null>(null);

  const handleInputChange = (key: keyof BettingValues, value: string) => {
    let numericValue = parseInt(value) || 0;
    if (numericValue > 200) {
      numericValue = 200;
      setWarning(
        `Betting multiplier cannot exceed 200. It has been set to 200.`
      );
    } else if (numericValue < 0) {
      numericValue = 0;
      setWarning(
        `Betting multiplier cannot be negative. It has been set to 0.`
      );
    } else {
      setWarning(null);
    }
    setBettingValues((prevValues) => ({
      ...prevValues,
      [key]: numericValue,
    }));
    sendBettingValues((prevValues: BettingValues) => ({
      ...prevValues,
      [key]: numericValue,
    }));
  };

  const handleDecksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 1;
    setNumberOfDecks(value);
    sendNumberOfDecks(value);
  };
  return (
    <Box w="full" className="mt-3">
      <Accordion allowToggle onChange={(index) => onToggle(index === 0)}>
        <AccordionItem>
          <h2>
            <AccordionButton className="text-lighter-blue">
              <Box as="span" flex="1" textAlign="left">
                Advanced Settings
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <FormLabel className="text-white">Number of Decks</FormLabel>
            <Input
              type="number"
              value={numberOfDecks}
              onChange={handleDecksChange}
              min={1}
              max={8}
              className="text-white"
            />
            <EditibleBettingSpreadTable
              bettingValues={bettingValues}
              setBettingValues={handleInputChange}
            />
            {warning && (
              <Text color="red.400" mt={3}>
                {warning}
              </Text>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default AdvancedSettingsAccordion;
