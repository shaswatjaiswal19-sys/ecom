"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Sparkles, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in required fields.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Our concierge team will reach out within 2 hours.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> 24/7 Priority Support
        </div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Get in Touch</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Have a question about a product, custom procurement, or order delivery? We are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Helpline Support</h3>
              <p className="text-xs text-zinc-400 mt-1">+91 1800 900 8000</p>
              <p className="text-xs text-zinc-400">+91 99999 88888 (WhatsApp VIP)</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Email Concierge</h3>
              <p className="text-xs text-zinc-400 mt-1">concierge@manojtraders.com</p>
              <p className="text-xs text-zinc-400">support@manojtraders.com</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Flagship Experience Store</h3>
              <p className="text-xs text-zinc-400 mt-1">Manoj Traders Tower, BKC Financial Center</p>
              <p className="text-xs text-zinc-400">Mumbai, Maharashtra - 400051</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-black/5 dark:border-white/10 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white">Send Us a Direct Message</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Your Message *</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-sm text-zinc-900 dark:text-white outline-none focus:border-amber-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> {isSubmitting ? "Sending..." : "Submit Inquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
