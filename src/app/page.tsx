"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Truck,
  Award,
  Zap,
  ChevronRight,
  TrendingUp,
  Flame,
  Sparkles,
  ShoppingBag,
  Wheat,
  Apple,
  Milk,
  RotateCw,
  Move3d,
  CheckCircle2,
  Heart,
  Eye,
  ShieldCheck,
  Package,
} from "lucide-react";
import ProductCard from "@/components/shop/ProductCard";
import QuickViewModal from "@/components/shop/QuickViewModal";
import CountdownTimer from "@/components/shop/CountdownTimer";
import { MOCK_CATEGORIES, MOCK_BRANDS } from "@/lib/mockData";
import { useProductStore, useCategoryStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/types";

// Dynamic 350° Kirana 3D Canvas
const Kirana3DStoreCanvas = dynamic(() => import("@/components/3d/Kirana3DStoreCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] sm:h-[580px] lg:h-[620px] rounded-3xl bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center gap-3 border border-amber-500/20">
      <div className="w-14 h-14 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
      <span className="text-xs font-bold text-amber-400 animate-pulse">
        Loading 350° Kirana 3D Showcase...
      </span>
    </div>
  ),
});

const MARQUEE_ITEMS = [
  "🌾 100% Shudh A2 Gir Cow Bilona Ghee",
  "🍚 2-Year Aged Royal Basmati Rice",
  "🥭 Hand-Picked Ratnagiri Alphonso Mangoes",
  "🌿 Cold-Pressed Mustard & Sesame Oil",
  "🫚 Organic Lakadong High-Curcumin Turmeric",
  "🍯 Himalayan Raw Unpasteurized Honey",
  "🚚 24-Hour Express Doorstep Kirana Delivery",
  "🛡️ Zero Pesticides & Direct Farm-Sourced",
];

const KIRANA_PIPELINE = [
  {
    step: "01",
    title: "100% Organic Farm Harvest",
    desc: "Sourced directly from certified heritage farms across India with zero chemical pesticides.",
    icon: "🌱",
    tag: "Soil Certified",
  },
  {
    step: "02",
    title: "Traditional Bilona & Wood-Pressed",
    desc: "A2 ghee churned bi-directionally in clay pots; edible oils cold-extracted in wooden Kolhus.",
    icon: "🏺",
    tag: "Ancient Purity",
  },
  {
    step: "03",
    title: "Vacuum Sealed & Lab Tested",
    desc: "Packed in nitrogen-flushed food grade glass jars and breathable jute burlap bags.",
    icon: "🔬",
    tag: "NABL Certified",
  },
  {
    step: "04",
    title: "24-Hr Cold Chain Express Delivery",
    desc: "Dispatched in insulated protective packaging straight to your doorstep with live GPS tracking.",
    icon: "🚚",
    tag: "Express Dispatch",
  },
];


const FAQS = [
  {
    q: "How do you guarantee 100% organic farm freshness?",
    a: "We partner directly with certified organic farms across India. All produce and grains undergo strict pesticide residue testing before being packed in climate-controlled, vacuum-sealed food grade containers.",
  },
  {
    q: "What are your grocery express delivery timelines?",
    a: "We offer 24-Hour Express Grocery Delivery across Mumbai, Delhi NCR, Bangalore, Hyderabad, Pune, Chennai, and Kolkata. Orders placed before 4 PM are dispatched same-day in insulated cold-chain vehicles.",
  },
  {
    q: "What is your return policy for fresh produce?",
    a: "We offer a 100% Freshness Guarantee. If any fruit, vegetable, or grocery item does not meet your quality expectations, inform us within 7 days and we will issue an instant replacement or full refund.",
  },
  {
    q: "Do you offer wholesale bulk discounts?",
    a: "Yes! We offer wholesale prices for bulk family orders, catering, and corporate grocery procurement. You can view wholesale price tiers directly on each product listing.",
  },
];

export default function HomePage() {
  const { products: storeProducts } = useProductStore();
  const { categories: storeCategories } = useCategoryStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // Global Page Scroll Animation Hooks (SSR-Safe)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Hero Section Parallax
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], ["0%", "12%"]);

  const displayCategories = storeCategories.length ? storeCategories : MOCK_CATEGORIES;
  const flashSaleProducts = storeProducts.filter((p) => p.isFlashSale);
  const featuredProducts = storeProducts.filter((p) => p.isFeatured);
  const flashSaleEnd = "2026-12-31T23:59:59Z";

  return (
    <div className="relative overflow-hidden selection:bg-amber-500 selection:text-black">
      {/* 1. TOP SCROLL PROGRESS BAR */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 origin-left z-50 shadow-sm"
      />

      {/* ===== HERO SECTION WITH 350° 3D KIRANA ORBIT SHOWCASE ===== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden py-10 lg:py-16">
        {/* Ambient Kirana Gold & Emerald Atmospheric Glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-emerald-500/5 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[550px] h-[550px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[450px] h-[450px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center w-full"
        >
          {/* Left Text Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 space-y-7 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>India's Premier Organic Kirana Store</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight leading-[1.08] text-zinc-900 dark:text-white">
                Pure Kirana. <br />
                <span className="gold-gradient-text">Farm Fresh Daily.</span>
              </h1>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed max-w-lg">
                Experience authentic purity — A2 Gir cow Bilona ghee, 2-year aged Royal Basmati rice, hand-picked Ratnagiri Alphonso mangoes, cold-pressed oils, and heritage spices delivered straight to your kitchen in 24 hours.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/shop"
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2 hover:gap-3 group"
              >
                <span>Shop Kirana Essentials</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?filter=flash-sale"
                className="px-6 py-4 rounded-2xl bg-zinc-100 dark:bg-zinc-850 text-zinc-900 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 font-bold text-sm transition-all border border-zinc-200 dark:border-zinc-700 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Today's Flash Deals</span>
              </Link>
            </div>

            {/* Kirana Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-amber-500">24-Hr</div>
                <div className="text-[11px] text-zinc-500 font-bold">Express Kirana</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-emerald-500">100%</div>
                <div className="text-[11px] text-zinc-500 font-bold">Shudh & Organic</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-black text-amber-500">500K+</div>
                <div className="text-[11px] text-zinc-500 font-bold">Happy Homes</div>
              </div>
            </div>
          </motion.div>

          {/* Right 350° 3D Kirana Orbit Canvas (7 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
            className="lg:col-span-7 w-full"
          >
            <Kirana3DStoreCanvas />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== CONTINUOUS MOVING KIRANA MARQUEE TICKER (Slow & Smooth) ===== */}
      <div className="relative py-3.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-zinc-950 font-black text-xs uppercase tracking-wider overflow-hidden shadow-md">
        <div className="animate-kirana-marquee whitespace-nowrap gap-8 font-extrabold cursor-default">
          {MARQUEE_ITEMS.concat(MARQUEE_ITEMS).map((item, idx) => (
            <span key={idx} className="flex items-center gap-3 pr-8">
              <span>{item}</span>
              <span className="text-black/40">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* ===== FEATURED KIRANA AISLES ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-500">Farm Direct Supermarket</span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
              Explore Kirana Aisles
            </h2>
          </div>
          <Link href="/shop" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
            View All Categories ({displayCategories.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className="group relative rounded-3xl overflow-hidden h-80 border border-black/5 dark:border-white/10 shadow-md flex flex-col justify-end p-6 bg-zinc-950 text-white block hover:shadow-xl transition-all"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-110 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md inline-block border border-amber-500/30">
                    {cat.itemCount || 10}+ Items in Stock
                  </span>
                  <h3 className="text-xl font-black group-hover:text-amber-400 transition-colors leading-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FLASH SALE WITH COUNTDOWN TIMER ===== */}
      <section className="py-20 bg-gradient-to-br from-amber-500/10 via-zinc-900 to-zinc-950 text-white border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-zinc-800 pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500 text-black font-black text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-black" /> Supermarket Daily Flash Deal
              </div>
              <h2 className="text-3xl sm:text-4xl font-black">Limited-Time Organic Offers</h2>
            </div>
            <CountdownTimer endsAt={flashSaleEnd} targetDate={flashSaleEnd} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashSaleProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4-STAGE KIRANA PURITY PIPELINE (Scroll Animated) ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-amber-500">The Manoj Traders Standard</span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
            From Sacred Soil to Your Kitchen
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500">
            Every grain, oil drop, and ghee jar passes our rigorous 4-step organic validation pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KIRANA_PIPELINE.map((p, idx) => (
            <motion.div
              key={p.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.12 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{p.icon}</span>
                  <span className="text-xs font-mono font-black text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                    {p.step}
                  </span>
                </div>
                <h3 className="font-bold text-base text-zinc-900 dark:text-white">{p.title}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.desc}</p>
              </div>

              <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{p.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== BEST SELLING PANTRY STAPLES ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-amber-500">Customer Favorites</span>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
              Best Selling Kirana Staples
            </h2>
          </div>
          <Link href="/shop?filter=best-sellers" className="text-xs font-bold text-amber-500 hover:underline flex items-center gap-1">
            View All Best Sellers <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </section>


      {/* ===== FAQ SECTION ===== */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Kirana Supermarket FAQ</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Answers to common questions about fresh organic deliveries, sourcing, and returns.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-sm text-zinc-900 dark:text-white flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronRight
                  className={`w-4 h-4 text-amber-500 transition-transform ${
                    openFAQ === idx ? "rotate-90" : ""
                  }`}
                />
              </button>
              {openFAQ === idx && (
                <div className="px-5 pb-5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
