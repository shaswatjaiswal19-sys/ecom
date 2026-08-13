"use client";

import dynamic from "next/dynamic";
import { MOCK_ANALYTICS, MOCK_ORDERS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp, ShoppingCart, Users,
  ArrowUpRight, Download, RefreshCw
} from "lucide-react";
import Link from "next/link";

const AdminCharts = dynamic(() => import("@/components/admin/AdminCharts"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 animate-pulse flex items-center justify-center text-xs text-zinc-400">
      Loading Analytics & Charts...
    </div>
  ),
});

const KPI_CARDS = [
  {
    label: "Today's Revenue",
    value: formatCurrency(MOCK_ANALYTICS.todayRevenue),
    sub: "+12.4% vs yesterday",
    trend: "up",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    label: "Monthly Revenue",
    value: formatCurrency(MOCK_ANALYTICS.monthlyRevenue),
    sub: "+8.2% vs last month",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    label: "Total Orders",
    value: MOCK_ANALYTICS.totalOrders.toLocaleString(),
    sub: `Avg: ${formatCurrency(MOCK_ANALYTICS.avgOrderValue)}`,
    trend: "up",
    icon: ShoppingCart,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  {
    label: "Total Customers",
    value: MOCK_ANALYTICS.totalCustomers.toLocaleString(),
    sub: `Conv. Rate: ${MOCK_ANALYTICS.conversionRate}%`,
    trend: "up",
    icon: Users,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const COLORS = ["#D4AF37", "#18181B", "#3B82F6", "#8B5CF6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs shadow-xl">
        <p className="font-bold text-white mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: <strong>{p.name === "revenue" ? formatCurrency(p.value) : p.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const recentOrders = MOCK_ORDERS.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Overview of Shaswat Ecom — {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {KPI_CARDS.map((card) => (
          <div
            key={card.label}
            className={`bg-white dark:bg-zinc-900 rounded-3xl p-6 border ${card.border} shadow-sm`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 ${card.bg} rounded-2xl flex items-center justify-center`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <ArrowUpRight className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white mb-1">{card.value}</div>
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">{card.label}</div>
            <div className={`text-[10px] font-bold mt-1 ${card.color}`}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Dynamically Loaded Admin Charts */}
      <AdminCharts />

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-base font-black text-zinc-900 dark:text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-amber-500 hover:underline">
            View All Orders →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                {["Order #", "Customer", "Amount", "Items", "Payment", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={`${order.id}-${idx}`} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-zinc-900 dark:text-white">{order.customerName}</div>
                    <div className="text-[10px] text-zinc-400">{order.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-zinc-900 dark:text-white">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-600 dark:text-zinc-400">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      order.paymentStatus === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {order.paymentStatus} • {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      order.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" :
                      order.status === "Shipped" ? "bg-blue-500/10 text-blue-500" :
                      "bg-amber-500/10 text-amber-500"
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-zinc-400">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
