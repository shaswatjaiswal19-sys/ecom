"use client";

import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";
import { signInWithFirebaseGoogle } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function SignInPage() {
  const handleFirebaseGoogleSignIn = async () => {
    try {
      const user = await signInWithFirebaseGoogle();
      toast.success(`Signed in as ${user.displayName || user.email}`);
    } catch (err: any) {
      toast.error(err.message || "Firebase Google Sign-In failed");
    }
  };

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
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Manoj Traders
      </Link>

      <div className="w-full max-w-md space-y-6 text-center z-10">
        {/* Brand Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> Manoj Traders Account Portal
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Welcome Back</h1>
          <p className="text-zinc-400 text-sm">Sign in to access your orders, wishlist & wallet rewards</p>
        </div>

        {/* Firebase Google Sign In Option */}
        <button
          onClick={handleFirebaseGoogleSignIn}
          className="w-full py-3.5 px-4 rounded-2xl bg-white text-zinc-900 font-bold text-sm hover:bg-zinc-100 transition-colors flex items-center justify-center gap-3 shadow-xl"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google (Firebase)
        </button>

        {/* Clerk Sign In Box */}
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
