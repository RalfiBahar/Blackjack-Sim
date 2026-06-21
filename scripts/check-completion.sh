#!/usr/bin/env bash
# Exit 0 when Blackjack-Sim is operationally complete (agent loop stop condition).
# See COMPLETION.md.
set -uo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="$ROOT/blackjack-sim"
cd "$ROOT"

CODE_ONLY=0
[[ "${1:-}" == "--code" ]] && CODE_ONLY=1

FAIL=0
ok()   { echo "  OK:   $*"; }
fail() { echo "  FAIL: $*"; FAIL=$((FAIL + 1)); }

COMPLETION_FILE="$ROOT/COMPLETION.md"

echo "==> Blackjack-Sim completion check"
echo ""

# ── A1: README stack accuracy ───────────────────────────────────────────────
if grep -q "Next.js" "$ROOT/README.md" 2>/dev/null \
   && grep -q "docs/ARCHITECTURE.md" "$ROOT/README.md" 2>/dev/null; then
  ok "A1 root README describes Next.js (not Express)"
else
  fail "A1 root README still mentions Express or missing Next.js — update README.md"
fi

# ── A2: app README not boilerplate ────────────────────────────────────────────
if [[ -f "$APP/README.md" ]] \
   && grep -q "ARCHITECTURE" "$APP/README.md" 2>/dev/null \
   && ! grep -q "create-next-app" "$APP/README.md" 2>/dev/null; then
  ok "A2 blackjack-sim/README.md is project-specific"
else
  fail "A2 replace create-next-app boilerplate in blackjack-sim/README.md"
fi

# ── A3: docs exist and linked ─────────────────────────────────────────────────
if [[ -f docs/ARCHITECTURE.md ]] && [[ -f docs/KNOWN-ISSUES.md ]] \
   && grep -q "ARCHITECTURE" "$ROOT/README.md" 2>/dev/null; then
  ok "A3 architecture and known-issues docs linked from README"
else
  fail "A3 add/link docs/ARCHITECTURE.md and docs/KNOWN-ISSUES.md"
fi

# ── A4: build + lint ──────────────────────────────────────────────────────────
if [[ -d "$APP/node_modules" ]] || (cd "$APP" && npm install --silent >/dev/null 2>&1); then
  if (cd "$APP" && npm run lint --silent >/dev/null 2>&1); then
    ok "A4 eslint passes"
  else
    fail "A4 eslint failing — run: cd blackjack-sim && npm run lint"
  fi
  if (cd "$APP" && npm run build --silent >/dev/null 2>&1); then
    ok "A4 production build passes"
  else
    fail "A4 build failing — run: cd blackjack-sim && npm run build"
  fi
else
  fail "A4 could not install npm dependencies"
fi

if [[ "$CODE_ONLY" -eq 1 ]]; then
  echo ""
  [[ "$FAIL" -eq 0 ]] && echo "==> Code gates (A4) passed." && exit 0
  echo "==> INCOMPLETE ($FAIL gate(s) failed)"
  exit 1
fi

# ── B1: rules modal honesty ───────────────────────────────────────────────────
if grep -q "double down on any two cards" "$APP/src/app/simulator/page.tsx" 2>/dev/null \
   && ! grep -rq "double" "$APP/src/components/BlackjackGame.ts" "$APP/src/strategies.ts" 2>/dev/null; then
  fail "B1 rules modal claims double down but engine has no double implementation"
else
  ok "B1 rules modal aligned with engine (or double implemented)"
fi

# ── B4: Fisher-Yates shuffle ──────────────────────────────────────────────────
if grep -q "sort(() => Math.random()" "$APP/src/components/Deck.ts" 2>/dev/null; then
  fail "B4 Deck still uses biased sort shuffle — implement Fisher-Yates"
else
  ok "B4 Fisher-Yates shuffle in Deck.ts"
fi

# ── C1: test runner configured ────────────────────────────────────────────────
if grep -q '"test"' "$APP/package.json" 2>/dev/null; then
  ok "C1 test script in package.json"
else
  fail "C1 add Vitest/Jest test script to blackjack-sim/package.json"
fi

# ── C2: minimum test count ────────────────────────────────────────────────────
_test_count=$(find "$APP" -path "*/node_modules" -prune -o \( -name "*.test.ts" -o -name "*.spec.ts" \) -print 2>/dev/null | wc -l)
if [[ "$_test_count" -ge 1 ]]; then
  if (cd "$APP" && npm test --silent >/dev/null 2>&1); then
    ok "C2 tests exist and pass (${_test_count} file(s))"
  else
    fail "C2 tests failing — run: cd blackjack-sim && npm test"
  fi
else
  fail "C2 add ≥1 test file under blackjack-sim/"
fi

# ── C3: CI workflow ───────────────────────────────────────────────────────────
if [[ -f "$ROOT/.github/workflows/ci.yml" ]] || [[ -f "$ROOT/.github/workflows/test.yml" ]]; then
  ok "C3 GitHub Actions CI workflow present"
else
  fail "C3 add .github/workflows/ci.yml"
fi

# ── D1: confidence interval in UI ─────────────────────────────────────────────
if grep -rq "confidence\|margin of error\|Conf interval" "$APP/src" 2>/dev/null; then
  ok "D1 confidence interval surfaced in UI"
else
  fail "D1 add Monte Carlo confidence interval to results UI"
fi

# ── D2: export ────────────────────────────────────────────────────────────────
if grep -rq "download\|export.*csv\|export.*json\|Blob" "$APP/src/components" 2>/dev/null; then
  ok "D2 results export available"
else
  fail "D2 add CSV/JSON export on results page"
fi

# ── D3: resume bullets filled ─────────────────────────────────────────────────
if grep -q "TBD" docs/resume-packaging.md 2>/dev/null; then
  fail "D3 docs/resume-packaging.md still has TBD bullets"
else
  ok "D3 resume bullets filled"
fi

# ── D4: demo section ──────────────────────────────────────────────────────────
if grep -q "## Demo" "$ROOT/README.md" 2>/dev/null; then
  ok "D4 README Demo section present"
else
  fail "D4 add ## Demo section to README.md"
fi

# ── D5: no aws-sdk v2 in dependencies ───────────────────────────────────────
if grep -q '"aws-sdk"' "$APP/package.json" 2>/dev/null; then
  fail "D5 migrate off aws-sdk v2 or gate behind env-only dynamic import"
else
  ok "D5 AWS SDK v2 removed or gated"
fi

echo ""
if [[ "$FAIL" -eq 0 ]]; then
  echo "==> ALL GATES PASSED — marking COMPLETE"
  _ts=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  if [[ -f "$COMPLETION_FILE" ]]; then
    sed -i "s/^STATUS: INCOMPLETE/STATUS: COMPLETE/" "$COMPLETION_FILE"
    sed -i "s/^COMPLETED_AT: —/COMPLETED_AT: ${_ts}/" "$COMPLETION_FILE"
  fi
  exit 0
fi

echo "==> INCOMPLETE ($FAIL gate(s) failed) — see COMPLETION.md"
exit 1
