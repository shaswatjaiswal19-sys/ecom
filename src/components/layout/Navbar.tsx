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
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-black/5 dark:border-white/10 transition-colors shadow-sm">
        {/* Top Announcement Bar */}
        <div className="bg-zinc-900 text-white text-[11px] font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>SUPERMARKET OFFER: Use code <strong className="text-amber-300 underline">MANOJ10</strong> for 10% OFF + Free 24-Hour Express Grocery Delivery</span>
          <span className="hidden md:inline-block text-zinc-400">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Organic & Farm Fresh Guaranteed
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center text-zinc-950 font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight uppercase text-zinc-900 dark:text-white leading-none">
                MANOJ TRADERS
              </span>
              <span className="text-[10px] tracking-widest text-emerald-600 dark:text-amber-400 font-bold uppercase mt-0.5">
                Fresh Groceries. Trusted Service.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <Link href="/" prefetch={true} className="hover:text-amber-500 transition-colors">
              Home
            </Link>

            {/* Mega Menu for Grocery Aisles */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <Link
                href="/shop"
                prefetch={true}
                className="flex items-center gap-1 hover:text-amber-500 transition-colors py-2"
              >
                Grocery Aisles <ChevronDown className="w-4 h-4 text-amber-500" />
              </Link>

              {megaMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-black/5 dark:border-white/10 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 z-50">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                      <Wheat className="w-4 h-4" /> Produce & Staples
                    </h4>
                    <ul className="space-y-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      <li>
                        <Link href="/shop?category=Atta,%20Rice%20%26%20Organic%20Staples" prefetch={true} className="hover:text-amber-500 transition-colors">
                          🌾 Atta, Aged Basmati Rice & Dal
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=Organic%20Fruits%20%26%20Vegetables" prefetch={true} className="hover:text-amber-500 transition-colors">
                          🍎 Organic Farm Fruits & Veggies
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=Dairy,%20Eggs%20%26%20Bakery" prefetch={true} className="hover:text-amber-500 transition-colors">
                          🥛 A2 Gir Cow Ghee & Farm Dairy
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?category=Gourmet%20Spices%20%26%20Cold-Pressed%20Oils" prefetch={true} className="hover:text-amber-500 transition-colors">
                          🌶️ Kachi Ghani Oils & Kashmiri Saffron
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Supermarket Offers
                    </h4>
                    <ul className="space-y-2.5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      <li>
                        <Link href="/shop?filter=flash-sale" prefetch={true} className="hover:text-amber-500 transition-colors font-bold text-amber-500">
                          🔥 Daily Grocery Flash Sale (Up to 30% OFF)
                        </Link>
                      </li>
                      <li>
                        <Link href="/shop?filter=best-sellers" prefetch={true} className="hover:text-amber-500 transition-colors">
                          ⭐ Top Selling Organic Staples
                        </Link>
                      </li>
                      <li>
                        <Link href="/compare" prefetch={true} className="hover:text-amber-500 transition-colors">
                          📊 Product Price & Spec Comparison
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

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
          <div className="flex items-center gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
              title="Search Grocery Items"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlistDrawer(true)}
              className="relative p-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
              title="View Saved Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => toggleCartDrawer(true)}
              className="relative p-2.5 rounded-2xl bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center gap-2 shadow-md font-bold"
              title="Shopping Cart Drawer"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline-block text-xs">
                Cart ({itemCount})
              </span>
              {itemCount > 0 && (
                <span className="sm:hidden absolute -top-1 -right-1 w-4 h-4 bg-black text-amber-400 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-700 dark:text-zinc-300"
              title="Toggle Light/Dark Theme"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-800" />}
            </button>

            {/* Account & Authentication Buttons */}
            <div className="pl-2 border-l border-zinc-200 dark:border-zinc-800">
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
                        avatarBox: "w-8 h-8 rounded-xl border border-amber-500/50",
                      },
                    }}
                  />
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-amber-500 hover:text-black transition-all shadow-sm"
                >
                  <User className="w-3.5 h-3.5" /> Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-white"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Global Instant Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-black/5 dark:border-white/10 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl p-4 shadow-xl">
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
          <div className="lg:hidden border-t border-black/5 dark:border-white/10 bg-white dark:bg-zinc-950 p-6 space-y-4 shadow-2xl">
            <nav className="flex flex-col space-y-3 font-bold text-sm text-zinc-900 dark:text-white">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500">
                Home
              </Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500">
                Grocery Catalog
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500">
                About Us
              </Link>
              <Link href="/blogs" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500">
                Journal
              </Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500">
                Contact
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-amber-500 text-amber-500 flex items-center gap-1.5 font-bold">
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
