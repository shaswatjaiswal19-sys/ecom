"use client";

import { useState } from "react";
import { Ticket, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import toast from "react-hot-toast";

const MOCK_COUPONS = [
  {
    id: "cp-1",
    code: "LUXURY10",
    discountType: "percentage" as const,
    discountValue: 10,
    minOrderValue: 20000,
    expiresAt: "2026-12-31",
    usageCount: 142,
    maxUsage: 1000,
    isActive: true,
  },
  {
    id: "cp-2",
    code: "MANOJ500",
    discountType: "fixed" as const,
    discountValue: 500,
    minOrderValue: 5000,
    expiresAt: "2026-11-30",
    usageCount: 88,
    maxUsage: 500,
    isActive: true,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");
  const [val, setVal] = useState(10);
  const [type, setType] = useState<"percentage" | "fixed">("percentage");

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    const created = {
      id: `cp-${Date.now()}`,
      code: code.toUpperCase(),
      discountType: type,
      discountValue: Number(val),
      minOrderValue: 5000,
      expiresAt: "2026-12-31",
      usageCount: 0,
      maxUsage: 500,
      isActive: true,
    };
    setCoupons([created, ...coupons]);
    setShowModal(false);
    setCode("");
    toast.success("Coupon code activated!");
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success("Coupon deleted.");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Coupons & Promos</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Create promotional discount codes and flash sale triggers.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {showModal && (
        <form onSubmit={handleAddCoupon} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-amber-500/30 shadow-2xl space-y-4">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">New Promo Coupon Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Coupon Code (e.g. VIP2026) *"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-sm text-zinc-900 dark:text-white uppercase outline-none focus:border-amber-500"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none"
            >
              <option value="percentage">Percentage (%) Discount</option>
              <option value="fixed">Fixed Amount (₹) Off</option>
            </select>
            <input
              type="number"
              placeholder="Discount Value *"
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
            >
              Activate Coupon
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-black text-amber-500 tracking-wider bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                {c.code}
              </span>
              <button
                onClick={() => handleDelete(c.id)}
                className="text-red-500 hover:text-red-600 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div>
              <div className="text-2xl font-black text-zinc-900 dark:text-white">
                {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Min. Order: ₹{c.minOrderValue.toLocaleString()} • Valid till {c.expiresAt}
              </p>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
              <span>Used: {c.usageCount} / {c.maxUsage}</span>
              <span className="text-emerald-500 font-bold">Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
