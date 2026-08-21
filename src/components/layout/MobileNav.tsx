"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, Heart, Package, User } from "lucide-react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function MobileNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { toggleCartDrawer, getCartTotal } = useCartStore();
  const { wishlist, toggleWishlistDrawer } = useWishlistStore();
  const { dict } = useLanguage();
  const { itemCount } = getCartTotal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up")
  ) {
    return null;
  }

  const isHome = pathname === "/";
  const isShop = pathname.startsWith("/shop");
  const isOrders = pathname.startsWith("/account/orders") || pathname.startsWith("/track");
  const isAccount = pathname === "/account" || pathname.startsWith("/account/profile");

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-200/80 dark:border-zinc-800/80 px-2 py-1.5 flex items-center justify-around shadow-[0_-8px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_24px_rgba(0,0,0,0.4)] pb-[max(env(safe-area-inset-bottom),0.5rem)]">
      {/* 1. Home */}
      <Link
        href="/"
        prefetch={true}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all active:scale-95 ${
          isHome
            ? "text-amber-500 font-extrabold"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        }`}
      >
        <div className={`p-1 rounded-xl transition-colors ${isHome ? "bg-amber-500/15" : ""}`}>
          <Home className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{dict.nav.home}</span>
      </Link>

      {/* 2. Categories / Shop */}
      <Link
        href="/shop"
        prefetch={true}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all active:scale-95 ${
          isShop
            ? "text-amber-500 font-extrabold"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        }`}
      >
        <div className={`p-1 rounded-xl transition-colors ${isShop ? "bg-amber-500/15" : ""}`}>
          <Store className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{dict.shop.category}</span>
      </Link>

      {/* 3. Orders / Tracking */}
      <Link
        href="/account/orders"
        prefetch={true}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 rounded-2xl transition-all active:scale-95 ${
          isOrders
            ? "text-amber-500 font-extrabold"
            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
        }`}
      >
        <div className={`p-1 rounded-xl transition-colors ${isOrders ? "bg-amber-500/15" : ""}`}>
          <Package className="w-5 h-5 stroke-[2.2]" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{dict.nav.orders}</span>
      </Link>

      {/* 4. Wishlist Drawer Button */}
      <button
        type="button"
        onClick={() => toggleWishlistDrawer(true)}
        className="relative flex flex-col items-center justify-center flex-1 py-1 rounded-2xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
      >
        <div className="relative p-1 rounded-xl">
          <Heart className="w-5 h-5 stroke-[2.2]" />
          {mounted && wishlist.length > 0 && (
            <span className="absolute -top-0.5 -right-1 min-w-[15px] h-[15px] px-1 bg-rose-500 text-white font-black text-[8px] rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{dict.nav.wishlist}</span>
      </button>

      {/* 5. Cart Button */}
      <button
        type="button"
        onClick={() => toggleCartDrawer(true)}
        className="relative flex flex-col items-center justify-center flex-1 py-1 rounded-2xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-95"
      >
        <div className="relative p-1 rounded-xl">
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-0.5 -right-1 min-w-[15px] h-[15px] px-1 bg-amber-500 text-black font-black text-[8px] rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
              {itemCount}
            </span>
          )}
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">{dict.nav.cart}</span>
      </button>
    </nav>
  );
}
