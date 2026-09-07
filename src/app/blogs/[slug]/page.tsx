"use client";

import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import { ArrowLeft, Share2, Sparkles, Clock, Calendar, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  content: {
    intro: string;
    sections: { heading: string; body: string }[];
    quote: string;
  };
}

const ARTICLES: Record<string, BlogArticle> = {
  "future-of-hi-fi-audio-2026": {
    slug: "future-of-hi-fi-audio-2026",
    title: "The Future of Hi-Fi Audio: Lossless Wireless & Planar Drivers",
    excerpt: "Exploring how planar magnetic technology and next-gen lossless Bluetooth codecs are redefining acoustic reproduction in modern luxury listening spaces.",
    author: "Manoj Traders Editorial",
    date: "August 2, 2026",
    category: "Audio Engineering",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200",
    content: {
      intro: "Acoustic engineering is experiencing a historic renaissance. For decades, audiophiles faced a stark trade-off between wireless convenience and uncompressed acoustic fidelity.",
      sections: [
        {
          heading: "1. The Rise of Planar Magnetic Transducers",
          body: "Unlike dynamic cone drivers that push air via a central voice coil attached to a diaphragm, planar magnetic drivers utilize an ultra-thin film membrane suspended between powerful neodymium magnets. The result is near-instantaneous transient response with zero cone breakup or harmonic distortion.",
        },
        {
          heading: "2. Uncompressed 24-bit/192kHz Wireless Codecs",
          body: "With next-gen Ultra-Wideband (UWB) transmission and LDAC+ codecs, listeners can now stream uncompressed master studio files directly from their smartphones to active high-resolution acoustic speakers.",
        },
      ],
      quote: "At Manoj Traders, we benchmark every acoustic system not just against technical lab specs, but against live unamplified orchestral performances.",
    },
  },
  "titanium-horology-buying-guide": {
    slug: "titanium-horology-buying-guide",
    title: "Grade 5 Titanium in Luxury Horology: Why Material Matters",
    excerpt: "An in-depth analysis of aerospace-grade titanium, micro-bead blasting, and sapphire crystal coating in contemporary smartwatch architecture.",
    author: "Shaswat Jaiswal",
    date: "July 28, 2026",
    category: "Horology & Tech",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200",
    content: {
      intro: "Grade 5 Titanium (Ti-6Al-4V) represents the gold standard in aerospace craftsmanship. When engineered into luxury smartwatches, it delivers an unprecedented strength-to-weight ratio.",
      sections: [
        {
          heading: "1. Corrosion Resistance & Thermal Stability",
          body: "Unlike standard stainless steel, Grade 5 Titanium is virtually impervious to seawater corrosion, perspiration, and extreme temperature fluctuations, retaining its lustrous satin finish for decades.",
        },
        {
          heading: "2. Scratch-Resistant Sapphire Crystal Architecture",
          body: "Coupled with double-domed anti-reflective sapphire crystal glass rated 9 on the Mohs mineral hardness scale, contemporary titanium smartwatches provide enduring heirloom durability.",
        },
      ],
      quote: "True luxury is imperceptible weight combined with indestructible structural resilience.",
    },
  },
  "curating-a-smart-home-ecosystem": {
    slug: "curating-a-smart-home-ecosystem",
    title: "Curating an Uncompromising Smart Home Audio Ecosystem",
    excerpt: "How to architect seamless multi-room audio with zero latency using optical pass-through and audiophile DAC amplifiers.",
    author: "Acoustic Engineering Team",
    date: "July 15, 2026",
    category: "Smart Living",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
    content: {
      intro: "Architecting a multi-room smart audio environment requires careful harmonization of high-resolution digital-to-analog converters (DACs), low-noise amplifiers, and synchronized stream protocols.",
      sections: [
        {
          heading: "1. Zero Latency Stream Architecture",
          body: "By implementing Wi-Fi 7 mesh topologies and dedicated sub-millisecond audio sync protocols, multi-zone living rooms, kitchens, and patios deliver completely unified acoustic ambiance without phase cancellation.",
        },
        {
          heading: "2. Audiophile Acoustic Tuning",
          body: "Room correction DSP algorithms analyze ambient furniture resonance and wall reflections to automatically calibrate equalization curves in real-time.",
        },
      ],
      quote: "A thoughtfully designed soundstage disappears into the architecture, leaving only pure, evocative music.",
    },
  },
};

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const article = ARTICLES[slug] || ARTICLES["future-of-hi-fi-audio-2026"];

  const handleShare = () => {
    navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
    toast.success("Article link copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <Link
        href="/blogs"
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-amber-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Journal
      </Link>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider">
          {article.category}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-between border-y border-zinc-100 dark:border-zinc-800 py-4 text-xs text-zinc-400">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-semibold text-zinc-900 dark:text-white">By {article.author}</span>
            <span>•</span>
            <span>{article.date}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>

          <button onClick={handleShare} className="flex items-center gap-1.5 hover:text-amber-500 transition-colors font-semibold">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>

      <div className="relative w-full h-[380px] sm:h-[450px] rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-lg">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="prose dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-6 text-sm sm:text-base">
        <p className="text-lg font-medium text-zinc-900 dark:text-white leading-relaxed">
          {article.content.intro}
        </p>

        {article.content.sections.map((section, idx) => (
          <div key={idx} className="space-y-3 pt-2">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              {section.heading}
            </h2>
            <p className="leading-relaxed">
              {section.body}
            </p>
          </div>
        ))}

        <blockquote className="border-l-4 border-amber-500 pl-4 py-2 italic font-serif text-zinc-800 dark:text-zinc-200 bg-amber-500/5 rounded-r-2xl my-6">
          &ldquo;{article.content.quote}&rdquo;
        </blockquote>

        <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 mt-8">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Manoj Traders Editorial Standards
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            All reviews and buying guides are independently verified by our engineering and master procurement team.
          </p>
        </div>
      </div>
    </div>
  );
}
