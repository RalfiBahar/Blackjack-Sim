import Deck from "./Deck";
import Card from "./Card";
import {
  hardHandStrategy,
  softHandStrategy,
  pairStrategy,
} from "../strategies";
import { GameResult, HandOutcome } from "../gameResult";

const MAX_HANDS = 3;
const PEEK_UPCARD_VALUES = [10, 11];

interface PlayerHand {
  cards: Card[];
  bet: number;
  doubled: boolean;
  stood: boolean;
  fromSplit: boolean;
  splitAces: boolean;
}

class BlackjackGame {
  deck: Deck;
  playerHands: PlayerHand[];
  dealerHand: Card[];
  runningCount: number;

  constructor(deck: Deck, runningCount: number) {
    this.deck = deck;
    this.playerHands = [];
    this.dealerHand = [];
    this.runningCount = runningCount;
  }

  startGame(baseBet: number): GameResult {
    this.dealerHand = [];
    this.playerHands = [
      {
        cards: [this.dealCard(), this.dealCard()],
        bet: baseBet,
        doubled: false,
        stood: false,
        fromSplit: false,
        splitAces: false,
      },
    ];
    this.dealerHand.push(this.dealCard(), this.dealCard());

    const insuranceProfit = 0;
    const upcard = this.dealerHand[0].value();
    const playerNatural =
      this.calculateScore(this.playerHands[0].cards) === 21;
    const dealerNatural = this.calculateScore(this.dealerHand) === 21;

    if (PEEK_UPCARD_VALUES.includes(upcard) && dealerNatural) {
      if (playerNatural) {
        return this.makeResult(
          [{ bet: baseBet, profit: 0, result: "push" }],
          insuranceProfit,
          { playerBlackjack: true }
        );
      }
      return this.makeResult(
        [{ bet: baseBet, profit: -baseBet, result: "loss" }],
        insuranceProfit,
        { dealerWin: true }
      );
    }

    if (playerNatural) {
      return this.makeResult(
        [{ bet: baseBet, profit: baseBet * 1.5, result: "blackjack" }],
        insuranceProfit,
        { playerBlackjack: true, winCount: 1 }
      );
    }

    let handIndex = 0;
    while (handIndex < this.playerHands.length) {
      this.playHand(this.playerHands[handIndex]);
      handIndex++;
    }

    if (
      this.playerHands.every((h) => this.calculateScore(h.cards) > 21)
    ) {
      const outcomes = this.playerHands.map((h) => ({
        bet: h.bet,
        profit: -h.bet,
        result: "bust" as const,
      }));
      return this.makeResult(outcomes, insuranceProfit, {
        playerBust: true,
        dealerWin: true,
      });
    }

    this.dealerTurn();
    return this.resolveHands(insuranceProfit);
  }

  dealCard(): Card {
    const card = this.deck.dealCard();
    if (!card) {
      throw new Error("The deck is empty. Cannot deal a card.");
    }
    this.updateRunningCount(card);
    return card;
  }

  updateRunningCount(card: Card): void {
    if ([2, 3, 4, 5, 6].includes(card.value())) {
      this.runningCount += 1;
    } else if (["10", "Jack", "Queen", "King", "Ace"].includes(card.number)) {
      this.runningCount -= 1;
    }
  }

  playHand(hand: PlayerHand): void {
    if (hand.splitAces) {
      hand.cards.push(this.dealCard());
      hand.stood = true;
      return;
    }

    while (!hand.stood) {
      const score = this.calculateScore(hand.cards);
      if (score >= 21) {
        hand.stood = true;
        break;
      }

      const action = this.resolveAction(hand);

      if (action === "hit") {
        hand.cards.push(this.dealCard());
      } else if (action === "stand") {
        hand.stood = true;
      } else if (action === "double") {
        hand.bet *= 2;
        hand.doubled = true;
        hand.cards.push(this.dealCard());
        hand.stood = true;
      } else if (action === "split") {
        this.splitHand(hand);
        hand.stood = true;
      } else {
        hand.stood = true;
      }
    }
  }

  splitHand(hand: PlayerHand): void {
    if (this.playerHands.length >= MAX_HANDS) return;

    const pairCard = hand.cards.pop();
    if (!pairCard) return;

    const isAces = pairCard.number === "Ace";
    hand.fromSplit = true;
    hand.splitAces = isAces;
    hand.cards.push(this.dealCard());

    const newHand: PlayerHand = {
      cards: [pairCard, this.dealCard()],
      bet: hand.bet,
      doubled: false,
      stood: isAces,
      fromSplit: true,
      splitAces: isAces,
    };
    this.playerHands.push(newHand);
  }

  resolveAction(hand: PlayerHand): string {
    let action = this.lookupStrategy(hand);

    if (action === "double") {
      if (hand.cards.length === 2 && !hand.doubled && !hand.splitAces) {
        return "double";
      }
      const score = this.calculateScore(hand.cards);
      const dealerUp = this.dealerHand[0].value();
      if (this.isSoftHand(hand.cards)) {
        action = softHandStrategy[score]?.[dealerUp] ?? "hit";
      } else {
        action = hardHandStrategy[score]?.[dealerUp] ?? "hit";
      }
      if (action === "double") action = "hit";
    }

    return action ?? "stand";
  }

  lookupStrategy(hand: PlayerHand): string {
    const cards = hand.cards;
    const playerScore = this.calculateScore(cards);
    const dealerUpcardValue = this.dealerHand[0].value();

    if (
      cards.length === 2 &&
      cards[0].number === cards[1].number &&
      !hand.fromSplit &&
      this.playerHands.length < MAX_HANDS
    ) {
      return pairStrategy[playerScore]?.[dealerUpcardValue] ?? "hit";
    }

    if (this.isSoftHand(cards)) {
      return softHandStrategy[playerScore]?.[dealerUpcardValue] ?? "hit";
    }

    return hardHandStrategy[playerScore]?.[dealerUpcardValue] ?? "hit";
  }

  calculateScore(hand: Card[]): number {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
      score += card.value();
      if (card.number === "Ace") aces += 1;
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  }

  isSoftHand(hand: Card[]): boolean {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
      score += card.value();
      if (card.number === "Ace") aces += 1;
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return aces > 0 && score <= 21;
  }

  dealerTurn(): void {
    while (
      this.calculateScore(this.dealerHand) < 17 ||
      (this.calculateScore(this.dealerHand) === 17 &&
        this.isSoftHand(this.dealerHand))
    ) {
      this.dealerHand.push(this.dealCard());
    }
  }

  resolveHands(insuranceProfit: number): GameResult {
    const dealerScore = this.calculateScore(this.dealerHand);
    const dealerBust = dealerScore > 21;
    const outcomes: HandOutcome[] = [];

    for (const hand of this.playerHands) {
      const score = this.calculateScore(hand.cards);
      let result: HandOutcome["result"];
      let profit = 0;

      if (score > 21) {
        result = "bust";
        profit = -hand.bet;
      } else if (dealerBust || score > dealerScore) {
        result = "win";
        profit = hand.bet;
      } else if (score === dealerScore) {
        result = "push";
        profit = 0;
      } else {
        result = "loss";
        profit = -hand.bet;
      }

      outcomes.push({ bet: hand.bet, profit, result });
    }

    const winCount = outcomes.filter(
      (h) => h.result === "win" || h.result === "blackjack"
    ).length;
    const tieCount = outcomes.filter((h) => h.result === "push").length;
    const playerBust = outcomes.every((h) => h.result === "bust");
    const dealerWin =
      winCount === 0 &&
      tieCount < outcomes.length &&
      outcomes.some((h) => h.result === "loss");

    return this.makeResult(outcomes, insuranceProfit, {
      winCount,
      tieCount,
      dealerWin,
      playerBust,
    });
  }

  private makeResult(
    outcomes: HandOutcome[],
    insuranceProfit: number,
    flags: Partial<
      Pick<
        GameResult,
        "winCount" | "tieCount" | "dealerWin" | "playerBust" | "playerBlackjack"
      >
    > = {}
  ): GameResult {
    return {
      hands: outcomes,
      insuranceProfit,
      totalWagered: outcomes.reduce((s, h) => s + h.bet, 0),
      totalProfit:
        outcomes.reduce((s, h) => s + h.profit, 0) + insuranceProfit,
      runningCount: this.runningCount,
      winCount: flags.winCount ?? 0,
      tieCount: flags.tieCount ?? 0,
      dealerWin: flags.dealerWin ?? false,
      playerBust: flags.playerBust ?? false,
      playerBlackjack: flags.playerBlackjack ?? false,
    };
  }
}

export default BlackjackGame;
