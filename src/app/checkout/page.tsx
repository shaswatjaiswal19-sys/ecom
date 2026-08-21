"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCartStore, useShippingStore } from "@/lib/store";
import { createOrderInStore } from "@/lib/firestore";
import { formatCurrency } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Order } from "@/types";
import { useUser, SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, MapPin, CreditCard, ShieldCheck, Truck, ArrowRight, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

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

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi NCR", "Chandigarh", "Jammu and Kashmir", "Ladakh"
];

export default function CheckoutPage() {
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const { dict, getLocalizedProduct, formatWeight, language } = useLanguage();

  const isUserLoggedIn = Boolean(clerkUser);

  const guestSteps = [
    language === "hi" ? "प्रमाणीकरण" : "Authentication",
    dict.checkout.shippingAddress,
    dict.checkout.paymentMethod,
    language === "hi" ? "ऑर्डर समीक्षा" : "Review Order"
  ];
  const authSteps = [
    dict.checkout.shippingAddress,
    dict.checkout.paymentMethod,
    language === "hi" ? "ऑर्डर समीक्षा" : "Review Order"
  ];

  const paymentOptions: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
    {
      id: "UPI",
      label: dict.checkout.upi,
      icon: "📱",
      description: language === "hi" ? "PhonePe, Google Pay, Paytm — तुरंत क्यूआर कोड स्कैन" : "GPay, PhonePe, BHIM UPI — Instant Confirmation"
    },
    {
      id: "Stripe",
      label: dict.checkout.card,
      icon: "💳",
      description: language === "hi" ? "वीज़ा, मास्टरकार्ड, रुपे — सुरक्षित भुगतान" : "Visa, Mastercard, AMEX — Secure Stripe Encryption"
    },
    {
      id: "Razorpay",
      label: dict.checkout.netBanking,
      icon: "⚡",
      description: language === "hi" ? "कार्ड, नेट बैंकिंग, यूपीआई, वॉलेट — रेज़रपे द्वारा" : "Cards, Net Banking, UPI, Wallets — via Razorpay"
    },
    {
      id: "COD",
      label: dict.checkout.cashOnDelivery,
      icon: "💵",
      description: language === "hi" ? "डिलीवरी के समय घर पर नकद भुगतान करें" : "Pay with cash upon delivery at your doorstep"
    },
  ];

  // If user is already logged in, start directly at Shipping Address (step 1).
  const [step, setStep] = useState(isUserLoggedIn ? 1 : 0);

  // Ensure step state synchronizes after client rehydration
  useEffect(() => {
    if (isUserLoggedIn && step === 0) {
      setStep(1);
    } else if (!isUserLoggedIn && step === 0) {
      setStep(0);
    }
  }, [isUserLoggedIn, step]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("UPI");
  const [upiUtr, setUpiUtr] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const { cart, clearCart, getCartTotal, couponCode, discountAmount } = useCartStore();
  const { shippingFee: configuredShippingFee, freeShippingThreshold } = useShippingStore();
  const { subtotal, tax, total } = getCartTotal();
  const shippingFee = (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) ? 0 : (configuredShippingFee || 0);
  const finalTotal = total + shippingFee;

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: clerkUser?.fullName || "",
      phone: clerkUser?.primaryPhoneNumber?.phoneNumber || "",
      streetAddress: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
  });

  // Keep form values populated if user logs in or hydrates
  useEffect(() => {
    const name = clerkUser?.fullName;
    const phone = clerkUser?.primaryPhoneNumber?.phoneNumber;
    if (name && !form.getValues("fullName")) {
      form.setValue("fullName", name);
    }
    if (phone && !form.getValues("phone")) {
      form.setValue("phone", phone);
    }
  }, [clerkUser, form]);

  const handlePlaceOrder = async () => {
    if (paymentMethod === "UPI" && !upiUtr.trim()) {
      toast.error(language === "hi" ? "कृपया भुगतान के बाद अपना 12-अंकीय यूपीआई यूटीआर / संदर्भ संख्या दर्ज करें" : "Please enter your 12-digit UPI UTR / Reference Number after paying");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const addressData = form.getValues();
      const shippingAddress = { ...addressData, id: `addr-${Date.now()}`, type: "Home" as const };

      const resolvedUserId = clerkUser?.id || "guest";
      const resolvedEmail = clerkUser?.primaryEmailAddress?.emailAddress || "customer@shaswatecom.com";
      const resolvedPhone = addressData.phone || clerkUser?.primaryPhoneNumber?.phoneNumber || "+91 99999 99999";

      const orderPayload: Partial<Order> = {
        userId: resolvedUserId,
        customerName: addressData.fullName || clerkUser?.fullName || "Customer",
        customerEmail: resolvedEmail,
        customerPhone: resolvedPhone,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          image: item.product.images[0] || "",
          price: item.selectedWeight?.price || item.selectedVariant?.price || item.product.price,
          quantity: item.quantity,
          variantName: item.selectedVariant?.name,
          selectedWeight: item.selectedWeight?.weight,
          selectedWeightId: item.selectedWeight?.id,
        })),
        shippingAddress,
        billingAddress: shippingAddress,
        subtotal,
        tax,
        shippingFee,
        discount: discountAmount,
        total: finalTotal,
        paymentMethod,
        paymentStatus: (paymentMethod === "UPI" ? "Pending Verification" : paymentMethod === "COD" ? "Pending" : "Paid") as Order["paymentStatus"],
        upiUtr: paymentMethod === "UPI" ? upiUtr.trim() : undefined,
      };

      // 1. Create order on backend API & Firestore
      let order: Order | null = null;
      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        const data = await res.json();
        if (data.success && data.order) {
          order = data.order;
        } else {
          if (data.error) {
            toast.error(data.error);
            setIsPlacingOrder(false);
            return;
          }
          order = await createOrderInStore(orderPayload);
        }
      } catch (err: any) {
        try {
          order = await createOrderInStore(orderPayload);
        } catch (directErr: any) {
          toast.error(directErr.message || "Failed to place order. Stock may be unavailable.");
          setIsPlacingOrder(false);
          return;
        }
      }

      if (!order) {
        toast.error("Failed to confirm order.");
        setIsPlacingOrder(false);
        return;
      }

      clearCart();
      toast.success(
        paymentMethod === "UPI"
          ? (language === "hi" ? "यूपीआई भुगतान विवरण सबमिट किया गया! प्रशासक सत्यापन के बाद ऑर्डर की पुष्टि करेंगे। 🎉" : "UPI Payment submitted! Admin will verify your UTR and confirm your order. 🎉")
          : (dict.checkout.orderPlacedSuccess + " 🎉")
      );
      router.push(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order. Please try again.");
      console.error(error);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-24">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-4">{dict.cart.emptyTitle}</h2>
        <Link href="/shop" className="text-amber-500 font-bold hover:underline">← {dict.cart.startShopping}</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-6 sm:py-12 pb-24 lg:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white mb-4 sm:mb-8">{dict.checkout.title}</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-6 sm:mb-10 overflow-x-auto pb-2 scrollbar-none">
          {(isUserLoggedIn ? authSteps : guestSteps).map((s, i) => {
            const activeStepIdx = isUserLoggedIn ? step - 1 : step;
            const stepsList = isUserLoggedIn ? authSteps : guestSteps;
            return (
              <div key={s} className="flex items-center flex-shrink-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-black border-2 transition-all ${
                      i < activeStepIdx
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : i === activeStepIdx
                        ? "border-amber-500 bg-amber-500 text-black shadow-sm"
                        : "border-zinc-300 dark:border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {i < activeStepIdx ? <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : i + 1}
                  </div>
                  <span className={`text-[11px] sm:text-xs font-bold whitespace-nowrap ${i === activeStepIdx ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>
                    {s}
                  </span>
                </div>
                {i < stepsList.length - 1 && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-300 dark:text-zinc-700 mx-1.5 sm:mx-2 flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* STEP 0: Authentication Gate */}
            {step === 0 && !isUserLoggedIn && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-amber-500/30 dark:border-amber-500/20 shadow-xl space-y-6 text-center">
                <div className="w-14 h-14 rounded-3xl bg-amber-500/10 border border-amber-500/20 mx-auto flex items-center justify-center text-amber-500">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-3.5 h-3.5" /> {language === "hi" ? "प्रमाणीकरण" : "Authentication"}
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white">
                    {language === "hi" ? "ऑर्डर पूरा करने के लिए क्लर्क से साइन इन करें" : "Sign In with Clerk to Complete Order"}
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
                    {language === "hi" ? "घर तक डिलीवरी ट्रैकिंग और डिजिटल टैक्स इनवॉइस के लिए कृपया अपने क्लर्क खाते (गूगल, ईमेल या फोन) से साइन इन करें।" : "Please sign in to your Clerk account (Google, Email, or Phone) for doorstep delivery tracking and digital tax invoices."}
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-3 pt-2">
                  <Link
                    href="/sign-in?redirect_url=/checkout"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                  >
                    <span>{dict.nav.signIn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {language === "hi" ? "या अतिथि के रूप में जारी रखें →" : "Or Continue as Guest →"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-black/5 dark:border-white/10 shadow-sm">
                <div className="flex items-center justify-between mb-5 sm:mb-6">
                  <h2 className="text-base sm:text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" /> {dict.checkout.shippingAddress}
                  </h2>
                  {clerkUser && (
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                      ✓ {clerkUser.fullName || clerkUser.firstName || "Signed In"}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                      {dict.checkout.fullName} *
                    </label>
                    <input
                      {...form.register("fullName")}
                      placeholder={dict.checkout.fullNamePlaceholder}
                      className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                    />
                    {form.formState.errors.fullName && (
                      <p className="text-xs text-rose-500 mt-1">{form.formState.errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                      {dict.checkout.phone} *
                    </label>
                    <input
                      {...form.register("phone")}
                      type="tel"
                      placeholder={dict.checkout.phonePlaceholder}
                      className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                    />
                    {form.formState.errors.phone && (
                      <p className="text-xs text-rose-500 mt-1">{form.formState.errors.phone.message}</p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                      {dict.checkout.address} *
                    </label>
                    <input
                      {...form.register("streetAddress")}
                      placeholder={dict.checkout.addressPlaceholder}
                      className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                    />
                    {form.formState.errors.streetAddress && (
                      <p className="text-xs text-rose-500 mt-1">{form.formState.errors.streetAddress.message}</p>
                    )}
                  </div>

                  {/* State (Dropdown Select) */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                      {dict.checkout.state} *
                    </label>
                    <select
                      {...form.register("state")}
                      className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                    >
                      <option value="">{dict.checkout.selectState}</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.state && (
                      <p className="text-xs text-rose-500 mt-1">{form.formState.errors.state.message}</p>
                    )}
                  </div>

                  {/* City / District */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                      {dict.checkout.city} *
                    </label>
                    <input
                      {...form.register("city")}
                      placeholder={dict.checkout.cityPlaceholder}
                      className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                    />
                    {form.formState.errors.city && (
                      <p className="text-xs text-rose-500 mt-1">{form.formState.errors.city.message}</p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                      {dict.checkout.pincode} *
                    </label>
                    <input
                      {...form.register("pincode")}
                      type="text"
                      maxLength={6}
                      placeholder={dict.checkout.pincodePlaceholder}
                      className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm outline-none focus:border-amber-500 transition-colors text-zinc-900 dark:text-white"
                    />
                    {form.formState.errors.pincode && (
                      <p className="text-xs text-rose-500 mt-1">{form.formState.errors.pincode.message}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1 uppercase tracking-wider">
                      {dict.checkout.country}
                    </label>
                    <input
                      {...form.register("country")}
                      disabled
                      value={dict.checkout.countryDefault}
                      className="w-full px-4 py-3 min-h-[46px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-sm outline-none text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <button
                  onClick={() => form.handleSubmit(() => setStep(2))()}
                  className="mt-6 w-full py-3.5 sm:py-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-sm hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  {language === "hi" ? "भुगतान पर आगे बढ़ें" : "Continue to Payment"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Payment Selection */}
            {step === 2 && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-500" /> {dict.checkout.paymentMethod}
                </h2>

                <div className="space-y-3">
                  {paymentOptions.map((opt) => (
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
                          <span>पे</span> {language === "hi" ? "फोनपे आधिकारिक व्यापार क्यूआर" : "PhonePe Official Business QR"}
                        </div>
                        <h4 className="text-sm font-black text-zinc-900 dark:text-white">
                          {language === "hi" ? "खाता धारक:" : "Account Name:"} <span className="text-amber-500 font-extrabold">SHASWAT JAISWAL</span>
                        </h4>
                        <p className="text-xs text-zinc-500">{language === "hi" ? "PhonePe, Google Pay, Paytm से QR स्कैन करें या UPI आईडी कॉपी करें:" : "Scan QR code using PhonePe, GPay, Paytm or copy VPA ID:"}</p>
                        
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
                            {language === "hi" ? "यूपीआई आईडी कॉपी करें" : "Copy UPI ID"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* UTR Input Field */}
                    <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
                      <label className="block text-xs font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider">
                        {language === "hi" ? "12-अंकीय यूपीआई यूटीआर / संदर्भ संख्या दर्ज करें" : "Enter 12-Digit UPI Transaction UTR / Ref Number"} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder={language === "hi" ? "उदा. 329182391029 (PhonePe/GPay रसीद में उपलब्ध)" : "e.g. 329182391029 (Found in GPay/PhonePe payment receipt)"}
                        value={upiUtr}
                        onChange={(e) => setUpiUtr(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 text-sm font-mono font-bold text-zinc-900 dark:text-white outline-none focus:border-amber-500 transition-colors shadow-sm"
                      />
                      <p className="text-[11px] text-zinc-500">
                        ⚡ {language === "hi" ? "प्रशासक आपके यूटीआर नंबर की पुष्टि करेंगे और तुरंत आपका ऑर्डर प्रोसेस करेंगे।" : "Admin will verify your UTR number and approve your order immediately."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:border-zinc-400 transition-colors"
                  >
                    ← {dict.common.back}
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 py-4 rounded-2xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-sm hover:bg-amber-500 hover:text-black transition-all flex items-center justify-center gap-2"
                  >
                    {language === "hi" ? "ऑर्डर समीक्षा" : "Review Order"} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Review & Confirm */}
            {step === 3 && (
              <div className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-6">{language === "hi" ? "अपने ऑर्डर की समीक्षा करें" : "Review Your Order"}</h2>

                <div className="space-y-3 mb-6">
                  {cart.map((item, idx) => {
                    const price = item.selectedWeight?.price || item.selectedVariant?.price || item.product.price;
                    const prodName = getLocalizedProduct(item.product).name;
                    return (
                      <div key={idx} className="flex gap-3 items-center p-3 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-black/5">
                          <Image src={item.product.images[0]} alt={prodName} fill className="object-contain p-1.5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-zinc-900 dark:text-white line-clamp-1">{prodName}</p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                            {item.selectedWeight ? (
                              <span className="font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                {formatWeight(item.selectedWeight.weight)}
                              </span>
                            ) : item.selectedVariant ? (
                              <span>{item.selectedVariant.name}</span>
                            ) : item.product.weight ? (
                              <span className="font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                {formatWeight(item.product.weight)}
                              </span>
                            ) : null}
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {dict.product.quantity}: {item.quantity} {item.product.unit ? `(${item.product.unit})` : ""}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                          {formatCurrency(price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Summary info */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl mb-6 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>{dict.checkout.shippingAddress}:</span>
                    <span className="font-semibold text-zinc-900 dark:text-white text-right max-w-[200px]">
                      {form.getValues("streetAddress")}, {form.getValues("city")}, {form.getValues("state")} - {form.getValues("pincode")}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>{dict.checkout.paymentMethod}:</span>
                    <span className="font-semibold text-zinc-900 dark:text-white">{paymentMethod}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold text-sm hover:border-zinc-400 transition-colors"
                  >
                    ← {dict.common.back}
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-black font-bold text-sm hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-70"
                  >
                    {isPlacingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                    {isPlacingOrder ? (language === "hi" ? "ऑर्डर दिया जा रहा है..." : "Placing Order...") : dict.checkout.placeOrder}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-sm sticky top-28">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-5">{dict.cart.orderSummary}</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{dict.cart.subtotal}</span>
                  <span className="font-semibold">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>{dict.cart.discountApplied}</span>
                    <span className="font-bold">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>GST (18%)</span>
                  <span className="font-semibold">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> {dict.home.expressDelivery}</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-500">{dict.common.free}</span>
                  ) : (
                    <span className="font-semibold">{formatCurrency(shippingFee)}</span>
                  )}
                </div>
                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-2.5 flex justify-between">
                  <span className="text-base font-black text-zinc-900 dark:text-white">{dict.cart.totalAmount}</span>
                  <span className="text-base font-black text-amber-600 dark:text-amber-400">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] text-zinc-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                {language === "hi" ? "256-बिट एसएसएल सुरक्षित चेकआउट" : "256-bit SSL Secure Checkout"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
