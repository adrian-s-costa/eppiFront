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

export function OneSignalLogin({ userId }: { userId?: string }) {
  useEffect(() => {
    if (!userId) return;

    // ✅ iOS nativo (WKWebView)
    if (window.webkit?.messageHandlers?.onesignal) {
      window.webkit.messageHandlers.onesignal.postMessage({
        userId,
      });
      return;
    }

    // ✅ Web / Android / TWA
    OneSignal.login(userId).catch(console.error);

  }, [userId]);

  return null;
}
