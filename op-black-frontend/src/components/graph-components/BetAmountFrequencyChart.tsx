import React from "react";
import { Bar } from "react-chartjs-2";
import { meanNetProfitPerBet } from "./utils";

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
              backgroundColor: "orange",
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Bet Amount",
                color: "white",
              },
              ticks: {
                color: "white",
              },
            },
            y: {
              title: {
                display: true,
                text: "Frequency",
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

export default BetAmountFrequencyChart;
