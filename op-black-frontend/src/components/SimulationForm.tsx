"use client";

import React, { useState } from "react";
import { InitialData, SimulationParams } from "./types";

interface SimulationFormProps {
  initialData: InitialData;
  onSubmit: (data: SimulationParams) => void;
}

const SimulationForm: React.FC<SimulationFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [numGames, setNumGames] = useState<number>(initialData.numGames);
  const [initialBankroll, setInitialBankroll] = useState<number>(
    initialData.initialBankroll
  );
  const [numSimulations, setNumSimulations] = useState<number>(
    initialData.numSimulations
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ numGames, initialBankroll, numSimulations });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Number of Games to Simulate</label>
        <input
          type="number"
          value={numGames}
          onChange={(e) => setNumGames(Number(e.target.value))}
          min={1}
          max={1000000}
        />
      </div>
      <div>
        <label>Initial Bankroll</label>
        <input
          type="number"
          value={initialBankroll}
          onChange={(e) => setInitialBankroll(Number(e.target.value))}
          min={1}
          max={1000000}
        />
      </div>
      <div>
        <label>Number of Simulations</label>
        <input
          type="number"
          value={numSimulations}
          onChange={(e) => setNumSimulations(Number(e.target.value))}
          min={1}
          max={100000}
        />
      </div>
      <button type="submit">Run Simulation</button>
    </form>
  );
};

export default SimulationForm;
