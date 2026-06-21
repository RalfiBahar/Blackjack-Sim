# Roadmap — Blackjack-Sim

## Vision

A production-quality Monte Carlo blackjack simulator that models Hi-Lo card counting, customizable betting spreads, and bankroll dynamics — with honest rule implementation, statistical rigor, and a polished Next.js dashboard suitable for a quant/SWE portfolio.

**Live:** [blackjack-sim.com](https://blackjack-sim.com)

---

## Milestones

### Phase 0 — Inventory & docs ✅ (current)

- [x] Clone and audit codebase
- [x] Agent-loop scaffolding (`AGENTS.md`, `COMPLETION.md`, `TASKS.md`)
- [x] Architecture and known-issues documentation
- [ ] Sync README with actual stack

### Phase 1 — Engine correctness

- [ ] Align documented rules with `BlackjackGame` behavior
- [ ] Fix split/double bet accounting
- [ ] Fisher–Yates shuffle; consistent penetration model
- [ ] Unit tests for game engine and EV math

### Phase 2 — UX & statistics

- [ ] Live progress during Monte Carlo aggregation
- [ ] Confidence intervals and required sample size (like Python prototype)
- [ ] Export/download results
- [ ] Fix typos (`chartDeafults`, `EditibleBettingSpreadTable`)

### Phase 3 — Performance & infra

- [ ] Parallel simulation (Web Workers or server-side batching)
- [ ] Optional S3 result cache (SDK v3, env-gated)
- [ ] GitHub Actions CI
- [ ] Dependency upgrades (Next.js 15, aws-sdk v3)

### Phase 4 — Resume / portfolio

- [ ] Demo section, screenshots, resume bullets
- [ ] Optional: strategy comparison, true count mode
- [ ] Post-mortem doc with performance numbers

---

## Out of scope (for now)

- Real-money gambling integration
- Live multiplayer / online casino APIs
- Mobile native apps
