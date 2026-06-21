# Decisions

Architecture and design decisions for Blackjack-Sim.

---

## ADR-001 — TypeScript engine in Next.js API routes (2026-06-21)

**Context:** README claimed Express + Python backend. Actual production path runs simulation in Node via imported TS modules.

**Decision:** Treat `blackjack-sim/` TypeScript engine as source of truth. Python folder is legacy reference.

**Consequences:** Docs updated; Python drift acceptable until archived.

---

## ADR-002 — Agent stop phrase (2026-06-21)

**Context:** Platform `agent-loop` supports project-specific completion signals.

**Decision:** Use `BLACKJACK COMPLETE — stopping.` (parallel to Meridian's `MERIDIAN COMPLETE — stopping.`).

**Consequences:** `COMPLETION.md` + `check-completion.sh` gate agent sessions.

---

## ADR-004 — Full rule engine spec (2026-06-21)

**Context:** UI rules modal promised double, insurance, peek; engine only had hit/stand/split.

**Decision:** Implement S17 + peek (Ace/10), double any two, split to max 3 hands (no RSA), insurance offered on dealer Ace (basic strategy: decline unless future count-based option), no surrender. User-configurable shoe penetration (default 75%).

**Consequences:** `BlackjackGame` returns structured `GameResult`; `run_simulation` computes P&L per hand. Strategy tables gain `double` actions.

---

**Context:** Cache code caused build-time credential errors; logic was already commented out in routes.

**Decision:** Keep cache optional; require explicit env vars before enabling. Migrate to AWS SDK v3 when re-enabled.

**Consequences:** Faster local dev; no AWS needed for core simulator.
