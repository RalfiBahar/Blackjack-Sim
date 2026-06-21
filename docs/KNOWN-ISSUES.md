# Known Issues & Verification Audit

Audit date: **2026-06-21** · Verified via `npm run build`, `npm run lint`, and code review.

Severity: **Critical** · **High** · **Medium** · **Low**

---

## 1. Documented rules ≠ engine behavior (High)

The simulator rules modal (`blackjack-sim/src/app/simulator/page.tsx`) claims:

- Player can double down on any two cards
- Dealer peeks for blackjack on ace or ten
- Insurance when dealer shows ace

**Reality:** `BlackjackGame.playHand()` only handles `hit`, `stand`, and `split`. `strategies.ts` has no `double` actions. No insurance or peek logic exists.

**Impact:** Users and resume reviewers may assume full casino rule fidelity.

**Fix:** Either implement these rules or update the modal to match actual behavior.

---

## 2. Split hand bet accounting (High)

When a hand splits, only one `betAmount` is charged per game in `run_simulation.ts`, but multiple hands may win or lose independently.

**Impact:** EV and bankroll curves are skewed vs real play.

**Fix:** Track per-hand bets; deduct `betAmount` per active hand on losses.

---

## 3. Biased deck shuffle (Medium)

```27:29:blackjack-sim/src/components/Deck.ts
  shuffleDeck(): void {
    this.deck = this.deck.sort(() => Math.random() - 0.5);
  }
```

`Array.sort` with random comparator does **not** produce a uniform permutation.

**Fix:** Fisher–Yates shuffle.

---

## 4. README / stack mismatch (Medium)

Root README cites **Express.js REST API**. The app uses **Next.js App Router API routes** with in-process TypeScript simulation (no separate Express server).

---

## 5. Missing LICENSE file (Medium)

README links to `./LICENSE` — file does not exist in the repository.

---

## 6. S3 cache & build warnings (Medium)

- AWS SDK v2 is **end-of-support** (migrate to `@aws-sdk/client-s3`).
- `GET /api/refreshCache` runs at static generation time and logs `CredentialsError` without AWS env vars.
- Cache logic in `runSimulation/route.ts` is commented out but dead code remains.

**Fix:** Gate S3 behind `process.env.AWS_ACCESS_KEY_ID`; skip refresh at build if unset.

---

## 7. Cache key omits deck count (Low)

`generateCacheKey()` does not include `numberOfDecks`, so identical spread params with different shoe sizes could collide if cache is re-enabled.

---

## 8. Reshuffle inconsistency TS vs Python (Low)

| Implementation | Reshuffle trigger |
|----------------|-------------------|
| TypeScript | Random 20–40% of shoe remaining |
| Python | Fixed ≤15 cards |

---

## 9. Progress UI not updated during run (Low)

`simulator/page.tsx` sets `percentDoneSimulating` to 0 then 100. Stream chunks are parsed but progress bar never increments mid-run.

---

## 10. Python duplicate method stub (Low)

`blackjack-sim-python/blackjack_game.py` defines `calculate_score(self)` with `pass` at line 49, then redefines it with `(self, hand)` — dead code, confusing for readers.

---

## 11. Typos & naming (Low)

| Location | Issue |
|----------|-------|
| `chartDeafults.ts` | Should be `chartDefaults` |
| `EditibleBettingSpreadTable.tsx` | Should be `Editable` |
| Rules modal | Says base bet 0.1%; constant `BET_MULTIPLIER = 0.001` is correct (0.1%) |
| Root README | GitHub issues link uses `yourusername` placeholder |

---

## 12. No automated tests (High for resume)

No unit, integration, or E2E tests. Statistical correctness is unverified in CI.

---

## 13. npm audit (Medium)

`npm install` reports **20 vulnerabilities** (1 critical, 9 high). Run `npm audit` and upgrade Next.js / transitive deps.

---

## 14. Split / strategy edge cases (Medium)

- `pairStrategy[playerScore]?.[dealerUpcardValue]` can return `undefined` → silent mis-play if table gap exists.
- Split creates new hand but original hand continues with one card + new card; re-split not supported (OK if documented).

---

## Verification commands

```bash
cd blackjack-sim
npm install
npm run lint    # ✓ passes (2026-06-21)
npm run build   # ✓ passes; AWS credential warning on refreshCache prerender
```

---

## Suggested fix priority

1. B1 — Rules modal vs engine (honesty + trust)
2. B2 — Split bet accounting
3. C1–C3 — Test suite + CI
4. B4 — Fisher–Yates shuffle
5. D5 — AWS SDK / build hygiene
