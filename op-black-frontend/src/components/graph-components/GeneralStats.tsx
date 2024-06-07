import React from "react";
import { GAMES_PLAYED_PER_HOUR } from "@/constants";

const GeneralStats: React.FC<{
  results: any;
  totalBankruptcies: number;
  numSimulations: number;
  numGames: number;
}> = ({ results, totalBankruptcies, numSimulations, numGames }) => {
  return (
    <div>
      <p className="">
        Player win rate: {results["Player Win Rate"][0].toFixed(2)}%
      </p>
      <p>Dealer win rate: {results["Dealer Win Rate"][0].toFixed(2)}%</p>
      <p>Tie rate: {results["Tie Rate"][0].toFixed(2)}%</p>
      <p>
        Number of Bankrolls depleted: {totalBankruptcies} - Percentage:{" "}
        {((totalBankruptcies / (numSimulations * numGames)) * 100).toFixed(4)}%
      </p>
      <p>
        Expected value per game:{" "}
        {results["Expected Value Per Game"][0].toFixed(4)}
      </p>
      <p>House edge: {results["House Edge"][0].toFixed(2)}%</p>
      <p>
        Money earned per hour:{" "}
        {(
          results["Expected Value Per Game"][0] * GAMES_PLAYED_PER_HOUR
        ).toFixed(3)}
        $
      </p>
      <p>Total Profit Amount: {results["Total Profit Amount"][0].toFixed(4)}</p>
      <p>Total Bet Amount: {results["Total Bet Amount"][0].toFixed(4)}</p>
      <p>Final Bankroll: {results["Final Bankroll"][0].toFixed(2)}</p>
    </div>
  );
};

export default GeneralStats;
