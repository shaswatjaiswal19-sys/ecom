"use client";

import { useState } from "react";
import { Wallet, Star, Gift, ArrowUpRight, ArrowDownLeft, Shield, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import toast from "react-hot-toast";

const TRANSACTIONS = [
  {
    id: "tx-1",
    type: "credit",
    amount: 1500,
    title: "Welcome Bonus Reward",
    date: "2026-08-01",
    note: "Manoj Traders privilege activation credit",
  },
  {
    id: "tx-2",
    type: "debit",
    amount: 499,
    title: "Applied on Order #MT-2026-8812",
    date: "2026-08-03",
    note: "Instant discount voucher redemption",
  },
  {
    id: "tx-3",
    type: "credit",
    amount: 250,
    title: "Cashback Reward - Chronos Ultra",
    date: "2026-08-04",
    note: "5% luxury cashback earnings",
  },
];

export default function AccountWalletPage() {
  const [walletBalance, setWalletBalance] = useState(1251);
  const [rewardPoints, setRewardPoints] = useState(3800);
  const [giftCardCode, setGiftCardCode] = useState("");

  const handleRedeemGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardCode.trim()) {
      toast.error("Please enter a valid gift card or voucher code.");
      return;
    }
    setWalletBalance((prev) => prev + 500);
    setGiftCardCode("");
    toast.success("₹500 Gift Voucher redeemed & added to your wallet! 🎁");
  };

  return (
    <div className="space-y-6">
      {/* Wallet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Cash Balance */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white border border-amber-500/30 shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Wallet className="w-4 h-4" /> Manoj Pay Cash Wallet
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase">
              Active
            </span>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-xs text-zinc-400 font-medium">Available Balance</p>
            <h2 className="text-4xl font-black text-white gold-gradient-text">
              {formatCurrency(walletBalance)}
            </h2>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-400">
            <span>Usable for 100% of order totals</span>
            <span className="text-amber-400 font-semibold">Instant Checkout</span>
          </div>
        </div>

        {/* Reward Points */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-black shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5 text-zinc-950">
              <Star className="w-4 h-4 fill-black" /> Loyalty Reward Points
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/10 text-black text-[10px] font-black uppercase">
              Tier 1 VIP
            </span>
          </div>

          <div className="mt-6 space-y-1">
            <p className="text-xs text-zinc-900/80 font-bold">Earned Points Balance</p>
            <h2 className="text-4xl font-black text-black">
              {rewardPoints.toLocaleString()} <span className="text-lg font-bold text-zinc-900">PTS</span>
            </h2>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-black/10 pt-4 text-xs text-zinc-950 font-bold">
            <span>100 Points = ₹50 Store Credit</span>
            <span className="bg-black text-amber-400 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              Auto Redeem Ready
            </span>
          </div>
        </div>
      </div>

      {/* Redeem Voucher / Gift Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-amber-500" /> Redeem Voucher or Gift Card
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">
            Have a promo card or Manoj Traders voucher code? Enter it below to add instant cash to your wallet.
          </p>
        </div>

        <form onSubmit={handleRedeemGiftCard} className="flex gap-3 max-w-md">
          <input
            type="text"
            placeholder="Enter gift voucher code (e.g. MANOJ500)"
            value={giftCardCode}
            onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm font-mono text-zinc-900 dark:text-white uppercase outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors shadow-md shadow-amber-500/20 flex-shrink-0"
          >
            Redeem Code
          </button>
        </form>
      </div>

      {/* Wallet Transaction History */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <h2 className="text-xl font-black text-zinc-900 dark:text-white">Transaction History</h2>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    tx.type === "credit"
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {tx.type === "credit" ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-zinc-900 dark:text-white">{tx.title}</p>
                  <p className="text-xs text-zinc-400">{tx.note} • {tx.date}</p>
                </div>
              </div>

              <div
                className={`font-black text-sm ${
                  tx.type === "credit" ? "text-emerald-500" : "text-zinc-900 dark:text-white"
                }`}
              >
                {tx.type === "credit" ? "+" : "-"}{formatCurrency(tx.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
