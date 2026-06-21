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
import { computeConfidenceInterval } from "@/utils";

const GeneralStats: React.FC<{
  results: any;
  aggregate: any[];
  totalBankruptcies: number;
  numSimulations: number;
  numGames: number;
  initialBankroll: number;
  title?: string;
}> = ({
  results,
  aggregate,
  totalBankruptcies,
  numSimulations,
  numGames,
  title,
}) => {
  const perSimEv = aggregate.map(
    (run) => run["Expected Value Per Game"]?.slice(-1)[0] ?? 0
  );
  const ci = computeConfidenceInterval(perSimEv, 0.95);
  const ev = results["Expected Value Per Game"][0];

  return (
    <div className="bg-light-grey rounded-xl p-3 m-0 md:m-5">
      {title && (
        <h2 className="text-white text-xl font-bold mb-3">{title}</h2>
      )}
      <StatGroup flexWrap="wrap">
        <Stat minW="140px">
          <StatLabel className="text-white">Player win rate</StatLabel>
          <StatNumber className="text-white">
            {results["Player Win Rate"][0].toFixed(2)}%
          </StatNumber>
        </Stat>
        <Stat minW="140px">
          <StatLabel className="text-white">Dealer win rate</StatLabel>
          <StatNumber className="text-white">
            {results["Dealer Win Rate"][0].toFixed(2)}%
          </StatNumber>
        </Stat>
        <Stat minW="140px">
          <StatLabel className="text-white">House Edge</StatLabel>
          <StatNumber className="text-white">
            {results["House Edge"][0].toFixed(2)}%
          </StatNumber>
        </Stat>
        <Stat minW="180px">
          <StatLabel className="text-white">Expected value / game</StatLabel>
          <StatNumber className="text-white">
            {ev.toFixed(4)}$
            <StatArrow ml={2} type={ev > 0 ? "increase" : "decrease"} boxSize={5} />
          </StatNumber>
          <StatHelpText className="text-gray-300">
            95% CI: [{ci.low.toFixed(4)}, {ci.high.toFixed(4)}] (n={ci.n} sims)
          </StatHelpText>
        </Stat>
        <Stat minW="160px">
          <StatLabel className="text-white">$/hour (est.)</StatLabel>
          <StatNumber className="text-white">
            {(ev * GAMES_PLAYED_PER_HOUR).toFixed(3)}$
          </StatNumber>
        </Stat>
        <Stat minW="160px">
          <StatLabel className="text-white">Bankruptcies</StatLabel>
          <StatNumber className="text-white">
            {totalBankruptcies} (
            {((totalBankruptcies / (numSimulations * numGames)) * 100).toFixed(
              4
            )}
            %)
          </StatNumber>
        </Stat>
        <Stat minW="140px">
          <StatLabel className="text-white">Final bankroll</StatLabel>
          <StatNumber className="text-white">
            {results["Final Bankroll"][0].toFixed(2)}$
          </StatNumber>
        </Stat>
      </StatGroup>
    </div>
  );
};

export default GeneralStats;
