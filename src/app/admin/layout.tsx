"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users, Ticket,
  BarChart3, Image as ImageIcon, Settings, ChevronRight, Zap,
  Shield, LogOut, Search, Moon, Sun, Menu, X
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { SignedIn, UserButton, useUser, SignInButton } from "@clerk/nextjs";
import { ShieldAlert, ArrowLeft, Lock } from "lucide-react";
import { isUserAdmin } from "@/lib/adminAuth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { dict, language } = useLanguage();
  const { isLoaded, isSignedIn, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNav = [
    { href: "/admin", label: dict.admin.dashboard, icon: LayoutDashboard },
    { href: "/admin/products", label: dict.admin.products, icon: Package },
    { href: "/admin/categories", label: dict.admin.categories, icon: Tag },
    { href: "/admin/orders", label: dict.admin.orders, icon: ShoppingCart },
    { href: "/admin/customers", label: dict.admin.customers, icon: Users },
    { href: "/admin/coupons", label: dict.admin.coupons, icon: Ticket },
    { href: "/admin/analytics", label: dict.admin.analytics, icon: BarChart3 },
    { href: "/admin/banners", label: language === "hi" ? "बैनर" : "Banners", icon: ImageIcon },
    { href: "/admin/settings", label: dict.admin.settings, icon: Settings },
  ];

  const userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  const isAdmin = Boolean(isSignedIn && isUserAdmin(user));
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 space-y-4 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xl shadow-lg">
          M
        </div>
        <div className="text-xs text-zinc-400 font-mono">{language === "hi" ? "प्रशासक अनुमति जांची जा रही है..." : "Verifying Admin Authorization..."}</div>
      </div>
    );
  }

  // Access Denied Screen for Non-Admins or Unauthenticated users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{language === "hi" ? "प्रशासक अनुमति आवश्यक" : "Admin Authorization Required"}</h1>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {language === "hi" ? "यह नियंत्रण कक्ष केवल अधिकृत मनोज ट्रेडर्स प्रशासकों के लिए प्रतिबंधित है।" : "This control panel is restricted exclusively to authorized Manoj Traders administrators."}
            </p>
            {userEmail ? (
              <div className="mt-3 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400">
                {language === "hi" ? "साइन इन खाता:" : "Signed in as:"} <span className="text-rose-400 font-bold">{userEmail}</span> ({language === "hi" ? "गैर-प्रशासक खाता" : "Non-Admin Account"})
              </div>
            ) : (
              <div className="mt-3 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-amber-400">
                {language === "hi" ? "स्थिति: अप्रमाणित अतिथि" : "Status: Unauthenticated Guest"}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {!isSignedIn ? (
              <SignInButton mode="modal" fallbackRedirectUrl="/admin">
                <button className="w-full py-3 rounded-2xl bg-amber-500 text-zinc-950 font-bold text-sm hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer">
                  <Lock className="w-4 h-4" /> {language === "hi" ? "प्रशासक के रूप में साइन इन करें" : "Sign In as Admin"}
                </button>
              </SignInButton>
            ) : (
              <Link
                href="/sign-in"
                className="w-full py-3 rounded-2xl bg-amber-500 text-zinc-950 font-bold text-sm hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Lock className="w-4 h-4" /> {language === "hi" ? "खाता बदलें" : "Switch Account"}
              </Link>
            )}

            <Link
              href="/"
              className="w-full py-3 rounded-2xl bg-zinc-800 text-white font-semibold text-xs hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> {language === "hi" ? "स्टोरफ्रंट पर वापस जाएं" : "Return to Supermarket Storefront"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col lg:flex-row">
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`w-64 bg-zinc-950 text-white flex flex-col fixed left-0 top-0 h-screen z-40 shadow-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/admin" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-lg shadow-md">
              M
            </div>
            <div>
              <div className="text-sm font-black tracking-tight gold-gradient-text uppercase">{dict.common.appName}</div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-amber-500" /> {language === "hi" ? "एडमिन पैनल" : "Admin Supermarket"}
              </div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNav.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Area */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {userEmail && (
            <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-400 truncate">
              {language === "hi" ? "लॉगिन:" : "Signed as"} <span className="text-amber-400 font-bold">{userEmail}</span>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-zinc-800 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" /> {language === "hi" ? "स्टोरफ्रंट पर जाएं" : "Exit to Storefront"}
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 text-[11px] text-zinc-500">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === "hi" ? "व्यवस्थापक सक्रिय" : "Admin Active & Synced"}</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="ml-0 lg:ml-64 flex-1 flex flex-col min-h-screen w-full">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-b border-black/5 dark:border-white/10 h-16 flex items-center justify-between px-4 sm:px-8 shadow-sm">
          {/* Mobile Sidebar Toggle & Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
              title="Open Admin Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search */}
            <div className="hidden sm:flex items-center gap-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-2 w-64 md:w-80">
              <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
              <input
                type="text"
                placeholder={language === "hi" ? "उत्पाद, ऑर्डर खोजें..." : "Search products, orders..."}
                className="bg-transparent border-none outline-none text-xs text-zinc-900 dark:text-white w-full placeholder:text-zinc-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher in Admin Header */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Clerk User Button */}
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 rounded-xl border border-amber-500/40",
                  },
                }}
              />
            </SignedIn>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-8 flex-1 w-full overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
