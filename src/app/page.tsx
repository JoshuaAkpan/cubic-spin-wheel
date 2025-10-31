import SpinToWin from "@/component/SpinToWin";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[url('/images/cubic-bg.svg')] bg-cover bg-center min-h-screen flex flex-col items-center justify-center overflow-hidden">
     <Link href="https://www.cubicprints.africa">
      <div className="cursor-pointer z-10 top-5 right-5 p-4 absolute">
        <Image
          src="/images/close.svg"
          alt="close"
          width={30}
          height={30}
          className="object-contain"
        />
      </div>
     </Link>

      <SpinToWin />
    </div>
  );
}
