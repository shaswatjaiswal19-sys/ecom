"use client";

import { useState } from "react";
import { useWishlistStore, useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">My Wishlist</h1>
        <p className="text-sm text-zinc-500 mt-1">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10">
          <Heart className="w-16 h-16 mx-auto mb-4 stroke-[1.5] text-zinc-200 dark:text-zinc-700" />
          <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-2">Your Wishlist is Empty</h3>
          <p className="text-sm text-zinc-500 mb-6">Browse our curated collection and save your favorite items.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden group hover:shadow-luxury transition-all">
              <Link href={`/shop/${product.slug}`} className="relative block aspect-square bg-zinc-50 dark:bg-zinc-950 p-6">
                <Image src={product.images[0]} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
              </Link>
              <div className="p-5 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{product.brand}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-zinc-900 dark:text-white">{product.rating}</span>
                  </div>
                </div>
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white hover:text-amber-500 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-base font-black text-zinc-900 dark:text-white">{formatCurrency(product.price)}</span>
                  {product.mrp > product.price && (
                    <span className="text-xs text-zinc-400 line-through">{formatCurrency(product.mrp)}</span>
                  )}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => { addToCart(product); toast.success("Added to Cart!"); }}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                  </button>
                  <button
                    onClick={() => { toggleWishlist(product); toast.success("Removed from Wishlist"); }}
                    className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-rose-500 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
