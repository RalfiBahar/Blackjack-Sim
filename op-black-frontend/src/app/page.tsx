import Image from "next/image";

export default function Home() {
  return (
    <div className="flex justify-center items-center flex-col w-full h-full bg-bg-grey">
      <div className="w-1/3 aspect-w-1 aspect-h-1 h-1/3 bg-light-grey justify-center items-center flex rounded-2xl p-3 shadow-2xl">
        <div className="h-1/2 w-1/2 relative">
          <Image
            src="/main_cards.png"
            alt="cards"
            layout="fill"
            objectFit="contain"
          />
        </div>{" "}
      </div>
      <p className="text-2xl text-white">Blackjack</p>
    </div>
  );
}
