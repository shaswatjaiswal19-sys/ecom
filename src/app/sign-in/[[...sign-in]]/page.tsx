"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-400/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800 backdrop-blur-md"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to SHASWAT ECOM
      </Link>

      <div className="w-full max-w-md space-y-6 text-center z-10">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> SHASWAT ECOM Account Portal
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">Sign in to access your orders, wishlist & wallet rewards</p>
        </div>

        {/* Pure Clerk Sign In Box */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                card: "bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-xl rounded-3xl p-6",
                headerTitle: "text-white font-bold text-xl",
                headerSubtitle: "text-zinc-400 text-sm",
                socialButtonsBlockButton:
                  "bg-zinc-800 hover:bg-zinc-750 text-white border border-zinc-700 rounded-xl transition-all font-medium text-sm",
                formButtonPrimary:
                  "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 py-2.5",
                formFieldInput:
                  "bg-zinc-800/80 border border-zinc-700 text-white rounded-xl focus:border-amber-500 transition-colors",
                footerActionLink: "text-amber-400 font-semibold hover:underline",
              },
            }}
          />
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-Bit SSL Encrypted & Clerk Authenticated</span>
        </div>
      </div>
    </div>
  );
}
