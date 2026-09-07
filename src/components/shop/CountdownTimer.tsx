"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endsAt?: string;
  targetDate?: string;
}

export default function CountdownTimer({ endsAt, targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const deadline = endsAt || targetDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = new Date(deadline).getTime() - Date.now();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)) % 24,
        minutes: Math.floor(diff / (1000 * 60)) % 60,
        seconds: Math.floor(diff / 1000) % 60,
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      {[
        { label: "HRS", val: timeLeft.hours },
        { label: "MIN", val: timeLeft.minutes },
        { label: "SEC", val: timeLeft.seconds },
      ].map(({ label, val }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl flex items-center justify-center text-xl font-black tabular-nums shadow-md">
              {pad(val)}
            </div>
            <span className="text-[9px] font-bold tracking-widest text-zinc-500 mt-1 uppercase">
              {label}
            </span>
          </div>
          {i < 2 && (
            <span className="text-2xl font-black text-zinc-400 mb-4 animate-pulse">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
