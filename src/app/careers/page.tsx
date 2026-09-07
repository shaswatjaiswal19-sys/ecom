"use client";

import { Sparkles, Briefcase, MapPin, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const JOBS = [
  {
    title: "Senior Full Stack Engineer (Next.js 15 & Firebase)",
    department: "Engineering",
    location: "Mumbai / Remote",
    type: "Full-Time",
  },
  {
    title: "Luxury Product Curator & Buyer",
    department: "Procurement",
    location: "Mumbai",
    type: "Full-Time",
  },
  {
    title: "Head of Concierge & VIP Customer Care",
    department: "Customer Experience",
    location: "Bangalore",
    type: "Full-Time",
  },
];

export default function CareersPage() {
  const handleApply = (title: string) => {
    toast.success(`Application window opened for ${title}. Send CV to careers@manojtraders.com`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Join Our Team
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Build the Future of Luxury E-Commerce</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Work with high-caliber engineers, designers, and curators passionate about perfection.
        </p>
      </div>

      <div className="space-y-4 max-w-4xl mx-auto">
        {JOBS.map((job) => (
          <div
            key={job.title}
            className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">{job.department}</span>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{job.title}</h3>
              <p className="text-xs text-zinc-400 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {job.location} • {job.type}
              </p>
            </div>

            <button
              onClick={() => handleApply(job.title)}
              className="px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              Apply Position <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
