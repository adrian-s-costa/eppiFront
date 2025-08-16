"use client"

import { StatusScreen } from '@mercadopago/sdk-react';
import { initMercadoPago } from '@mercadopago/sdk-react';

initMercadoPago('APP_USR-8f6a300a-b0ba-4e33-a08a-87b0b8d6614c');

export default function Status({ params }: { params: { id: string } }){

    const initialization = {
        paymentId: params.id,
    };
       const onError = async (error: any) => {
        // callback chamado para todos os casos de erro do Brick
        console.log(error);
       };
       const onReady = async () => {
        /*
        Callback chamado quando o Brick estiver pronto.
        Aqui você pode ocultar loadings do seu site, por exemplo.
        */
    };

    return (
        <StatusScreen
            initialization={initialization}
            onReady={onReady}
            onError={onError}
        />
    )
}



