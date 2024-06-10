import React from "react";
import { GAMES_PLAYED_PER_HOUR } from "@/constants";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";
import { themeColors } from "@/constants";

const GeneralStats: React.FC<{
  results: any;
  totalBankruptcies: number;
  numSimulations: number;
  numGames: number;
  initialBankroll: number;
}> = ({
  results,
  totalBankruptcies,
  numSimulations,
  numGames,
  initialBankroll,
}) => {
  return (
    <div className="bg-light-grey rounded-xl p-3 m-0 md:m-5">
      <StatGroup>
        <Stat>
          <StatLabel className="text-white">Player win rate</StatLabel>
          <StatNumber className="text-white">
            {results["Player Win Rate"][0].toFixed(2)}%
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel className="text-white">Dealer win rate</StatLabel>
          <StatNumber className="text-white">
            {results["Dealer Win Rate"][0].toFixed(2)}%
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel className="text-white">Tie rate</StatLabel>
          <StatNumber className="text-white">
            {results["Tie Rate"][0].toFixed(2)}%
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel className="text-white">House Edge</StatLabel>
          <StatNumber className="text-white">
            {results["House Edge"][0].toFixed(2)}%
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel className="text-white">
            Number of Bankrolls depleted{" "}
          </StatLabel>
          <StatNumber className="text-white">
            {totalBankruptcies} (
            {((totalBankruptcies / numGames) * 100).toFixed(4)}%)
          </StatNumber>
        </Stat>
        {/* 
        <Stat>
          <StatLabel className="text-white">Percentage of Bankrolls depleted</StatLabel>
          <StatNumber className="text-white">
            {((totalBankruptcies / numGames) * 100).toFixed(4)}%
          </StatNumber>
        </Stat>
        */}
      </StatGroup>
      <StatGroup>
        <Stat>
          <StatLabel className="text-white">Expected value per game</StatLabel>
          <StatNumber className="text-white">
            {results["Expected Value Per Game"][0].toFixed(4)}$
            <StatArrow
              ml={2}
              type={
                results["Expected Value Per Game"][0] > 0
                  ? "increase"
                  : "decrease"
              }
              boxSize={5}
            />
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel className="text-white">Money earned per hour</StatLabel>
          <StatNumber className="text-white">
            {(
              results["Expected Value Per Game"][0] * GAMES_PLAYED_PER_HOUR
            ).toFixed(3)}
            $
            <StatArrow
              ml={2}
              type={
                results["Expected Value Per Game"][0] > 0
                  ? "increase"
                  : "decrease"
              }
              boxSize={5}
            />
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel className="text-white">Total Profit Amount</StatLabel>
          <StatNumber className="text-white">
            {results["Total Profit Amount"][0].toFixed(2)}$
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel className="text-white">Total Bet Amount</StatLabel>
          <StatNumber className="text-white">
            {results["Total Bet Amount"][0].toFixed(2)}$
          </StatNumber>
        </Stat>

        <Stat>
          <StatLabel className="text-white">Final Bankroll</StatLabel>
          <StatNumber className="text-white">
            {results["Final Bankroll"][0].toFixed(2)}$
            <StatArrow
              ml={2}
              type={
                results["Total Profit Amount"][0] >= 0 ? "increase" : "decrease"
              }
              boxSize={5}
            />
          </StatNumber>
        </Stat>
      </StatGroup>
    </div>
  );
};

export default GeneralStats;
