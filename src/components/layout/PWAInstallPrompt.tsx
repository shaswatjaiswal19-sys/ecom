"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 z-50 max-w-sm bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 flex-shrink-0">
        <Smartphone className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-xs font-bold text-white">Install Manoj Traders App</h4>
        <p className="text-[10px] text-zinc-400">Get faster access, offline support & exclusive drops.</p>
      </div>
      <button
        onClick={handleInstall}
        className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors flex items-center gap-1"
      >
        <Download className="w-3.5 h-3.5" /> Install
      </button>
      <button onClick={() => setShowPrompt(false)} className="text-zinc-500 hover:text-white p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
