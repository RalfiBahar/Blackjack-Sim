# blackjack-sim-python — Legacy Prototype

> **Status:** Legacy reference. The production app is [`../blackjack-sim/`](../blackjack-sim/) (Next.js + TypeScript).

Early Streamlit dashboard used to prototype Monte Carlo aggregation, matplotlib charts, and confidence-interval helpers before the web app existed.

## Run locally

```bash
pip install streamlit pandas matplotlib seaborn numpy
streamlit run app.py
```

## Files

| File | Purpose |
|------|---------|
| `app.py` | Streamlit UI |
| `run_simulation.py` | Single-run simulation → pandas DataFrame |
| `blackjack_game.py` | Game engine (Python port) |
| `strategies.py` | Basic strategy tables |
| `utils.py` | `calculate_required_games` for sample-size estimation |

## Divergences from TypeScript engine

- Reshuffle at **15 cards** (TS uses random 20–40% penetration)
- No custom betting-spread UI (hard-coded spread in `run_simulation.py`)
- Includes confidence interval output not yet ported to the Next.js UI

Do not treat this folder as source of truth for production behavior. See [../docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).
