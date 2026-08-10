"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, Heart, User, Package } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";

export default function MobileNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { toggleCartDrawer, getCartTotal } = useCartStore();
  const { wishlist, toggleWishlistDrawer } = useWishlistStore();
  const { itemCount } = getCartTotal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-black/5 dark:border-white/10 px-4 py-2 flex items-center justify-around shadow-2xl">
      <Link
        href="/"
        prefetch={true}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === "/" ? "text-amber-500 font-bold" : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        href="/shop"
        prefetch={true}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname.startsWith("/shop") ? "text-amber-500 font-bold" : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        <Store className="w-5 h-5" />
        <span>Catalog</span>
      </Link>

      <button
        onClick={() => toggleWishlistDrawer(true)}
        className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 transition-colors"
      >
        <Heart className="w-5 h-5" />
        <span>Wishlist</span>
        {mounted && wishlist.length > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </button>

      <button
        onClick={() => toggleCartDrawer(true)}
        className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Cart</span>
        {mounted && itemCount > 0 && (
          <span className="absolute -top-1 right-2 w-4 h-4 bg-amber-500 text-black font-bold text-[9px] rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      <Link
        href="/account"
        prefetch={true}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === "/account" ? "text-amber-500 font-bold" : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        <User className="w-5 h-5" />
        <span>Account</span>
      </Link>
    </div>
  );
}
