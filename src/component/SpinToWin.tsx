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
import Link from "next/link";
import "react-roulette-pro/dist/index.css";
import { Info } from "lucide-react";
// import { Wheel } from "react-custom-roulette";

const Wheel = dynamic(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
) as React.ComponentType<any>;

interface WheelData {
  option: string;
  style?: StyleType;
}

const prizes: WheelData[] = [
  { option: "5% Discount", style: { fontSize: 15 } }, // 13%
  { option: "Free Delivery", style: { fontSize: 15 } }, // 20%
  { option: "10% Discount", style: { fontSize: 15 } }, // 7%
  { option: "Spin Again", style: { fontSize: 15 } }, // 20%
  { option: "Better Luck next time", style: { fontSize: 14 } }, // 20%
  { option: "Merch from cubic prints", style: { fontSize: 14 } }, // 20%
];

type Stage = "form" | "spinning" | "result";

export default function SpinToWin() {
  const [stage, setStage] = useState<Stage>("spinning");
  const [email, setEmail] = useState<string>("");
  const [spinResult, setSpinResult] = useState<string>("");
  const [mustSpin, setMustSpin] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");

  const { width, height } = useWindowSize();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const GOOGLE_FORM_FIELD_NAMES = {
    Email: "entry.1705414739",
  };

  const GOOGLE_FORM_ACTION_URL =
    "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfr-Axz5izgoAChtSso2PMPxynRtbHj91fEW-d51IEQJNlSHg/formResponse";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmitToGoogle = async (emailValue: string, prize: string) => {
    if (!emailValue) return;

    const data = {
      [GOOGLE_FORM_FIELD_NAMES.Email]: emailValue,
      "entry.710184327": prize,
    };

    const formBody = new URLSearchParams(data).toString();

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        mode: "no-cors",
        body: formBody,
      });
      console.log("✅ Saved to Google Sheet");
    } catch (error) {
      console.error("❌ Network error:", error);
    }
  };

  const pickWeightedPrize = (prizes: WheelData[]): number => {
    // define weights according to `prizes` array
    const weights = [20, 20, 20, 7, 20, 13];
    const total = weights.reduce((a, b) => a + b, 0);
    const rand = Math.random() * total;

    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (rand <= sum) return i;
    }
    return weights.length - 1;
  };

  const handleStart = (): void => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const newPrize = pickWeightedPrize(prizes);

    setPrizeNumber(newPrize);
    setMustSpin(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleStart();
    }
  };

  const handleStop = async (): Promise<void> => {
    setTimeout(async () => {
      setMustSpin(false);

      const n = prizes.length;
      const OFFSET = Math.floor(n / 2) - (n % 2 === 0 ? 1 : 0);
      const resultIndex = (prizeNumber + OFFSET + n) % n;
      const result = prizes[resultIndex].option;

      setSpinResult(result);

      if (result === "Spin Again") {
        setTimeout(() => {
          handleStart();
        }, 1500);
        return;
      }

      setShowConfetti(true);

      await handleSubmitToGoogle(email.trim(), result);

      toast.success("Your entry was recorded!");
      setStatus("Success! Data saved to Google Sheet.");

      setTimeout(() => {
        setStage("result");
      }, 300);
    }, 500);
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
        isMounted &&
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
            backgroundColors={[
              "#F36523",
              "#4BAAF3",
              "#6F2D91",
              "#ED1B24",
              "#0072BB",
              "#8DC73F",
            ]}
            textColors={["#FFFFFF"]}
            perpendicularText={false}
            textDistance={50}
            outerBorderWidth={0}
            radiusLineWidth={0}
            innerRadius={10}
            pointerProps={{
              src: "images/cubic-wheel-pointer.svg",
              style: {
                position: "absolute",
                top: "94%",
                left: "53%",
                transform: "translateX(-50%)",
                width: "40px",
                height: "40px",
              },
            }}
            spinDuration={0.9}
            disableInitialAnimation={true}
            onStopSpinning={handleStop}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Image
              src="/images/cubic-wheel-midLogo.svg"
              alt="Wheel Center"
              width={0}
              height={0}
              sizes="20vw"
              style={{ width: "5%", height: "auto" }}
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
              <h1 className="text-3xl font-bold text-black text-center mb-2">
                Exclusive Reward to our Loyal Clients
              </h1>
              <p className="text-black text-sm text-center mb-2">
                Spin the wheel to win amazing prices
              </p>

              <p className="text-[#292524] text-sm text-left mb-4 flex items-center justify-center gap-2">
                <Info size={14} />
                <span>
                  Discounts and Free delivery are available on Next order
                </span>
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col"
              >
                <input
                  name={GOOGLE_FORM_FIELD_NAMES.Email}
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
                  type="button"
                  disabled={mustSpin && status === "Submitting..."}
                  className="w-full cursor-pointer bg-[#070606] hover:bg-[#241f1f] text-[#FFB825] font-semibold py-3 rounded-[5px]"
                >
                  {mustSpin ? "Spinning..." : "Spin Now"}
                </button>
              </form>
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

              <Link
                href={`https://wa.me/+2349135491212?text=Hi%2C%20my%20name%20is%20______________.%20I%20won%20${spinResult}.`}
              >
                <button
                  onClick={() => toast.success("Redirect to WhatsApp")}
                  className="w-full cursor-pointer bg-[#070606] hover:bg-[#241f1f] text-[#FFB825] font-semibold py-3 rounded-[5px]"
                >
                  Claim Now
                </button>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {isMounted &&
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
