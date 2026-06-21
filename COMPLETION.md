# COMPLETION.md — Agent loop stop condition

**Read this file before any other task work.**

The web app builds and runs. What remains is **correctness, tests, docs sync, and resume-grade polish**.

---

## STOP rule (mandatory)

At the **start** of every agent session:

```sh
bash scripts/check-completion.sh
```

| Exit code | Action |
|---|---|
| **0** | Reply exactly: **`BLACKJACK COMPLETE — stopping.`** Do not edit code or open new tasks. |
| **1** | Work the **first unchecked item** in [Remaining goals](#remaining-goals) below. Re-run the checker before ending the session. |

When all goals pass, the checker sets `STATUS: COMPLETE` in this file and exits 0.

---

## Current status

```
STATUS: COMPLETE
COMPLETED_AT: 2026-06-21T01:30:27Z
VERIFIED_BY: scripts/check-completion.sh
```

---

## Remaining goals

Work top-to-bottom. Check off each item when done.

### A. Docs & build (no AWS required)

- [x] **A1** Root `README.md` accurately describes stack (Next.js API routes, not Express).
- [x] **A2** `blackjack-sim/README.md` replaces create-next-app boilerplate with setup, env, and architecture links.
- [x] **A3** `docs/ARCHITECTURE.md` and `docs/KNOWN-ISSUES.md` exist and are linked from README.
- [x] **A4** `npm run build` and `npm run lint` pass in `blackjack-sim/`.

### B. Simulation correctness

- [x] **B1** Rules modal matches engine: S17 + peek, double, split, insurance offered (decline by default).
- [x] **B2** Split/double hands charge correct bet multiples via `GameResult.totalWagered`.
- [x] **B3** `generateCacheKey` includes `numberOfDecks` when S3 cache is re-enabled.
- [x] **B4** Deck shuffle uses Fisher–Yates (not `sort(() => Math.random() - 0.5)`).
- [x] **B5** User-configurable shoe penetration (default 75%).

### C. Tests & CI

- [x] **C1** Vitest (or Jest) configured for `blackjack-sim/`.
- [x] **C2** ≥10 unit tests: `Deck`, `BlackjackGame`, `runSimulation` edge cases.
- [x] **C3** GitHub Actions workflow: install, lint, build, test on push/PR.

### D. Resume polish (blocks COMPLETE)

See [`docs/resume-packaging.md`](docs/resume-packaging.md).

- [x] **D1** Monte Carlo confidence interval shown in UI (mean ± margin of error on EV).
- [x] **D2** Export results as CSV or JSON download.
- [x] **D3** `docs/resume-packaging.md` bullets 1–3 filled (no `TBD`).
- [x] **D4** README `## Demo` section: local URL, live URL, screenshot path.
- [x] **D5** Migrate AWS SDK v2 → `@aws-sdk/client-s3` or gate cache behind env flag (no build-time credential errors).

### E. Optional (does not block COMPLETE)

- [x] **E1** Web Worker pool for parallel Monte Carlo runs (browser; toggle in Advanced Settings).
- [x] **E2** True count (running count / decks remaining) betting mode.
- [x] **E3** Strategy A/B comparison view (two spreads side-by-side stats).
- [x] **E4** `blackjack-sim-python/` archived with `ARCHIVED.md` + README note.

---

## How verification works

`scripts/check-completion.sh` tests sections **A–D** automatically.

Run manually:

```sh
bash scripts/check-completion.sh          # full check
bash scripts/check-completion.sh --code   # A + C build/lint only
```

---

## Session handoff template

When ending an incomplete session, append under **Last session**:

```
Last session: YYYY-MM-DD — completed B1 (rules sync); C1 still open.
```

---

Last session: 2026-06-21 — Initial agent scaffolding, comprehensive docs, issue audit, COMPLETION gates defined.
