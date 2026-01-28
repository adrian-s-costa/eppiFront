"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

declare global {
  interface Window {
    webkit?: {
      messageHandlers?: {
        onesignal?: {
          postMessage: (message: any) => void;
        };
      };
    };
  }
}

export function OneSignalInit({ userId }: { userId?: string }) {
  useEffect(() => {
    window.webkit?.messageHandlers?.onesignal?.postMessage({
      userId: userId
    })
  }, [userId]);

  return null;
}