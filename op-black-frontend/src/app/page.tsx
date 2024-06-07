import Image from "next/image";
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

export default function Home() {
  return (
    <div>
      BLACKJACKKKKKK
      <BlackjackSimulation initialData={initialData} />
    </div>
  );
}
