"use client";

import { useState, useEffect, useCallback } from "react";
import { useOrderStore } from "@/lib/store";
import { Order, OrderStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { getOrdersFromStore } from "@/lib/firestore";
import {
  Package,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Printer,
  ChevronRight,
  ShieldCheck,
  XCircle,
  Phone,
  User,
  MapPin,
  Sparkles,
  ArrowRight,
  Check,
  LayoutList,
  LayoutGrid,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

// Fulfillment Progression Workflow
const FULFILLMENT_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "Placed", label: "Placed" },
  { status: "Confirmed", label: "Confirmed" },
  { status: "Packed", label: "Packed" },
  { status: "Shipped", label: "Shipped" },
  { status: "Out for Delivery", label: "Out for Delivery" },
  { status: "Delivered", label: "Delivered" },
];

function getNextAction(status: OrderStatus): { nextStatus: OrderStatus; label: string; bg: string } | null {
  switch (status) {
    case "Placed":
      return { nextStatus: "Confirmed", label: "Step 1: Confirm Order", bg: "bg-indigo-600 hover:bg-indigo-500 text-white" };
    case "Confirmed":
      return { nextStatus: "Packed", label: "Step 2: Mark Packed", bg: "bg-purple-600 hover:bg-purple-500 text-white" };
    case "Packed":
      return { nextStatus: "Shipped", label: "Step 3: Ship Package", bg: "bg-cyan-600 hover:bg-cyan-500 text-white" };
    case "Shipped":
      return { nextStatus: "Out for Delivery", label: "Step 4: Mark Out for Delivery", bg: "bg-amber-500 hover:bg-amber-400 text-zinc-950" };
    case "Out for Delivery":
      return { nextStatus: "Delivered", label: "Step 5: Mark Delivered", bg: "bg-emerald-600 hover:bg-emerald-500 text-white" };
    default:
      return null;
  }
}

export default function AdminOrdersPage() {
  const { orders: rawOrders, setOrders, updateOrderStatus } = useOrderStore();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchLatestOrders = useCallback(async (showToast = false) => {
    setIsRefreshing(true);
    try {
      const liveOrders = await getOrdersFromStore();
      if (liveOrders && liveOrders.length > 0) {
        setOrders(liveOrders);
        if (showToast) toast.success(`Synced ${liveOrders.length} orders from database!`);
      }
    } catch (err) {
      console.error("Failed to fetch latest orders:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [setOrders]);

  useEffect(() => {
    fetchLatestOrders();

    // Set up real-time listener for Firestore orders
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
      console.error("Firestore onSnapshot listener error:", err);
    }
  }, [fetchLatestOrders, setOrders]);

  // Deduplicate orders by unique ID and order number
  const orders = Array.from(
    new Map(rawOrders.map((o) => [o.id || o.orderNumber, o])).values()
  );

  // Category counts
  const totalCount = orders.length;
  const actionNeededCount = orders.filter(
    (o) => o.paymentStatus === "Pending Verification" || o.status === "Cancellation Requested"
  ).length;
  const processingCount = orders.filter((o) => ["Placed", "Confirmed", "Packed"].includes(o.status)).length;
  const inTransitCount = orders.filter((o) => ["Shipped", "Out for Delivery"].includes(o.status)).length;
  const completedCount = orders.filter((o) => o.status === "Delivered").length;
  const cancelledCount = orders.filter((o) => ["Cancelled", "Refunded"].includes(o.status)).length;

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery.trim() ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.upiUtr && o.upiUtr.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesTab = true;
    if (activeTab === "action_needed") {
      matchesTab = o.paymentStatus === "Pending Verification" || o.status === "Cancellation Requested";
    } else if (activeTab === "processing") {
      matchesTab = ["Placed", "Confirmed", "Packed"].includes(o.status);
    } else if (activeTab === "in_transit") {
      matchesTab = ["Shipped", "Out for Delivery"].includes(o.status);
    } else if (activeTab === "completed") {
      matchesTab = o.status === "Delivered";
    } else if (activeTab === "cancelled") {
      matchesTab = ["Cancelled", "Refunded"].includes(o.status);
    }

    return matchesSearch && matchesTab;
  });

  const handleNextStep = (orderId: string, currentStatus: OrderStatus) => {
    const next = getNextAction(currentStatus);
    if (next) {
      updateOrderStatus(orderId, next.nextStatus, `Order status advanced to ${next.nextStatus}`);
      toast.success(`Order status updated to ${next.nextStatus}! 🎉`);
    }
  };

  const handleApproveUPI = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      targetOrder.paymentStatus = "Paid";
      targetOrder.status = "Confirmed";
    }
    updateOrderStatus(orderId, "Confirmed", "UPI Payment verified and confirmed by Admin");
    toast.success(`UPI Payment verified! Order #${targetOrder?.orderNumber || orderId} confirmed.`);
  };

  const handleApproveCancellation = (orderId: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      targetOrder.paymentStatus = "Refunded";
      targetOrder.status = "Cancelled";
    }
    updateOrderStatus(orderId, "Cancelled", "Cancellation approved and refund processed by Admin");
    toast.success(`Cancellation approved & refund processed for Order #${targetOrder?.orderNumber || orderId}!`);
  };

  const handleCopyAddress = (address: any) => {
    const text = `${address?.fullName}\n${address?.streetAddress}, ${address?.city}, ${address?.state} - ${address?.pincode}\nPhone: ${address?.phone}`;
    navigator.clipboard.writeText(text);
    toast.success("Shipping address copied for courier label!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <span className="text-[10px] font-mono font-extrabold text-amber-500 uppercase tracking-widest">
            Seller Order Manager
          </span>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2 mt-0.5">
            <Package className="w-6 h-6 text-amber-500" /> Orders Fulfillment Console
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Easy 1-click order fulfillment, payment verification, and shipping label copy.
          </p>
        </div>

        {/* Search Bar & Refresh Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 shadow-sm w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search Order #, Customer, UTR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400"
            />
          </div>
          <button
            onClick={() => fetchLatestOrders(true)}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-sm transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
            title="Sync latest orders from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync DB"}</span>
          </button>
        </div>
      </div>

      {/* User-Friendly Tab Bar & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
          {[
            { id: "all", label: "All Orders", count: totalCount },
            { id: "action_needed", label: "⚡ Action Required", count: actionNeededCount, badge: "amber" },
            { id: "processing", label: "📦 Processing", count: processingCount },
            { id: "in_transit", label: "🚚 In Transit", count: inTransitCount },
            { id: "completed", label: "✅ Delivered", count: completedCount },
            { id: "cancelled", label: "❌ Cancelled", count: cancelledCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeTab === tab.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md font-black"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  tab.badge === "amber" && tab.count > 0
                    ? "bg-amber-500 text-zinc-950 animate-pulse"
                    : activeTab === tab.id
                    ? "bg-amber-500 text-zinc-950"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* View Switcher Buttons (List vs Detailed Cards) */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex-shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "list"
                ? "bg-amber-500 text-black shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title="List View"
          >
            <LayoutList className="w-4 h-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "cards"
                ? "bg-amber-500 text-black shadow-sm"
                : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            }`}
            title="Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Cards</span>
          </button>
        </div>
      </div>

      {/* Orders Display */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-2">
          <Package className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 stroke-[1.5]" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">No orders found in this section</h3>
          <p className="text-xs text-zinc-500">Select another tab above or clear your search query.</p>
        </div>
      ) : viewMode === "list" ? (
        /* 1. COMPACT ORDERS LIST VIEW */
        <div className="space-y-3">
          {filteredOrders.map((o, idx) => {
            const nextAction = getNextAction(o.status);

            return (
              <div
                key={`${o.id || o.orderNumber}-${idx}`}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Order ID & Customer Info */}
                <div className="space-y-1 min-w-[220px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
                      #{o.orderNumber}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <span>{o.customerName}</span>
                    <span className="text-zinc-400 font-normal">• {o.customerPhone}</span>
                  </div>

                  <div className="text-[11px] text-zinc-400 truncate max-w-[240px]">
                    {o.shippingAddress?.city}, {o.shippingAddress?.state}
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px] overflow-hidden">
                  <div className="flex -space-x-2 overflow-hidden py-1">
                    {o.items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="w-9 h-9 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex-shrink-0"
                        title={item.name}
                      >
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                      {o.items[0]?.name} {o.items.length > 1 && `+${o.items.length - 1} more`}
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      {o.items.reduce((s, i) => s + i.quantity, 0)} total item(s)
                    </div>
                  </div>
                </div>

                {/* Amount & Payment */}
                <div className="min-w-[130px] space-y-0.5 text-left lg:text-right">
                  <div className="font-black text-sm text-zinc-900 dark:text-white">
                    {formatCurrency(o.total)}
                  </div>
                  <div className="text-[11px] text-zinc-500 font-semibold flex items-center lg:justify-end gap-1">
                    <span>{o.paymentMethod}</span>
                    {o.paymentStatus === "Paid" ? (
                      <span className="text-emerald-500 font-bold">✓ Paid</span>
                    ) : o.paymentStatus === "Pending Verification" ? (
                      <span className="text-amber-500 font-bold">UTR Verify</span>
                    ) : (
                      <span className="text-zinc-400 font-medium">({o.paymentStatus})</span>
                    )}
                  </div>
                  {o.upiUtr && (
                    <div className="text-[10px] font-mono text-amber-500 truncate">
                      UTR: {o.upiUtr}
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="min-w-[130px] text-left lg:text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${
                      o.status === "Delivered"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        : o.status === "Cancelled"
                        ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                        : o.status === "Cancellation Requested"
                        ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 animate-pulse"
                        : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Quick Next Action Button */}
                <div className="flex items-center gap-2 justify-end">
                  {o.paymentStatus === "Pending Verification" ? (
                    <button
                      onClick={() => handleApproveUPI(o.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-black text-xs hover:bg-emerald-400 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve UPI
                    </button>
                  ) : o.status === "Cancellation Requested" ? (
                    <button
                      onClick={() => handleApproveCancellation(o.id)}
                      className="px-3.5 py-2 rounded-xl bg-rose-500 text-white font-black text-xs hover:bg-rose-600 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Cancel
                    </button>
                  ) : nextAction ? (
                    <button
                      onClick={() => handleNextStep(o.id, o.status)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-colors shadow-sm whitespace-nowrap flex items-center gap-1 ${nextAction.bg}`}
                    >
                      <Check className="w-3.5 h-3.5" /> {nextAction.label}
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Fulfilled
                    </span>
                  )}

                  <Link
                    href={`/track?orderId=${o.orderNumber}`}
                    target="_blank"
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-amber-500 transition-colors"
                    title="Open Live GPS Tracking Screen"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 2. DETAILED FULFILLMENT CARDS VIEW */
        <div className="space-y-6">
          {filteredOrders.map((o, idx) => {
            const nextAction = getNextAction(o.status);
            const currentStepIdx = FULFILLMENT_STEPS.findIndex((s) => s.status === o.status);

            return (
              <div
                key={`${o.id}-${idx}`}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden space-y-0"
              >
                {/* Clean Top Banner */}
                <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-mono font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3.5 py-1 rounded-xl border border-amber-500/20">
                      Order #{o.orderNumber}
                    </span>
                    <span className="text-xs text-zinc-500 font-semibold">
                      Placed: {new Date(o.createdAt).toLocaleString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-zinc-900 dark:text-white">
                      {formatCurrency(o.total)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black border ${
                        o.status === "Delivered"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                          : o.status === "Cancelled"
                          ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                          : o.status === "Cancellation Requested"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40 animate-pulse"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                </div>

                {/* ACTION REQUIRED BANNER 1: UPI Verification */}
                {o.paymentStatus === "Pending Verification" && (
                  <div className="p-4 bg-amber-500/15 border-b border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-amber-700 dark:text-amber-300 text-xs">
                      <AlertCircle className="w-6 h-6 flex-shrink-0 animate-bounce text-amber-500" />
                      <div>
                        <strong className="text-sm font-black text-zinc-900 dark:text-white block">
                          UPI Payment Verification Needed
                        </strong>
                        <span>
                          Customer submitted UTR Reference Number: <strong className="font-mono text-amber-600 dark:text-amber-400 underline">{o.upiUtr || "N/A"}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApproveUPI(o.id)}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-500 text-zinc-950 font-black text-xs hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" /> Confirm UPI Payment (Mark Paid)
                    </button>
                  </div>
                )}

                {/* ACTION REQUIRED BANNER 2: Cancellation Approval */}
                {o.status === "Cancellation Requested" && (
                  <div className="p-4 bg-rose-500/15 border-b border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <strong className="text-sm font-black text-rose-600 dark:text-rose-400 block">
                        Customer Requested Cancellation & Refund
                      </strong>
                      <p className="text-zinc-700 dark:text-zinc-300">
                        Reason: <strong>{o.cancellationReason || "Not specified"}</strong>
                      </p>
                      {o.refundDetails?.method === "UPI" && (
                        <p className="font-mono text-zinc-600 dark:text-zinc-400">
                          Refund UPI VPA: <strong className="text-amber-500">{o.refundDetails.upiId}</strong>
                        </p>
                      )}
                      {o.refundDetails?.method === "Bank" && (
                        <p className="font-mono text-zinc-600 dark:text-zinc-400">
                          Bank: {o.refundDetails.accountHolderName} • Acc: {o.refundDetails.accountNumber} (IFSC: {o.refundDetails.ifscCode})
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleApproveCancellation(o.id)}
                      className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white font-black text-xs hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Check className="w-4 h-4" /> Approve Cancellation & Refund
                    </button>
                  </div>
                )}

                {/* Visual Fulfillment Step Progression Bar */}
                {!["Cancelled", "Returned", "Refunded"].includes(o.status) && (
                  <div className="p-4 bg-zinc-50/50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between overflow-x-auto pb-1 gap-2 scrollbar-none">
                      {FULFILLMENT_STEPS.map((step, sIdx) => {
                        const isDone = sIdx <= currentStepIdx;
                        const isCurrent = sIdx === currentStepIdx;

                        return (
                          <div key={step.status} className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-1.5">
                              <div
                                className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                                  isDone
                                    ? "bg-amber-500 text-zinc-950"
                                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                                }`}
                              >
                                {isDone ? "✓" : sIdx + 1}
                              </div>
                              <span
                                className={`text-[11px] font-bold ${
                                  isCurrent
                                    ? "text-amber-600 dark:text-amber-400 font-extrabold"
                                    : isDone
                                    ? "text-zinc-800 dark:text-zinc-200"
                                    : "text-zinc-400"
                                }`}
                              >
                                {step.label}
                              </span>
                            </div>
                            {sIdx < FULFILLMENT_STEPS.length - 1 && (
                              <ChevronRight className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-700 flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Main Card 2-Column Content */}
                <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Left Column: Items List */}
                  <div className="space-y-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                      Ordered Products ({o.items.length})
                    </span>

                    <div className="space-y-2.5">
                      {o.items.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200/60 dark:border-zinc-800"
                        >
                          <div className="relative w-12 h-12 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-zinc-900 dark:text-white truncate">{item.name}</h5>
                            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                              Qty: {item.quantity} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Customer Shipping Address */}
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold uppercase tracking-wider text-zinc-400">Delivery Address</span>
                      <button
                        onClick={() => handleCopyAddress(o.shippingAddress)}
                        className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy Address
                      </button>
                    </div>

                    <div>
                      <p className="font-extrabold text-zinc-900 dark:text-white text-sm">{o.customerName}</p>
                      <p className="text-zinc-500">{o.customerEmail}</p>
                      <p className="text-zinc-500 font-mono font-bold mt-0.5">Phone: {o.customerPhone || o.shippingAddress?.phone}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                      <p className="font-medium">
                        {o.shippingAddress?.streetAddress}, {o.shippingAddress?.city}, {o.shippingAddress?.state} - {o.shippingAddress?.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Controls */}
                <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-zinc-500">Payment Method:</span>
                    <span className="font-black text-zinc-900 dark:text-white">{o.paymentMethod}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      o.paymentStatus === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Invoice
                    </button>

                    <Link
                      href={`/track?order=${o.orderNumber}`}
                      className="px-3.5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 hover:text-amber-500 text-xs font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-500" /> Live GPS Map
                    </Link>

                    {/* 1-Click Next Step Action Button */}
                    {nextAction && (
                      <button
                        onClick={() => handleNextStep(o.id, o.status)}
                        className={`px-5 py-2.5 rounded-2xl font-black text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${nextAction.bg}`}
                      >
                        {nextAction.label} <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
