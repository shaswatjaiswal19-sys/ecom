"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white">Privacy Policy</h1>
        <p className="text-zinc-500 text-xs mt-2">Last Updated: August 5, 2026</p>
      </div>

      <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed space-y-6">
        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">1. Information We Collect</h2>
          <p>
            At Manoj Traders, we respect your privacy and protect your personal information. When you create an account, purchase products, or interact with our concierge services, we collect information including your name, email address, phone number, shipping address, and payment information handled securely through Clerk and certified payment gateways.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">2. Use of Firebase & Cloud Storage</h2>
          <p>
            All user preferences, order histories, and saved shipping profiles are stored in encrypted Cloud Firestore databases with strict security rules. We do not sell or monetize customer data to third-party advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">3. Data Protection Rights</h2>
          <p>
            You have the right to request access, correction, or deletion of your account records at any time through our Support Portal or by contacting concierge@manojtraders.com.
          </p>
        </section>
      </div>
    </div>
  );
}
