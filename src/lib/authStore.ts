import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile, Role } from "@/types";

// SSR-Safe LocalStorage wrapper
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.error("Failed to save auth session:", e);
      }
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(key);
      } catch {}
    }
  },
};

export interface AuthUser {
  id: string;
  clerkId?: string;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  role: Role;
  walletBalance?: number;
  rewardPoints?: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (userData: Partial<AuthUser>) => void;
  logout: () => void;
  syncWithClerk: (clerkUser: any) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (userData) => {
        const fullUser: AuthUser = {
          id: userData.id || `usr-${Date.now()}`,
          clerkId: userData.clerkId,
          email: userData.email || "customer@manojtraders.com",
          fullName: userData.fullName || "Valued Customer",
          phone: userData.phone || "+91 98765 43210",
          avatar:
            userData.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
          role: userData.role || "customer",
          walletBalance: userData.walletBalance ?? 1500,
          rewardPoints: userData.rewardPoints ?? 340,
        };

        // Also mark welcome modal as permanently completed
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("shaswat_ecom_has_seen_login_prompt", "true");
          } catch {}
        }

        set({ user: fullUser, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      syncWithClerk: (clerkUser) => {
        if (!clerkUser) return;
        const current = get().user;
        if (current?.id === clerkUser.id && get().isAuthenticated) return;

        const email =
          clerkUser.primaryEmailAddress?.emailAddress ||
          clerkUser.emailAddresses?.[0]?.emailAddress ||
          "user@manojtraders.com";
        const fullName =
          clerkUser.fullName ||
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
          email.split("@")[0];
        const phone = clerkUser.primaryPhoneNumber?.phoneNumber || clerkUser.phoneNumbers?.[0]?.phoneNumber || "";

        const syncedUser: AuthUser = {
          id: clerkUser.id,
          clerkId: clerkUser.id,
          email,
          fullName,
          phone,
          avatar: clerkUser.imageUrl,
          role: "customer",
          walletBalance: current?.walletBalance ?? 1500,
          rewardPoints: current?.rewardPoints ?? 340,
        };

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("shaswat_ecom_has_seen_login_prompt", "true");
          } catch {}
        }

        set({ user: syncedUser, isAuthenticated: true });
      },
    }),
    {
      name: "manoj-traders-auth-session",
      storage: createJSONStorage(() => safeLocalStorage),
    }
  )
);
