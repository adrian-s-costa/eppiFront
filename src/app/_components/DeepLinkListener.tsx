'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DeepLinkListener() {
  const router = useRouter();

  useEffect(() => {
    function onDeepLink(event: any) {
      const url = event.detail as string;

      let parsed: URL;
      try {
        parsed = new URL(url);
      } catch {
        console.error('URL inválida no deeplink:', url);
        return;
      }

      const dataEncoded = parsed.searchParams.get('data');

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

      // 🔁 Navegação interna, sem reload
      router.replace('/tab');
    }

    window.addEventListener('deeplink', onDeepLink);
    return () => window.removeEventListener('deeplink', onDeepLink);
  }, [router]);

  return null;
}
