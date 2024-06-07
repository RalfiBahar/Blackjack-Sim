import React from "react";
import { Bar } from "react-chartjs-2";

const RunningCountDistributionChart: React.FC<{ data: any }> = ({ data }) => {
  // Aggregate Running Count data
  const aggregateRunningCount = () => {
    const runningCountData = data.map((d: any) => d["Running Count"]).flat();

    const frequencyMap: { [key: number]: number } = {};
    runningCountData.forEach((count: number) => {
      if (frequencyMap[count]) {
        frequencyMap[count]++;
      } else {
        frequencyMap[count] = 1;
      }
    });

    const sortedKeys = Object.keys(frequencyMap)
      .map(Number)
      .sort((a, b) => a - b);
    const frequencies = sortedKeys.map((key) => frequencyMap[key]);

    return { sortedKeys, frequencies };
  };

  const { sortedKeys, frequencies } = aggregateRunningCount();

  return (
    <div>
      <h3>Running Count Distribution</h3>
      <Bar
        data={{
          labels: sortedKeys,
          datasets: [
            {
              label: "Running Count",
              data: frequencies,
              backgroundColor: "green",
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
                text: "Frequency",
              },
            },
          },
        }}
      />
    </div>
  );
};

export default RunningCountDistributionChart;
