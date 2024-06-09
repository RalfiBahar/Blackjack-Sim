import React from "react";
import { Bar } from "react-chartjs-2";
import { themeColors } from "@/constants";

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
              backgroundColor: themeColors.GRAPH_BLUE,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Total Net Profit",
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

export default TotalNetProfitDistributionChart;
