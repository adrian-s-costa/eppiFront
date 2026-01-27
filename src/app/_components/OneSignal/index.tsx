"use client";

import OneSignal from "react-onesignal";
import { useEffect } from "react";

export function OneSignalInit({ userId }: { userId: string }) {
  useEffect(() => {
    OneSignal.init({
      appId: '3a2a3d66-11c1-4c83-a061-ff7681dc53d4',
    });

    console.log("OneSignal initialized with userId:", userId);
    
    OneSignal.login(userId);
  }, [userId]);

  return null;
}
