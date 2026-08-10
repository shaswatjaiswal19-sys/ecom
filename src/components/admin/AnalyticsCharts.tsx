"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { MOCK_ANALYTICS } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#D4AF37", "#18181B", "#3B82F6", "#8B5CF6", "#10B981"];

export default function AnalyticsCharts() {
  return (
    <>
      {/* Chart 1: Revenue Monthly Trend Area Chart */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-zinc-900 dark:text-white">Revenue Trend (2026 YTD)</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_ANALYTICS.revenueByMonth}>
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="month" stroke="#a1a1aa" fontSize={12} />
              <YAxis stroke="#a1a1aa" fontSize={12} />
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
              <Area type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#goldGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid Charts: Sales Category Pie & Inventory Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Sales Distribution by Category</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_ANALYTICS.salesByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value">
                  {MOCK_ANALYTICS.salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => `₹${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm space-y-4">
          <h2 className="text-lg font-black text-zinc-900 dark:text-white">Inventory Velocity & Low Stock Alerts</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_ANALYTICS.inventoryStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="category" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} />
                <Tooltip />
                <Bar dataKey="inStock" fill="#10B981" name="In Stock Units" radius={[6, 6, 0, 0]} />
                <Bar dataKey="lowStock" fill="#EF4444" name="Low Stock Units" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
