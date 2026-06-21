# Locked decisions (2026-06-21)

User-confirmed direction for the ~1 month sprint.

| Decision | Choice |
|----------|--------|
| Resume target | Hybrid **quant + full-stack** |
| First sprint | **Correctness** (B1/B2/B4) |
| Rule engine | **Full implementation** (double, insurance, peek) |
| Python legacy | **Archive** — port CI logic to TS only |
| AWS cache | **SDK v3 + env-gated** |
| Agent loop | **Run until COMPLETE** |
| Timeline | **~1 month** (Tier 1–2) |

## Recommended rule set (accepted)

| Area | Spec |
|------|------|
| Dealer | **S17 + peek** on Ace and 10-value (matches modal; standard for counting sims) |
| Player | **Modal-aligned:** double any two cards, split pairs (max **3 hands**, no re-split aces), **insurance offered** on dealer Ace (decline by default; optional count-based take later), **no surrender** |
| Penetration | **User-configurable %** (default **75%** of shoe dealt before reshuffle) |
| Shuffle | **Fisher–Yates** (replace biased `sort`) |

## Sprint order

1. Engine correctness (this sprint)
2. Vitest + CI
3. Confidence intervals + export
4. AWS SDK v3 migration
