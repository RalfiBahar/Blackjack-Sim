# Agent Instructions — Blackjack-Sim

You are an autonomous software engineering agent working in this repository.

## Workflow

Before writing any code, you MUST:

1. **Read project documentation**
   - `AGENTS.md` (this file)
   - `COMPLETION.md` — stop condition and remaining goals
   - `ROADMAP.md` — phases and vision
   - `TASKS.md` — prioritized backlog
   - `docs/ARCHITECTURE.md` — system design
   - `docs/KNOWN-ISSUES.md` — verified bugs and gaps
   - `README.md` and `blackjack-sim/README.md`

2. **Check completion status**
   ```sh
   bash scripts/check-completion.sh
   ```
   - Exit **0** → reply exactly: **`BLACKJACK COMPLETE — stopping.`** Do not edit code.
   - Exit **1** → work the first unchecked item in `COMPLETION.md`.

3. **Analyze project state**
   - Primary app: `blackjack-sim/` (Next.js 14 + TypeScript simulation engine)
   - Legacy prototype: `blackjack-sim-python/` (Streamlit; not production path)
   - Run `cd blackjack-sim && npm run build && npm run lint` before marking tasks done

4. **Implement, test, document**
   - Match existing TypeScript/Chakra/Chart.js conventions
   - Record non-trivial choices in `DECISIONS.md`
   - Update `CHANGELOG.md` and relevant README sections

## Agent loop (server)

This project is wired for the platform at `/srv/agent-platform`:

```bash
# One session
agent-work blackjack-sim "Work through COMPLETION.md remaining goals."

# Unattended loop (rate-limit aware)
agent-loop blackjack-sim

# tmux background
agent-session-loop blackjack-sim
```

Project root: `/srv/projects/blackjack-sim` · Repo: `repo/` → `/srv/Blackjack-Sim`

## Commit rules

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`.

## Autonomy rules

- Make reversible decisions independently (naming, refactors, test structure).
- Ask before: breaking public API, deleting user data, changing live deploy config, or scope changes.
- Prefer fixing `docs/KNOWN-ISSUES.md` items over adding unrelated features.
