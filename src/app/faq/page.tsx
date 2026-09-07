"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, Search } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    category: "Authenticity & Warranties",
    items: [
      {
        q: "Are all products 100% genuine with manufacturer warranty?",
        a: "Yes. Manoj Traders is an authorized direct distributor for every brand listed on our platform. Every purchase includes official brand warranty cards, hologram certificates, and tax invoices eligible for brand service centers globally.",
      },
      {
        q: "How do I verify the authenticity of my product?",
        a: "Each luxury item features a unique serial number registered on the manufacturer database at the time of dispatch. You can enter your SKU/Serial number on our verification portal.",
      },
    ],
  },
  {
    category: "Shipping & Express Delivery",
    items: [
      {
        q: "What are your delivery timeframes across India?",
        a: "We offer Express Transit (1-2 business days) across Mumbai, Delhi NCR, Bangalore, Hyderabad, Chennai, Kolkata, and Pune. Standard shipping takes 3-4 days for other pin codes.",
      },
      {
        q: "Is transit insurance included?",
        a: "Yes. Every shipment is 100% insured against loss or transit damage at no additional cost to you.",
      },
    ],
  },
  {
    category: "Payments & EMI Options",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, AMEX, Razorpay, Net Banking, UPI (GPay, PhonePe), Manoj Pay Wallet, and Cash on Delivery (COD) up to ₹50,000.",
      },
      {
        q: "Do you offer No-Cost EMI options?",
        a: "Yes, 3, 6, and 12-month No-Cost EMI plans are available across major credit cards for orders above ₹10,000.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Help & Frequently Asked Questions
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">How Can We Help You?</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Find answers to common questions about authenticity, shipping, returns, and payment plans.
        </p>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm max-w-xl mx-auto">
        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          placeholder="Search questions or keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none text-sm text-zinc-900 dark:text-white w-full placeholder:text-zinc-400"
        />
      </div>

      {/* FAQ Categories & Questions */}
      <div className="space-y-8">
        {FAQ_CATEGORIES.map((cat) => {
          const matchingItems = cat.items.filter(
            (i) =>
              i.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
              i.a.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (matchingItems.length === 0) return null;

          return (
            <div key={cat.category} className="space-y-4">
              <h2 className="text-xl font-black text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-2">
                {cat.category}
              </h2>

              <div className="space-y-3">
                {matchingItems.map((item, idx) => {
                  const id = `${cat.category}-${idx}`;
                  const isOpen = openIndex === id;

                  return (
                    <div
                      key={id}
                      className="bg-white dark:bg-zinc-900 rounded-2xl border border-black/5 dark:border-white/10 shadow-sm overflow-hidden"
                    >
                      <button
                        onClick={() => toggleOpen(id)}
                        className="w-full p-5 text-left font-bold text-sm text-zinc-900 dark:text-white flex items-center justify-between gap-4 hover:text-amber-500 transition-colors"
                      >
                        <span>{item.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 flex-shrink-0 text-amber-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
