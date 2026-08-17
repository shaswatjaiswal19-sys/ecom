"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Mail, ShieldCheck, Truck, RefreshCw, Award, Send, Apple, Wheat, Flame } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  if (pathname.startsWith("/admin") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to Manoj Traders Organic Grocery Deals!");
    setEmail("");
  };

  return (
    <footer className="bg-zinc-950 text-white pt-20 pb-28 lg:pb-12 border-t border-zinc-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">24-Hour Express Grocery</h4>
            <p className="text-xs text-zinc-400">Cold-chain insulated shipping</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">100% Certified Organic</h4>
            <p className="text-xs text-zinc-400">Direct farm-to-doorstep purity</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Easy Fresh Returns</h4>
            <p className="text-xs text-zinc-400">7-Day quality guarantee</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold">Trusted Since 1999</h4>
            <p className="text-xs text-zinc-400">500,000+ satisfied families</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xl">
              S
            </div>
            <span className="font-bold text-xl tracking-tight gold-gradient-text uppercase">
              SHASWAT ECOM
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            Shaswat Ecom is India&apos;s trusted online supermarket for 100% farm-fresh organic produce, aged Basmati rice, A2 Gir cow ghee, cold-pressed oils, and heritage spices.
          </p>

          {/* Newsletter Box */}
          <form onSubmit={handleSubscribe} className="pt-2">
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              Subscribe to Weekly Organic Harvest Offers
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                Join <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Grocery Aisles</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/shop?category=Atta,%20Rice%20%26%20Organic%20Staples" className="hover:text-white transition-colors">Aged Basmati & Staples</Link></li>
            <li><Link href="/shop?category=Organic%20Fruits%20%26%20Vegetables" className="hover:text-white transition-colors">Organic Fruits & Vegetables</Link></li>
            <li><Link href="/shop?category=Dairy,%20Eggs%20%26%20Bakery" className="hover:text-white transition-colors">A2 Gir Cow Ghee & Dairy</Link></li>
            <li><Link href="/shop?category=Gourmet%20Spices%20%26%20Cold-Pressed%20Oils" className="hover:text-white transition-colors">Cold-Pressed Oils & Saffron</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Customer Care</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/account/orders" className="hover:text-white transition-colors">Track Orders</Link></li>
            <li><Link href="/account/returns" className="hover:text-white transition-colors">Fresh Returns & Refunds</Link></li>
            <li><Link href="/account/tickets" className="hover:text-white transition-colors">Support Portal</Link></li>
            <li><Link href="/support" className="hover:text-white transition-colors">Help & Concierge</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">Shaswat Ecom</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/about" className="hover:text-white transition-colors">Our Story & Heritage</Link></li>
            <li><Link href="/blogs" className="hover:text-white transition-colors">Journal</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex flex-col lg:flex-row items-center gap-2 text-center lg:text-left flex-wrap">
          <span>© 2026 Shaswat Ecom. All rights reserved.</span>
          <span className="hidden lg:inline">•</span>
          <span className="font-semibold text-zinc-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            Made by <strong className="text-amber-400 font-extrabold">Satyesh Kumar</strong> (Contact: <a href="tel:7307440594" className="text-amber-400 font-mono font-bold hover:underline">7307440594</a>) &amp; <strong className="text-amber-400 font-extrabold">Shaswat Jaiswal</strong> (Contact: <a href="tel:9170215145" className="text-amber-400 font-mono font-bold hover:underline">9170215145</a>)
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>💳 Visa</span>
          <span>⚡ Razorpay</span>
          <span>📱 UPI / PhonePe</span>
          <span>💵 Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
}
