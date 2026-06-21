import { describe, it, expect } from "vitest";
import runSimulation, {
  countForBetting,
  resolveBetAmount,
  trueCountForBetting,
} from "../run_simulation";
import Deck from "../components/Deck";
import { computeConfidenceInterval } from "../utils";

const spread = {
  "-1": 1,
  "0": 1,
  "1": 1,
  "2": 4,
  "3": 6,
  "4": 8,
  "5": 12,
  "6-9": 16,
  "10": 32,
};

describe("runSimulation", () => {
  it("returns data and summary objects", () => {
    const result = runSimulation(10, 100, 10000, spread, 1);
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("summary");
  });

  it("houseEdge is a finite number", () => {
    const result = runSimulation(50, 100, 10000, spread, 1);
    expect(isFinite(result.summary.houseEdge)).toBe(true);
  });

  it("bet sizing uses true count, not raw running count", () => {
    const deck = new Deck(6);
    while (deck.cardsRemaining() > 52 * 2) deck.dealCard();
    const running = 10;
    const trueCount = trueCountForBetting(running, deck);
    const bet = resolveBetAmount(10, running, spread, deck, 6);
    expect(trueCount).toBeLessThan(running);
    expect(bet).toBe(10 * spread[String(trueCount) as keyof typeof spread]);
    expect(bet).not.toBe(10 * spread["10"]);
  });

  it("works with custom penetration", () => {
    const r1 = runSimulation(5, 100, 10000, spread, 1, 0.5);
    const r2 = runSimulation(5, 100, 10000, spread, 1, 0.9);
    expect(r1.summary.finalBankroll).toBeGreaterThan(0);
    expect(r2.summary.finalBankroll).toBeGreaterThan(0);
  });
});

describe("trueCountForBetting", () => {
  it("normalizes running count by decks remaining", () => {
    const deck = new Deck(6);
    while (deck.cardsRemaining() > 52 * 2) deck.dealCard();
    expect(trueCountForBetting(10, deck)).toBe(Math.trunc(10 / 2));
  });

  it("countForBetting alias returns true count", () => {
    const deck = new Deck(2);
    expect(countForBetting(5, deck)).toBe(trueCountForBetting(5, deck));
  });
});

describe("computeConfidenceInterval", () => {
  it("computes symmetric interval around mean", () => {
    const values = [1, 2, 3, 4, 5];
    const ci = computeConfidenceInterval(values, 0.95);
    expect(ci.mean).toBe(3);
    expect(ci.low).toBeLessThan(ci.mean);
    expect(ci.high).toBeGreaterThan(ci.mean);
  });
});
