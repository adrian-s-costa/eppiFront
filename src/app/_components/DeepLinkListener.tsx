'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function DeepLinkListener() {
  const router = useRouter();
  // Usamos um Ref para que a função global sempre acesse as props/router mais recentes
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useEffect(() => {
    // Definimos a função no window
    (window as any).onAppResumeWithUrl = async (urlString: string) => {
      console.log("🚀 [DeepLinkListener] Swift chamou:", urlString);

      if (urlString.includes("code=")) {
        try {
          const url = new URL(urlString.replace("#", "?")); // iOS as vezes usa fragmentos
          const code = url.searchParams.get("code");

          if (!code) return;

          const response = await fetch("https://grupoferaapi.shop/auth/google/native", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: code })
          });

          const data = await response.json();
          
          if (data) {
             const userObj = data.account || data; 

             localStorage.setItem('user', userObj.name || "Usuário");
             localStorage.setItem('id', userObj.id);
             localStorage.setItem('email', userObj.email);
             localStorage.setItem('smartToken', userObj.smart_token);
             // ... outros campos ...

             console.log("🎉 Login OK");

             // Forçamos um pequeno delay para o localStorage "assentar" no iOS
             // e usamos window.location para garantir que o estado do App resete
             setTimeout(() => {
                window.location.href = '/tab';
             }, 100);
          }

        } catch (e) {
          console.error("❌ Erro:", e);
        }
      }
    };

    // 💡 IMPORTANTE: Informe ao Swift que o JS está pronto
    // Se o seu código Swift tiver um mecanismo de checagem, isso ajuda.
    console.log("✅ Listener Nativo Ativado e Pronto");

    return () => {
      // Não limpe se o componente estiver no Layout global, 
      // mas se estiver em uma página, limpe para evitar memory leak.
      // window.onAppResumeWithUrl = undefined;
    };
  }, []); // Executa apenas uma vez no mount do App

  return null;
}