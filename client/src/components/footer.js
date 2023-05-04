import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfairDisplay = Playfair_Display({ subsets: ["latin"] });

export default function Footer() {
  return (
    <>
      <div className="mt-20 flex items-center justify-between bg-black px-6 pt-6 pb-14">
        <h2 className={`${playfairDisplay.className} font-bold text-white`}>
          StyLish
        </h2>
        <div className="flex gap-4">
          <Image
            alt="facebook"
            src="/facebook.svg"
            width={0}
            height={0}
            sizes="100vw"
            className="cursor-pointer w-full h-auto"
          />
          <Image
            alt="instagram"
            src="/instagram.svg"
            width={0}
            height={0}
            sizes="100vw"
            className="cursor-pointer w-full h-auto"
          />
          <Image
            alt="home"
            src="/home.svg"
            width={0}
            height={0}
            sizes="100vw"
            className="cursor-pointer w-full h-auto"
          />
        </div>
      </div>
    </>
  );
}
