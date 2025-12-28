'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

// Isso é necessário para o TypeScript não reclamar do window.onAppResumeWithUrl
declare global {
  interface Window {
    onAppResumeWithUrl?: (url: string) => Promise<void>;
  }
}

export default function DeepLinkListener() {
  const router = useRouter();

  useEffect(() => {
    // Definimos a função que o Swift vai chamar
    window.onAppResumeWithUrl = async (urlString: string) => {
      console.log("🚀 [DeepLinkListener] Swift chamou com URL:", urlString);

      // Verificação básica se é o retorno do Google com o 'code'
      if (urlString.includes("code=")) {
        try {
          const url = new URL(urlString);
          const code = url.searchParams.get("code");
          const state = url.searchParams.get("state");

          if (!code) return;

          if (state) {
            try{
              const response = await fetch("https://grupoferaapi.shop/auth/google/register-native", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: code })
              });
              
              if (!response.ok) throw new Error("Falha na API");
              const data = await response.json();
              
              if (data) {
                router.push(`/code?email=${data.email}`)
              }
            }catch{
              toast("Erro ao fazer seu registro")
            }
          }
          
          else {
            const response = await fetch("https://grupoferaapi.shop/auth/google/native", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ code: code })
            });

            if (!response.ok) throw new Error("Falha na API");

            const data = await response.json();
            
            // 2. Salva no localStorage (Exatamente como você fazia antes)
            // Nota: Certifique-se que o backend retorna essas chaves no JSON
            if (data) {
              // Ajuste aqui se o seu backend retornar dentro de 'account' ou direto no objeto
              const userObj = data.account || data; 

              localStorage.setItem('user', userObj.name);
              localStorage.setItem('id', userObj.id);
              localStorage.setItem('email', userObj.email);
              localStorage.setItem('number', userObj.cellphone);
              localStorage.setItem('cep', userObj.cep);
              localStorage.setItem('pfpUrl', userObj.pfpUrl);
              localStorage.setItem('cpf', userObj.initials);
              localStorage.setItem('smartToken', userObj.smart_token);
              
              console.log("🎉 Login salvo, redirecionando...");
              
              // 3. Redireciona para o app
              window.location.href = '/tab';
            }
          }
        } catch (e) {
          console.error("❌ Erro no fluxo nativo:", e);
        }
      }
    };
    console.log("✅ Listener Nativo Ativado");
    // Cleanup
    return () => {
      // Opcional: window.onAppResumeWithUrl = undefined;
    };
  }, [router]);

  return null;
}