"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Package, MapPin, CreditCard, Download, ArrowRight, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { MOCK_ORDERS } from "@/lib/mockData";
import { useOrderStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";

interface PageProps {
  params: Promise<{ id: string }>;
}

const ORDER_STATUS_STEPS = ["Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];

export default function OrderConfirmationPage({ params }: PageProps) {
  const { id } = use(params);
  const { orders: storeOrders } = useOrderStore();
  const [order] = useState(() => {
    const foundInStore = storeOrders.find((o) => o.id === id || o.orderNumber === id);
    if (foundInStore) return foundInStore;
    const foundInMock = MOCK_ORDERS.find((o) => o.id === id || o.orderNumber === id);
    return foundInMock || storeOrders[0] || MOCK_ORDERS[0];
  });

  useEffect(() => {
    // Launch confetti celebration
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#D4AF37", "#F3E5AB", "#ffffff", "#18181B"];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const currentStatusIdx = ORDER_STATUS_STEPS.indexOf(order?.status || "Placed");

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 rounded-full bg-emerald-500/10 border-4 border-emerald-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-3">Order Confirmed! 🎉</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
            Your luxury order has been placed and will be dispatched with white-glove packaging. We&apos;ll notify you at every step.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400">
            Order #{order?.orderNumber || `MT-2026-${id.slice(-4)}`}
          </div>
        </motion.div>

        {/* Order Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm mb-6"
        >
          <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-500" /> Order Status Timeline
          </h2>

          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0" />
            <div
              className="absolute top-5 left-0 h-0.5 bg-amber-500 z-0 transition-all duration-1000"
              style={{ width: `${(currentStatusIdx / (ORDER_STATUS_STEPS.length - 1)) * 100}%` }}
            />

            {ORDER_STATUS_STEPS.map((status, i) => (
              <div key={status} className="flex flex-col items-center gap-2 relative z-10">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all text-xs font-black ${
                    i <= currentStatusIdx
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-400"
                  }`}
                >
                  {i < currentStatusIdx ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-[9px] font-bold text-center w-14 leading-tight ${i <= currentStatusIdx ? "text-amber-600 dark:text-amber-400" : "text-zinc-400"}`}>
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" />
            <span>
              Estimated Delivery: <strong className="text-zinc-900 dark:text-white">{order?.estimatedDelivery || "3-5 Business Days"}</strong>
              {order?.trackingNumber && (
                <> • Tracking: <strong className="font-mono text-zinc-900 dark:text-white">{order.trackingNumber}</strong></>
              )}
            </span>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm mb-6"
        >
          <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-5 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" /> Items Ordered
          </h2>
          <div className="space-y-3">
            {(order?.items || []).map((item, i) => (
              <div key={i} className="flex gap-4 items-center p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 border border-black/5 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1.5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">{item.name}</p>
                  {item.selectedWeight ? (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded inline-block mt-0.5">
                      Weight: {item.selectedWeight}
                    </span>
                  ) : item.variantName ? (
                    <p className="text-[10px] text-zinc-400">{item.variantName}</p>
                  ) : null}
                  <p className="text-[10px] text-zinc-500">Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Cost breakdown */}
          <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1.5 text-xs">
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Subtotal</span>
              <span>{formatCurrency(order?.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>GST</span>
              <span>{formatCurrency(order?.tax || 0)}</span>
            </div>
            <div className="flex justify-between text-zinc-500 dark:text-zinc-400">
              <span>Shipping</span>
              <span className="text-emerald-500 font-bold">FREE</span>
            </div>
            <div className="flex justify-between font-black text-sm text-zinc-900 dark:text-white pt-1.5 border-t border-zinc-200 dark:border-zinc-800">
              <span>Total Paid</span>
              <span className="text-amber-600 dark:text-amber-400">{formatCurrency(order?.total || 0)}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping Details */}
        {order?.shippingAddress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm mb-6"
          >
            <h2 className="text-sm font-black text-zinc-900 dark:text-white mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" /> Shipping To
            </h2>
            <address className="not-italic text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
              <p className="font-bold text-zinc-900 dark:text-white">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.phone}</p>
            </address>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/account/orders"
            className="flex-1 py-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-sm hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            Track Orders <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => window.print()}
            className="flex-1 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:border-amber-500 hover:text-amber-500 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Download Invoice
          </button>
          <Link
            href="/shop"
            className="flex-1 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:border-zinc-400 transition-all flex items-center justify-center gap-2"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
