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
      <h3>Running Count Distribution Statistics</h3>
      <p>Mean: {mean.toFixed(2)}</p>
      <p>Variance: {variance.toFixed(2)}</p>
      <p>Standard Deviation: {standardDeviation.toFixed(2)}</p>
    </div>
  );
};

export default RunningCountDistributionStatistics;
