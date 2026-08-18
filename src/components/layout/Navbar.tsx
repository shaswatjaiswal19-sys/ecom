"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCartStore, useWishlistStore } from "@/lib/store";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Apple,
  Milk,
  Wheat,
  Flame,
  Truck,
  Package,
  LogOut,
} from "lucide-react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { isUserAdmin } from "@/lib/adminAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const { cart, toggleCartDrawer, getCartTotal } = useCartStore();
  const { wishlist, toggleWishlistDrawer } = useWishlistStore();
  const { theme, setTheme } = useTheme();

  const { user: clerkUser } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { itemCount: rawItemCount } = getCartTotal();
  const itemCount = mounted ? rawItemCount : 0;
  const wishlistCount = mounted ? wishlist.length : 0;
  const isAdmin = mounted && Boolean(isUserAdmin(clerkUser));

  if (pathname.startsWith("/admin") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`;
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors shadow-sm">
        {/* Top Announcement Bar (Hidden on small mobile screens to save screen height) */}
        <div className="hidden sm:flex bg-zinc-900 text-white text-[11px] font-medium py-1.5 px-4 text-center items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>SUPERMARKET OFFER: Use code <strong className="text-amber-300 underline">MANOJ10</strong> for 10% OFF + Free 24-Hour Express Grocery Delivery</span>
          <span className="hidden md:inline-block text-zinc-400">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Organic & Farm Fresh Guaranteed
          </span>
        </div>

        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 lg:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-lg lg:text-xl shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-black text-sm lg:text-lg tracking-tight uppercase text-zinc-900 dark:text-white leading-none">
                MANOJ TRADERS
              </span>
              <span className="hidden sm:inline-block text-[9px] lg:text-[10px] tracking-widest text-emerald-600 dark:text-amber-400 font-bold uppercase mt-0.5">
                Fresh Groceries. Trusted Service.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <Link href="/" prefetch={true} className="hover:text-amber-500 transition-colors">
              Home
            </Link>

            {/* Grocery Aisles Supermarket Catalog */}
            <Link
              href="/shop"
              prefetch={true}
              className="flex items-center gap-1 hover:text-amber-500 transition-colors py-2"
            >
              <Wheat className="w-4 h-4 text-amber-500" />
              <span>Grocery Aisles</span>
            </Link>

            <Link href="/account/orders" prefetch={true} className="hover:text-amber-500 transition-colors flex items-center gap-1 font-bold">
              <Package className="w-3.5 h-3.5 text-amber-500" /> Orders
            </Link>
            <Link href="/track" prefetch={true} className="hover:text-amber-500 transition-colors flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-amber-500" /> Track Order
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                prefetch={true}
                className="text-xs px-3 py-1.5 rounded-full bg-amber-500 text-black hover:bg-amber-400 font-bold transition-all shadow-sm flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Admin Console
              </Link>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Desktop Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex p-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
              title="Search Grocery Items"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlistDrawer(true)}
              className="relative p-2 sm:p-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
              title="View Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => toggleCartDrawer(true)}
              className="relative p-2 sm:p-2.5 rounded-2xl bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-1.5 sm:gap-2 shadow-md font-bold"
              title="Shopping Cart Drawer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline-block text-xs">
                Cart ({itemCount})
              </span>
              {itemCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-4 h-4 bg-black text-amber-400 font-black text-[9px] rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 sm:p-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
              title="Toggle Light/Dark Theme"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-800" />}
            </button>

            {/* Account & Authentication Buttons */}
            <div className="pl-1 sm:pl-2 border-l border-zinc-200 dark:border-zinc-800">
              {clerkUser ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/account"
                    className="text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-amber-500 hidden md:inline-block"
                  >
                    Account
                  </Link>
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-7 h-7 sm:w-8 sm:h-8 rounded-xl border border-amber-500/50",
                      },
                    }}
                  />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1 text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-amber-500 hover:text-black transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Sign In</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-white"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ALWAYS-VISIBLE MOBILE SEARCH BAR (Flipkart/Amazon style) */}
        <div className="lg:hidden px-3 pb-2.5 pt-0.5">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 5,000+ groceries, atta, dal, ghee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-16 py-2 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-12 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : null}
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 bg-amber-500 text-black text-[11px] font-black uppercase rounded-xl shadow-sm hover:bg-amber-400 transition-colors"
            >
              Go
            </button>
          </form>
        </div>

        {/* Desktop Global Instant Search Dropdown */}
        {searchOpen && (
          <div className="hidden lg:block border-t border-black/5 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-4 shadow-xl">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search fresh mangoes, basmati rice, A2 ghee, spices, staples..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-base outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
                autoFocus
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-colors flex-shrink-0"
              >
                Search
              </button>
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X className="w-5 h-5 text-zinc-400 hover:text-black dark:hover:text-white" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-black/5 dark:border-white/10 bg-white dark:bg-zinc-950 p-5 space-y-4 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-2.5 font-bold text-sm text-zinc-900 dark:text-white">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-between">
                <span>🏠 Home</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-zinc-400" />
              </Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-between">
                <span>🌾 Grocery Catalog</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-zinc-400" />
              </Link>
              <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-between">
                <span>📦 My Orders & Tracking</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-zinc-400" />
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-between">
                <span>🌿 About Manoj Traders</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-zinc-400" />
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 flex items-center justify-between">
                <span>📞 Customer Support</span>
                <ChevronDown className="w-4 h-4 -rotate-90 text-zinc-400" />
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-2 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Admin Console
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
