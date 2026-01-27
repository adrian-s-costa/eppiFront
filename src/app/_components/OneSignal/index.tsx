"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export function OneSignalInit({ userId }: { userId?: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
      allowLocalhostAsSecureOrigin: true
    });

    console.log("OneSignal initialized", userId);

    if (userId) {
      OneSignal.login(userId);
    }
  }, [userId]);

  return null;
}
