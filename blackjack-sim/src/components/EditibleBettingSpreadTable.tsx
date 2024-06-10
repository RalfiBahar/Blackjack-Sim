"use client";

import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  TableProps,
  Box,
  Input,
  Text,
} from "@chakra-ui/react";
import { themeColors } from "../constants";
import { BettingValues } from "./types";

interface EditibleBettingSpreadTableProps extends TableProps {
  bettingValues: {
    "-1": number;
    "0": number;
    "1": number;
    "2": number;
    "3": number;
    "4": number;
    "5": number;
    "6-9": number;
    "10": number;
  };
  setBettingValues: (key: keyof BettingValues, value: string) => void;
}

const EditibleBettingSpreadTable: React.FC<EditibleBettingSpreadTableProps> = ({
  bettingValues,
  setBettingValues,
  ...props
}) => {
  const order: (keyof typeof bettingValues)[] = [
    "-1",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6-9",
    "10",
  ];

  return (
    <Box maxW="100%" overflowX="auto" padding="2">
      <TableContainer
        className="bg-white rounded-md mt-5"
        maxWidth="800px"
        margin="0 auto"
      >
        <Table variant="simple" size={"sm"}>
          <TableCaption>Betting Strategy Based on Running Count</TableCaption>
          <Thead>
            <Tr>
              <Th>Running Count</Th>
              <Th>Bet</Th>
            </Tr>
          </Thead>
          <Tbody>
            {order.map((key) => (
              <Tr key={key}>
                <Td>{key === "6-9" ? ">=6 and <=9" : key}</Td>
                <Td>
                  base bet *
                  <Input
                    placeholder=""
                    size="sm"
                    m={2}
                    value={bettingValues[key]}
                    onChange={(e) => setBettingValues(key, e.target.value)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EditibleBettingSpreadTable;
