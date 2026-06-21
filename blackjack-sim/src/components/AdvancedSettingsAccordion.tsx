"use client";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Box,
  AccordionIcon,
  Text,
  Input,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import { EditibleBettingSpreadTable } from ".";
import { BettingValues } from "./types";
import { InitialBettingValues, DEFAULT_PENETRATION } from "@/constants";

interface AdvancedSettingsAccordionProps {
  onToggle: (isOpen: boolean) => void;
  sendBettingValues: (values: BettingValues) => void;
  sendCompareBettingValues?: (values: BettingValues) => void;
  sendNumberOfDecks: (value: number) => void;
  sendPenetration?: (value: number) => void;
  enableCompare?: boolean;
  onEnableCompareChange?: (enabled: boolean) => void;
  useClientWorkers?: boolean;
  onUseClientWorkersChange?: (enabled: boolean) => void;
}

const AdvancedSettingsAccordion: React.FC<AdvancedSettingsAccordionProps> = ({
  onToggle,
  sendBettingValues,
  sendCompareBettingValues,
  sendNumberOfDecks,
  sendPenetration,
  enableCompare = false,
  onEnableCompareChange,
  useClientWorkers = true,
  onUseClientWorkersChange,
}) => {
  const [bettingValues, setBettingValues] =
    useState<BettingValues>(InitialBettingValues);
  const [compareValues, setCompareValues] =
    useState<BettingValues>(InitialBettingValues);
  const [numberOfDecks, setNumberOfDecks] = useState<number>(1);
  const [penetrationPct, setPenetrationPct] = useState<number>(
    DEFAULT_PENETRATION * 100
  );
  const [warning, setWarning] = useState<string | null>(null);

  const handleInputChange = (
    key: keyof BettingValues,
    value: string,
    target: "primary" | "compare" = "primary"
  ) => {
    let numericValue = parseInt(value) || 0;
    if (numericValue > 200) {
      numericValue = 200;
      setWarning("Betting multiplier cannot exceed 200.");
    } else if (numericValue < 0) {
      numericValue = 0;
      setWarning("Betting multiplier cannot be negative.");
    } else {
      setWarning(null);
    }
    if (target === "compare") {
      const next = { ...compareValues, [key]: numericValue };
      setCompareValues(next);
      sendCompareBettingValues?.(next);
    } else {
      const next = { ...bettingValues, [key]: numericValue };
      setBettingValues(next);
      sendBettingValues(next);
    }
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
              onChange={(e) => {
                const v = parseInt(e.target.value) || 1;
                setNumberOfDecks(v);
                sendNumberOfDecks(v);
              }}
              min={1}
              max={8}
              className="text-white"
            />
            <FormLabel className="text-white" mt={4}>
              Shoe penetration (% dealt before reshuffle)
            </FormLabel>
            <Input
              type="number"
              value={penetrationPct}
              onChange={(e) => {
                let v = parseInt(e.target.value) || DEFAULT_PENETRATION * 100;
                v = Math.min(95, Math.max(50, v));
                setPenetrationPct(v);
                sendPenetration?.(v / 100);
              }}
              min={50}
              max={95}
              className="text-white"
            />
            <Checkbox
              mt={4}
              isChecked={useClientWorkers}
              onChange={(e) => onUseClientWorkersChange?.(e.target.checked)}
              colorScheme="blue"
            >
              <Text as="span" className="text-white">
                Run in browser with Web Workers (parallel)
              </Text>
            </Checkbox>
            <Checkbox
              mt={2}
              isChecked={enableCompare}
              onChange={(e) => onEnableCompareChange?.(e.target.checked)}
              colorScheme="blue"
            >
              <Text as="span" className="text-white">
                A/B compare two betting spreads
              </Text>
            </Checkbox>
            <Text className="text-white" mt={4} fontWeight="bold">
              Spread A
            </Text>
            <EditibleBettingSpreadTable
              bettingValues={bettingValues}
              setBettingValues={(key, value) =>
                handleInputChange(key as keyof BettingValues, value, "primary")
              }
            />
            {enableCompare && (
              <>
                <Text className="text-white" mt={4} fontWeight="bold">
                  Spread B (comparison)
                </Text>
                <EditibleBettingSpreadTable
                  bettingValues={compareValues}
                  setBettingValues={(key, value) =>
                    handleInputChange(key as keyof BettingValues, value, "compare")
                  }
                />
              </>
            )}
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
