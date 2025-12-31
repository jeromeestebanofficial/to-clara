"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { appConfig } from "@/config/appConfig";

interface CountdownProps {
  onComplete: () => void;
}

export default function Countdown({ onComplete }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(appConfig.targetDate).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        onComplete();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds };
    };

    // Initial calculation
    setTimeLeft(calculateTime());

    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center h-screen z-20 relative"
    >
      <h1 className="text-2xl md:text-4xl font-serif text-amber-100 tracking-widest text-center px-4">
        {appConfig.countdown.title}
      </h1>
      {appConfig.countdown.subtitle ? (
        <p className="mt-4 mb-10 text-sm md:text-base text-white/70 text-center px-6 max-w-xl">
          {appConfig.countdown.subtitle}
        </p>
      ) : (
        <div className="mb-12" />
      )}
      <div className="flex flex-wrap justify-center gap-6 md:gap-12">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </motion.div>
  );
}

const TimeUnit = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center bg-white/5 backdrop-blur-sm p-4 rounded-lg w-24 md:w-32 border border-white/10">
    <span className="text-4xl md:text-6xl font-bold text-white tabular-nums">
      {value.toString().padStart(2, "0")}
    </span>
    <span className="text-xs md:text-sm text-slate-400 uppercase tracking-widest mt-2">
      {label}
    </span>
  </div>
);
