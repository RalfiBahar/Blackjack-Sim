from card import Card
import random

class Deck:
    def __init__(self):
        self.suits = ["hearts", "clubs", "spades", "diamonds"]
        self.numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Ace", "Jack", "King", "Queen"]
        self.deck = []
        self.create_deck()
        self.shuffle_deck()

    def create_deck(self):
        for suit in self.suits:
            for number in self.numbers:
                current_card = Card(suit, number)
                self.deck.append(current_card)

    def shuffle_deck(self):
        random.shuffle(self.deck)

    def deal_card(self):
        return self.deck.pop()

    def display_deck(self):
        for card in self.deck:
            card.display()

if __name__ == "__main__":
    deck_instance = Deck()
    deck_instance.display_deck()
