export type HandResult = "win" | "loss" | "push" | "blackjack" | "bust";

export interface HandOutcome {
  bet: number;
  profit: number;
  result: HandResult;
}

export interface GameResult {
  hands: HandOutcome[];
  insuranceProfit: number;
  totalWagered: number;
  totalProfit: number;
  runningCount: number;
  /** Legacy-compatible flags for aggregate stats */
  winCount: number;
  tieCount: number;
  dealerWin: boolean;
  playerBust: boolean;
  playerBlackjack: boolean;
}

/** Map structured result to legacy string for any code still expecting it */
export function toLegacyResultString(result: GameResult): string {
  if (result.playerBlackjack && result.hands.length === 1) {
    if (result.hands[0].result === "push") return "tie";
    return "player_blackjack";
  }
  if (result.playerBust) return "player_bust";
  if (result.dealerWin && result.winCount === 0 && result.tieCount === 0) {
    return "dealer_win";
  }
  if (result.winCount === 0 && result.tieCount === result.hands.length) {
    return "tie";
  }
  if (result.winCount > 0 && result.tieCount > 0) {
    return `${result.winCount}player_win_${result.tieCount}tie`;
  }
  if (result.winCount > 0) return `${result.winCount}player_win`;
  return "dealer_win";
}
