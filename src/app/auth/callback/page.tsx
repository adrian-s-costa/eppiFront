// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dataEncoded = params.get('data');

    if (dataEncoded) {
      try {
        const data = JSON.parse(decodeURIComponent(dataEncoded));

        localStorage.setItem('user', data.name);
        localStorage.setItem('id', data.id);
        localStorage.setItem('email', data.email);
        localStorage.setItem('number', data.cellphone);
        localStorage.setItem('cep', data.cep);
        localStorage.setItem('pfpUrl', data.pfpUrl);
        localStorage.setItem('cpf', data.initials);
        localStorage.setItem('smartToken', data.smart_token);
      } catch (e) {
        console.error('Erro no callback Google', e);
      }
    }

    // 🔑 redirecionamento mais confiável no iOS
    window.location.replace('/tab');
  }, []);

  // ⚠️ NÃO renderiza nada
  return null;
}
