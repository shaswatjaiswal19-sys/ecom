"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/components/layout/CartDrawer"), { ssr: false });
const WishlistDrawer = dynamic(() => import("@/components/layout/WishlistDrawer"), { ssr: false });
const MobileNav = dynamic(() => import("@/components/layout/MobileNav"), { ssr: false });
const PWAInstallPrompt = dynamic(() => import("@/components/layout/PWAInstallPrompt"), { ssr: false });
const WelcomeLoginModal = dynamic(() => import("@/components/layout/WelcomeLoginModal"), { ssr: false });

export default function ClientLayoutWidgets() {
  return (
    <>
      <CartDrawer />
      <WishlistDrawer />
      <MobileNav />
      <PWAInstallPrompt />
      <WelcomeLoginModal />
    </>
  );
}
