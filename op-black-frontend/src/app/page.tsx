import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center items-center flex-col w-full h-full bg-bg-grey">
      <div className="size-96 aspect-w-1 aspect-h-1 bg-light-grey justify-center items-center flex rounded-2xl p-3 shadow-2xl">
        <div className="h-1/2 w-1/2 relative">
          <Image
            src="/main_cards.png"
            alt="cards"
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <Link href={"/simulator"}>
          <p className="text-2xl text-sky-400">Blackjack</p>
        </Link>
      </div>
    </div>
  );
}
