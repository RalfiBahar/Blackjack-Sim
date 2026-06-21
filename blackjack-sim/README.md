# blackjack-sim — Next.js App

Production web application for the [Blackjack-Sim](../) project.

## Prerequisites

- Node.js 18+
- npm

## Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/simulator` | Simulation form + results dashboard |
| `POST /api/runSimulation` | Runs Monte Carlo; streams JSON chunks |
| `GET /api/refreshCache` | Clears S3 cache (requires AWS credentials) |

## Key source files

| File | Purpose |
|------|---------|
| `src/run_simulation.ts` | Monte Carlo loop, betting spread, P&L series |
| `src/components/BlackjackGame.ts` | Single-hand game logic |
| `src/strategies.ts` | Basic strategy lookup tables |
| `src/components/Deck.ts` | Multi-deck shoe |
| `src/app/services/simulationProcessor.ts` | Aggregates N simulation runs |
| `src/components/BlackjackSimulation.tsx` | Results charts |

## Configuration

Constants in `src/constants.ts`:

- `BET_MULTIPLIER = 0.001` → base bet = 0.1% of initial bankroll
- `GAMES_PLAYED_PER_HOUR = 200`
- `InitialBettingValues` — default Hi-Lo spread multipliers

Simulation limit: `numGames × numSimulations ≤ 3,000,000` (enforced in form).

## Environment variables

Optional (S3 cache — route logic currently commented out):

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

## Architecture

See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) and [../docs/KNOWN-ISSUES.md](../docs/KNOWN-ISSUES.md).

## Deployment

Configured for [Vercel](https://vercel.com) (`vercel.json`). Analytics and Speed Insights are enabled in `layout.tsx`.
