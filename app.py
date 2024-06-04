import random
import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from run_simulation import run_simulation
from constants import GAMES_PLAYED_PER_HOUR, BET_MULTIPLIER

def main():
    st.title("Blackjack Simulation Analysis")

    num_games = st.number_input("Number of Games to Simulate", min_value=1, max_value=1000000, value=5000)
    initial_bankroll = st.number_input("Initial Bankroll", min_value=1, max_value=1000000, value=10000)
    num_simulations = st.number_input("Number of Simulations", min_value=1, max_value=100000, value=5000)

    base_bet = initial_bankroll * BET_MULTIPLIER

    if st.button("Run Simulation"):
        aggregated_data = []
        total_bankruptcies = 0
        progress_placeholder = st.empty() 

        for i in range(num_simulations):
            data = run_simulation(num_games, base_bet, initial_bankroll)

            total_bankruptcies += data["Number of Bankruptcies"].iloc[-1]

            progress_placeholder.text(f"{((i / num_simulations) * 100):.1f}% Done")
            aggregated_data.append(data)

        # Loop guarantee
        progress_placeholder.text("{}% Done".format(100.0))
        # Combine and average the results
        combined_data = pd.concat(aggregated_data)
        data = combined_data.groupby(combined_data.index).mean()

        st.write("### Simulation results after averaging {} runs of {} games:".format(num_simulations, num_games))
        st.write(f"Player win rate: {data['Player Win Rate'].mean():.2f}%")
        st.write(f"Dealer win rate: {data['Dealer Win Rate'].mean():.2f}%")
        st.write(f"Tie rate: {data['Tie Rate'].mean():.2f}%")
        st.write(f"Number of Bankrolls depleted: {total_bankruptcies}")
        st.write(f"Expected value per game: {data['Expected Value Per Game'].mean():.4f}")
        st.write(f"House edge: {data['House Edge'].mean():.2f}%")
        st.write(f"Money earned per hour: {data['Expected Value Per Game'].mean() * GAMES_PLAYED_PER_HOUR:.3f}$")
        st.write(f"Total Profit Amount: {data['Total Profit Amount'].mean():.4f}")
        st.write(f"Total Bet Amount: {data['Total Bet Amount'].mean():.4f}")
        st.write(f"Final Bankroll: {data['Final Bankroll'].mean():.2f}")

        st.write("### Descriptive Statistics")
        st.write(data.describe())

        st.write("### Distribution of Total Net Profit and Current Game Net Profit")
        fig, ax = plt.subplots(1, 2, figsize=(12, 6))

        # Histogram for Total Net Profit
        ax[0].hist(data['Total Net Profit'], bins=20, color='blue', alpha=0.7)
        ax[0].set_xlabel('Total Net Profit')
        ax[0].set_ylabel('Frequency')
        ax[0].set_title('Distribution of Total Net Profit')

        # Histogram for Current Game Net Profit
        ax[1].hist(data['Current Game Net Profit'], bins=1000, color='green', alpha=0.7)
        ax[1].set_xlabel('Current Game Net Profit')
        ax[1].set_ylabel('Frequency')
        ax[1].set_title('Distribution of Current Game Net Profit')

        st.pyplot(fig)

        st.write("### Correlation Matrix")
        st.write(data.corr())

        st.write("### Cumulative Total Net Profit Trend")
        data['Cumulative Total Net Profit'] = data['Total Net Profit'].cumsum()
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.plot(data['Cumulative Total Net Profit'], label='Cumulative Total Net Profit', color='purple')
        ax.set_xlabel('Game Number')
        ax.set_ylabel('Cumulative Total Net Profit')
        ax.set_title('Cumulative Total Net Profit Trend')
        ax.legend()
        ax.grid(True)
        st.pyplot(fig)

        mean_net_profit_per_bet = combined_data.groupby('Bet Amount')['Current Game Net Profit'].mean().reset_index()
        frequency = combined_data['Bet Amount'].value_counts().reset_index()
        frequency.columns = ['Bet Amount', 'Frequency']
        mean_net_profit_per_bet = pd.merge(mean_net_profit_per_bet, frequency, on='Bet Amount')
        
        st.write("### Mean Current Game Net Profit per Bet Amount")
        fig, ax = plt.subplots(figsize=(12, 6))

        # Calculate bar width as a fraction of the x-axis range
        x_range = mean_net_profit_per_bet['Bet Amount'].max() - mean_net_profit_per_bet['Bet Amount'].min()
        bar_width = x_range / len(mean_net_profit_per_bet) * 0.4  # Adjust the 0.8 to control the bar width

        ax.bar(mean_net_profit_per_bet['Bet Amount'], mean_net_profit_per_bet['Current Game Net Profit'], width=bar_width, color='blue')
        ax.set_xticks(mean_net_profit_per_bet['Bet Amount'])
        ax.set_xticklabels(mean_net_profit_per_bet['Bet Amount'])
        plt.xticks(rotation=45)
        ax.set_xlabel('Bet Amount')
        ax.set_ylabel('Mean Current Game Net Profit')
        ax.set_title('Mean Current Game Net Profit per Bet Amount')
        ax.grid(True)
        st.pyplot(fig)
        st.write(mean_net_profit_per_bet)

        st.write("### Running Count vs. Current Game Net Profit")
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.scatter(combined_data['Running Count'], combined_data['Current Game Net Profit'], alpha=0.5, color='green')
        y_max = max(abs(combined_data['Current Game Net Profit'].min()), combined_data['Current Game Net Profit'].max()) * 1.2
        ax.set_ylim(-y_max, y_max)
        ax.set_xlabel('Running Count')
        ax.set_ylabel('Current Game Net Profit')
        ax.set_title('Running Count vs. Current Game Net Profit')
        ax.grid(True)
        st.pyplot(fig)

        st.write("### Running Count vs. Current Game Net Profit")
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.scatter(combined_data['Running Count'], combined_data['Current Game Net Profit'], s=10, alpha=0.3, color='green')
        y_max = max(abs(combined_data['Current Game Net Profit'].min()), combined_data['Current Game Net Profit'].max()) * 1.2
        ax.set_ylim(-y_max, y_max)
        ax.set_xlabel('Running Count')
        ax.set_ylabel('Current Game Net Profit')
        ax.set_title('Running Count vs. Current Game Net Profit')
        ax.grid(True)
        st.pyplot(fig)

        '''
        st.write("### Running Count vs. Current Game Net Profit (Density Plot)")
        fig, ax = plt.subplots(figsize=(12, 6))
        sns.kdeplot(x=combined_data['Running Count'], y=combined_data['Current Game Net Profit'], cmap="Greens", fill=True, ax=ax)
        ax.set_xlabel('Running Count')
        ax.set_ylabel('Current Game Net Profit')
        ax.set_title('Running Count vs. Current Game Net Profit (Density Plot)')
        ax.grid(True)
        st.pyplot(fig)
        '''

        st.write("### Current Bankroll per Game")
        fig, ax = plt.subplots(figsize=(12, 6))
        ax.plot(data.index, data['Current Bankroll'], label='Current Bankroll', color='red')
        ax.set_xlabel('Game Number')
        ax.set_ylabel('Current Bankroll')
        ax.set_title('Current Bankroll per Game')
        ax.legend()
        ax.grid(True)
        st.pyplot(fig)

if __name__ == "__main__":
    main()
