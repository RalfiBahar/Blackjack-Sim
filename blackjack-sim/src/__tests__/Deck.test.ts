import { describe, it, expect } from "vitest";
import Deck from "../components/Deck";

describe("Deck", () => {
  it("creates 52 cards for 1 deck", () => {
    const deck = new Deck(1);
    expect(deck.cardsRemaining()).toBe(52);
  });

  it("creates 104 cards for 2 decks", () => {
    const deck = new Deck(2);
    expect(deck.cardsRemaining()).toBe(104);
  });

  it("creates 312 cards for 6 decks", () => {
    const deck = new Deck(6);
    expect(deck.cardsRemaining()).toBe(312);
  });

  it("dealCard returns a card and decrements remaining", () => {
    const deck = new Deck(1);
    const card = deck.dealCard();
    expect(card).toBeDefined();
    expect(card!.suit).toBeDefined();
    expect(card!.number).toBeDefined();
    expect(deck.cardsRemaining()).toBe(51);
  });

  it("cardsRemaining decrements on each deal", () => {
    const deck = new Deck(1);
    deck.dealCard();
    deck.dealCard();
    expect(deck.cardsRemaining()).toBe(50);
  });

  it("returns undefined when deck is exhausted", () => {
    const deck = new Deck(1);
    for (let i = 0; i < 52; i++) deck.dealCard();
    expect(deck.dealCard()).toBeUndefined();
  });

  it("initialSize is set at construction time", () => {
    const deck = new Deck(2);
    expect(deck.initialSize).toBe(104);
    deck.dealCard();
    expect(deck.initialSize).toBe(104);
  });
});
