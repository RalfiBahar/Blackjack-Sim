import Card from "./Card";

class Deck {
  suits: string[];
  numbers: (number | string)[];
  deck: Card[];
  readonly initialSize: number;

  constructor(numDecks: number = 1) {
    this.suits = ["hearts", "clubs", "spades", "diamonds"];
    this.numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Ace", "Jack", "King", "Queen"];
    this.deck = [];
    this.createDeck(numDecks);
    this.initialSize = this.deck.length;
    this.shuffleDeck();
  }

  createDeck(numDecks: number): void {
    for (let i = 0; i < numDecks; i++) {
      for (const suit of this.suits) {
        for (const number of this.numbers) {
          this.deck.push(new Card(suit, number.toString()));
        }
      }
    }
  }

  /** Fisher–Yates shuffle (uniform permutation). */
  shuffleDeck(): void {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCard(): Card | undefined {
    return this.deck.pop();
  }

  cardsRemaining(): number {
    return this.deck.length;
  }

  displayDeck(): void {
    this.deck.forEach((card) => {
      console.log(card.toString());
    });
  }
}

export default Deck;
