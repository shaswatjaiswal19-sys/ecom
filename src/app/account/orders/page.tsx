"use client";

import { useState, useEffect } from "react";
import { useOrderStore, useCartStore } from "@/lib/store";
import { useUser } from "@clerk/nextjs";
import { getOrdersFromStore } from "@/lib/firestore";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  AlertCircle,
  X,
  Search,
  RotateCcw,
  Star,
  ExternalLink,
  MapPin,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  Placed: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20", icon: Clock, label: "Order Placed" },
  Confirmed: { color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", icon: CheckCircle2, label: "Confirmed by Seller" },
  Packed: { color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10 border-purple-500/20", icon: Package, label: "Packed at Warehouse" },
  Shipped: { color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20", icon: Truck, label: "Shipped & En-Route" },
  "Out for Delivery": { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20 animate-pulse", icon: Truck, label: "Out for Delivery Today" },
  Delivered: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2, label: "Delivered Successfully" },
  "Cancellation Requested": { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20 animate-pulse", icon: AlertCircle, label: "Cancellation Pending Verification" },
  Cancelled: { color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10 border-rose-500/20", icon: XCircle, label: "Order Cancelled" },
};

const ORDER_STATUS_STEPS = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function OrdersPage() {
  const { user: clerkUser } = useUser();
  const { orders: rawStoreOrders, setOrders, requestCancellation } = useOrderStore();
  const { addToCart } = useCartStore();
  const { dict, formatStatus, formatWeight, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    getOrdersFromStore().then((orders) => {
      if (orders && orders.length > 0) {
        setOrders(orders);
      }
    }).catch(() => {});
  }, [setOrders]);

  // Deduplicate orders by unique ID and order number
  const storeOrders = Array.from(
    new Map(rawStoreOrders.map((o) => [o.id || o.orderNumber, o])).values()
  );

  const reasonOptions = [
    language === "hi" ? "गलती से ऑर्डर हो गया / डुप्लिकेट ऑर्डर" : "Ordered by mistake / Duplicate order",
    language === "hi" ? "कीमत कम हो गई / कहीं और सस्ता मिला" : "Item price decreased / Found cheaper price elsewhere",
    language === "hi" ? "डिलीवरी का समय बहुत लंबा है" : "Delivery time is too long",
    language === "hi" ? "गलत डिलीवरी पता या मोबाइल नंबर" : "Incorrect shipping address or mobile number",
    language === "hi" ? "भुगतान समस्या या मन बदल गया" : "Payment issue or changed mind",
    language === "hi" ? "अन्य कारण" : "Other reason",
  ];

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState<any | null>(null);
  const [reason, setReason] = useState(reasonOptions[0]);
  const [refundMethod, setRefundMethod] = useState<"UPI" | "Bank">("UPI");
  const [upiId, setUpiId] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [bankName, setBankName] = useState("");

  const filters = [
    { id: "All", label: dict.orders.allOrders },
    { id: "On the Way", label: language === "hi" ? "रास्ते में है" : "On the Way" },
    { id: "Delivered", label: dict.orders.delivered },
    { id: "Cancelled", label: dict.orders.cancelled }
  ];

  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress?.toLowerCase();
  const userId = clerkUser?.id;

  // Filter orders by status pill & search query
  const filteredOrders = storeOrders.filter((o) => {
    const matchesUser = !userEmail && !userId ? true : (
      o.userId === userId ||
      (o.customerEmail && userEmail && o.customerEmail.toLowerCase() === userEmail) ||
      o.userId === "usr-guest" || o.userId === "guest"
    );

    const matchesFilter =
      filter === "All" ||
      (filter === "On the Way" && ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery"].includes(o.status)) ||
      (filter === "Delivered" && o.status === "Delivered") ||
      (filter === "Cancelled" && ["Cancelled", "Cancellation Requested"].includes(o.status));

    const matchesSearch =
      !searchQuery.trim() ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesUser && matchesFilter && matchesSearch;
  });

  const handleReorder = (item: any) => {
    addToCart(
      {
        id: item.productId,
        slug: item.name.toLowerCase().replace(/\s+/g, "-"),
        name: item.name,
        tagline: "100% Farm Fresh & Organic",
        description: "Farm fresh organic produce harvested daily.",
        highlights: ["100% Organic", "Direct Farm", "Zero Preservatives"],
        features: ["Freshly Harvested", "Vacuum-Sealed"],
        price: item.price,
        mrp: item.price * 1.2,
        wholesalePrice: item.price * 0.8,
        discountPercentage: 20,
        gstPercentage: 5,
        category: "Atta, Rice & Organic Staples",
        brand: "Manoj Traders",
        sku: "SKU-REORDER",
        barcode: "8901234567890",
        stock: 50,
        inStock: true,
        weight: "1 kg",
        dimensions: "15x10x20 cm",
        images: [item.image],
        specifications: [],
        rating: 5,
        reviewCount: 10,
        tags: ["organic", "grocery"],
        createdAt: new Date().toISOString(),
      },
      1,
      undefined,
      item.selectedWeight
        ? {
            id: `wt-${Date.now()}`,
            weight: item.selectedWeight,
            price: item.price,
            stock: 50,
          }
        : undefined
    );
    toast.success(`Re-added "${item.name}"${item.selectedWeight ? ` (${item.selectedWeight})` : ""} to cart! 🛒`);
  };

  const handleSubmitCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingOrder) return;

    if (refundMethod === "UPI" && !upiId.trim()) {
      toast.error("Please enter a valid UPI ID for refund payout");
      return;
    }
    if (refundMethod === "Bank" && (!accountNumber.trim() || !ifscCode.trim())) {
      toast.error("Please enter your Bank Account Number and IFSC Code for refund payout");
      return;
    }

    const refundDetails = {
      method: refundMethod,
      upiId: refundMethod === "UPI" ? upiId.trim() : undefined,
      accountHolderName: refundMethod === "Bank" ? accountHolder.trim() : undefined,
      accountNumber: refundMethod === "Bank" ? accountNumber.trim() : undefined,
      ifscCode: refundMethod === "Bank" ? ifscCode.trim() : undefined,
      bankName: refundMethod === "Bank" ? bankName.trim() : undefined,
      cancellationReason: reason,
      requestedAt: new Date().toISOString(),
    };

    requestCancellation(cancellingOrder.id, reason, refundDetails);
    toast.success("Cancellation request submitted! Admin will verify and process your refund.");
    setCancellingOrder(null);
    setUpiId("");
    setAccountNumber("");
  };

  return (
    <div className="space-y-6">
      {/* Flipkart / Amazon Style Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-amber-500" /> {dict.orders.title}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {language === "hi" ? "पैकेज ट्रैक करें, इनवॉइस देखें, दोबारा ऑर्डर करें, या रिटर्न प्रबंधित करें।" : "Track packages, view tax invoices, re-order items, or manage returns & refunds."}
          </p>
        </div>

        {/* Search Orders Bar */}
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-2.5 shadow-sm w-full md:w-80">
          <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
          <input
            type="text"
            placeholder={language === "hi" ? "ऑर्डर या उत्पाद का नाम खोजें..." : "Search orders or item names..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-zinc-900 dark:text-white outline-none placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-zinc-400 hover:text-zinc-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              filter === f.id
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-md"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Orders List Display */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3">
          <Package className="w-14 h-14 mx-auto text-zinc-300 dark:text-zinc-700 stroke-[1.5]" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">{dict.orders.noOrders}</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            {language === "hi" ? "कोई अन्य उत्पाद नाम खोजें या फ़िल्टर रीसेट करें।" : "Try searching for another product name or reset your order status filter tab."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order, idx) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG["Placed"];
            const StatusIcon = cfg.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div
                key={`${order.id}-${idx}`}
                className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-lg overflow-hidden transition-all"
              >
                {/* Flipkart Header Banner */}
                <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/20">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-xs text-zinc-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>

                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="p-1.5 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
                      title="View Breakdown Details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Items List (Flipkart Style) */}
                <div className="p-5 sm:p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/60 last:border-none last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-zinc-900 dark:text-white line-clamp-1">{item.name}</h4>
                          {item.selectedWeight ? (
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full inline-block mt-0.5 border border-amber-500/20">
                              Weight: {item.selectedWeight}
                            </span>
                          ) : item.variantName ? (
                            <p className="text-xs text-zinc-400 mt-0.5">Variant: {item.variantName}</p>
                          ) : null}
                          <p className="text-xs font-semibold text-zinc-500 mt-0.5">Qty: {item.quantity} • {formatCurrency(item.price)} each</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:justify-end">
                        <button
                          onClick={() => handleReorder(item)}
                          className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-500 hover:text-black transition-colors text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Buy Again
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Summary Footer & Quick Action Buttons */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Total Paid Amount</span>
                      <span className="text-lg font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(order.total)}{" "}
                        <span className="text-xs font-normal text-zinc-500">({order.paymentMethod} • {order.paymentStatus})</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/track?order=${order.orderNumber}`}
                        className="px-4 py-2.5 rounded-2xl bg-amber-500 text-zinc-950 font-extrabold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                      >
                        <Truck className="w-4 h-4" /> Track Live GPS Map
                      </Link>

                      <button
                        onClick={() => window.print()}
                        className="px-3.5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Invoice
                      </button>

                      {["Placed", "Confirmed", "Packed"].includes(order.status) && (
                        <button
                          onClick={() => setCancellingOrder(order)}
                          className="px-3.5 py-2.5 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expandable Order Breakdown Drawer */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-dashed border-zinc-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 p-4 sm:p-5 rounded-2xl space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Shipping Address */}
                        <div className="space-y-1">
                          <span className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider block">Shipping Address</span>
                          <p className="font-semibold text-zinc-700 dark:text-zinc-300">{order.shippingAddress?.fullName}</p>
                          <p className="text-zinc-500">{order.shippingAddress?.streetAddress}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                          <p className="text-zinc-500">Phone: {order.shippingAddress?.phone}</p>
                        </div>

                        {/* Price Breakdown */}
                        <div className="space-y-1.5 bg-white dark:bg-zinc-900 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                            <span>Subtotal:</span>
                            <span className="font-semibold">{formatCurrency(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                            <span>GST (18%):</span>
                            <span className="font-semibold">{formatCurrency(order.tax)}</span>
                          </div>
                          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                            <span>Shipping Charge:</span>
                            {order.shippingFee === 0 ? (
                              <span className="font-bold text-emerald-500">FREE</span>
                            ) : (
                              <span className="font-semibold">{formatCurrency(order.shippingFee)}</span>
                            )}
                          </div>
                          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-1 flex justify-between font-black text-zinc-900 dark:text-white">
                            <span>Grand Total:</span>
                            <span className="text-amber-600 dark:text-amber-400">{formatCurrency(order.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      {order.timeline && order.timeline.length > 0 && (
                        <div>
                          <span className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider block mb-2">Order Activity Timeline</span>
                          <div className="space-y-2">
                            {order.timeline.map((t, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-[11px] text-zinc-500">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                <strong className="text-zinc-800 dark:text-zinc-200">{t.status}</strong> — {new Date(t.timestamp).toLocaleString("en-IN")} {t.note && `(${t.note})`}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Flipkart-Style Interactive Order Cancellation Modal */}
      {cancellingOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setCancellingOrder(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest">
                Flipkart / Amazon Return & Refund Portal
              </span>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                Cancel Order #{cancellingOrder.orderNumber}
              </h3>
              <p className="text-xs text-zinc-500">
                Please provide your reason and refund payout details for instant Admin verification.
              </p>
            </div>

            <form onSubmit={handleSubmitCancellation} className="space-y-5">
              {/* Select Reason */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Select Reason for Cancellation <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                >
                  {reasonOptions.map((opt: string) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Refund Method Choice */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
                  Where Should We Refund Your Amount ({formatCurrency(cancellingOrder.total)})? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRefundMethod("UPI")}
                    className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      refundMethod === "UPI"
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                    }`}
                  >
                    📱 Instant UPI Payout
                  </button>

                  <button
                    type="button"
                    onClick={() => setRefundMethod("Bank")}
                    className={`py-3 rounded-2xl text-xs font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      refundMethod === "Bank"
                        ? "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "border-zinc-200 dark:border-zinc-800 text-zinc-500"
                    }`}
                  >
                    🏦 Bank NEFT / IMPS
                  </button>
                </div>
              </div>

              {/* Refund Account Details Input */}
              {refundMethod === "UPI" ? (
                <div className="space-y-1.5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">
                    Your UPI ID (VPA) for Refund <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210@paytm or yourname@ybl"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono font-bold text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                  <p className="text-[10px] text-zinc-400">Admin will transfer ₹{cancellingOrder.total} directly to this UPI ID upon approval.</p>
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">Account Holder Name</label>
                    <input
                      type="text"
                      placeholder="Name as per bank passbook"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">Account Number</label>
                      <input
                        type="text"
                        placeholder="Account Number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-zinc-700 dark:text-zinc-300 mb-1">IFSC Code</label>
                      <input
                        type="text"
                        placeholder="e.g. SBIN0001234"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-mono text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingOrder(null)}
                  className="flex-1 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-xs hover:border-zinc-400"
                >
                  Keep Order
                </button>

                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20 flex items-center justify-center gap-1.5"
                >
                  Confirm Cancellation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
