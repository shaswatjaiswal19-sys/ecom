"use client";

import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, Gift, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartPage() {
  const {
    cart, removeFromCart, updateQuantity, clearCart,
    couponCode, discountAmount, applyCoupon, removeCoupon, getCartTotal,
  } = useCartStore();

  const { dict, getLocalizedProduct, formatWeight, language } = useLanguage();
  const [couponInput, setCouponInput] = useState("");
  const { subtotal, tax, total, itemCount } = getCartTotal();

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
        <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">{dict.cart.emptyTitle}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm">
          {dict.cart.emptyDesc}
        </p>
        <Link
          href="/shop"
          className="px-8 py-4 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors shadow-lg flex items-center gap-2"
        >
          {dict.cart.startShopping} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white">{dict.cart.title}</h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">{itemCount} {itemCount === 1 ? dict.cart.item : dict.cart.items}</p>
          </div>
          <button
            onClick={() => { clearCart(); toast.success(language === "hi" ? "कार्ट खाली कर दिया गया।" : "Cart cleared."); }}
            className="text-xs text-rose-500 font-semibold hover:underline flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> {dict.cart.clearCart}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map((item, idx) => {
              const price = item.selectedWeight?.price || item.selectedVariant?.price || item.product.price;
              const mrp = item.selectedWeight?.mrp || item.selectedVariant?.mrp || item.product.mrp;
              const weightId = item.selectedWeight?.id || item.selectedWeight?.weight;
              const prodName = getLocalizedProduct(item.product).name;
              return (
                <div
                  key={`${item.product.id}-${item.selectedVariant?.id || ""}-${weightId || idx}`}
                  className="flex gap-3 sm:gap-5 p-3.5 sm:p-5 bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-black/5 dark:border-white/10 shadow-sm transition-all group"
                >
                  {/* Product Image */}
                  <Link href={`/shop/${item.product.slug}`} className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 flex-shrink-0 border border-black/5 dark:border-white/5">
                    <Image src={item.product.images[0]} alt={prodName} fill className="object-contain p-2 sm:p-3 group-hover:scale-105 transition-transform duration-300" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <span className="text-[10px] sm:text-[11px] font-bold text-amber-500 uppercase tracking-wider">{item.product.brand}</span>
                          <Link href={`/shop/${item.product.slug}`}>
                            <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white hover:text-amber-500 transition-colors line-clamp-1 mt-0.5">
                              {prodName}
                            </h3>
                          </Link>
                          {item.selectedWeight ? (
                            <span className="text-[10px] sm:text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 sm:px-2.5 py-0.5 rounded-full inline-block mt-0.5 border border-amber-500/20">
                              {dict.product.weightVariant}: {formatWeight(item.selectedWeight.weight)}
                            </span>
                          ) : item.selectedVariant ? (
                            <p className="text-xs text-zinc-400 mt-0.5">{dict.product.weightVariant}: {item.selectedVariant.name}</p>
                          ) : item.product.weight ? (
                            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">{dict.product.weightVariant}: {formatWeight(item.product.weight)}</p>
                          ) : null}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedVariant?.id, weightId)}
                          className="text-zinc-300 dark:text-zinc-700 hover:text-rose-500 dark:hover:text-rose-500 transition-colors p-1 flex-shrink-0"
                          title={dict.common.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between flex-wrap gap-2 mt-2 sm:mt-3">
                      {/* Price */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-lg font-black text-zinc-900 dark:text-white">{formatCurrency(price)}</span>
                        {mrp > price && (
                          <span className="text-[10px] sm:text-xs text-zinc-400 line-through">{formatCurrency(mrp)}</span>
                        )}
                      </div>

                      {/* Qty Controller */}
                      {(() => {
                        const maxStock = item.selectedWeight
                          ? Number(item.selectedWeight.stock ?? 0)
                          : Number(item.product.stock ?? 0);
                        return (
                          <div className="flex items-center gap-1.5 sm:gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2 sm:px-3 py-1 sm:py-1.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant?.id, weightId)}
                              className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors p-0.5"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white w-5 sm:w-6 text-center tabular-nums">{item.quantity}</span>
                            <button
                              disabled={item.quantity >= maxStock}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant?.id, weightId)}
                              className="text-zinc-500 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed p-0.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })()}

                      {/* Line Total */}
                      <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency(price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Free Delivery Promise */}
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-emerald-500/20 bg-emerald-500/5">
              <Truck className="w-6 h-6 text-emerald-500 flex-shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">{dict.home.expressDelivery}</h4>
                <p className="text-[11px] text-zinc-500">{dict.footer.aboutText}</p>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            {/* Coupon Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-sm">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" /> {dict.cart.promoCode}
              </h3>
              {couponCode ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    ✓ {couponCode} — {dict.cart.discountApplied} {formatCurrency(discountAmount)}
                  </span>
                  <button onClick={removeCoupon} className="text-rose-500 text-[10px] font-bold hover:underline">{dict.common.remove}</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={dict.cart.promoCode}
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    className="flex-1 px-3 py-2 sm:py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs outline-none focus:border-amber-500 transition-colors font-mono"
                  />
                  <button
                    onClick={handleApply}
                    className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    {dict.common.apply}
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-sm">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white mb-4">{dict.cart.orderSummary}</h3>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{dict.cart.subtotal} ({itemCount} {itemCount === 1 ? dict.cart.item : dict.cart.items})</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>{dict.cart.discountApplied}</span>
                    <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>GST (18%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> {dict.home.expressDelivery}
                  </span>
                  <span className="font-bold text-emerald-500 uppercase">{dict.common.free}</span>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 flex justify-between">
                  <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-white">{dict.cart.totalAmount}</span>
                  <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">{formatCurrency(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-5 w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/20 active:scale-98"
              >
                {dict.cart.proceedToCheckout} <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-3.5 flex items-center justify-center gap-1.5 text-[10px] text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {language === "hi" ? "256-बिट एसएसएल सुरक्षित चेकआउट" : "256-bit SSL Encrypted Secure Checkout"}
              </div>
            </div>

            {/* Continue Shopping */}
            <Link
              href="/shop"
              className="w-full py-2.5 sm:py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:border-amber-500 hover:text-amber-500 transition-colors"
            >
              ← {dict.cart.startShopping}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
