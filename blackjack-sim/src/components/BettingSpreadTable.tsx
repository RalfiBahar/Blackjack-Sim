import React from "react";
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
} from "@chakra-ui/react";
import { themeColors } from "../constants";

interface BettinSpreadTableProps extends TableProps {}

const BettingSpreadTable: React.FC<BettinSpreadTableProps> = ({ ...props }) => {
  return (
    <Box maxW="100%" overflowX="auto" padding="5">
      <TableContainer
        className="bg-white rounded-md mt-5"
        maxWidth="800px"
        margin="0 auto"
      >
        <Table variant="simple" size={"sm"}>
          <TableCaption>Betting Strategy Based on Running Count</TableCaption>
          <Thead>
            <Tr>
              <Th isNumeric>Running Count</Th>
              <Th>Bet</Th>
              <Th isNumeric>Example (base bet $10)</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{"<="}-1</Td>
              <Td>base bet</Td>
              <Td isNumeric>$10</Td>
            </Tr>
            <Tr>
              <Td>0</Td>
              <Td>base bet</Td>
              <Td isNumeric>$10</Td>
            </Tr>
            <Tr>
              <Td>1</Td>
              <Td>base bet</Td>
              <Td isNumeric>$10</Td>
            </Tr>
            <Tr>
              <Td>2</Td>
              <Td>base bet * 4</Td>
              <Td isNumeric>$40</Td>
            </Tr>
            <Tr>
              <Td>3</Td>
              <Td>base bet * 6</Td>
              <Td isNumeric>$60</Td>
            </Tr>
            <Tr>
              <Td>4</Td>
              <Td>base bet * 8</Td>
              <Td isNumeric>$80</Td>
            </Tr>
            <Tr>
              <Td>5</Td>
              <Td>base bet * 12</Td>
              <Td isNumeric>$120</Td>
            </Tr>
            <Tr>
              <Td>
                {">="}6 and {"<="}9
              </Td>
              <Td>base bet * 16</Td>
              <Td isNumeric>$160</Td>
            </Tr>
            <Tr>
              <Td>{">="}10</Td>
              <Td>base bet * 32</Td>
              <Td isNumeric>$320</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BettingSpreadTable;
