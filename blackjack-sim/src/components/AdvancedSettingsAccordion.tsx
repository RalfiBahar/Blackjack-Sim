"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  AccordionProps,
  Text,
} from "@chakra-ui/react";
import { EditibleBettingSpreadTable } from ".";
import { BettingValues } from "./types";
import { InitialBettingValues } from "@/constants";

interface AdvancedSettingsAccordionProps {
  onToggle: (isOpen: boolean) => void;
  sendBettingValues: any;
}

const AdvancedSettingsAccordion: React.FC<AdvancedSettingsAccordionProps> = ({
  onToggle,
  sendBettingValues,
}) => {
  const [bettingValues, setBettingValues] =
    useState<BettingValues>(InitialBettingValues);
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
