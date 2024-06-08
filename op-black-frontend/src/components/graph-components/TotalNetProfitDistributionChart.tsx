import React from "react";
import { Bar } from "react-chartjs-2";

const TotalNetProfitDistributionChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-white">Distribution of Total Net Profit</h3>
      <Bar
        data={{
          labels: data["Total Net Profit"].map((_: number, i: number) =>
            i.toString()
          ),
          datasets: [
            {
              label: "Total Net Profit",
              data: data["Total Net Profit"],
              backgroundColor: "blue",
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Total Net Profit",
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

export default TotalNetProfitDistributionChart;
