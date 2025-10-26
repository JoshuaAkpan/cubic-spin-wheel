"use client";

import { useState, useEffect } from "react";
// import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { StyleType } from "react-custom-roulette/dist/components/Wheel/types";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const handleStart = (): void => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const newPrize = Math.floor(Math.random() * prizes.length);
    setPrizeNumber(newPrize);
    setMustSpin(true);
    // setStage("spinning");
  };

  const handleStop = (): void => {
    setMustSpin(false);
    setSpinResult(prizes[prizeNumber].option);
    setShowConfetti(true);
    setStage("result");
  };

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="bg-red-40 h-screen flex flex-col items-center justify-center space-y-8 p-6">
      {showConfetti && (
        <Confetti width={width} height={height} className="z-100" />
      )}

      {/* SPINNING STAGE */}
      <div className="flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center ">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={prizes}
            backgroundColors={["#6D28D9", "#7C3AED"]}
            textColors={["#FFFFFF"]}
            // make the text sit inside the wheel and not poke out
            perpendicularText={false} // <- important: don't rotate text perpendicular
            textDistance={50} // adjust [0..100] (smaller = closer to center)
            fontSize={14} // reduce font size so long labels wrap inside slices
            // borders / radius lines for the neat look
            outerBorderColor="#ffffff"
            outerBorderWidth={2}
            innerRadius={5}
            innerBorderColor="#ffffff"
            innerBorderWidth={6}
            radiusLineColor="#ffffff"
            radiusLineWidth={2}
            // pointerProps - override the default pointer with a triangle that points inward
            pointerProps={{
              style: {
                position: "absolute",
                top: "95%",
                left: "50%",
                transform: "translateX(-50%) rotate(0deg)",
                width: 0,
                height: 0,
                // triangle pointing down (borderBottom is the visible color)
                borderLeft: "16px solid transparent",
                borderRight: "16px solid transparent",
                borderBottom: "28px solid black", // color of the pointer tip
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",

                // zIndex: 10,
              },
            }}
            // spin tuning (optional)
            spinDuration={0.9}
            onStopSpinning={handleStop}
          />
        </div>

        {/* FORM STAGE */}
        {stage === "spinning" && (
          <div className="w-full space-y-4 text-">
            <h1 className="text-2xl font-bold text-purple-700">
              Brandpop Customer Service Week 2025
            </h1>
            <p className="text-gray-600 text-sm">
              Win amazing prizes this week! Enter your email to spin the wheel.
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              onClick={handleStart}
              disabled={mustSpin}
              className="w-full bg-[#6D28D9] hover:bg-[#7C3AED] text-white font-semibold py-3 rounded-xl"
            >
              {mustSpin ? "Spinning..." : "Spin the Wheel"}
            </button>
          </div>
        )}
      </div>

      {/* RESULT STAGE */}
      {stage === "result" && (
        <div className="max-w-sm w-full bg-white shadow-lg rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-bold text-purple-700">
            🎉 Surprise Gift Awaits!
          </h2>
          <p className="text-gray-700 text-sm">
            You&apos;ve won:
            <span className="font-semibold text-purple-600">{spinResult}</span>
          </p>

          <button
            onClick={() => toast.success("Redirect to whatsapp dm")}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl"
          >
            Claim Now
          </button>
        </div>
      )}
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
        theme="colored"
      />
    </div>
  );
}
