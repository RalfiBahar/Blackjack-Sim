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
            score += card.value()
            if card.number == "Ace":
                aces += 1
        while score > 21 and aces:
            score -= 10
            aces -= 1
        return score
    
    def basic_strategy(self, hand):
        player_score = self.calculate_score(hand)
        dealer_upcard_value = self.dealer_hand[0].value()

        if len(hand) == 2 and hand[0].number == hand[1].number:
            return self.pair_strategy(player_score, dealer_upcard_value)

        if self.is_soft_hand(hand):
            return self.soft_hand_strategy(player_score, dealer_upcard_value)

        return self.hard_hand_strategy(player_score, dealer_upcard_value)
        
    def pair_strategy(self, player_score, dealer_upcard_value):
        return pair_strategy.get(player_score, {}).get(dealer_upcard_value)

    def soft_hand_strategy(self, player_score, dealer_upcard_value):
        return soft_hand_strategy.get(player_score, {}).get(dealer_upcard_value)

    def hard_hand_strategy(self, player_score, dealer_upcard_value):
        return hard_hand_strategy.get(player_score, {}).get(dealer_upcard_value)

    def is_soft_hand(self, hand):
        score = sum(card.value() for card in hand)
        aces = sum(1 for card in hand if card.number == "Ace")
        while score > 21 and aces > 0:
            score -= 10
            aces -= 1
        return any(card.number == "Ace" for card in hand) and score <= 21

    def show_hand(self, hand):
        return [(card.number, card.suit) for card in hand]
    
    def dealer_turn(self):
        pass

    def determine_winner(self):
        pass