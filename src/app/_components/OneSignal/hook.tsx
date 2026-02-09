"use client";

import { useEffect, useRef } from "react";
import OneSignal from "react-onesignal";

export function OneSignalBootstrap() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    OneSignal.init({
      appId: "333bc4c4-5d43-44ce-a64b-f2c7ee9bc934",
      allowLocalhostAsSecureOrigin: true,
    }).catch(console.error);
  }, []);

  return null;
}
