"use client";

import { ShoppingBag, Sparkles, Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  size = "md",
  label = "Loading...",
  fullScreen = false,
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 space-y-6 select-none"
    : "flex flex-col items-center justify-center p-8 space-y-4 select-none";

  const logoSizes = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-lg",
    lg: "w-20 h-20 text-2xl",
    xl: "w-24 h-24 text-3xl",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  return (
    <div className={containerClasses}>
      {/* Glowing Ambient Background Aura */}
      <div className="absolute w-72 h-72 bg-amber-500/15 dark:bg-amber-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Main Animated Pulsing Logo Container */}
      <div className="relative group">
        {/* Radar Ring Ripple Animations */}
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-500 to-amber-400 rounded-3xl opacity-30 blur-lg animate-pulse" />
        <div className="absolute -inset-1 rounded-3xl bg-amber-500/30 animate-ping pointer-events-none" />

        {/* Central Logo Box */}
        <div
          className={`relative ${logoSizes[size]} rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-black shadow-2xl shadow-amber-500/40 flex flex-col items-center justify-center ring-4 ring-amber-500/20`}
        >
          <ShoppingBag className={`${iconSizes[size]} animate-bounce`} />
        </div>
      </div>

      {/* Brand Title & Glowing Progress Line */}
      <div className="text-center space-y-2 z-10">
        <div className="flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <h3 className="text-sm font-black tracking-wider uppercase text-zinc-900 dark:text-white">
            Manoj Traders
          </h3>
        </div>

        {label && (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 animate-pulse">
            {label}
          </p>
        )}

        {/* Shimmer Animated Progress Bar */}
        <div className="w-44 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mx-auto shadow-inner">
          <div className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-full w-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function InlineSpinner({ className = "w-5 h-5 text-amber-500 animate-spin" }: { className?: string }) {
  return <Loader2 className={className} />;
}
