import React from "react";
import { Bar } from "react-chartjs-2";
import { meanNetProfitPerBet } from "./utils";

const CurrNetProfitPerBetChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-white">
        Mean Current Game Net Profit per Bet Amount
      </h3>
      <Bar
        data={{
          labels: meanNetProfitPerBet(data).map((data) =>
            data.betAmount.toString()
          ),
          datasets: [
            {
              label: "Mean Current Game Net Profit",
              data: meanNetProfitPerBet(data).map((data) => data.meanProfit),
              backgroundColor: "blue",
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
                text: "Mean Current Game Net Profit",
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

export default CurrNetProfitPerBetChart;
