"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { MOCK_ANALYTICS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

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

export default function AdminCharts() {
  return (
    <>
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="xl:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-black text-zinc-900 dark:text-white">Revenue Trend</h2>
            <span className="text-xs text-zinc-400">Last 8 Months</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={MOCK_ANALYTICS.revenueByMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2.5} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
          <h2 className="text-base font-black text-zinc-900 dark:text-white mb-6">Sales by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={MOCK_ANALYTICS.salesByCategory}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {MOCK_ANALYTICS.salesByCategory.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {MOCK_ANALYTICS.salesByCategory.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-zinc-600 dark:text-zinc-400 truncate max-w-[120px]">{cat.name}</span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-white">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Monthly Sales Bar Chart */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-black text-zinc-900 dark:text-white">Monthly Sales Volume</h2>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MOCK_ANALYTICS.revenueByMonth} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#D4AF37" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Inventory Status
            </h2>
            <Link href="/admin/products" className="text-xs font-bold text-amber-500 hover:underline">
              Manage Inventory
            </Link>
          </div>
          <div className="space-y-4">
            {MOCK_ANALYTICS.inventoryStatus.map((item) => {
              const total = item.inStock + item.lowStock;
              const pct = Math.round((item.inStock / total) * 100);
              return (
                <div key={item.category}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate">{item.category}</span>
                    <span className="font-bold text-zinc-900 dark:text-white flex-shrink-0 ml-2">{item.inStock} in stock</span>
                  </div>
                  <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${pct > 70 ? "bg-emerald-500" : pct > 40 ? "bg-amber-500" : "bg-rose-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  {item.lowStock > 0 && (
                    <p className="text-[10px] text-rose-500 font-bold mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {item.lowStock} low-stock items
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
