import { describe, it, expect } from "vitest";
import BlackjackGame from "../components/BlackjackGame";
import Deck from "../components/Deck";
import Card from "../components/Card";

const makeDeck = () => new Deck(6);

describe("BlackjackGame.calculateScore", () => {
  it("sums a simple hard hand", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [new Card("hearts", "10"), new Card("spades", "7")];
    expect(game.calculateScore(hand)).toBe(17);
  });

  it("counts ace as 11 when beneficial", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [new Card("hearts", "Ace"), new Card("spades", "9")];
    expect(game.calculateScore(hand)).toBe(20);
  });

  it("reduces ace to 1 to avoid bust", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [
      new Card("hearts", "Ace"),
      new Card("spades", "9"),
      new Card("clubs", "5"),
    ];
    expect(game.calculateScore(hand)).toBe(15);
  });

  it("recognises natural blackjack as 21", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [new Card("hearts", "Ace"), new Card("spades", "King")];
    expect(game.calculateScore(hand)).toBe(21);
  });

  it("counts face cards as 10", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [new Card("hearts", "Jack"), new Card("spades", "Queen")];
    expect(game.calculateScore(hand)).toBe(20);
  });
});

describe("BlackjackGame.isSoftHand", () => {
  it("identifies soft 17 (A+6)", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [new Card("hearts", "Ace"), new Card("spades", "6")];
    expect(game.isSoftHand(hand)).toBe(true);
  });

  it("hard 17 is not soft", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [new Card("hearts", "10"), new Card("spades", "7")];
    expect(game.isSoftHand(hand)).toBe(false);
  });

  it("A+9+5 is hard (ace forced to 1)", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const hand = [
      new Card("hearts", "Ace"),
      new Card("spades", "9"),
      new Card("clubs", "5"),
    ];
    expect(game.isSoftHand(hand)).toBe(false);
  });
});

describe("BlackjackGame.updateRunningCount (Hi-Lo)", () => {
  it("increments for low cards (2–6)", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    game.updateRunningCount(new Card("hearts", "5"));
    expect(game.runningCount).toBe(1);
  });

  it("decrements for high cards (10, J, Q, K, A)", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    game.updateRunningCount(new Card("hearts", "Ace"));
    expect(game.runningCount).toBe(-1);
  });

  it("neutral for mid cards (7–9)", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    game.updateRunningCount(new Card("hearts", "7"));
    expect(game.runningCount).toBe(0);
  });

  it("accumulates across multiple cards", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    game.updateRunningCount(new Card("hearts", "2"));
    game.updateRunningCount(new Card("hearts", "3"));
    game.updateRunningCount(new Card("spades", "King"));
    expect(game.runningCount).toBe(1);
  });
});

describe("BlackjackGame.startGame", () => {
  it("returns a GameResult with correct shape", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const result = game.startGame(100);
    expect(result.totalWagered).toBeGreaterThanOrEqual(100);
    expect(typeof result.totalProfit).toBe("number");
    expect(result.hands.length).toBeGreaterThanOrEqual(1);
    expect(typeof result.runningCount).toBe("number");
  });

  it("totalWagered equals sum of hand bets", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const result = game.startGame(50);
    const sumBets = result.hands.reduce((s, h) => s + h.bet, 0);
    expect(result.totalWagered).toBe(sumBets);
  });

  it("totalProfit equals sum of hand profits plus insurance", () => {
    const game = new BlackjackGame(makeDeck(), 0);
    const result = game.startGame(50);
    const sumProfit =
      result.hands.reduce((s, h) => s + h.profit, 0) + result.insuranceProfit;
    expect(result.totalProfit).toBe(sumProfit);
  });
});
