import Image from "next/image";
import Link from "next/link";
import { Button } from "@chakra-ui/react";
import { InfoCard } from "@/components";

export default function Home() {
  return (
    <div className="flex items-center flex-col w-full h-full bg-bg-grey">
      <h1 className="text-6xl text-white mt-20 text-center">
        Welcome to BlackjackSim!
      </h1>
      <h3 className="mb-10 mt-3 text-white text-2xl italic text-center">
        Simulate and optimize your blackjack strategies.
      </h3>
      <div className="flex md:flex-row flex-col w-full justify-center items-center md:items-start">
        <div className="size-96 aspect-w-1 aspect-h-1 bg-light-grey justify-center items-center flex flex-col rounded-2xl p-3 shadow-2xl">
          <div className="h-1/2 w-1/2 relative">
            <Image
              src="/main_cards.png"
              alt="cards"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className="h-1/6 w-1/2 mt-10 relative">
            <Link href="/simulator">
              <Button bg="#0C1222" color="white" _hover={{ bg: "blue.700" }}>
                Go to Simulator
              </Button>
            </Link>
          </div>
        </div>
        <InfoCard />
      </div>
    </div>
  );
}
