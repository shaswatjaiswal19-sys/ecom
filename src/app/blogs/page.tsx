"use client";

import Link from "next/link";
import { Sparkles, Calendar, User, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "future-of-hi-fi-audio-2026",
    title: "The Future of Hi-Fi Audio: Lossless Wireless & Planar Drivers",
    excerpt: "Exploring how planar magnetic technology and next-gen lossless Bluetooth codecs are redefining acoustic reproduction in modern luxury listening spaces.",
    author: "Manoj Traders Editorial",
    date: "August 2, 2026",
    category: "Audio Engineering",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "titanium-horology-buying-guide",
    title: "Grade 5 Titanium in Luxury Horology: Why Material Matters",
    excerpt: "An in-depth analysis of aerospace-grade titanium, micro-bead blasting, and sapphire crystal coating in contemporary smartwatch architecture.",
    author: "Shaswat Jaiswal",
    date: "July 28, 2026",
    category: "Horology & Tech",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "curating-a-smart-home-ecosystem",
    title: "Curating an Uncompromising Smart Home Audio Ecosystem",
    excerpt: "How to architect seamless multi-room audio with zero latency using optical pass-through and audiophile DAC amplifiers.",
    author: "Acoustic Engineering Team",
    date: "July 15, 2026",
    category: "Smart Living",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
  },
];

export default function BlogsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Manoj Traders Journal
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Insights & Innovations</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Deep dives into acoustic science, horological craftsmanship, and high-tech lifestyle.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase">
                  {post.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="font-bold text-lg text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0">
              <Link
                href={`/blogs/${post.slug}`}
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 hover:underline"
              >
                Read Full Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
