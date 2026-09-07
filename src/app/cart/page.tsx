"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, Gift, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartPage() {
  const {
    cart, removeFromCart, updateQuantity, clearCart,
    couponCode, discountAmount, applyCoupon, removeCoupon, getCartTotal,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const { subtotal, tax, total, itemCount } = getCartTotal();
  const shippingFee = subtotal > 5000 ? 0 : 199;
  const finalTotal = total + shippingFee;

  const handleApply = () => {
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
    setCouponInput("");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24 bg-white dark:bg-zinc-950">
        <ShoppingBag className="w-20 h-20 stroke-[1] text-zinc-200 dark:text-zinc-800 mb-6" />
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">Your Cart is Empty</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
          Add items from our luxury catalog to see them here. Explore our curated collections!
        </p>
        <Link
          href="/shop"
          className="px-8 py-4 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg flex items-center gap-2"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Your Cart</h1>
            <p className="text-sm text-zinc-500 mt-1">{itemCount} item{itemCount !== 1 ? "s" : ""} in your luxury selection</p>
          </div>
          <button
            onClick={() => { clearCart(); toast.success("Cart cleared."); }}
            className="text-xs text-rose-500 font-semibold hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              const price = item.selectedVariant?.price || item.product.price;
              const mrp = item.selectedVariant?.mrp || item.product.mrp;
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || idx}`}
                  className="flex gap-5 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm hover:shadow-luxury transition-all group"
                >
                  {/* Product Image */}
                  <Link href={`/shop/${item.product.slug}`} className="relative w-28 h-28 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 flex-shrink-0 border border-black/5 dark:border-white/5">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">{item.product.brand}</span>
                          <Link href={`/shop/${item.product.slug}`}>
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white hover:text-amber-500 transition-colors line-clamp-1 mt-0.5">
                              {item.product.name}
                            </h3>
                          </Link>
                          {item.selectedVariant ? (
                            <p className="text-xs text-zinc-400 mt-0.5">Variant: {item.selectedVariant.name}</p>
                          ) : item.product.weight ? (
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Pack: {item.product.weight}</p>
                          ) : null}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id)}
                          className="text-zinc-300 dark:text-zinc-700 hover:text-rose-500 dark:hover:text-rose-500 transition-colors p-1 flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2 mt-3">
                      {/* Price */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-zinc-900 dark:text-white">{formatCurrency(price)}</span>
                        {mrp > price && (
                          <span className="text-xs text-zinc-400 line-through">{formatCurrency(mrp)}</span>
                        )}
                      </div>

                      {/* Qty Controller */}
                      <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id)}
                          className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-black text-zinc-900 dark:text-white w-6 text-center tabular-nums">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id)}
                          className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <span className="text-sm font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Gift Wrap Option */}
            <div className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-amber-500/30">
              <Gift className="w-8 h-8 text-amber-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Add Premium Gift Wrapping</h4>
                <p className="text-xs text-zinc-500">Luxury matte-black box with gold ribbon & personalized message card — ₹299</p>
              </div>
              <button className="ml-auto px-4 py-2 rounded-xl border border-amber-500 text-amber-500 text-xs font-bold hover:bg-amber-500 hover:text-black transition-colors flex-shrink-0">
                Add Gift Wrap
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            {/* Coupon Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" /> Promo Code
              </h3>
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    ✓ {couponCode} — saving {formatCurrency(discountAmount)}
                  </span>
                  <button onClick={removeCoupon} className="text-rose-500 text-[10px] font-bold hover:underline">Remove</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Code (e.g., MANOJ10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                  <button
                    onClick={handleApply}
                    className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              <p className="text-[10px] text-zinc-400 mt-2">Try: <strong>MANOJ10</strong>, <strong>WELCOME10</strong>, or <strong>LUXURY500</strong></p>
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">Order Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Coupon Savings</span>
                    <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>GST (18%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Express Shipping
                  </span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-500">FREE</span>
                  ) : (
                    <span className="font-semibold">{formatCurrency(shippingFee)}</span>
                  )}
                </div>
                {shippingFee > 0 && (
                  <p className="text-[10px] text-zinc-400">Add {formatCurrency(5000 - subtotal)} more for free shipping</p>
                )}

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between">
                  <span className="text-base font-black text-zinc-900 dark:text-white">Total Amount</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">{formatCurrency(finalTotal)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-5 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-amber-500/20 hover:-translate-y-0.5"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                256-bit SSL Encrypted Secure Checkout
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/shop"
              className="w-full py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-bold flex items-center justify-center gap-2 hover:border-amber-500 hover:text-amber-500 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
