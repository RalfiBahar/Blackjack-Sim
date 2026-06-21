# TASKS.md — Prioritized Backlog

Status: `[ ]` todo · `[~]` in progress · `[x]` done

---

## STOP — agent loop exit condition

**Before any task work:** run `bash scripts/check-completion.sh`.

- Exit **0** → reply **`BLACKJACK COMPLETE — stopping.`**
- Exit **1** → work first unchecked item in [`COMPLETION.md`](COMPLETION.md)

---

## Phase 1 — Documentation sync (READY)

- [ ] **1-a** Rewrite root `README.md` (stack, structure, agent loop, links)
- [ ] **1-b** Replace `blackjack-sim/README.md` boilerplate
- [ ] **1-c** Add `blackjack-sim-python/README.md` marking legacy status
- [ ] **1-d** Add MIT `LICENSE` file (referenced but missing)

## Phase 2 — Correctness fixes (READY)

- [ ] **2-a** Update rules modal OR implement missing rule features (see `docs/KNOWN-ISSUES.md`)
- [ ] **2-b** Fix split-hand bet sizing in `run_simulation.ts`
- [ ] **2-c** Fisher–Yates shuffle in `Deck.ts` (+ Python `deck.py`)
- [ ] **2-d** Include `numberOfDecks` in cache key generation
- [ ] **2-e** Gate S3/`refreshCache` behind `AWS_*` env vars (no build-time failures)

## Phase 3 — Tests & CI (blocked on 2-c)

- [ ] **3-a** Add Vitest + test scripts to `package.json`
- [ ] **3-b** Tests: deck size, shuffle determinism seed, basic strategy lookup, bankruptcy stop
- [ ] **3-c** GitHub Actions: lint, build, test

## Phase 4 — Resume polish (blocked on 3-a)

- [ ] **4-a** Confidence interval UI (reuse Python `utils.calculate_required_games` logic in TS)
- [ ] **4-b** CSV/JSON export button on results page
- [ ] **4-c** Fill `docs/resume-packaging.md` bullets
- [ ] **4-d** README Demo section + screenshot in `docs/images/`

## Done

- [x] **0-a** Initial audit and comprehensive docs (2026-06-21)
- [x] **0-b** Agent platform wiring at `/srv/projects/blackjack-sim`

## Blocked

| Task | Reason | Needed |
|------|--------|--------|
| S3 cache in prod | AWS credentials | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` in Vercel |
