"use client";

import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    toggleCartDrawer,
    removeFromCart,
    updateQuantity,
    couponCode,
    discountAmount,
    applyCoupon,
    removeCoupon,
    getCartTotal,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState("");

  const { subtotal, tax, total } = getCartTotal();

  if (!isCartOpen) return null;

  const handleApplyCoupon = () => {
    if (!inputCoupon) return;
    const res = applyCoupon(inputCoupon);
    if (res.success) {
      toast.success(res.message);
      setInputCoupon("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => toggleCartDrawer(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-full sm:max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between border-l border-black/5 dark:border-white/10 z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white">Kirana Cart</h2>
            <span className="text-xs bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
              {cart.length} items
            </span>
          </div>
          <button
            onClick={() => toggleCartDrawer(false)}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <ShoppingBag className="w-14 h-14 stroke-[1] mb-3 text-zinc-300 dark:text-zinc-700" />
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Your cart is empty
              </p>
              <p className="text-xs text-zinc-500 mt-1 mb-5">
                Discover our fresh organic collection and add your essentials.
              </p>
              <Link
                href="/shop"
                onClick={() => toggleCartDrawer(false)}
                className="px-6 py-3 rounded-2xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors shadow-md"
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            cart.map((item, idx) => {
              const price = item.selectedWeight?.price || item.selectedVariant?.price || item.product.price;
              const weightId = item.selectedWeight?.id || item.selectedWeight?.weight;
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || ""}-${weightId || idx}`}
                  className="flex gap-3 p-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors bg-zinc-50/50 dark:bg-zinc-900/50"
                >
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 flex-shrink-0 border border-black/5 dark:border-white/5">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <h4 className="text-xs font-black text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.selectedWeight ? (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-amber-500/20">
                          {item.selectedWeight.weight}
                        </span>
                      ) : item.selectedVariant ? (
                        <span className="text-[10px] text-zinc-500 block">
                          {item.selectedVariant.name}
                        </span>
                      ) : null}
                      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 mt-1 block">
                        {formatCurrency(price)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {(() => {
                        const maxStock = item.selectedWeight
                          ? Number(item.selectedWeight.stock ?? 0)
                          : Number(item.product.stock ?? 0);
                        return (
                          <div className="flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2 py-1 bg-white dark:bg-zinc-800">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedVariant?.id,
                                  weightId
                                )
                              }
                              className="text-zinc-500 hover:text-black dark:hover:text-white p-1"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-black w-4 text-center tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              disabled={item.quantity >= maxStock}
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedVariant?.id,
                                  weightId
                                )
                              }
                              className="text-zinc-500 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed p-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })()}

                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedVariant?.id, weightId)
                        }
                        className="text-rose-500 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 sm:space-y-4">
            {/* Coupon Code Section */}
            <div>
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon ({couponCode}) Applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-500 text-[10px] uppercase font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code (e.g. MANOJ10)"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 outline-none uppercase text-zinc-900 dark:text-white"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-bold hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discount Savings</span>
                  <span className="font-bold">
                    -{formatCurrency(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                <span>24-Hour Express Delivery</span>
                <span className="font-bold uppercase">FREE</span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span>Total Amount</span>
                <span className="text-amber-600 dark:text-amber-400">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={() => toggleCartDrawer(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 active:scale-98"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Encrypted 256-bit SSL Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
