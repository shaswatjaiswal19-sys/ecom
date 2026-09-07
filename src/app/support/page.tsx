"use client";

import Link from "next/link";
import { HeadphonesIcon, ShieldCheck, Truck, RotateCcw, FileText, MessageSquare } from "lucide-react";

export default function SupportPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Help & Support Hub</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Everything you need for order assistance, returns, warranty claims, and account support.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Link
          href="/faq"
          className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm hover:border-amber-500/50 transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">FAQ Center</h3>
          <p className="text-xs text-zinc-400">Read quick answers to top questions about products and shipping.</p>
        </Link>

        <Link
          href="/account/tickets"
          className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm hover:border-amber-500/50 transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <HeadphonesIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Support Tickets</h3>
          <p className="text-xs text-zinc-400">Open a direct ticket with our luxury concierge support team.</p>
        </Link>

        <Link
          href="/account/returns"
          className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm hover:border-amber-500/50 transition-all space-y-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Returns & Pickups</h3>
          <p className="text-xs text-zinc-400">Request doorstep pickup and track refund status easily.</p>
        </Link>
      </div>
    </div>
  );
}
