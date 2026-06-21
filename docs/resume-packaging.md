# Resume Packaging — Blackjack-Sim

Use this doc to turn the project into strong portfolio bullets. Fill in metrics after running corrected simulations.

---

## One-liner

**Monte Carlo blackjack simulator** with Hi-Lo card counting, customizable betting spreads, and interactive Chart.js analytics — deployed at [blackjack-sim.com](https://blackjack-sim.com).

---

## Resume bullets (fill after Phase 4)

### Bullet 1 — Full-stack / product

> Built and deployed a Next.js 14 blackjack Monte Carlo simulator processing up to 3M hand-aggregates per request with streaming JSON API responses and 10+ interactive Chart.js analytics charts; deployed on Vercel at blackjack-sim.com.

### Bullet 2 — Quant / simulation

> Implemented a Hi-Lo card-counting engine with basic-strategy decision tables (hard/soft/pair), shoe penetration modelling, and bankroll Monte Carlo; surfaces EV, house edge, confidence intervals, and bankruptcy rate across configurable betting spreads.

### Bullet 3 — Engineering quality

> Added Vitest unit-test suite (Deck, BlackjackGame, runSimulation) and GitHub Actions CI; corrected statistical bugs including biased shuffle (replaced sort-random with Fisher–Yates) and split/double bet accounting; removed aws-sdk v2 with env-gated stub pattern ready for SDK v3 migration.

---

## Skills to highlight

| Skill | Evidence in repo |
|-------|------------------|
| TypeScript / React | Next.js App Router, Chakra UI |
| Probability & stats | Monte Carlo, EV, house edge, distributions |
| Data visualization | Chart.js dashboards, enlarging card UX |
| API design | Streaming JSON from `/api/runSimulation` |
| Cloud | Vercel deploy, optional S3 cache |
| Python (secondary) | Streamlit prototype, pandas/matplotlib |

---

## Interview talking points

1. **Why Monte Carlo?** — Analytic EV for counting systems is hard; simulation estimates edge under realistic bankroll variance and ruin probability.
2. **Hi-Lo true count** — Bet sizing normalizes running count by decks remaining (standard card-counting practice).
3. **Rule fidelity** — Be honest: basic strategy + splits implemented; double/insurance were aspirational in UI (fixed in Phase 2).
4. **Performance** — Single-threaded Node loop; parallelization via Web Workers is a natural scale-up story.
5. **Shuffle bias** — Great example of subtle bugs affecting statistical validity.

---

## Demo script (2 minutes)

1. Open [blackjack-sim.com](https://blackjack-sim.com) → **Go to Simulator**
2. Set 5,000 games × 500 simulations, default spread
3. Point out: win rate, house edge, cumulative profit chart, running count vs profit scatter
4. Open Advanced Settings → edit betting spread for high counts
5. Mention bankruptcy counter and bankroll time series

---

## Metrics to capture (after fixes)

| Metric | Target |
|--------|--------|
| Build time | ~30s |
| 300×1000 sim wall time | measure locally |
| Test count | ≥10 |
| Lighthouse performance | run on /simulator |

---

## GitHub / LinkedIn

- **Repo:** https://github.com/RalfiBahar/Blackjack-Sim
- **Live:** https://blackjack-sim.com
- **Screenshot:** add to `docs/images/simulator-results.png` after Phase 4-d
