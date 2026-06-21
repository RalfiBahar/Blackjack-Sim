// src/run_simulation.ts

import Deck from "./components/Deck";
import BlackjackGame from "./components/BlackjackGame";
import { DEFAULT_PENETRATION } from "./constants";

interface SimulationData {
  [key: string]: number[];
}

interface Results {
  [key: string]: number;
}

export interface SimulationSummary {
  playerWinRate: number;
  dealerWinRate: number;
  tieRate: number;
  expectedValuePerGame: number;
  houseEdge: number;
  netProfit: number;
  totalBets: number;
  finalBankroll: number;
  numBankruptcies: number;
}

export interface SimulationResult {
  data: SimulationData;
  summary: SimulationSummary;
}

export interface RunSimulationOptions {
  numGames: number;
  baseBet: number;
  initialBankroll: number;
  bettingSpread: Record<string, number>;
  numberOfDecks?: number;
  penetration?: number;
}

interface BettingSpread {
  [key: string]: number;
}

export function trueCountForBetting(
  runningCount: number,
  deck: Deck
): number {
  const decksRemaining = Math.max(0.25, deck.cardsRemaining() / 52);
  return Math.trunc(runningCount / decksRemaining);
}

/** @deprecated Use trueCountForBetting — bet sizing always uses true count. */
export function countForBetting(
  runningCount: number,
  deck: Deck,
  _numberOfDecks?: number,
  _bettingMode?: string
): number {
  return trueCountForBetting(runningCount, deck);
}

export function resolveBetAmount(
  baseBet: number,
  runningCount: number,
  bettingSpread: BettingSpread,
  deck: Deck,
  _numberOfDecks: number = 1
): number {
  const count = trueCountForBetting(runningCount, deck);

  for (const key in bettingSpread) {
    let betMultiplier = 1;
    if (count < 0 && key === "-1") {
      betMultiplier = bettingSpread["-1"];
    } else if (key.includes("-")) {
      const [min, max] = key.split("-").map(Number);
      if (count >= min && count <= max) {
        betMultiplier = bettingSpread[key];
      }
    } else {
      const singleValue = Number(key);
      if (count === singleValue) {
        betMultiplier = bettingSpread[key];
      }
    }
    if (betMultiplier !== 1) {
      return baseBet * betMultiplier;
    }
  }
  return baseBet;
}

function runSimulation(
  numGamesOrOptions: number | RunSimulationOptions,
  baseBet?: number,
  initialBankroll?: number,
  bettingSpread: BettingSpread = {},
  numberOfDecks: number = 1,
  penetration: number = DEFAULT_PENETRATION
): SimulationResult {
  let opts: RunSimulationOptions;
  if (typeof numGamesOrOptions === "object") {
    opts = numGamesOrOptions;
  } else {
    opts = {
      numGames: numGamesOrOptions,
      baseBet: baseBet!,
      initialBankroll: initialBankroll!,
      bettingSpread,
      numberOfDecks,
      penetration,
    };
  }

  const {
    numGames,
    baseBet: bet,
    initialBankroll: bankrollStart,
    bettingSpread: spread,
  } = opts;
  numberOfDecks = opts.numberOfDecks ?? 1;
  penetration = opts.penetration ?? DEFAULT_PENETRATION;

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

  let bankroll = bankrollStart;
  let runningCount = 0;

  let deck = new Deck(numberOfDecks);
  const clampedPenetration = Math.min(0.95, Math.max(0.5, penetration));
  const reshuffleThreshold = Math.floor(
    deck.initialSize * (1 - clampedPenetration)
  );

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

  let gamesPlayed = 0;

  for (let i = 0; i < numGames; i++) {
    if (deck.cardsRemaining() <= reshuffleThreshold) {
      deck = new Deck(numberOfDecks);
      runningCount = 0;
    }

    const betAmount = spread
      ? resolveBetAmount(bet, runningCount, spread, deck, numberOfDecks)
      : bet;

    if (bankroll < betAmount) {
      numBankruptcies += 1;
      break;
    }

    const game = new BlackjackGame(deck, runningCount);
    const gameResult = game.startGame(betAmount);

    totalBets += gameResult.totalWagered;
    const currGameNetProfit = gameResult.totalProfit;
    totalWinnings += Math.max(0, currGameNetProfit);
    totalLosses += Math.max(0, -currGameNetProfit);

    if (gameResult.playerBlackjack) results.player_blackjack += 1;
    if (gameResult.playerBust) results.player_bust += 1;
    if (gameResult.dealerWin && gameResult.winCount === 0) {
      results.dealer_win += 1;
    }
    if (
      gameResult.tieCount === gameResult.hands.length &&
      gameResult.winCount === 0
    ) {
      results.tie += 1;
    }
    if (gameResult.winCount > 0) {
      totalWins[gameResult.winCount] =
        (totalWins[gameResult.winCount] ?? 0) + 1;
    }
    totalTies += gameResult.tieCount;

    bankroll += currGameNetProfit;
    gamesPlayed += 1;

    const netProfit = bankroll - bankrollStart;
    data["Total Net Profit"].push(netProfit);
    data["Current Game Net Profit"].push(currGameNetProfit);
    data["Running Count"].push(gameResult.runningCount);
    data["Bet Amount"].push(gameResult.totalWagered);
    data["Current Bankroll"].push(bankroll);

    runningCount = gameResult.runningCount;
  }

  const denom = gamesPlayed || 1;
  const playerWinRate =
    (Object.values(totalWins).reduce((a, b) => a + b, 0) +
      results.player_blackjack +
      results.tie / 2) /
    denom;
  const dealerWinRate = results.dealer_win / denom;
  const tieRate = (results.tie + totalTies) / denom;
  const netProfit = bankroll - bankrollStart;
  const expectedValuePerGame = netProfit / denom;
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
