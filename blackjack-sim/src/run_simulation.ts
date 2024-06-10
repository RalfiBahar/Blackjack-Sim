// src/run_simulation.ts

import Deck from "./components/Deck";
import BlackjackGame from "./components/BlackjackGame";

interface SimulationData {
  [key: string]: number[];
}

interface Results {
  [key: string]: number;
}

interface SimulationResult {
  data: SimulationData;
  summary: {
    playerWinRate: number;
    dealerWinRate: number;
    tieRate: number;
    expectedValuePerGame: number;
    houseEdge: number;
    netProfit: number;
    totalBets: number;
    finalBankroll: number;
    numBankruptcies: number;
  };
}

interface BettingSpread {
  [key: string]: number;
}

function runSimulation(
  numGames: number,
  baseBet: number,
  initialBankroll: number,
  bettingSpread: BettingSpread
): SimulationResult {
  const results: Results = {
    player_blackjack: 0,
    player_bust: 0,
    dealer_win: 0,
    tie: 0,
  };
  const totalWins: Results = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };
  let totalTies = 0;
  let totalWinnings = 0;
  let totalLosses = 0;
  let totalBets = 0;
  let numBankruptcies = 0;
  let netProfit = 0;

  let bankroll = initialBankroll;
  let runningCount = 0;
  const betSizes: number[] = [];
  const prof: number[] = [];
  const runningCounts: number[] = [];
  const betsVsRunningCount: [number, number][] = [];
  const bankrollOverTime: number[] = [];

  let deck = new Deck();

  const data: SimulationData = {
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
    "Final Bankroll": [],
    "Number of Bankruptcies": [],
  };

  for (let i = 0; i < numGames; i++) {
    if (deck.deck.length <= 15) {
      deck = new Deck();
      runningCount = 0;
    }

    const game = new BlackjackGame(deck, runningCount);

    let betAmount = baseBet;
    if (bettingSpread) {
      for (const count in bettingSpread) {
        let betMultiplier = 1;
        if (runningCount < 0 && count === "-1") {
          betMultiplier = bettingSpread["-1"];
        } else if (count.includes("-")) {
          const [min, max] = count.split("-").map(Number);
          if (runningCount >= min && runningCount <= max) {
            betMultiplier = bettingSpread[count];
          }
        } else {
          const singleValue = Number(count);
          if (runningCount === singleValue) {
            betMultiplier = bettingSpread[count];
          }
        }
        if (betMultiplier !== 1) {
          betAmount = baseBet * betMultiplier;
          break;
        }
      }
    } else {
      if (runningCount <= -1) {
        betAmount = baseBet;
      } else if (runningCount == 0 || runningCount == 1) {
        betAmount = baseBet;
      } else if (runningCount == 2) {
        betAmount = baseBet * 4;
      } else if (runningCount == 3) {
        betAmount = baseBet * 6;
      } else if (runningCount == 4) {
        betAmount = baseBet * 8;
      } else if (runningCount == 5) {
        betAmount = baseBet * 12;
      } else if (runningCount >= 6 && runningCount <= 9) {
        betAmount = baseBet * 16;
      } else if (runningCount >= 10) {
        betAmount = baseBet * 32;
      } else {
        betAmount = baseBet;
      }
    }
    if (bankroll < betAmount) {
      numBankruptcies += 1;
      break;
    }

    betSizes.push(betAmount);
    betsVsRunningCount.push([runningCount, betAmount]);

    const result = game.startGame();
    totalBets += betAmount;
    let currGameNetProfit = 0;

    if (result === "player_blackjack") {
      results.player_blackjack += 1;
      totalWinnings += betAmount * 1.5;
      currGameNetProfit += betAmount * 1.5;
    } else if (result.includes("player_win")) {
      const parts = result.split("player_win");
      const numWins = parseInt(parts[0]);
      if (parts.length > 1 && parts[1].startsWith("_")) {
        const numTies = parseInt(parts[1].split("_")[1].split("tie")[0]);
        totalTies += numTies;
      }
      totalWinnings += betAmount * numWins;
      currGameNetProfit += betAmount * numWins;
      totalWins[numWins] += 1;
    } else if (result === "dealer_win") {
      results.dealer_win += 1;
      totalLosses += betAmount;
      currGameNetProfit -= betAmount;
    } else if (result === "player_bust") {
      results.player_bust += 1;
      totalLosses += betAmount;
      currGameNetProfit -= betAmount;
    } else if (result === "tie") {
      results.tie += 1;
    }

    bankroll += currGameNetProfit;
    bankrollOverTime.push(bankroll);

    netProfit = totalWinnings - totalLosses;
    data["Total Net Profit"].push(netProfit);
    data["Current Game Net Profit"].push(currGameNetProfit);
    data["Running Count"].push(game.runningCount);
    data["Bet Amount"].push(betAmount);
    data["Current Bankroll"].push(bankroll);

    runningCount = game.runningCount;
    runningCounts.push(runningCount);
  }

  const playerWinRate =
    (Object.values(totalWins).reduce((a, b) => a + b, 0) +
      results.player_blackjack +
      results.tie / 2) /
    numGames;
  const dealerWinRate = results.dealer_win / numGames;
  const tieRate = (results.tie + totalTies) / numGames;
  const expectedValuePerGame = netProfit / numGames;
  const expectedValuePerBet = totalBets === 0 ? 0 : netProfit / totalBets;
  const houseEdge = -expectedValuePerBet * 100;

  data["Player Win Rate"].push(playerWinRate * 100);
  data["Dealer Win Rate"].push(dealerWinRate * 100);
  data["Tie Rate"].push(tieRate * 100);
  data["Expected Value Per Game"].push(expectedValuePerGame);
  data["House Edge"].push(houseEdge);
  data["Total Profit Amount"].push(netProfit);
  data["Total Bet Amount"].push(totalBets);
  data["Final Bankroll"].push(bankroll);
  data["Number of Bankruptcies"].push(numBankruptcies);

  const maxLength = Math.max(...Object.values(data).map((arr) => arr.length));
  for (const key in data) {
    while (data[key].length < maxLength) {
      data[key].push(data[key][data[key].length - 1]);
    }
  }

  return {
    data,
    summary: {
      playerWinRate,
      dealerWinRate,
      tieRate,
      expectedValuePerGame,
      houseEdge,
      netProfit,
      totalBets,
      finalBankroll: bankroll,
      numBankruptcies,
    },
  };
}

export default runSimulation;
