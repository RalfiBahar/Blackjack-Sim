import React from "react";
import { calculateStatistics } from "./utils";

const RunningCountStatistics: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div>
      <h3>Running Count Statistics</h3>
      <p>
        Mean:{" "}
        {calculateStatistics(
          data.flatMap((data: any) => data["Running Count"])
        ).mean.toFixed(2)}
      </p>
      <p>
        Variance:{" "}
        {calculateStatistics(
          data.flatMap((data: any) => data["Running Count"])
        ).variance.toFixed(2)}
      </p>
      <p>
        Standard Deviation:{" "}
        {calculateStatistics(
          data.flatMap((data: any) => data["Running Count"])
        ).standardDeviation.toFixed(2)}
      </p>
    </div>
  );
};

export default RunningCountStatistics;
