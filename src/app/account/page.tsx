"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useAuthStore } from "@/lib/authStore";
import { Package, MapPin, Heart, Wallet, RotateCcw, ArrowRight, TrendingUp, Star } from "lucide-react";
import { MOCK_ORDERS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import DeleteAccountButton from "@/app/account/DeleteAccountButton";

const QUICK_STATS = [
  { label: "Total Orders", value: "3", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Wallet Balance", value: "₹1,500", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Reward Points", value: "340 pts", icon: Star, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Wishlist Items", value: "0", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
];

const QUICK_LINKS = [
  { href: "/account/orders", label: "Track My Orders", icon: Package, sub: "View order history & tracking" },
  { href: "/account/addresses", label: "Manage Addresses", icon: MapPin, sub: "Add or edit delivery addresses" },
  { href: "/account/returns", label: "Return & Refund", icon: RotateCcw, sub: "Initiate returns & refunds" },
];

export default function AccountDashboardPage() {
  const { user } = useUser();
  const { user: authUser } = useAuthStore();
  const displayName = authUser?.fullName || user?.firstName || "Valued Member";
  const recentOrder = MOCK_ORDERS[0];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-amber-500/20 dark:to-amber-600/10 rounded-3xl p-8 border border-amber-500/10">
        <h1 className="text-2xl font-black text-white mb-1">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-zinc-400 dark:text-zinc-300 text-sm">
          Your luxury account dashboard. Manage orders, addresses, and rewards.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-amber-400">Luxury Member</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">• 340 reward points • ₹1,500 wallet balance</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {QUICK_STATS.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-black/5 dark:border-white/10 shadow-sm flex flex-col gap-3">
            <div className={`w-10 h-10 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</div>
              <div className="text-xs text-zinc-500 font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Order */}
      {recentOrder && (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-zinc-900 dark:text-white">Latest Order</h2>
            <Link href="/account/orders" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-black/5 dark:border-white/10">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 border border-black/5 flex-shrink-0">
              <img src={recentOrder.items[0].image} alt={recentOrder.items[0].name} className="w-full h-full object-contain p-2" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">{recentOrder.items[0].name}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Order #{recentOrder.orderNumber}</p>
                  <p className="text-[10px] text-zinc-400">{new Date(recentOrder.createdAt).toLocaleDateString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-600 dark:text-amber-400">{formatCurrency(recentOrder.total)}</span>
                  <div className="mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      recentOrder.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" :
                      recentOrder.status === "Shipped" ? "bg-blue-500/10 text-blue-500" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      {recentOrder.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {QUICK_LINKS.map(({ href, label, icon: Icon, sub }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-black/5 dark:border-white/10 hover:border-amber-500/30 transition-all shadow-sm hover:shadow-luxury flex flex-col gap-3"
          >
            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <Icon className="w-5 h-5 text-zinc-700 dark:text-zinc-300 group-hover:text-black transition-colors" />
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">{label}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{sub}</div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-700 group-hover:text-amber-500 transition-colors" />
          </Link>
        ))}
      </div>
      <DeleteAccountButton />
    </div>
  );
}
