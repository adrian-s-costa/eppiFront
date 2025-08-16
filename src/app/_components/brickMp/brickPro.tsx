"use client"

import React, { useEffect, useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { config } from '../../../../config';

initMercadoPago('APP_USR-8f6a300a-b0ba-4e33-a08a-87b0b8d6614c', { locale: 'pt-BR' });


const CheckoutPro = () => {
    const [response, setResponse] = useState<any>();
    
    useEffect(()=>{
        fetch(config.API_URL + "/process_payment/preference", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({teste: "a"}),
        })
        .then((response) => response.json())
        .then((response) => {
            setResponse(response);
        })
        .catch((error) => {
            console.log(error)
        });
    }, [])

    return (
      <div>
        <Wallet initialization={{ preferenceId: response && response.id}} />
      </div>
    );
};

export default CheckoutPro;