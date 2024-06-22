// Calculate mean net profit per bet amount
export const meanNetProfitPerBet = (aggregate: any) => {
  const betAmounts: {
    [key: number]: { totalProfit: number; count: number };
  } = {};
  const betAmountFreq: { [key: number]: number } = {};

  aggregate.forEach((data: any) => {
    data["Bet Amount"].forEach((betAmount: number, index: number) => {
      const profit = data["Current Game Net Profit"][index];
      if (betAmount in betAmounts) {
        betAmounts[betAmount].totalProfit += profit;
        betAmounts[betAmount].count += 1;
      } else {
        betAmounts[betAmount] = { totalProfit: profit, count: 1 };
      }

      if (betAmount in betAmountFreq) {
        betAmountFreq[betAmount] += 1;
      } else {
        betAmountFreq[betAmount] = 1;
      }
    });
  });

  const meanNetProfit = Object.keys(betAmounts).map((bet: any) => {
    return {
      betAmount: Number(bet),
      meanProfit: betAmounts[bet].totalProfit / betAmounts[bet].count,
      frequency: betAmountFreq[bet],
    };
  });

  return meanNetProfit;
};

export function calculateStatistics(data: number[]) {
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const variance =
    data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
    (data.length - 1);
  const standardDeviation = Math.sqrt(variance);
  return { mean, variance, standardDeviation };
}

export const createBins = (data: any, numBins: number) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / numBins;
  let bins = [];

  for (let i = 0; i < numBins; i++) {
    const binMin = min + i * binWidth;
    const binMax = binMin + binWidth;
    bins.push({
      binMin: binMin,
      binMax: binMax,
      count: data.filter((x: number) => x >= binMin && x < binMax).length,
    });
  }
  return bins;
};

// src/utils/downsample.ts

export function downsample(data: any[], threshold: number): any[] {
  if (threshold >= data.length || threshold === 0) {
    return data; // Nothing to do
  }

  const sampled = [];
  const bucketSize = (data.length - 2) / (threshold - 2);

  let a: any = 0; // Initially a is the first point in the triangle
  let maxAreaPoint;
  let maxArea;
  let area;
  let nextA;

  sampled.push(data[a]); // Always add the first point

  for (let i = 0; i < threshold - 2; i++) {
    // Calculate point average for next bucket
    let avgX = 0;
    let avgY = 0;
    let avgRangeStart = Math.floor((i + 1) * bucketSize) + 1;
    let avgRangeEnd = Math.floor((i + 2) * bucketSize) + 1;
    avgRangeEnd = avgRangeEnd < data.length ? avgRangeEnd : data.length;

    const avgRangeLength = avgRangeEnd - avgRangeStart;

    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].x;
      avgY += data[j].y;
    }
    avgX /= avgRangeLength;
    avgY /= avgRangeLength;

    // Get the range for this bucket
    const rangeOffs = Math.floor(i * bucketSize) + 1;
    const rangeTo = Math.floor((i + 1) * bucketSize) + 1;

    // Point a
    const pointAX = data[a].x;
    const pointAY = data[a].y;

    maxArea = area = -1;

    for (let j = rangeOffs; j < rangeTo; j++) {
      // Calculate triangle area over three buckets
      area =
        Math.abs(
          (pointAX - avgX) * (data[j].y - pointAY) -
            (pointAX - data[j].x) * (avgY - pointAY)
        ) * 0.5;

      if (area > maxArea) {
        maxArea = area;
        maxAreaPoint = data[j];
        nextA = j; // Next a is this b
      }
    }

    sampled.push(maxAreaPoint); // Pick this point from the bucket
    a = nextA; // This a is the next a (chosen b)
  }

  sampled.push(data[data.length - 1]); // Always add the last point

  return sampled;
}

export function removeDuplicates(data: any) {
  const unique: any = [];
  const seen = new Set();
  data.forEach((point: any) => {
    const key = `${point.x}-${point.y}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(point);
    }
  });
  return unique;
}
