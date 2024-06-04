from deck import Deck
from blackjack_game import BlackjackGame
import pandas as pd
import streamlit as st

# TASK: add more parameters the user can customize
def run_simulation(num_games, base_bet, initial_bankroll):
    results = {"player_blackjack": 0, "player_bust": 0, "dealer_win": 0, "tie": 0}
    total_wins = {i: 0 for i in range(1, 10)}
    total_ties = 0
    total_winnings = 0
    total_losses = 0
    total_bets = 0

    bankroll = initial_bankroll
    running_count = 0
    bet_sizes = []
    prof = []
    running_counts = []
    bets_vs_running_count = []
    bankroll_over_time = []  

    deck = Deck()

    data = {
        "Total Net Profit": [],
        "Current Game Net Profit": [],
        "Running Count": [],
        "Bet Amount": [],
        "Current Bankroll": [], 
        "Player Win Rate": [],  
        "Dealer Win Rate": [],  
        "Tie Rate": [],  
        "Expected Value Per Game": [],  
        "House Edge": [], 
        "Total Profit Amount": [],  
        "Total Bet Amount": [],  
        "Final Bankroll": []  
    }

    for _ in range(num_games):
        # TASK: Instead of 15 make random int between some to numbers
        if len(deck.deck) <= 15:  # Check if the deck needs to be reshuffled
            deck = Deck()
            running_count = 0

        game = BlackjackGame(deck, running_count)    

        # TASK: give ability to make user create/choose custom bet spread 
        if running_count <= -1:
            bet_amount = 0#base_bet
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
        elif running_count == 6 or running_count == 7 or running_count == 8 or running_count == 9:
            bet_amount = base_bet * 16
        elif running_count >= 10:
            bet_amount = base_bet * 32
        else:
            bet_amount = base_bet

        # Check if bankroll can cover the bet
        if bankroll < bet_amount:
            st.write("Bankroll depleted! Simulation stopped.")
            break

        bet_sizes.append(bet_amount)
        bets_vs_running_count.append((running_count, bet_amount))  # Track the bet amount and running count

        result = game.start_game()

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

        bankroll += curr_game_net_profit  # Update the bankroll
        bankroll_over_time.append(bankroll)  # Track bankroll over time

        net_profit = total_winnings - total_losses  # Calculate TOTAL net profit
        data["Total Net Profit"].append(net_profit)
        data["Current Game Net Profit"].append(curr_game_net_profit)
        data["Running Count"].append(game.running_count)
        data["Bet Amount"].append(bet_amount)
        data["Current Bankroll"].append(bankroll)  

        running_count = game.running_count
        running_counts.append(running_count)

    player_win_rate = (sum(total_wins.values()) + results["player_blackjack"] + results["tie"] / 2) / num_games
    dealer_win_rate = results["dealer_win"] / num_games
    tie_rate = (results["tie"] + total_ties) / num_games
    expected_value_per_game = net_profit / num_games
    expected_value_per_bet = net_profit / total_bets
    house_edge = -expected_value_per_bet * 100

    # Append summary statistics to the data dictionary
    data["Player Win Rate"].append(player_win_rate * 100)
    data["Dealer Win Rate"].append(dealer_win_rate * 100)
    data["Tie Rate"].append(tie_rate * 100)
    data["Expected Value Per Game"].append(expected_value_per_game)
    data["House Edge"].append(house_edge)
    data["Total Profit Amount"].append(net_profit)
    data["Total Bet Amount"].append(total_bets)
    data["Final Bankroll"].append(bankroll)

    # Ensure all arrays have the same length
    max_length = max(len(value) for value in data.values())
    for key, value in data.items():
        while len(value) < max_length:
            value.append(value[-1])

    return pd.DataFrame(data)