// src/components/CountCurrNetProfitChart.tsx

import React, { useEffect, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { downsample } from "./utils";

const CountCurrNetProfitChart: React.FC<{ data: any }> = ({ data }) => {
  const [processedData, setProcessedData] = useState<any>(null);

  useEffect(() => {
    // Convert your data to scatter plot format
    const scatterData = data.flatMap((data: any) =>
      data["Running Count"].map((count: number, i: number) => ({
        x: count,
        y: data["Current Game Net Profit"][i],
      }))
    );

    // Downsample the data
    const downsampledData = downsample(scatterData, 2000); // Adjust threshold as needed
    setProcessedData(downsampledData);
  }, [data]);

  if (!processedData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Running Count vs. Current Game Net Profit</h3>
      <Scatter
        data={{
          datasets: [
            {
              label: "Running Count vs. Current Game Net Profit",
              data: processedData,
              backgroundColor: "rgba(0, 100, 0, 0.2)", // Adjust transparency
              pointRadius: 5, // Increase the size of the points
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Running Count",
              },
            },
            y: {
              title: {
                display: true,
                text: "Current Game Net Profit",
              },
            },
          },
          plugins: {
            tooltip: {
              enabled: false, // Disable tooltips on hover
            },
            legend: {
              display: false, // Optionally disable the legend
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
