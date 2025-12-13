// app/auth/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const searchParams = useSearchParams()
        const dataEncoded = searchParams.get("data");

        if (dataEncoded){
            const data = JSON.parse(
                decodeURIComponent(dataEncoded)
            );
            
            localStorage.setItem('user', data.name)
            //localStorage.setItem('token', data.token)
            localStorage.setItem('id', data.id)
            localStorage.setItem('email', data.email)
            localStorage.setItem('number', data.cellphone)
            localStorage.setItem('cep', data.cep)
            localStorage.setItem('pfpUrl', data.pfpUrl)
            localStorage.setItem('toke_alloyal', data)
            localStorage.setItem('pfpUrl', data.pfpUrl)
            localStorage.setItem('cpf', data.initials)
            localStorage.setItem('smartToken', data.smart_token)

            router.replace('/');
        }
    
    }, []);

  return <p>Finalizando login...</p>;
}
