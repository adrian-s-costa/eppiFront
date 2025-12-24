'use client';

import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function DeepLinkListener() {
  useEffect(() => {
    const handleNativeCall = async (urlString: string) => {
      // 1. Log imediato para confirmar que o Swift "chegou" aqui
      toast("🚀 [DeepLinkListener] Swift chamou com URL:");

      if (!urlString.includes("code=")) return;

      try {
        const url = new URL(urlString.replace("#", "?"));
        const code = url.searchParams.get("code");

        const response = await fetch("https://grupoferaapi.shop/auth/google/native", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code })
        });

        if (response.ok) {
          const data = await response.json();
          const userObj = data.account || data;
          
          // Salve seus dados...
          localStorage.setItem('smartToken', userObj.smart_token);

          // 🔑 O SEGREDO: Recarregue a página para limpar a WebView para o próximo login
          window.location.href = '/tab';
        }
      } catch (e) {
        console.error("❌ Erro no processamento nativo:", e);
      }
    };

    // Atribuição direta e forçada ao window
    (window as any).onAppResumeWithUrl = handleNativeCall;

    // Log para você ver no Safari Debugger se a função está pronta
    console.log("✅ [DeepLinkListener] Função registrada no window");

    return () => {
       // Não limpe, deixe a função lá para o Swift achar
    };
  }, []);

  return null;
}