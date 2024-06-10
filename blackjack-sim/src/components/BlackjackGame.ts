import Deck from "./Deck";
import Card from "./Card";
import {
  hardHandStrategy,
  softHandStrategy,
  pairStrategy,
} from "../strategies";

class BlackjackGame {
  deck: Deck;
  playerHand: Card[];
  dealerHand: Card[];
  splitHands: Card[][];
  runningCount: number;

  constructor(deck: Deck, runningCount: number) {
    this.deck = deck;
    this.playerHand = [];
    this.dealerHand = [];
    this.splitHands = [];
    this.runningCount = runningCount; // unrelated to amount of decks
  }

  startGame(): string {
    this.playerHand = [this.dealCard(), this.dealCard()];
    this.dealerHand = [this.dealCard(), this.dealCard()];

    if (this.calculateScore(this.playerHand) === 21) {
      if (this.calculateScore(this.dealerHand) === 21) {
        return "tie";
      }
      return "player_blackjack";
    }

    this.playHand(this.playerHand);

    for (const hand of this.splitHands) {
      this.playHand(hand);
    }

    const allHands = [this.playerHand, ...this.splitHands];
    if (allHands.every((hand) => this.calculateScore(hand) > 21)) {
      return "player_bust";
    }

    this.dealerTurn();
    return this.determineWinner();
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

  playHand(hand: Card[]): void {
    while (this.calculateScore(hand) < 21) {
      const action = this.basicStrategy(hand);
      if (action === "hit") {
        hand.push(this.dealCard());
      } else if (action === "stand") {
        break;
      } else if (action === "split") {
        this.splitHand(hand);
        break;
      }
    }
  }

  splitHand(hand: Card[]): void {
    const splitCard = hand.pop();
    if (splitCard) {
      this.splitHands.push([splitCard, this.dealCard()]);
      hand.push(this.dealCard());
    }
  }

  calculateScore(hand: Card[]): number {
    let score = 0;
    let aces = 0;
    for (const card of hand) {
      score += card.value();
      if (card.number === "Ace") {
        aces += 1;
      }
    }
    while (score > 21 && aces > 0) {
      score -= 10;
      aces -= 1;
    }
    return score;
  }

  basicStrategy(hand: Card[]): string {
    const playerScore = this.calculateScore(hand);
    const dealerUpcardValue = this.dealerHand[0].value();

    if (hand.length === 2 && hand[0].number === hand[1].number) {
      return this.pairStrategy(playerScore, dealerUpcardValue);
    }

    if (this.isSoftHand(hand)) {
      return this.softHandStrategy(playerScore, dealerUpcardValue);
    }

    return this.hardHandStrategy(playerScore, dealerUpcardValue);
  }

  pairStrategy(playerScore: number, dealerUpcardValue: number): string {
    return pairStrategy[playerScore]?.[dealerUpcardValue];
  }

  softHandStrategy(playerScore: number, dealerUpcardValue: number): string {
    return softHandStrategy[playerScore]?.[dealerUpcardValue];
  }

  hardHandStrategy(playerScore: number, dealerUpcardValue: number): string {
    return hardHandStrategy[playerScore]?.[dealerUpcardValue];
  }

  isSoftHand(hand: Card[]): boolean {
    const score = hand.reduce((sum, card) => sum + card.value(), 0);
    const aces = hand.filter((card) => card.number === "Ace").length;
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

  determineWinner(): string {
    const playerScores = [
      this.calculateScore(this.playerHand),
      ...this.splitHands.map((hand) => this.calculateScore(hand)),
    ];
    const dealerScore = this.calculateScore(this.dealerHand);

    let playerWins = 0;
    let ties = 0;

    for (const score of playerScores) {
      if (score > 21) continue;
      if (dealerScore > 21 || score > dealerScore) {
        playerWins += 1;
      } else if (score === dealerScore) {
        ties += 1;
      }
    }

    if (playerWins > 0 && ties > 0) {
      return `${playerWins}player_win_${ties}tie`;
    }
    if (playerWins > 0) {
      return `${playerWins}player_win`;
    }
    if (ties === playerScores.length) {
      return "tie";
    }
    return "dealer_win";
  }
}

export default BlackjackGame;
