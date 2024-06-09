// src/components/CurrentBankrollChart.tsx

import React from "react";
import { Line } from "react-chartjs-2";
import { themeColors } from "@/constants";

const CurrentBankrollChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-white">Current Bankroll per Game</h3>
      <Line
        data={{
          labels: data["Current Bankroll"].map((_: number, i: number) =>
            i.toString()
          ),
          datasets: [
            {
              label: "Current Bankroll",
              data: data["Current Bankroll"],
              borderColor: themeColors.GRAPH_RED,
              fill: false,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Game Number",
                color: themeColors.GRAPH_TEXT,
              },
              ticks: {
                color: themeColors.GRAPH_TEXT,
              },
            },
            y: {
              title: {
                display: true,
                text: "Current Bankroll",
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

export default CurrentBankrollChart;
