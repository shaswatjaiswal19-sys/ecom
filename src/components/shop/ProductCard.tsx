"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCartStore, useWishlistStore, useCompareStore } from "@/lib/store";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Heart, ShoppingBag, Eye, Star, RotateCcw, Check } from "lucide-react";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart } = useCartStore();
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { compareItems, addToCompare } = useCompareStore();
  const { dict, getLocalizedProduct, formatWeight, language } = useLanguage();

  const localized = getLocalizedProduct(product);

  const isWishlisted = wishlist.some((p) => p.id === product.id);
  const isCompared = compareItems.some((p) => p.id === product.id);
  const discount = calculateDiscount(product.mrp, product.price);

  const hasWeightOptions = product.weightOptions && product.weightOptions.length > 0;
  const inStockWeights = hasWeightOptions
    ? product.weightOptions!.filter((w) => Number(w.stock ?? 0) > 0)
    : [];
  const isOutOfStock = hasWeightOptions ? inStockWeights.length === 0 : (product.stock ?? 0) <= 0;

  const displayPrice = hasWeightOptions ? product.weightOptions![0].price : product.price;
  const displayMrp = hasWeightOptions ? (product.weightOptions![0].mrp || product.mrp) : product.mrp;
  const displayDiscount = calculateDiscount(displayMrp, displayPrice);

  return (
    <div className={`group relative bg-white dark:bg-zinc-900/90 rounded-2xl sm:rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-amber-500/60 dark:hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_16px_36px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_16px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between overflow-hidden backdrop-blur-sm ${isOutOfStock ? "opacity-85" : ""}`}>
      {/* Top Badges Overlay */}
      <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {displayDiscount > 0 && (
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[9px] sm:text-[10px] font-black uppercase px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md shadow-amber-500/20 tracking-wider">
            -{displayDiscount}%
          </span>
        )}
        {product.isFlashSale && (
          <span className="hidden xs:inline-block bg-gradient-to-r from-rose-500 to-red-600 text-white text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-md shadow-rose-500/20 animate-pulse tracking-wider">
            🔥 {language === "hi" ? "ऑफ़र" : "Flash"}
          </span>
        )}
        {isOutOfStock && (
          <span className="bg-zinc-900/90 dark:bg-zinc-800/90 text-rose-400 text-[8px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-rose-500/30 backdrop-blur-md">
            {dict.common.soldOut}
          </span>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-2 right-2 sm:top-3.5 sm:right-3.5 z-10 flex flex-col gap-1 sm:gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        <button
          onClick={() => {
            toggleWishlist(product);
            toast.success(isWishlisted ? (language === "hi" ? "पसंदीदा सूची से हटाया गया" : "Removed from Wishlist") : (language === "hi" ? "पसंदीदा सूची में जोड़ा गया ❤️" : "Saved to Wishlist ❤️"));
          }}
          className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl backdrop-blur-md transition-all shadow-md active:scale-95 ${
            isWishlisted
              ? "bg-rose-500 text-white shadow-rose-500/30 ring-2 ring-rose-500/20"
              : "bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:bg-rose-500 hover:text-white border border-black/5 dark:border-white/5"
          }`}
          title={dict.nav.wishlist}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isWishlisted ? "fill-white scale-110" : ""}`} />
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:bg-amber-500 hover:text-black transition-all shadow-md border border-black/5 dark:border-white/5 active:scale-95"
            title={dict.product.quickView}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        <button
          onClick={() => {
            addToCompare(product);
            toast.success(language === "hi" ? "तुलना सूची में जोड़ा गया ⚖️" : "Added to Product Comparison ⚖️");
          }}
          className={`p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl backdrop-blur-md transition-all shadow-md active:scale-95 ${
            isCompared
              ? "bg-emerald-500 text-white shadow-emerald-500/30"
              : "bg-white/90 dark:bg-zinc-800/90 text-zinc-700 dark:text-zinc-200 hover:bg-emerald-500 hover:text-white border border-black/5 dark:border-white/5"
          }`}
          title={dict.nav.compare}
        >
          {isCompared ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" /> : <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* Image Thumbnail with Gradient Accent */}
      <div className="relative aspect-square p-2 sm:p-6 overflow-hidden bg-radial from-amber-500/5 via-transparent to-transparent">
        <Link href={`/shop/${product.slug || product.id}`} prefetch={true} className="block relative w-full h-full">
          <Image
            src={product.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"}
            alt={localized.name || "Product"}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-contain p-2 sm:p-5 group-hover:scale-108 transition-transform duration-500 ease-out"
          />
        </Link>
        {/* 360 Badge in bottom-left */}
        <Link
          href={`/shop/${product.slug}?view=360`}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 z-10 bg-zinc-900/80 hover:bg-amber-500 hover:text-black text-white dark:bg-zinc-800/90 dark:hover:bg-amber-400 dark:hover:text-black backdrop-blur-md transition-all text-[8px] sm:text-[9px] font-bold uppercase px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg border border-white/10 shadow-xs flex items-center gap-0.5"
        >
          🔄 360°
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-1.5 sm:space-y-2.5 bg-gradient-to-b from-transparent to-zinc-50/50 dark:to-zinc-950/20">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider truncate">
            {localized.category}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {hasWeightOptions ? (
              <button
                type="button"
                onClick={() => onQuickView && onQuickView(product)}
                className="text-[9px] sm:text-[10px] font-extrabold bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-800 dark:text-amber-300 px-1.5 sm:px-2 py-0.5 rounded-md border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-colors"
                title={dict.product.selectWeight}
              >
                {product.weightOptions!.length} {dict.product.sizes}
              </button>
            ) : product.weight ? (
              <span className="text-[9px] sm:text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-1.5 sm:px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700">
                {formatWeight(product.weight)}
              </span>
            ) : null}
            <div className="flex items-center gap-0.5 text-amber-400 text-[10px] sm:text-xs font-black">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
              <span className="text-zinc-900 dark:text-white">{product.rating}</span>
            </div>
          </div>
        </div>

        <Link href={`/shop/${product.slug}`} prefetch={true} className="block group-hover:text-amber-500 transition-colors">
          <h3 className="text-xs sm:text-sm font-extrabold text-zinc-900 dark:text-zinc-100 line-clamp-1">
            {localized.name}
          </h3>
        </Link>

        <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 font-medium hidden xs:block">
          {localized.tagline || localized.description}
        </p>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-1.5 sm:pt-2 flex items-center justify-between gap-1 border-t border-zinc-100/80 dark:border-zinc-800/50">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-zinc-900 dark:text-zinc-100">
                {formatCurrency(displayPrice)}
              </span>
              {displayMrp > displayPrice && (
                <span className="text-[10px] sm:text-[11px] text-zinc-400 line-through font-medium">
                  {formatCurrency(displayMrp)}
                </span>
              )}
            </div>
            <span className="text-[8px] sm:text-[9px] text-zinc-400 font-medium block">{dict.common.gstIncluded}</span>
          </div>

          <button
            onClick={() => {
              if (hasWeightOptions) {
                const defaultWeight = product.weightOptions![0];
                if (inStockWeights.length === 0) {
                  toast.error(dict.common.outOfStock);
                  return;
                }

                if (product.weightOptions!.length > 1 || Number(defaultWeight.stock ?? 0) <= 0) {
                  if (onQuickView) {
                    onQuickView(product);
                  } else {
                    addToCart(product, 1, undefined, inStockWeights[0]);
                    toast.success(`${dict.product.addedToCart} (${formatWeight(inStockWeights[0].weight)})`);
                  }
                } else {
                  addToCart(product, 1, undefined, defaultWeight);
                  toast.success(`${dict.product.addedToCart} (${formatWeight(defaultWeight.weight)})`);
                }
              } else {
                if ((product.stock ?? 0) <= 0) {
                  toast.error(dict.common.outOfStock);
                  return;
                }
                addToCart(product, 1);
                toast.success(dict.product.addedToCart);
              }
            }}
            disabled={isOutOfStock}
            className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 dark:hover:text-black transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            title={hasWeightOptions && product.weightOptions!.length > 1 ? dict.product.selectWeight : isOutOfStock ? dict.common.outOfStock : dict.product.addToCart}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline text-xs font-bold">{dict.product.addToCart.split(" ")[0]}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
