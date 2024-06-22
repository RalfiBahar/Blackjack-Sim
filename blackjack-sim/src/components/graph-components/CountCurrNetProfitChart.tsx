"use client";
import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { downsample, removeDuplicates } from "./utils";
import { themeColors } from "@/constants";

const CountCurrNetProfitChart: React.FC<{ data: any }> = ({ data }) => {
  const [processedData, setProcessedData] = useState<any>(null);

  useEffect(() => {
    const scatterData = data.flatMap((data: any) =>
      data["Running Count"].map((count: number, i: number) => ({
        x: count,
        y: data["Current Game Net Profit"][i],
      }))
    );

    const downsampledData = removeDuplicates(scatterData);
    setProcessedData(downsampledData);
  }, [data]);

  if (!processedData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3 className="text-white">Running Count vs. Current Game Net Profit</h3>
      <Scatter
        data={{
          datasets: [
            {
              label: "Running Count vs. Current Game Net Profit",
              data: processedData,
              backgroundColor: "rgba(0, 100, 0, 0.2)", // Adjust transparency
              pointRadius: 5, // Increase the size of the points
              pointBackgroundColor: themeColors.GRAPH_GREEN,
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Running Count",
                color: themeColors.GRAPH_TEXT,
              },
              ticks: {
                color: themeColors.GRAPH_TEXT,
              },
            },
            y: {
              title: {
                display: true,
                text: "Current Game Net Profit",
                color: themeColors.GRAPH_TEXT,
              },
              ticks: {
                color: themeColors.GRAPH_TEXT,
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: false, // Disable tooltips on hover
            },
            legend: {
              display: false, // Optionally disable the legend
              labels: {
                color: themeColors.GRAPH_TEXT,
              },
            },
          },
          hover: {
            mode: undefined, // Disable hover interactions
          },
        }}
      />
    </div>
  );
};

export default CountCurrNetProfitChart;
