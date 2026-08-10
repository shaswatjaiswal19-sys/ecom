"use client";

import { useWishlistStore, useCartStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { X, Heart, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, toggleWishlistDrawer, toggleWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => toggleWishlistDrawer(false)}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col justify-between border-l border-black/5 dark:border-white/10 z-10 animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-lg font-bold">Saved Luxury Wishlist</h2>
            <span className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full font-medium">
              {wishlist.length}
            </span>
          </div>
          <button
            onClick={() => toggleWishlistDrawer(false)}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-zinc-500">
              <Heart className="w-16 h-16 stroke-[1] mb-4 text-zinc-300 dark:text-zinc-700" />
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Your wishlist is empty
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Save your favorite items here while browsing the store.
              </p>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 items-center"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 flex-shrink-0 border border-black/5 dark:border-white/5">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                    {product.name}
                  </h4>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success("Added to Cart!");
                    }}
                    className="p-2 rounded-xl bg-amber-500 text-black hover:bg-amber-400 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
