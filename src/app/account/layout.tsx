"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  LayoutDashboard, Package, MapPin, Heart, Wallet, RotateCcw,
  HeadphonesIcon, ChevronRight, User, Star
} from "lucide-react";

const ACCOUNT_NAV = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/wallet", label: "Wallet & Points", icon: Wallet },
  { href: "/account/returns", label: "Returns & Refunds", icon: RotateCcw },
  { href: "/account/tickets", label: "Support Tickets", icon: HeadphonesIcon },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden sticky top-28">
              {/* Profile Card */}
              <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-950">
                <div className="flex items-center gap-3">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} alt={user.fullName || "User"} className="w-12 h-12 rounded-2xl border border-amber-500/20 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-black text-lg">
                      {user?.firstName?.[0] || "U"}
                    </div>
                  )}
                  <div>
                    <div className="font-black text-sm text-zinc-900 dark:text-white">{user?.fullName || "Guest User"}</div>
                    <div className="text-[11px] text-zinc-400 truncate max-w-[140px]">{user?.emailAddresses?.[0]?.emailAddress || "Not signed in"}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-amber-500">Luxury Member</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="p-3">
                {ACCOUNT_NAV.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all mb-1 ${
                      pathname === href
                        ? "bg-amber-500 text-black shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${pathname === href ? "opacity-100" : "opacity-0"}`} />
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
