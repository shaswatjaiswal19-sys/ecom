"use client";

import { useState } from "react";
import { MOCK_BANNERS } from "@/lib/mockData";
import { Banner } from "@/types";
import { Image as ImageIcon, Plus, Trash2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(MOCK_BANNERS);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");

  const handleAddBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const created: Banner = {
      id: `bnr-${Date.now()}`,
      title,
      subtitle: subtitle || "Special Collection Highlight",
      badge: "EXCLUSIVE",
      ctaText: "Explore Now",
      ctaLink: "/shop",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
      active: true,
    };
    setBanners([...banners, created]);
    setShowModal(false);
    setTitle("");
    toast.success("Hero banner added to homepage slider!");
  };

  const handleDelete = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    toast.success("Banner deleted.");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">Banners & Hero Slider</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage main promotional sliders, sales announcements, and hero visual assets.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Add Hero Banner
        </button>
      </div>

      {showModal && (
        <form onSubmit={handleAddBanner} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-amber-500/30 shadow-2xl space-y-4">
          <h3 className="text-lg font-black text-zinc-900 dark:text-white">Create Hero Slider Banner</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Banner Main Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
            />
            <input
              type="text"
              placeholder="Subtitle / Tagline"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400"
            >
              Publish Banner
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="relative rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-lg group h-64 flex flex-col justify-between p-6 bg-zinc-900 text-white"
          >
            <img
              src={b.imageUrl}
              alt={b.title}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
            />
            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase">
                {b.badge}
              </span>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-2 rounded-xl bg-red-500/80 text-white hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl font-black">{b.title}</h3>
              <p className="text-xs text-zinc-300">{b.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
