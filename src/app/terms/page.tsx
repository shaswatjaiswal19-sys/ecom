"use client";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Terms & Conditions</h1>
        <p className="text-zinc-500 text-xs mt-2">Last Updated: August 5, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Agreement to Terms</h2>
          <p>
            By accessing or placing an order on Manoj Traders, you confirm your agreement to these Terms of Service. All luxury products sold are subject to availability and verification.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Pricing & GST Compliance</h2>
          <p>
            Prices are listed in Indian Rupees (INR) and include applicable Goods and Services Tax (GST). Tax invoices with GSTIN details are generated automatically upon order confirmation.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">3. Returns & Refunds</h2>
          <p>
            Eligible products may be returned within 7 days of delivery in their original, undamaged packaging. Refunds are issued to the original payment method or Manoj Pay Wallet within 3 business days of return inspection.
          </p>
        </section>
      </div>
    </div>
  );
}
