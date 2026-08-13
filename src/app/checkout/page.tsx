"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore, useShippingStore } from "@/lib/store";
import { createOrderInStore } from "@/lib/firestore";
import { formatCurrency } from "@/lib/utils";
// Clerk user hook removed - not needed for checkout
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, MapPin, CreditCard, ShieldCheck, Truck, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { useAuthStore } from "@/lib/authStore";
import { signInWithFirebaseGoogle } from "@/lib/firebase";

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name required"),
  phone: z.string().min(10, "Valid phone required"),
  streetAddress: z.string().min(5, "Street address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  pincode: z.string().min(6, "6-digit pincode required").max(6),
  country: z.string().default("India"),
});

type AddressForm = z.infer<typeof addressSchema>;

type PaymentMethod = "Stripe" | "Razorpay" | "UPI" | "COD";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
  { id: "Stripe", label: "Credit / Debit Card", icon: "💳", description: "Visa, Mastercard, AMEX — Secure Stripe Encryption" },
  { id: "Razorpay", label: "Razorpay", icon: "⚡", description: "Cards, Net Banking, UPI, Wallets — via Razorpay" },
  { id: "UPI", label: "UPI Direct Transfer", icon: "📱", description: "GPay, PhonePe, BHIM UPI — Instant Confirmation" },
  { id: "COD", label: "Cash on Delivery", icon: "💵", description: "Pay with cash upon delivery at your doorstep" },
];

const STEPS = ["Authentication", "Shipping Address", "Payment", "Review Order"];

export default function CheckoutPage() {
  const clerkUser = null; // Clerk user not used
  const { user: authUser, isAuthenticated, login, syncWithClerk } = useAuthStore();
  const router = useRouter();

  const activeUser = authUser || (clerkUser ? {
    id: clerkUser.id,
    fullName: clerkUser.fullName || "Customer",
    email: clerkUser.primaryEmailAddress?.emailAddress || "customer@manojtraders.com",
    phone: clerkUser.primaryPhoneNumber?.phoneNumber || "",
  } : null);

  const isUserLoggedIn = Boolean(isAuthenticated || clerkUser || activeUser);

  const [step, setStep] = useState(isUserLoggedIn ? 1 : 0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [upiUtr, setUpiUtr] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [quickLoginPhone, setQuickLoginPhone] = useState("");
  const [quickLoginName, setQuickLoginName] = useState("");

  const { cart, clearCart, getCartTotal, couponCode, discountAmount } = useCartStore();
  const { shippingFee: configuredShippingFee, freeShippingThreshold } = useShippingStore();
  const { subtotal, tax, total } = getCartTotal();
  const shippingFee = (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) ? 0 : (configuredShippingFee || 0);
  const finalTotal = total + shippingFee;

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: activeUser?.fullName || "",
      phone: activeUser?.phone || "",
      country: "India",
    },
  });

  const handleCheckoutGoogleSignIn = async () => {
    try {
      const gUser = await signInWithFirebaseGoogle();
      login({
        id: gUser.uid,
        email: gUser.email || "google-user@manojtraders.com",
        fullName: gUser.displayName || "Google Customer",
        avatar: gUser.photoURL || undefined,
      });
      form.setValue("fullName", gUser.displayName || "Google Customer");
      toast.success(`Logged in as ${gUser.displayName || "Customer"}`);
      setStep(1);
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        toast.error(err.message || "Google Sign-In failed");
      }
    }
  };

  const handleQuickCheckoutLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLoginPhone.trim()) {
      toast.error("Please enter your mobile phone number or email");
      return;
    }
    const isEmail = quickLoginPhone.includes("@");
    const name = quickLoginName.trim() || (isEmail ? quickLoginPhone.split("@")[0] : "Customer");
    login({
      fullName: name,
      email: isEmail ? quickLoginPhone.trim() : `${quickLoginPhone.replace(/\D/g, "")}@customer.manojtraders.com`,
      phone: !isEmail ? quickLoginPhone.trim() : "+91 98765 43210",
    });
    form.setValue("fullName", name);
    if (!isEmail) form.setValue("phone", quickLoginPhone.trim());
    toast.success("Signed in & session saved! You can now complete your order.");
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === "UPI" && !upiUtr.trim()) {
      toast.error("Please enter your 12-digit UPI UTR / Reference Number after paying");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const addressData = form.getValues();
      const shippingAddress = { ...addressData, id: `addr-${Date.now()}`, type: "Home" as const };

      const order = await createOrderInStore({
        userId: activeUser?.id || "guest",
        customerName: addressData.fullName,
        customerEmail: activeUser?.email || "customer@manojtraders.com",
        customerPhone: addressData.phone,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          image: item.product.images[0],
          price: item.selectedVariant?.price || item.product.price,
          quantity: item.quantity,
          variantName: item.selectedVariant?.name,
        })),
        shippingAddress,
        billingAddress: shippingAddress,
        subtotal,
        tax,
        shippingFee,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === "UPI" ? "Pending Verification" : paymentMethod === "COD" ? "Pending" : "Paid",
        upiUtr: paymentMethod === "UPI" ? upiUtr.trim() : undefined,
      });

      clearCart();
      toast.success(
        paymentMethod === "UPI"
          ? "UPI Payment submitted! Admin will verify your UTR and confirm your order. 🎉"
          : "Order Placed Successfully! 🎉"
      );
      router.push(`/order-confirmation/${order.id}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">Your cart is empty</h2>
        <Link href="/shop" className="text-amber-500 font-bold hover:underline">← Back to Catalog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-10">Secure Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                    i < step
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : i === step
                      ? "border-amber-500 bg-amber-500 text-black"
                      : "border-zinc-300 dark:border-zinc-700 text-zinc-400"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${i === step ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && <ChevronRight className="w-5 h-5 text-zinc-300 dark:text-zinc-700 mx-2 flex-shrink-0" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 0: Mandatory Authentication Gate */}
            {step === 0 && !isUserLoggedIn && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-amber-500/30 dark:border-amber-500/20 shadow-xl space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> Step 1 of 4: Account Required
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                    Sign In to Complete Your Order
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    To guarantee doorstep delivery, real-time GPS tracking, and digital tax invoices, please sign in or register before checkout. Your session will be saved permanently.
                  </p>
                </div>

                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleCheckoutGoogleSignIn}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-bold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-all flex items-center justify-center gap-3 border border-zinc-200 dark:border-zinc-700 shadow-sm"
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
                  <span>1-Click Sign In with Google</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                  <span className="flex-shrink mx-4 text-xs text-zinc-400 font-semibold uppercase">Or Instant Mobile / Email</span>
                  <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
                </div>

                {/* Instant Quick Login Form */}
                <form onSubmit={handleQuickCheckoutLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Shaswat Jaiswal"
                      value={quickLoginName}
                      onChange={(e) => setQuickLoginName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                      Mobile Number or Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 98765 43210 or user@example.com"
                      value={quickLoginPhone}
                      onChange={(e) => setQuickLoginPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                  >
                    <span>Sign In & Continue to Address</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <Link
                    href="/sign-in?redirect=/checkout"
                    className="text-xs font-semibold text-zinc-500 hover:text-amber-500 transition-colors"
                  >
                    Prefer to use full Clerk Sign In portal? Click here →
                  </Link>
                </div>
              </div>
            )}

            {/* STEP 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" /> Shipping Address
                  </h2>
                  {activeUser && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                      ✓ Logged in as {activeUser.fullName}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "fullName", label: "Full Name", placeholder: "Your full name", col: 1 },
                    { name: "phone", label: "Mobile Number", placeholder: "+91 98765 43210", col: 1 },
                    { name: "streetAddress", label: "Street Address", placeholder: "Flat / House No, Building, Street", col: 2 },
                    { name: "city", label: "City", placeholder: "City", col: 1 },
                    { name: "state", label: "State", placeholder: "State", col: 1 },
                    { name: "pincode", label: "PIN Code", placeholder: "110001", col: 1 },
                    { name: "country", label: "Country", placeholder: "India", col: 1 },
                  ].map((field) => (
                    <div key={field.name} className={field.col === 2 ? "md:col-span-2" : ""}>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wider">
                        {field.label}
                      </label>
                      <input
                        {...form.register(field.name as keyof AddressForm)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                      />
                      {form.formState.errors[field.name as keyof AddressForm] && (
                        <p className="text-xs text-rose-500 mt-1">
                          {form.formState.errors[field.name as keyof AddressForm]?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => form.handleSubmit(() => setStep(2))()}
                  className="mt-6 w-full py-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-sm hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Payment Selection */}
            {step === 2 && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" /> Select Payment Method
                </h2>

                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === opt.id
                          ? "border-amber-500 bg-amber-500/5"
                          : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.id}
                        checked={paymentMethod === opt.id}
                        onChange={() => setPaymentMethod(opt.id)}
                        className="sr-only"
                      />
                      <span className="text-2xl">{opt.icon}</span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-zinc-900 dark:text-white">{opt.label}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">{opt.description}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === opt.id ? "border-amber-500 bg-amber-500" : "border-zinc-300 dark:border-zinc-700"}`}>
                        {paymentMethod === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </label>
                  ))}
                </div>

                {/* PhonePe & UPI Instant QR Code Section */}
                {paymentMethod === "UPI" && (
                  <div className="mt-6 p-6 bg-gradient-to-b from-purple-500/10 via-amber-500/5 to-transparent border border-purple-500/30 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Generated PhonePe QR Code Graphic */}
                      <div className="w-40 h-40 bg-white p-3 rounded-2xl border-2 border-purple-500/40 shadow-xl flex flex-col items-center justify-center flex-shrink-0 text-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=9170215145@axl%26pn=SHASWAT%20JAISWAL%26am=${finalTotal}`}
                          alt="PhonePe QR Code - SHASWAT JAISWAL"
                          className="w-full h-full object-contain"
                        />
                        <span className="text-[9px] font-extrabold text-purple-700 uppercase tracking-tighter mt-1">
                          PhonePe Accepted Here
                        </span>
                      </div>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                          <span>पे</span> PhonePe Official Business QR
                        </div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                          Account Name: <span className="text-amber-500 font-extrabold">SHASWAT JAISWAL</span>
                        </h4>
                        <p className="text-xs text-zinc-500">Scan QR code using PhonePe, GPay, Paytm or copy VPA ID:</p>
                        
                        <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                          <span className="font-mono font-black text-xs bg-white dark:bg-zinc-950 px-3.5 py-1.5 rounded-xl border border-purple-500/30 text-purple-600 dark:text-purple-400 shadow-xs">
                            9170215145@axl
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText("9170215145@axl");
                              toast.success("UPI VPA 9170215145@axl copied!");
                            }}
                            className="text-xs font-extrabold px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300 hover:bg-purple-500 hover:text-white transition-colors"
                          >
                            Copy UPI ID
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* UTR Input Field */}
                    <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
                      <label className="block text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
                        Enter 12-Digit UPI Transaction UTR / Ref Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 329182391029 (Found in GPay/PhonePe payment receipt)"
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-mono font-bold text-zinc-900 dark:text-white outline-none focus:border-amber-500 transition-colors shadow-sm"
                      />
                      <p className="text-[11px] text-zinc-500">
                        ⚡ Admin will verify your UTR number and approve your order immediately.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:border-zinc-400 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-sm hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    Review Order <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Confirm */}
            {step === 3 && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6">Review Your Order</h2>

                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-3 items-center p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-black/5">
                        <Image src={item.product.images[0]} alt={item.product.name} fill className="object-contain p-1.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{item.product.name}</p>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                          {item.selectedVariant ? (
                            <span>{item.selectedVariant.name}</span>
                          ) : item.product.weight ? (
                            <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                              {item.product.weight}
                            </span>
                          ) : null}
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                            Qty: {item.quantity} {item.product.unit ? `(${item.product.unit})` : ""}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                        {formatCurrency((item.selectedVariant?.price || item.product.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Summary info */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl mb-6 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping to:</span>
                    <span className="font-semibold text-zinc-900 dark:text-white text-right max-w-[200px]">
                      {form.getValues("streetAddress")}, {form.getValues("city")}, {form.getValues("state")} - {form.getValues("pincode")}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Payment:</span>
                    <span className="font-semibold text-zinc-900 dark:text-white">{paymentMethod}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:border-zinc-400 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-70"
                  >
                    {isPlacingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {isPlacingOrder ? "Placing Order..." : "Place Order Now"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm sticky top-28">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">Order Total</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Coupon Savings</span>
                    <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>GST (18%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-500">FREE</span>
                  ) : (
                    <span className="font-semibold">{formatCurrency(shippingFee)}</span>
                  )}
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2.5 flex justify-between">
                  <span className="text-base font-black text-zinc-900 dark:text-white">Total</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                256-bit SSL Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
