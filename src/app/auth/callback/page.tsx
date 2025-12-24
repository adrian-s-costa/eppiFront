// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataEncoded = params.get('data');

    if (dataEncoded) {
      try {
        const data = JSON.parse(decodeURIComponent(dataEncoded));

        // Salva os dados
        localStorage.setItem('user', "HUMPTY");
        localStorage.setItem('id', data.id);
        localStorage.setItem('email', data.email);
        localStorage.setItem('number', data.cellphone);
        localStorage.setItem('cep', data.cep);
        localStorage.setItem('pfpUrl', data.pfpUrl);
        localStorage.setItem('cpf', data.initials);
        localStorage.setItem('smartToken', data.smart_token);

        // ✅ 1. Limpa o histórico de navegação para evitar que o "voltar" do iOS bugue
        window.history.replaceState(null, '', window.location.pathname);

        // ✅ 2. No iOS PWA, o replace puro as vezes mantém o 'state' antigo.
        // Usar o router.push ou href com um pequeno timeout ajuda o sistema a processar o localStorage.
        setTimeout(() => {
          window.location.href = '/tab'; 
        }, 100);

      } catch (e) {
        console.error('Erro no callback Google', e);
        window.location.replace('/login?error=true');
      }
    } else {
        window.location.replace('/login');
    }
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-white">
       {/* Feedback visual evita que a tela pareça travada no iOS */}
       <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
    </div>
  );
}