import React from "react";
import { Bar } from "react-chartjs-2";
import { meanNetProfitPerBet } from "./utils";
import { themeColors } from "@/constants";

const BetAmountFrequencyChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-white">Bet Amount Frequencies</h3>
      <Bar
        data={{
          labels: meanNetProfitPerBet(data).map((data) =>
            data.betAmount.toString()
          ),
          datasets: [
            {
              label: "Frequency",
              data: meanNetProfitPerBet(data).map((data) => data.frequency),
              backgroundColor: themeColors.GRAPH_ORANGE,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Bet Amount",
                color: themeColors.GRAPH_TEXT,
              },
              ticks: {
                color: themeColors.GRAPH_TEXT,
              },
            },
            y: {
              title: {
                display: true,
                text: "Frequency",
                color: themeColors.GRAPH_TEXT,
              },
              ticks: {
                color: themeColors.GRAPH_TEXT,
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: themeColors.GRAPH_TEXT,
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BetAmountFrequencyChart;
