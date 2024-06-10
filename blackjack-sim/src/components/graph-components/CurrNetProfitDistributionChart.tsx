import React from "react";
import { Bar } from "react-chartjs-2";
import { createBins } from "./utils";
import { themeColors } from "@/constants";

const CurrNetProfitDistributionChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-white">Distribution of Current Game Net Profit</h3>
      <Bar
        data={{
          labels: createBins(data["Current Game Net Profit"], 50).map(
            (bin: { binMin: number }) => bin.binMin.toFixed(2)
          ),
          datasets: [
            {
              label: "Current Game Net Profit",
              data: createBins(data["Current Game Net Profit"], 50).map(
                (bin: { count: any }) => bin.count
              ),
              backgroundColor: themeColors.GRAPH_GREEN,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Current Game Net Profit",
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

export default CurrNetProfitDistributionChart;
