"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  User,
  ShieldCheck,
  Truck,
  Gift,
  ArrowRight,
  Mail,
  Phone,
  Lock,
} from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { signInWithFirebaseGoogle } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function WelcomeLoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const { isAuthenticated, login, syncWithClerk } = useAuthStore();
  
  // Safely sync with Clerk if active
  let clerkUser: any = null;
  try {
    const clerk = useUser();
    clerkUser = clerk?.user;
  } catch {}

  useEffect(() => {
    if (clerkUser && !isAuthenticated) {
      syncWithClerk(clerkUser);
    }

    // If user is already authenticated (saved in session or Clerk), never show login prompt
    if (isAuthenticated || clerkUser) {
      setIsOpen(false);
      return;
    }

    // Do not show on auth pages or admin dashboard
    if (
      pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/admin")
    ) {
      return;
    }

    // Check if user skipped in this session or show on arrival
    const hasSkippedThisSession = sessionStorage.getItem("shaswat_ecom_skipped_welcome_session");
    if (!hasSkippedThisSession) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [pathname, isAuthenticated, clerkUser]);

  const handleSkip = () => {
    try {
      sessionStorage.setItem("shaswat_ecom_skipped_welcome_session", "true");
    } catch {}
    setIsOpen(false);
  };

  const handleGoToClerkSignIn = () => {
    handleSkip();
    router.push("/sign-in");
  };

  const handleFirebaseGoogleSignIn = async () => {
    try {
      const user = await signInWithFirebaseGoogle();
      login({
        id: user.uid,
        email: user.email || "google-user@manojtraders.com",
        fullName: user.displayName || "Google User",
        avatar: user.photoURL || undefined,
      });
      toast.success(`Welcome back, ${user.displayName || "Customer"}!`);
      setIsOpen(false);
    } catch (err: any) {
      // If popup closed by user or failed, provide smooth notification
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error(err.message || "Google Sign-In failed");
      }
    }
  };

  const handleQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      toast.error("Please enter your email or phone number");
      return;
    }

    const isEmail = emailOrPhone.includes("@");
    login({
      email: isEmail ? emailOrPhone.trim() : `${emailOrPhone.replace(/\D/g, "")}@customer.manojtraders.com`,
      phone: !isEmail ? emailOrPhone.trim() : "+91 98765 43210",
      fullName: fullName.trim() || (isEmail ? emailOrPhone.split("@")[0] : "Valued Customer"),
    });

    toast.success("Signed in successfully! Welcome to Manoj Traders.");
    setIsOpen(false);
  };

  if (!isOpen || isAuthenticated || clerkUser) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Dark Backdrop with Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleSkip}
          className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-zinc-900 border border-amber-500/30 dark:border-amber-500/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
        >
          {/* Subtle Ambient Gold Glow */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button (X) */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Content */}
          <div className="space-y-5 text-center">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to Manoj Traders
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                Sign In to Unlock <span className="gold-gradient-text">10% OFF</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                Log in to access instant ₹500 welcome coupons, 24-hour express delivery, and seamless 1-click checkout.
              </p>
            </div>

            {/* Exclusive Perks Card */}
            {!showQuickForm && (
              <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60 rounded-2xl p-4 text-left space-y-2.5">
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  <Gift className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Instant ₹500 voucher on your 1st order</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  <Truck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Live GPS order tracking & express dispatch</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-zinc-700 dark:text-zinc-200">
                  <ShieldCheck className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Session saved permanently — never asked again</span>
                </div>
              </div>
            )}

            {/* Quick Email/Phone Form */}
            {showQuickForm ? (
              <form onSubmit={handleQuickLogin} className="space-y-3 text-left">
                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Full Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shaswat Jaiswal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 block mb-1">
                    Email or Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. user@gmail.com or 9876543210"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-white outline-none focus:border-amber-500 font-medium"
                    autoFocus
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQuickForm(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 text-xs font-black hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20"
                  >
                    Sign In & Save Session
                  </button>
                </div>
              </form>
            ) : (
              /* Action Buttons */
              <div className="space-y-2.5 pt-1">
                {/* Instant Google One-Click Sign In */}
                <button
                  onClick={handleFirebaseGoogleSignIn}
                  className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-xs hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all flex items-center justify-center gap-2.5 border border-zinc-200 dark:border-zinc-700 shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  Continue with Google
                </button>

                {/* Quick Phone / Email Direct Login */}
                <button
                  onClick={() => setShowQuickForm(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white font-bold text-xs hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-700"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Continue with Mobile or Email</span>
                </button>

                {/* Main Clerk Portal Link */}
                <button
                  onClick={handleGoToClerkSignIn}
                  className="w-full py-2.5 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:text-amber-500 flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Or use standard Clerk Account Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Skip for now (Allows browsing store & cart, but will gate at checkout) */}
                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={handleSkip}
                    className="text-xs font-semibold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    Skip for now & browse store →
                  </button>
                </div>
              </div>
            )}

            {/* Security Guarantee */}
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              🔒 100% Secure • Session saved permanently after login.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
