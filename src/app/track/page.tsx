"use client";

import { useState } from "react";
import { useOrderStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Search, Package, Truck, CheckCircle2, Clock, XCircle, ShieldCheck, MapPin, Calendar, ArrowRight, Download, Phone, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import LiveTrackingMap from "@/components/shop/LiveTrackingMap";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Placed: { color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock },
  Confirmed: { color: "text-indigo-500", bg: "bg-indigo-500/10", icon: CheckCircle2 },
  Packed: { color: "text-purple-500", bg: "bg-purple-500/10", icon: Package },
  Shipped: { color: "text-cyan-500", bg: "bg-cyan-500/10", icon: Truck },
  "Out for Delivery": { color: "text-amber-500", bg: "bg-amber-500/10", icon: Truck },
  Delivered: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  Cancelled: { color: "text-rose-500", bg: "bg-rose-500/10", icon: XCircle },
};

const ORDER_STATUS_STEPS = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function PublicOrderTrackerPage() {
  const { orders: storeOrders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error("Please enter an Order ID or Phone Number");
      return;
    }

    const query = searchQuery.trim().toLowerCase();
    const found = storeOrders.find(
      (o) =>
        o.orderNumber.toLowerCase() === query ||
        o.id.toLowerCase() === query ||
        o.customerPhone.includes(query) ||
        o.customerEmail.toLowerCase() === query
    );

    setHasSearched(true);
    if (found) {
      setSearchedOrder(found);
      toast.success("Live order tracking status loaded!");
    } else {
      setSearchedOrder(null);
      toast.error("No order found with that ID or Phone Number");
    }
  };

  const activeOrder = searchedOrder || storeOrders[0];
  const cfg = STATUS_CONFIG[activeOrder.status] || STATUS_CONFIG["Placed"];
  const StatusIcon = cfg.icon;
  const currentStepIdx = ORDER_STATUS_STEPS.indexOf(activeOrder.status);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-extrabold uppercase tracking-widest border border-amber-500/20">
            <Truck className="w-3.5 h-3.5" /> 24-Hour Express Order Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">Track Your Product Order</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Enter your Order ID (e.g. <strong className="text-amber-500">MT-2026-8812</strong>) or phone number to view real-time delivery status.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-4 sm:p-6 border border-black/5 dark:border-white/10 shadow-xl">
          <form onSubmit={handleTrackSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order # (e.g. MT-2026-8812) or Phone (+91...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm font-semibold outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 text-zinc-950 font-bold text-sm hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              Track Order <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Live GPS Satellite Tracking Map (Amazon/Flipkart Experience) */}
        <LiveTrackingMap
          orderNumber={activeOrder.orderNumber}
          status={activeOrder.status}
          customerAddress={`${activeOrder.shippingAddress?.streetAddress || (activeOrder.shippingAddress as any)?.addressLine1 || "City Center"}, ${activeOrder.shippingAddress?.city || "New Delhi"}`}
        />

        {/* Order Details Display Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-xl overflow-hidden">
          {/* Order Header Banner */}
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-500/5 via-transparent to-transparent">
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tracking Result</span>
              <h2 className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2 mt-0.5">
                Order #{activeOrder.orderNumber}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Placed on {new Date(activeOrder.createdAt).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-full ${cfg.bg} ${cfg.color}`}>
                <StatusIcon className="w-4 h-4" />
                {activeOrder.status}
              </span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="p-6 sm:p-8 border-b border-zinc-100 dark:border-zinc-800 space-y-6">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Live Delivery Timeline</h3>
            <div className="flex items-center justify-between relative py-2">
              <div className="absolute top-5 left-0 right-0 h-1 bg-zinc-200 dark:bg-zinc-800 z-0" />
              <div
                className="absolute top-5 left-0 h-1 bg-amber-500 z-0 transition-all duration-500"
                style={{ width: `${(Math.max(0, currentStepIdx) / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
              />
              {ORDER_STATUS_STEPS.map((s, i) => (
                <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 text-xs font-black transition-all ${
                      i <= currentStepIdx
                        ? "border-amber-500 bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30 scale-110"
                        : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {i < currentStepIdx ? "✓" : i + 1}
                  </div>
                  <span
                    className={`text-[10px] font-bold text-center w-14 leading-tight ${
                      i <= currentStepIdx ? "text-amber-500 font-extrabold" : "text-zinc-400"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {/* Estimated Delivery Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Estimated Delivery</span>
                  <p className="text-xs font-black text-zinc-900 dark:text-white">{activeOrder.estimatedDelivery || "Within 24 Hours"}</p>
                </div>
              </div>

              {activeOrder.trackingNumber && (
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Express Courier ID</span>
                    <p className="text-xs font-mono font-black text-blue-600 dark:text-blue-400">{activeOrder.trackingNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ordered Products Items List */}
          <div className="p-6 sm:p-8 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Items in Package ({activeOrder.items.length})</h3>
            <div className="space-y-3">
              {activeOrder.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800">
                  <div className="w-14 h-14 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 overflow-hidden flex-shrink-0 p-1">
                    <Image src={item.image} alt={item.name} width={56} height={56} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-zinc-900 dark:text-white">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-sm">
              <span className="font-bold text-zinc-500">Order Amount Total</span>
              <span className="text-lg font-black text-amber-500">{formatCurrency(activeOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Back to Account Link */}
        <div className="text-center">
          <Link href="/account/orders" className="text-xs font-bold text-amber-500 hover:underline">
            View All My Orders in Account Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
}
