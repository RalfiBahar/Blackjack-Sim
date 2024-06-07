import React from "react";
import { Bar } from "react-chartjs-2";
import { createBins } from "./utils";

const CurrNetProfitDistributionChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3>Distribution of Current Game Net Profit</h3>
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
              backgroundColor: "green",
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Current Game Net Profit",
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

export default CurrNetProfitDistributionChart;
