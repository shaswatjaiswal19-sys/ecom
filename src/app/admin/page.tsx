"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/lib/utils";
import { useOrderStore } from "@/lib/store";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getOrdersFromStore } from "@/lib/firestore";
import { Order } from "@/types";
import {
  TrendingUp, ShoppingCart, Users,
  ArrowUpRight, Download, RefreshCw
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const AdminCharts = dynamic(() => import("@/components/admin/AdminCharts"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 animate-pulse flex items-center justify-center text-xs text-zinc-400">
      Loading Analytics & Charts...
    </div>
  ),
});

export default function AdminDashboard() {
  const { orders: rawOrders, setOrders } = useOrderStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOrders = useCallback(async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const liveOrders = await getOrdersFromStore();
      if (liveOrders && liveOrders.length > 0) {
        setOrders(liveOrders);
        if (showToast) toast.success(`Synced ${liveOrders.length} orders from database!`);
      }
    } catch (err) {
      console.error("Failed to sync orders:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [setOrders]);

  useEffect(() => {
    fetchOrders();

    try {
      const unsubscribe = onSnapshot(collection(db, "orders"), (snapshot) => {
        const liveOrders: Order[] = [];
        snapshot.forEach((docSnap) => {
          liveOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        if (liveOrders.length > 0) {
          liveOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(liveOrders);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.error("Dashboard onSnapshot error:", err);
    }
  }, [fetchOrders, setOrders]);

  const orders = Array.from(
    new Map(rawOrders.map((o) => [o.id || o.orderNumber, o])).values()
  );

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? (o.total || 0) : 0), 0);
  const totalOrdersCount = orders.length;
  const uniqueCustomers = new Set(orders.map((o) => o.customerEmail || o.userId)).size;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  const KPI_CARDS = [
    {
      label: "Total Store Revenue",
      value: formatCurrency(totalRevenue),
      sub: `${orders.filter((o) => o.paymentStatus === "Paid").length} Paid Orders`,
      trend: "up",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Total Orders Placed",
      value: totalOrdersCount.toLocaleString(),
      sub: `Avg: ${formatCurrency(avgOrderValue)}`,
      trend: "up",
      icon: ShoppingCart,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
    {
      label: "Active Customers",
      value: uniqueCustomers.toLocaleString(),
      sub: "Verified buyers",
      trend: "up",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      label: "Pending Verification",
      value: orders.filter((o) => o.paymentStatus === "Pending Verification").length.toString(),
      sub: "Action required",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
  ];

  const recentOrders = orders.slice(0, 5);

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
          <button
            onClick={() => fetchOrders(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Refresh"}</span>
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
