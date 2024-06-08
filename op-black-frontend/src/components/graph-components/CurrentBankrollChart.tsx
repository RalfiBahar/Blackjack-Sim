// src/components/CurrentBankrollChart.tsx

import React from "react";
import { Line } from "react-chartjs-2";

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
              borderColor: "red",
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
                color: "white",
              },
              ticks: {
                color: "white",
              },
            },
            y: {
              title: {
                display: true,
                text: "Current Bankroll",
                color: "white",
              },
              ticks: {
                color: "white",
              },
            },
          },
          plugins: {
            legend: {
              labels: {
                color: "white",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default CurrentBankrollChart;
