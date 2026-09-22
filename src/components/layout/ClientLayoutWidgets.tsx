"use client";

import CartDrawer from "@/components/layout/CartDrawer";
import WishlistDrawer from "@/components/layout/WishlistDrawer";
import MobileNav from "@/components/layout/MobileNav";
import PWAInstallPrompt from "@/components/layout/PWAInstallPrompt";
import WelcomeLoginModal from "@/components/layout/WelcomeLoginModal";

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
