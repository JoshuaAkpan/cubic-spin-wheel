"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { StyleType } from "react-custom-roulette/dist/components/Wheel/types";
import dynamic from "next/dynamic";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

interface WheelData {
  option: string;
  style?: StyleType;
}

const prizes: WheelData[] = [
  { option: "₦10,000 off your next order" },
  { option: "Free delivery coupon" },
  { option: "Surprise gift box" },
  { option: "₦5,000 shopping voucher" },
  { option: "Buy 1 get 1 free" },
  { option: "Discount up to 20%" },
];

type Stage = "form" | "spinning" | "result";

export default function SpinToWin() {
  const [stage, setStage] = useState<Stage>("spinning");
  const [email, setEmail] = useState<string>("");
  const [spinResult, setSpinResult] = useState<string>("");
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { width, height } = useWindowSize();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleStart = (): void => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const newPrize = Math.floor(Math.random() * prizes.length);

    setPrizeNumber(newPrize);
    setMustSpin(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleStart();
    }
  };

  const handleStop = (): void => {
    setTimeout(() => {
      setMustSpin(false);

      const n = prizes.length;
      const OFFSET = Math.floor(n / 2) - (n % 2 === 0 ? 1 : 0);
      const resultIndex = (prizeNumber + OFFSET + n) % n;

      setSpinResult(prizes[resultIndex].option);
      setShowConfetti(true);

      setTimeout(() => {
        setStage("result");
      }, 300);
    }, 200);
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="h-full flex flex-col items-center justify-center space-y-8 p-6">
      {showConfetti &&
        typeof window !== "undefined" &&
        createPortal(
          <Confetti
            width={width}
            height={height}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          />,
          document.body
        )}

      <div className="flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center justify-center relative">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={prizes}
            backgroundColors={["#E67220", "#070606"]}
            textColors={["#FFFFFF"]}
            perpendicularText={false}
            textDistance={55}
            fontSize={13}
            outerBorderColor="#d8af30"
            outerBorderWidth={5}
            innerRadius={10}
            pointerProps={{
              src: "images/cubic-wheel-pointer.svg",
              style: {
                position: "absolute",
                top: "94%",
                left: "52%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
              },
            }}
            spinDuration={0.9}
            onStopSpinning={handleStop}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Image
              src="/images/cubic-wheel-midLogo.svg"
              alt="Wheel Center"
              width={0}
              height={0}
              sizes="20vw"
              style={{ width: "7%", height: "auto" }}
              className="object-contain"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {stage === "spinning" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-[95%] mt-6"
            >
              <h1 className="text-2xl font-semibold text-black text-center mb-2">
                Cubic Customer Service Week 2025
              </h1>
              <p className="text-black text-sm text-center mb-4">
                Win amazing prizes this customer service week with the spin the
                wheel challenge.
              </p>

              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={mustSpin}
                className="w-full text-sm border-2 bg-white border-[#E67220] rounded-[5px] mb-2 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d8af30]"
              />

              <button
                onClick={handleStart}
                disabled={mustSpin}
                className="w-full cursor-pointer bg-[#070606] hover:bg-[#241f1f] text-[#FFB825] font-semibold py-3 rounded-[5px]"
              >
                {mustSpin ? "Spinning..." : "Spin Now"}
              </button>
            </motion.div>
          )}

          {stage === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-[95%] mt-6 text-center"
            >
              <h2 className="text-2xl font-bold text-[#070606]">
                🎉 Surprise Gift Awaits!
              </h2>
              <p className="text-gray-700 text-sm mb-4">
                You&apos;ve won:&nbsp;
                <span className="font-semibold text-[#E67220]">
                  {spinResult}
                </span>
              </p>

              <button
                onClick={() => toast.success("Redirect to WhatsApp")}
                className="w-full cursor-pointer bg-[#070606] hover:bg-[#241f1f] text-[#FFB825] font-semibold py-3 rounded-[5px]"
              >
                Claim Now
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />,
          document.body
        )}
    </div>
  );
}
