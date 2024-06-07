import React from "react";
import { Bar } from "react-chartjs-2";
import { meanNetProfitPerBet } from "./utils";

const BetAmountFrequencyChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3>Bet Amount Frequencies</h3>
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
              },
            },
            y: {
              title: {
                display: true,
                text: "Frequency",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default BetAmountFrequencyChart;
