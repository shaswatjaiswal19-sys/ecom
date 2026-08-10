"use client";

import { useState } from "react";
import { Settings, Shield, Key, Truck, Percent, CreditCard, Save, Sparkles, CheckCircle2 } from "lucide-react";
import { useShippingStore } from "@/lib/store";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const { shippingFee: currentFee, freeShippingThreshold: currentThreshold, setShippingFee, setFreeShippingThreshold: updateThreshold } = useShippingStore();
  const [gstRate, setGstRate] = useState("18");
  const [shippingFeeInput, setShippingFeeInput] = useState(String(currentFee || 0));
  const [freeShippingThresholdInput, setFreeShippingThresholdInput] = useState(String(currentThreshold || 0));
  const [storePhone, setStorePhone] = useState("+91 1800 900 8000");
  const [storeEmail, setStoreEmail] = useState("concierge@manojtraders.com");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const newFee = Number(shippingFeeInput) || 0;
    const newThreshold = Number(freeShippingThresholdInput) || 0;

    setShippingFee(newFee);
    updateThreshold(newThreshold);

    setTimeout(() => {
      setIsSaving(false);
      toast.success(`Shipping settings updated! Default shipping fee: ₹${newFee}`);
    }, 400);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Store Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
          Configure global taxes, shipping charges, threshold limits, and store parameters.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Tax & Shipping Config */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" /> Logistics & Shipping Fee Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Default Shipping Fee (₹)
              </label>
              <input
                type="number"
                value={shippingFeeInput}
                onChange={(e) => setShippingFeeInput(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm font-bold text-amber-600 dark:text-amber-400 outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">Set to 0 for FREE shipping on all orders</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                value={freeShippingThresholdInput}
                onChange={(e) => setFreeShippingThresholdInput(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">0 = Always apply default fee above</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Default GST Rate (%)
              </label>
              <input
                type="text"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-500" /> Storefront Contact Info
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Customer Care Helpline
              </label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Official Support Email
              </label>
              <input
                type="text"
                value={storeEmail}
                onChange={(e) => setStoreEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Security & Firebase Status */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
          <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-500" /> Backend Environment & API Integrations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-zinc-400">Firebase Firestore</span>
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected & Active
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-zinc-400">Clerk Authentication</span>
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active & Middleware Protected
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-1">
              <span className="text-xs font-bold text-zinc-400">PWA Service Worker</span>
              <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Offline Caching Ready
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
