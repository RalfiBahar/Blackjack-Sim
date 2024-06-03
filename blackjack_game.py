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
        self.running_count = running_count

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
        pass

    def calculate_score(self):
        pass

    def play_hand(self):
        pass

    def dealer_turn(self):
        pass

    def determine_winner(self):
        pass