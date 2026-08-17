import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ClerkProviderWrapper from "@/components/providers/ClerkProviderWrapper";
import QueryProvider from "@/components/providers/QueryProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import MobileNav from "@/components/layout/MobileNav";
import PWAInstallPrompt from "@/components/layout/PWAInstallPrompt";
import SingleSessionGuard from "@/components/auth/SingleSessionGuard";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "MANOJ TRADERS | Fresh Groceries. Trusted Quality.",
    template: "%s | MANOJ TRADERS",
  },
  description:
    "Manoj Traders — India's premier supermarket for 100% farm-fresh organic produce, aged Basmati rice, A2 Gir cow Bilona ghee, cold-pressed oils, and heritage spices delivered in 24 hours.",
  keywords: ["Manoj Traders", "Organic Supermarket", "Basmati Rice", "A2 Ghee", "Fresh Mangoes", "Cold Pressed Oil"],
  authors: [{ name: "Manoj Traders" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://manojtraders.com",
    title: "MANOJ TRADERS | Fresh Groceries. Trusted Quality.",
    description: "India's premier supermarket for organic groceries, aged basmati, and A2 ghee.",
    siteName: "MANOJ TRADERS",
    images: [{ url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=1200", width: 1200, height: 630, alt: "Manoj Traders" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MANOJ TRADERS | Fresh Groceries. Trusted Quality.",
    description: "India's premier supermarket for organic produce and farm essentials.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#D4AF37" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ClerkProviderWrapper>
          <ThemeProvider>
            <QueryProvider>
              <Navbar />
              <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
              <Footer />
              <CartDrawer />
              <WishlistDrawer />
              <MobileNav />
              <PWAInstallPrompt />
              <SingleSessionGuard />
              <Toaster
                position="bottom-right"
                toastOptions={{
                  className: "text-xs font-semibold",
                  style: {
                    background: "#18181B",
                    color: "#FAFAFA",
                    borderRadius: "12px",
                    border: "1px solid rgba(212,175,55,0.3)",
                    padding: "12px 16px",
                  },
                  success: {
                    iconTheme: { primary: "#D4AF37", secondary: "#18181B" },
                  },
                }}
              />
            </QueryProvider>
          </ThemeProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
