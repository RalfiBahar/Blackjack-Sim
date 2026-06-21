# ARCHIVED — Legacy Streamlit prototype

> **Status:** Archived as of 2026-06-21. Do not extend this folder.

The production application is [`../blackjack-sim/`](../blackjack-sim/) (Next.js + TypeScript).

This Python prototype was kept for historical reference only. Statistical helpers (confidence intervals, sample-size estimation) have been ported to `blackjack-sim/src/utils.ts`.

To run locally (not maintained):

```bash
pip install streamlit pandas matplotlib seaborn numpy
streamlit run app.py
```
