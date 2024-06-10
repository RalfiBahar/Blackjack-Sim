export default class Card {
  suit: string;
  number: string;

  constructor(suit: string, number: string) {
    this.suit = suit;
    this.number = number;
  }

  toString(): string {
    return `${this.number} of ${this.suit}`;
  }

  value(): number {
    if (["Jack", "Queen", "King"].includes(this.number)) {
      return 10;
    } else if (this.number === "Ace") {
      return 11; // or 1, this possibility will be calculated in the game class
    } else {
      return parseInt(this.number);
    }
  }
}
