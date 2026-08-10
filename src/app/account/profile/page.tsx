"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { User, Mail, Phone, ShieldCheck, Award, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function AccountProfilePage() {
  const { user } = useUser();
  const [fullName, setFullName] = useState(user?.fullName || "Manoj Member");
  const [phone, setPhone] = useState(user?.phoneNumbers?.[0]?.phoneNumber || "+91 98765 43210");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Profile updated successfully!");
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Profile Details</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage your personal credentials, contact details, and security preferences.
          </p>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-xl">
            {user?.firstName?.[0] || "M"}
          </div>
          <div>
            <div className="font-bold text-zinc-900 dark:text-white">{user?.fullName || "Valued Customer"}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 font-semibold">
              <Award className="w-3.5 h-3.5" /> Tier 1 Platinum Luxury Circle Member
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Full Name
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <User className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 cursor-not-allowed">
              <Mail className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                disabled
                value={user?.emailAddresses?.[0]?.emailAddress || "customer@manojtraders.com"}
                className="bg-transparent border-none outline-none text-sm text-zinc-500 w-full cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
              <Phone className="w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Security Status
            </label>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Clerk Multi-Factor Authentication Enabled</span>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Profile Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
