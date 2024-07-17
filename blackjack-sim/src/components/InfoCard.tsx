import React from "react";
import { Card, CardProps } from "@chakra-ui/react";
import { themeColors } from "../constants";
import { BettingSpreadTable } from ".";

interface InfoCardProps extends CardProps {}

const InfoCard: React.FC<InfoCardProps> = ({ ...props }) => {
  return (
    <Card
      {...props}
      backgroundColor={themeColors.LIGHT_GREY}
      className="p-5 md:ml-5 mt-10 w-4/5 md:w-2/5 md:mt-0"
    >
      <h2 className="text-xl text-white font-bold">What&#39;s going on?</h2>
      <p className="text-base text-white mt-2">
        This is a blackjack simulator. It makes use of optimal/basic strategy
        and card counting to play the game. The simulator does this A LOT of
        times (you can decide how much though). It has an implemented betting
        strategy to bet based on the running count. Finally the simulator will
        show you the expected value, profit, win rate, and many more aggregated
        statistics.
      </p>
      <BettingSpreadTable />
    </Card>
  );
};

export default InfoCard;
