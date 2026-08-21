"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MessageSquare, Mail, ShieldCheck, Truck, RefreshCw, Award, Send, Apple, Wheat, Flame } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import toast from "react-hot-toast";

export default function Footer() {
  const pathname = usePathname();
  const { dict, language } = useLanguage();
  const [email, setEmail] = useState("");

  if (pathname.startsWith("/admin") || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success(language === "hi" ? "मनोज ट्रेडर्स ऑर्गेनिक किराना ऑफर्स की सदस्यता लेने के लिए धन्यवाद!" : "Thank you for subscribing to Manoj Traders Organic Grocery Deals!");
    setEmail("");
  };

  return (
    <footer className="bg-zinc-950 text-white pt-10 sm:pt-20 pb-24 lg:pb-12 border-t border-zinc-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pb-10 sm:pb-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 border-b border-zinc-800">
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold leading-tight">{language === "hi" ? "24-घंटे एक्सप्रेस" : "24-Hr Express"}</h4>
            <p className="text-[10px] sm:text-xs text-zinc-400">{language === "hi" ? "सुरक्षित कोल्ड-चेन डिलीवरी" : "Cold-chain shipping"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold leading-tight">{language === "hi" ? "100% शुद्धता" : "100% Pure"}</h4>
            <p className="text-[10px] sm:text-xs text-zinc-400">{language === "hi" ? "खेत से सीधा जैविक किराना" : "Direct farm organic"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold leading-tight">{language === "hi" ? "आसान वापसी" : "Easy Returns"}</h4>
            <p className="text-[10px] sm:text-xs text-zinc-400">{language === "hi" ? "7-दिवसीय रिफंड गारंटी" : "7-Day refund guarantee"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Award className="w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold leading-tight">{language === "hi" ? "1999 से सेवा में" : "Since 1999"}</h4>
            <p className="text-[10px] sm:text-xs text-zinc-400">{language === "hi" ? "5 लाख+ संतुष्ट परिवार" : "500K+ happy homes"}</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-xl">
              M
            </div>
            <span className="font-bold text-xl tracking-tight gold-gradient-text uppercase">
              {dict.common.appName}
            </span>
          </div>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            {dict.footer.aboutText}
          </p>

          {/* Newsletter Box */}
          <form onSubmit={handleSubscribe} className="pt-2">
            <label className="block text-xs font-semibold text-zinc-300 mb-2">
              {dict.home.newsletterTitle}
            </label>
            <div className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder={dict.home.newsletterPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5"
              >
                {dict.home.newsletterButton} <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">{dict.footer.categories}</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/shop?category=Atta,%20Rice%20%26%20Organic%20Staples" className="hover:text-white transition-colors">{language === "hi" ? "बासमती चावल और अनाज" : "Aged Basmati & Staples"}</Link></li>
            <li><Link href="/shop?category=Organic%20Fruits%20%26%20Vegetables" className="hover:text-white transition-colors">{language === "hi" ? "ताज़ा फल और जैविक सब्ज़ियां" : "Organic Fruits & Vegetables"}</Link></li>
            <li><Link href="/shop?category=Dairy,%20Eggs%20%26%20Bakery" className="hover:text-white transition-colors">{language === "hi" ? "A2 गिर गाय घी और डेयरी" : "A2 Gir Cow Ghee & Dairy"}</Link></li>
            <li><Link href="/shop?category=Gourmet%20Spices%20%26%20Cold-Pressed%20Oils" className="hover:text-white transition-colors">{language === "hi" ? "कच्ची घानी तेल और मसाले" : "Cold-Pressed Oils & Saffron"}</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">{dict.footer.customerService}</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/account/orders" className="hover:text-white transition-colors">{dict.orders.trackOrder}</Link></li>
            <li><Link href="/account/returns" className="hover:text-white transition-colors">{dict.nav.returns}</Link></li>
            <li><Link href="/account/tickets" className="hover:text-white transition-colors">{dict.nav.support}</Link></li>
            <li><Link href="/support" className="hover:text-white transition-colors">{dict.nav.help}</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">{dict.common.appName}</h4>
          <ul className="space-y-2.5 text-xs text-zinc-400">
            <li><Link href="/about" className="hover:text-white transition-colors">{dict.nav.about}</Link></li>
            <li><Link href="/blogs" className="hover:text-white transition-colors">{language === "hi" ? "किराना पत्रिका" : "Journal"}</Link></li>
            <li><Link href="/careers" className="hover:text-white transition-colors">{language === "hi" ? "करियर" : "Careers"}</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">{dict.footer.privacy}</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">{dict.footer.terms}</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex flex-col lg:flex-row items-center gap-2 text-center lg:text-left flex-wrap">
          <span>© 2026 {dict.common.appName}. {dict.footer.rights}</span>
          <span className="hidden lg:inline">•</span>
          <span className="font-semibold text-zinc-300 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
            {language === "hi" ? "निर्माता" : "Made by"} <strong className="text-amber-400 font-extrabold">Shaswat Jaiswal</strong> (Contact: <a href="tel:9170215145" className="text-amber-400 font-mono font-bold hover:underline">9170215145</a>) &amp; <strong className="text-amber-400 font-extrabold">Satyesh Kumar</strong> (Contact: <a href="tel:7307440594" className="text-amber-400 font-mono font-bold hover:underline">7307440594</a>)
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>💳 {language === "hi" ? "कार्ड भुगतान" : "Visa"}</span>
          <span>⚡ Razorpay</span>
          <span>📱 UPI / PhonePe</span>
          <span>💵 {dict.checkout.cashOnDelivery}</span>
        </div>
      </div>
    </footer>
  );
}
