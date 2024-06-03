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