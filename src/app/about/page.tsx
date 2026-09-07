"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Award, Sparkles, Building2, Users, Globe, ArrowRight } from "lucide-react";

const STATS = [
  { label: "Years of Trust", value: "25+" },
  { label: "Luxury Products", value: "10,000+" },
  { label: "Satisfied Clients", value: "500,000+" },
  { label: "Metros Covered", value: "120+" },
];

const PILLARS = [
  {
    title: "100% Authentic Quality",
    description: "Every item in our inventory is sourced directly from original manufacturers with global warranties and holographic authenticity certificates.",
    icon: ShieldCheck,
  },
  {
    title: "White Glove Logistics",
    description: "Our proprietary logistics network ensures climate-controlled, insured express transit within 24 to 48 hours to major metro destinations.",
    icon: Building2,
  },
  {
    title: "24/7 VIP Concierge",
    description: "Dedicated personal account representatives ready to assist with custom orders, corporate procurement, and technical support.",
    icon: Award,
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-20 py-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-zinc-950 text-white p-8 sm:p-16 border border-zinc-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Est. 1999 • Luxury Retail Pioneer
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
            Quality Products. <br />
            <span className="gold-gradient-text">Trusted Service.</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            For over two decades, Manoj Traders has stood at the intersection of precision engineering, luxury aesthetics, and uncompromised customer trust. We curate world-class technology, audio, horology, and lifestyle instruments for discerning clients across India.
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-center space-y-2 shadow-sm"
            >
              <div className="text-4xl sm:text-5xl font-black text-amber-500">{s.value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Brand Pillars */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Our Core Commitments</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">
            Built on a legacy of integrity, perfectionism, and client satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-black flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Experience Manoj Traders Privilege</h3>
            <p className="text-zinc-950/80 text-sm font-medium">Browse our full luxury catalog with complimentary insured shipping.</p>
          </div>
          <Link
            href="/shop"
            className="px-8 py-4 rounded-2xl bg-black text-amber-400 font-bold text-sm hover:bg-zinc-900 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
