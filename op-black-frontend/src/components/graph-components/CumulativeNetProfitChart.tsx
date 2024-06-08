import React from "react";
import { Line } from "react-chartjs-2";

const CumulativeNetProfitChart: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3 className="text-white">Cumulative Total Net Profit Trend</h3>
      <Line
        data={{
          labels: data["Total Net Profit"].map((_: number, i: number) =>
            i.toString()
          ),
          datasets: [
            {
              label: "Cumulative Total Net Profit",
              data: data["Total Net Profit"].reduce(
                (acc: number[], val: number) => {
                  if (acc.length === 0) return [val];
                  acc.push(acc[acc.length - 1] + val);
                  return acc;
                },
                []
              ),
              borderColor: "purple",
            },
          ],
        }}
        options={{
          scales: {
            x: {
              title: {
                display: false,
                color: "white",
              },
              ticks: {
                color: "white",
              },
            },
            y: {
              title: {
                display: false,
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

export default CumulativeNetProfitChart;
