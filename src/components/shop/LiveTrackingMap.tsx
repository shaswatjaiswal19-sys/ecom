"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Navigation, Phone, ShieldCheck, Clock, Copy } from "lucide-react";
import toast from "react-hot-toast";

interface LiveTrackingMapProps {
  orderNumber: string;
  status: string;
  customerAddress?: string;
}

export default function LiveTrackingMap({ orderNumber, status, customerAddress }: LiveTrackingMapProps) {
  const [progress, setProgress] = useState(68); // 0 to 100% on route
  const [etaMinutes, setEtaMinutes] = useState(14);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 94 ? 68 : prev + 0.5));
      setEtaMinutes((prev) => (prev <= 4 ? 14 : prev - 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyOTP = () => {
    navigator.clipboard.writeText("4982");
    toast.success("Delivery OTP copied to clipboard!");
  };

  const handleCallDriver = () => {
    toast.success("Connecting to Delivery Captain Ramesh Sharma...");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl space-y-0">
      {/* Top Map Header */}
      <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Navigation className="w-5 h-5 animate-pulse text-amber-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                GPS Live Tracking Map
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <h3 className="text-sm font-black text-zinc-900 dark:text-white mt-0.5">
              Order #{orderNumber} En-Route
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-2xl text-xs shadow-sm">
          <Clock className="w-4 h-4 text-amber-500" />
          <span>
            Estimated Arrival: <strong className="text-amber-600 dark:text-amber-400 font-extrabold">{etaMinutes} mins</strong> ({progress.toFixed(0)}% covered)
          </span>
        </div>
      </div>

      {/* Light Google-Maps Style Interactive Vector Map */}
      <div className="relative h-72 sm:h-80 w-full bg-[#f1f5f9] dark:bg-[#18181b] overflow-hidden select-none">
        {/* Vector Map Roads, Water, Greenery Layers */}
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Green Parks */}
          <rect x="10%" y="15%" width="25%" height="30%" rx="20" fill="#dcfce7" fillOpacity="0.7" />
          <rect x="65%" y="45%" width="20%" height="40%" rx="30" fill="#dcfce7" fillOpacity="0.7" />

          {/* River Water Stream */}
          <path d="M -20 280 C 150 260, 300 120, 500 180 T 900 100" fill="none" stroke="#bae6fd" strokeWidth="28" strokeLinecap="round" />

          {/* Grid Background Pattern */}
          <defs>
            <pattern id="lightGrid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeOpacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lightGrid)" />

          {/* Main White Highway Road Line */}
          <path d="M 50 160 Q 200 80 400 160 T 750 120" fill="none" stroke="#ffffff" strokeWidth="16" strokeLinecap="round" className="drop-shadow-sm" />
          <path d="M 50 160 Q 200 80 400 160 T 750 120" fill="none" stroke="#cbd5e1" strokeWidth="12" strokeLinecap="round" />

          {/* Active Navigation Route Line (Bold Amber) */}
          <path d="M 50 160 Q 200 80 400 160 T 750 120" fill="none" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
          <path d="M 50 160 Q 200 80 400 160 T 750 120" fill="none" stroke="#fbbf24" strokeWidth="4" strokeDasharray="10 10" strokeLinecap="round" className="animate-pulse" />

          {/* Secondary City Streets */}
          <path d="M 200 80 L 220 260 M 400 160 L 420 20 M 600 140 L 620 270" fill="none" stroke="#ffffff" strokeWidth="8" />
        </svg>

        {/* Warehouse Origin Pin */}
        <div className="absolute top-[45%] left-[8%] -translate-y-1/2 flex flex-col items-center gap-1 group">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            🏢
          </div>
          <span className="text-[10px] font-bold bg-white/95 dark:bg-zinc-900/95 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-0.5 rounded-full shadow-md">
            Shaswat Hub
          </span>
        </div>

        {/* Live Moving Delivery Driver Marker */}
        <div
          className="absolute top-[40%] -translate-y-1/2 transition-all duration-1000 ease-linear flex flex-col items-center gap-1.5 z-20"
          style={{ left: `${Math.min(84, Math.max(16, progress))}%` }}
        >
          {/* Radar Ripple Rings */}
          <div className="absolute -inset-3 bg-amber-500/20 rounded-full animate-ping pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black shadow-2xl shadow-amber-500/50 ring-4 ring-amber-500/30">
            <Truck className="w-6 h-6 animate-bounce" />
          </div>

          <div className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 font-black text-[10px] px-3 py-1 rounded-full shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <span>Ramesh (Express Delivery)</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
        </div>

        {/* Customer Destination Pin */}
        <div className="absolute top-[35%] right-[10%] -translate-y-1/2 flex flex-col items-center gap-1 group">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500 border-2 border-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/40 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2.5 py-0.5 rounded-full shadow-md">
            Your Doorstep
          </span>
        </div>
      </div>

      {/* Driver Executive Info Banner */}
      <div className="p-5 sm:p-6 bg-slate-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-5 items-center">
        {/* Driver Profile */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xl font-bold text-amber-500 overflow-hidden flex-shrink-0 shadow-sm">
            👨‍✈️
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-900" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Ramesh Sharma</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Express Captain • EV Electric Bike</p>
            <span className="text-[10px] font-mono font-bold text-zinc-400">Reg: UP 32 EV 8892</span>
          </div>
        </div>

        {/* Delivery OTP Box */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Share OTP with Captain</span>
            <span className="text-lg font-mono font-black text-amber-600 dark:text-amber-400 tracking-widest">4982</span>
          </div>
          <button
            onClick={handleCopyOTP}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>

        {/* Contact Captain Button */}
        <div className="flex gap-2">
          <button
            onClick={handleCallDriver}
            className="flex-1 py-3.5 rounded-2xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Phone className="w-4 h-4 fill-zinc-950" /> Call Delivery Captain
          </button>
        </div>
      </div>
    </div>
  );
}
