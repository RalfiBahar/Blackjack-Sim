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
        while self.calculate_score(self.dealer_hand) < 17 or (self.calculate_score(self.dealer_hand) == 17 and self.is_soft_hand(self.dealer_hand)):
            self.dealer_hand.append(self.deal_card())

    def determine_winner(self):
        player_scores = [self.calculate_score(hand) for hand in [self.player_hand] + self.split_hands]
        dealer_score = self.calculate_score(self.dealer_hand)

        player_wins = 0
        ties = 0

        for score in player_scores:
            if score > 21:
                continue
            if dealer_score > 21 or score > dealer_score:
                player_wins += 1
            elif score == dealer_score:
                ties += 1

        # The result will be separated into parts after
        if player_wins > 0 and ties > 0:
            return f"{player_wins}player_win_{ties}tie"
        if player_wins > 0:
            return f"{player_wins}player_win"
        if ties == len(player_scores):
            return "tie"
        return "dealer_win"
    
if __name__ == "__main__":
    results = {"player_blackjack": 0, "player_bust": 0, "dealer_win": 0, "tie": 0}
    total_wins = {i: 0 for i in range(1, 10)}
    total_ties = 0
    num_simulations = 100000
    base_bet = 10
    total_winnings = 0
    total_losses = 0
    total_bets = 0

    running_count = 0
    bet_sizes = []
    prof = []
    running_counts = []
    bets_vs_running_count = []

    start_time = time.time()

    deck = Deck()

    file_path = "blackjack_simulation_output.csv"
    with open(file_path, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Total Net Profit", "Current Game Net Profit", "Running Count", "Bet Amount"])

        for _ in range(num_simulations):
            if len(deck.deck) <= 15:  # Check if the deck needs to be reshuffled
                deck = Deck()
                running_count = 0

            game = BlackjackGame(deck, running_count)

            if running_count <= -1:
                bet_amount = base_bet
            elif running_count == 0 or running_count == 1:
                bet_amount = base_bet
            elif running_count == 2:
                bet_amount = base_bet * 4
            elif running_count == 3:
                bet_amount = base_bet * 6
            elif running_count == 4:
                bet_amount = base_bet * 8
            elif running_count == 5:
                bet_amount = base_bet * 12
            elif running_count >= 6:
                bet_amount = base_bet * 16
            else:
                bet_amount = base_bet

            bet_sizes.append(bet_amount)
            bets_vs_running_count.append((running_count, bet_amount))  # Track the bet amount and running count

            result = game.start_game()
            #results[result.split("player_win")[0]] += 1

            #results[result] += 1

            total_bets += bet_amount
            curr_game_net_profit = 0

            if result == "player_blackjack":
                results["player_blackjack"] += 1
                total_winnings += bet_amount * 1.5
                curr_game_net_profit += bet_amount * 1.5
            elif "player_win" in result:
                parts = result.split("player_win")
                num_wins = int(parts[0])
                if len(parts) > 1 and parts[1].startswith("_"):
                    num_ties = int(parts[1].split("_")[1].split("tie")[0])
                    total_ties += num_ties
                total_winnings += bet_amount * num_wins
                curr_game_net_profit += bet_amount * num_wins
                total_wins[num_wins] += 1
            elif result == "dealer_win":
                results["dealer_win"] += 1
                total_losses += bet_amount
                curr_game_net_profit -= bet_amount
            elif result == "player_bust":
                results["player_bust"] += 1
                total_losses += bet_amount
                curr_game_net_profit -= bet_amount
            elif result == "tie":
                results["tie"] += 1

            net_profit = total_winnings - total_losses  # Calculate net profit
            print(f'Total Net Profit: {net_profit} - Current Game Net Profit: {curr_game_net_profit} - Count: {game.running_count} - Bet: {bet_amount}')
            writer.writerow([net_profit, curr_game_net_profit, game.running_count, bet_amount])

            prof.append(net_profit)

            running_count = game.running_count
            running_counts.append(running_count)


    print(running_count)
    end_time = time.time()
    elapsed_time = end_time - start_time

    player_win_rate = (sum(total_wins.values()) + results["player_blackjack"] + results["tie"] / 2) / num_simulations
    dealer_win_rate = results["dealer_win"] / num_simulations
    tie_rate = (results["tie"] + total_ties) / num_simulations
    #expected_value = net_profit / total_bets
    expected_value = net_profit / num_simulations
    expected_value_per_bet = net_profit / total_bets
    house_edge = -expected_value_per_bet * 100
    #house_edge = -expected_value * 100

    print(f"Simulation results after {num_simulations} games:")
    print(f"Player win rate: {player_win_rate * 100:.2f}%")
    print(f"Dealer win rate: {dealer_win_rate * 100:.2f}%")
    print(f"Tie rate: {tie_rate * 100:.2f}%")
    print(f"Expected value per game: {expected_value:.4f}")
    print(f"House edge: {house_edge:.2f}%")

    print(f"Total Profit Amount: {net_profit:.4f}")
    print(f"Total Bet Amount: {total_bets:.4f}")

    
    print(f"\nTime taken for simulation: {elapsed_time} seconds")


    # Plot the profit against the number of rounds played
    plt.figure(figsize=(10, 6))
    plt.plot(range(num_simulations), prof, linestyle='-', marker='o')
    plt.xlabel('Rounds Played')
    plt.ylabel('Profit')
    plt.title('Profit as a Function of Rounds Played')
    plt.grid(True)
    plt.show()

    # Plot the running count against the number of rounds played
    plt.figure(figsize=(10, 6))
    plt.plot(range(num_simulations), running_counts, linestyle='-', marker='o')
    plt.xlabel('Rounds Played')
    plt.ylabel('Running Count')
    plt.title('Running Count as a Function of Rounds Played')
    plt.grid(True)
    plt.show()

    # Plot the bet amount against the running count
    running_count_values, bet_amounts = zip(*bets_vs_running_count)
    plt.figure(figsize=(10, 6))
    plt.scatter(running_count_values, bet_amounts, alpha=0.5)
    plt.xlabel('Running Count')
    plt.ylabel('Bet Amount')
    plt.title('Bet Amount as a Function of Running Count')
    plt.grid(True)
    plt.show()