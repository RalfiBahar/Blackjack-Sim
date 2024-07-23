import Card from "./Card";

class Deck {
  suits: string[];
  numbers: (number | string)[];
  deck: Card[];

  constructor(numDecks: number = 1) {
    this.suits = ["hearts", "clubs", "spades", "diamonds"];
    this.numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Ace", "Jack", "King", "Queen"];
    this.deck = [];
    this.createDeck(numDecks);
    this.shuffleDeck();
  }

  createDeck(numDecks: number): void {
    for (let i = 0; i < numDecks; i++) {
      for (const suit of this.suits) {
        for (const number of this.numbers) {
          const currentCard = new Card(suit, number.toString());
          this.deck.push(currentCard);
        }
      }
    }
  }

  shuffleDeck(): void {
    this.deck = this.deck.sort(() => Math.random() - 0.5);
  }

  dealCard(): Card | undefined {
    return this.deck.pop();
  }

  displayDeck(): void {
    this.deck.forEach((card) => {
      console.log(card.toString());
    });
  }
}

export default Deck;
