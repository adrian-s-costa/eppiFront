"use client";
import React, { useEffect } from "react";

export default function Pwa() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			window.addEventListener("load", async function () {
				await navigator.serviceWorker.register("/sw.js")
          .then((reg) => console.log('✅ Service Worker registrado:', reg))
          .catch((err) => console.error('❌ Erro ao registrar o SW:', err));
			});
		}

    navigator.serviceWorker.register('/notification-sw.js')
    .then(function(reg) {
        console.log('Service Worker registered for notifications', reg);
    }).catch(function(err) {
        console.error('Service Worker registration failed:', err);
    });
	}, []);

	return <></>;
}