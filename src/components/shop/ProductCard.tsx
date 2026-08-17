"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types";
import { formatCurrency, calculateDiscount } from "@/lib/utils";
import { useCartStore, useWishlistStore, useCompareStore } from "@/lib/store";
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

  const isWishlisted = wishlist.some((p) => p.id === product.id);
  const isCompared = compareItems.some((p) => p.id === product.id);
  const discount = calculateDiscount(product.mrp, product.price);

  return (
    <div className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-luxury flex flex-col justify-between overflow-hidden">
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
        {discount > 0 && (
          <span className="bg-amber-500 text-black text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm">
            -{discount}% OFF
          </span>
        )}
        {product.isFlashSale && (
          <span className="bg-rose-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm animate-pulse">
            🔥 Flash Deal
          </span>
        )}
        <Link
          href={`/shop/${product.slug}?view=360`}
          className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-amber-500 hover:text-black transition-colors text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1"
        >
          🔄 360° View
        </Link>
      </div>

      {/* Action Hover Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => {
            toggleWishlist(product);
            toast.success(isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist");
          }}
          className={`p-2.5 rounded-full backdrop-blur-md transition-colors shadow-md ${
            isWishlisted
              ? "bg-rose-500 text-white"
              : "bg-white/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-rose-500 hover:text-white"
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
        </button>

        {onQuickView && (
          <button
            onClick={() => onQuickView(product)}
            className="p-2.5 rounded-full bg-white/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-amber-500 hover:text-black transition-colors shadow-md"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => {
            addToCompare(product);
            toast.success("Added to Product Comparison");
          }}
          className={`p-2.5 rounded-full backdrop-blur-md transition-colors shadow-md ${
            isCompared
              ? "bg-emerald-500 text-white"
              : "bg-white/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-emerald-500 hover:text-white"
          }`}
          title="Compare"
        >
          {isCompared ? <Check className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
        </button>
      </div>

      {/* Image Thumbnail Container */}
      <Link href={`/shop/${product.slug || product.id}`} prefetch={true} className="block relative aspect-square p-6 overflow-hidden">
        <Image
          src={product.images?.[0] || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400"}
          alt={product.name || "Product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain p-6 group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </Link>

      {/* Product Content info */}
      <div className="p-5 border-t border-black/5 dark:border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center gap-1.5">
            {product.weight && (
              <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-500/20">
                {product.weight}
              </span>
            )}
            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-zinc-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>
        </div>

        <Link href={`/shop/${product.slug}`} prefetch={true}>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-amber-500 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
          {product.tagline}
        </p>

        <div className="pt-2 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
                {formatCurrency(product.price)}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-zinc-400 line-through">
                  {formatCurrency(product.mrp)}
                </span>
              )}
            </div>
            <span className="text-[9px] text-zinc-400 block">+18% GST Included</span>
          </div>

          <button
            onClick={() => {
              addToCart(product);
              toast.success("Added to Cart!");
            }}
            className="p-2.5 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-400 transition-all shadow-sm"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
