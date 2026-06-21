# Changelog

## [Unreleased]

### Added
- Live simulation progress bar (NDJSON streaming + percent label)
- Browser Web Worker pool for parallel Monte Carlo (Advanced Settings toggle, default on)
- True count betting mode (running count ÷ decks remaining)
- A/B spread comparison with side-by-side stats panels
- Monte Carlo 95% confidence interval on expected value per game
- CSV export alongside JSON on results page
- `blackjack-sim-python/ARCHIVED.md`
- Vitest 1.6 test suite: 30 unit tests across `Deck`, `BlackjackGame`, `runSimulation` — all passing
- GitHub Actions CI workflow (`.github/workflows/ci.yml`): install → lint → build → test
- JSON export button on simulation results page (`BlackjackSimulation.tsx`)
- `vitest.config.ts` with `@` path alias for engine tests
- Agent-loop scaffolding: `AGENTS.md`, `COMPLETION.md`, `TASKS.md`, `ROADMAP.md`
- `docs/ARCHITECTURE.md`, `docs/KNOWN-ISSUES.md`, `docs/resume-packaging.md`
- `scripts/check-completion.sh` verification gates
- Agent platform project at `/srv/projects/blackjack-sim`

### Fixed
- True count decks-remaining uses `cardsRemaining / 52` (was incorrectly divided by shoe size)
- API pipes NDJSON stream directly to client (no full-buffer delay; progress updates live)
- Removed stray debug text from enlarged chart portal
- `generateCacheKey` now includes `numberOfDecks` in the cache key string (B3)
- Removed `aws-sdk` v2 package; S3 cache functions are env-gated stubs ready for SDK v3 migration (D5)

### Documented
- Full codebase audit (rules vs engine, shuffle bias, missing tests, README drift)
- Resume improvement roadmap in COMPLETION section D
- Filled resume-packaging.md bullets 1–3 with concrete project metrics

## [0.1.0] — prior history

- Next.js web app with Monte Carlo blackjack simulation
- Hi-Lo counting and customizable betting spreads
- Chart.js analytics dashboard
- Streamlit Python prototype
- Deployed to blackjack-sim.com via Vercel
