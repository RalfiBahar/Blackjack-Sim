import matplotlib.pyplot as plt
from card import Card
from deck import Deck
from strategies import hard_hand_strategy, soft_hand_strategy, pair_strategy
import time
import random
import csv

class BlackjackGame:
    def __init__(self, deck, running_count):
        self.deck = deck
        self.player_hand = []
        self.dealer_hand = []
        self.split_hands = []
        self.running_count = running_count # unrelated to amount of decks

    def start_game(self):
        self.player_hand = [self.deal_card(), self.deal_card()]
        self.dealer_hand = [self.deal_card(), self.deal_card()]

        if self.calculate_score(self.player_hand) == 21:
            if self.calculate_score(self.dealer_hand) == 21:
                return "tie"
            return "player_blackjack"

        self.play_hand(self.player_hand)

        for hand in self.split_hands:
            self.play_hand(hand)

        if all(self.calculate_score(hand) > 21 for hand in [self.player_hand] + self.split_hands):
            return "player_bust"

        self.dealer_turn()
        return self.determine_winner()
    
    def deal_card(self):
        card = self.deck.deal_card()
        self.update_running_count(card)
        return card
    
    def update_running_count(self, card):
        if card.number in [2, 3, 4, 5, 6]:
            self.running_count += 1
        elif card.number in [10, "Jack", "Queen", "King", "Ace"]:
            self.running_count -= 1

    def calculate_score(self):
        pass

    def play_hand(self, hand):
        while self.calculate_score(hand) < 21:
            action = self.basic_strategy(hand)
            if action == "hit":
                hand.append(self.deal_card())
            elif action == "stand":
                break
            elif action == "split":
                self.split_hand(hand)
                break

    def split_hand(self, hand):
        split_card = hand.pop()
        self.split_hands.append([split_card, self.deal_card()])
        hand.append(self.deal_card())

    def calculate_score(self, hand):
        score = 0
        aces = 0
        for card in hand:
            score += 10  
            if card.number == "Ace":
                aces += 1
        while score > 21 and aces:
            score -= 1
            aces -= 1
        return score


    def dealer_turn(self):
        pass

    def determine_winner(self):
        pass