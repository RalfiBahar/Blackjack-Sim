import BlackjackSimulation from "@/components/BlackjackSimulation";
import { InitialData } from "@/components/types";

const initialData: InitialData = {
  numGames: 1000,
  initialBankroll: 1000,
  numSimulations: 10,
  results: null,
  aggregate: null,
  totalBankruptcies: 0,
  percentDoneSimulating: 0,
};

export default function Simulator() {
  return (
    <div className="flex justify-center items-center flex-col min-w-width">
      <p className="text-xl">BLACKJACKKKKKK</p>
      <BlackjackSimulation initialData={initialData} />
    </div>
  );
}
