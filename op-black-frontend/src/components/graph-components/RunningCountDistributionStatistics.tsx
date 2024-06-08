import React from "react";
import * as stat from "simple-statistics";

const RunningCountDistributionStatistics: React.FC<{ data: any }> = ({
  data,
}) => {
  const runningCountData = data.flatMap((item: any) => item["Running Count"]);

  const mean = stat.mean(runningCountData);
  const variance = stat.variance(runningCountData);
  const standardDeviation = stat.standardDeviation(runningCountData);

  return (
    <div>
      <h3 className="text-white">Running Count Distribution Statistics</h3>
      <p className="text-white">Mean: {mean.toFixed(2)}</p>
      <p className="text-white">Variance: {variance.toFixed(2)}</p>
      <p className="text-white">
        Standard Deviation: {standardDeviation.toFixed(2)}
      </p>
    </div>
  );
};

export default RunningCountDistributionStatistics;
