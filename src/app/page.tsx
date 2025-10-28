import SpinToWin from "@/component/SpinToWin";

export default function Home() {
  return (
    <div className="bg-[url('/images/cubic-bg.svg')] bg-cover bg-center min-h-screen flex justify-center items-center overflow-hidden">
        <SpinToWin />
    </div>
  );
}
