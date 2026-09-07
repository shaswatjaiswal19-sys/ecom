"use client";

import dynamic from "next/dynamic";
import { MOCK_ANALYTICS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";
import toast from "react-hot-toast";

const AnalyticsCharts = dynamic(() => import("@/components/admin/AnalyticsCharts"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 animate-pulse flex items-center justify-center text-xs text-zinc-400">
      Loading Analytics & Financial Charts...
    </div>
  ),
});

export default function AdminAnalyticsPage() {
  const handleExportCSV = () => {
    toast.success("Downloading Revenue & Sales CSV report...");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Business Intelligence & Analytics</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Real-time financial growth metrics, sales distribution, and inventory velocity.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
        >
          <Download className="w-4 h-4" /> Export Financial Report (CSV)
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Today's Revenue</span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{formatCurrency(MOCK_ANALYTICS.todayRevenue)}</div>
          <span className="text-xs text-emerald-500 font-bold">+12.4% from yesterday</span>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Monthly Revenue</span>
          <div className="text-2xl font-black text-amber-500">{formatCurrency(MOCK_ANALYTICS.monthlyRevenue)}</div>
          <span className="text-xs text-emerald-500 font-bold">+8.2% vs last month</span>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Average Order Value</span>
          <div className="text-2xl font-black text-zinc-900 dark:text-white">{formatCurrency(MOCK_ANALYTICS.avgOrderValue)}</div>
          <span className="text-xs text-zinc-400">High luxury margin</span>
        </div>
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm space-y-2">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Conversion Rate</span>
          <div className="text-2xl font-black text-purple-500">{MOCK_ANALYTICS.conversionRate}%</div>
          <span className="text-xs text-emerald-500 font-bold">+0.6% vs benchmark</span>
        </div>
      </div>

      {/* Dynamically Loaded Analytics Charts */}
      <AnalyticsCharts />
    </div>
  );
}
