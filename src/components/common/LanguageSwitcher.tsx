"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "pill" | "compact" | "buttons";
  className?: string;
}

export default function LanguageSwitcher({ variant = "pill", className = "" }: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === "compact") {
    return (
      <button
        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-amber-500/20 hover:text-amber-600 dark:hover:text-amber-400 border border-zinc-200 dark:border-zinc-700 ${className}`}
        title={language === "en" ? "हिंदी में बदलें" : "Switch to English"}
        aria-label="Toggle language"
      >
        <Languages className="w-3.5 h-3.5 text-amber-500" />
        <span>{language === "en" ? "हिंदी" : "English"}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/80 shadow-xs ${className}`}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === "en"
            ? "bg-amber-500 text-zinc-950 shadow-xs font-extrabold scale-100"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          language === "hi"
            ? "bg-amber-500 text-zinc-950 shadow-xs font-extrabold scale-100"
            : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
