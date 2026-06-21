# Blackjack Simulator

Monte Carlo blackjack simulator with **Hi-Lo card counting**, customizable **betting spreads**, and interactive **Chart.js analytics**.

**Live demo:** [blackjack-sim.com](https://blackjack-sim.com) · **Repo:** [github.com/RalfiBahar/Blackjack-Sim](https://github.com/RalfiBahar/Blackjack-Sim)

---

## What it does

- Simulates thousands of blackjack sessions with basic strategy and running-count bet sizing
- Aggregates Monte Carlo runs and charts EV, house edge, bankroll paths, running-count distributions, and more
- Lets you edit the betting spread per running-count bucket in advanced settings

---

## Repository structure

| Path | Role |
|------|------|
| [`blackjack-sim/`](blackjack-sim/) | **Production app** — Next.js 14, TypeScript simulation engine, API routes |
| [`blackjack-sim-python/`](blackjack-sim-python/) | Legacy Streamlit prototype (reference) |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System design and data flow |
| [`docs/KNOWN-ISSUES.md`](docs/KNOWN-ISSUES.md) | Verified bugs and gaps |
| [`docs/resume-packaging.md`](docs/resume-packaging.md) | Portfolio bullets and demo script |
| [`COMPLETION.md`](COMPLETION.md) | Agent-loop stop condition and remaining goals |

---

## Quick start

```bash
cd blackjack-sim
npm install
npm run dev
```

Open [http://localhost:3000/simulator](http://localhost:3000/simulator).

```bash
npm run build   # production build
npm run lint    # eslint
```

Optional AWS env vars (S3 cache — currently disabled in routes):

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

---

## Technology stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 App Router, React 18, Chakra UI, Tailwind CSS |
| Charts | Chart.js, react-chartjs-2 |
| Simulation | TypeScript modules (`run_simulation.ts`, `BlackjackGame.ts`) |
| API | Next.js Route Handlers (`/api/runSimulation`) |
| Deploy | Vercel (+ optional AWS S3 cache) |
| Legacy | Python Streamlit + matplotlib |

> Simulations run in-process via Next.js API routes — no separate backend service.

---

## Agent platform (this server)

This repo is registered for autonomous agent sessions:

```bash
agent-work blackjack-sim "Work through COMPLETION.md."
agent-loop blackjack-sim          # rate-limit-aware loop
agent-session-loop blackjack-sim  # tmux background
```

Project path: `/srv/projects/blackjack-sim` · Stop phrase: **`BLACKJACK COMPLETE — stopping.`**

Run verification:

```bash
bash scripts/check-completion.sh
bash scripts/check-completion.sh --code   # build/lint only
```

---

## Documentation

- [Architecture](docs/ARCHITECTURE.md) — request flow, engine rules, caching
- [Known issues](docs/KNOWN-ISSUES.md) — audit findings and fix priority
- [Roadmap](ROADMAP.md) · [Tasks](TASKS.md) · [Changelog](CHANGELOG.md)

---

## Demo

| | |
|---|---|
| **Local** | `npm run dev` → http://localhost:3000 |
| **Production** | https://blackjack-sim.com/simulator |
| **Screenshot** | _Add `docs/images/simulator-results.png` (Phase D4)_ |

---

## License

MIT — see [LICENSE](LICENSE).

---

## Author

Ralfi Bahar — [blackjack-sim.com](https://blackjack-sim.com)
