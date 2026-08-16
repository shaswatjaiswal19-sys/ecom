"use client";

import { useEffect, useRef } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

const LOCAL_SESSION_KEY = "shaswat_ecom_active_device_session";

export default function SingleSessionGuard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const isLoggingOutRef = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id) return;

    const userId = user.id;
    const sessionDocRef = doc(db, "user_sessions", userId);

    // 1. Get or generate this device's unique session ID
    let currentDeviceId = localStorage.getItem(LOCAL_SESSION_KEY);
    const hasClaimedInSession = sessionStorage.getItem("shaswat_session_claimed");

    if (!currentDeviceId || !hasClaimedInSession) {
      currentDeviceId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(LOCAL_SESSION_KEY, currentDeviceId);
      sessionStorage.setItem("shaswat_session_claimed", "true");
    }

    // 2. Register this device as the active session in Firestore (Overrides previous device)
    const registerCurrentDevice = async () => {
      try {
        await setDoc(sessionDocRef, {
          userId,
          activeDeviceId: currentDeviceId,
          userEmail: user.primaryEmailAddress?.emailAddress || "",
          lastLoginAt: Date.now(),
          deviceInfo: typeof navigator !== "undefined" ? navigator.userAgent : "Web Device",
        }, { merge: true });
      } catch (err) {
        console.error("SingleSessionGuard register error:", err);
      }
    };

    registerCurrentDevice();

    // 3. Listen in real time for session changes from other devices
    const unsubscribe = onSnapshot(sessionDocRef, async (docSnap) => {
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const serverActiveDeviceId = data?.activeDeviceId;

      // If another device claimed the session, log out this device immediately
      if (serverActiveDeviceId && serverActiveDeviceId !== currentDeviceId && !isLoggingOutRef.current) {
        isLoggingOutRef.current = true;
        
        // Remove local session ID
        localStorage.removeItem(LOCAL_SESSION_KEY);

        toast.error("You were logged out because your account was logged in from another device.", {
          duration: 6000,
          id: "concurrent-login-kick",
        });

        try {
          await signOut({ redirectUrl: "/sign-in" });
        } catch {
          window.location.href = "/sign-in";
        }
      }
    }, (error) => {
      console.warn("SingleSessionGuard onSnapshot listener error:", error);
    });

    return () => {
      unsubscribe();
    };
  }, [isLoaded, isSignedIn, user?.id, signOut]);

  return null;
}
