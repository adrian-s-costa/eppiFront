"use client";

import { useState, useMemo } from "react";
import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import { config } from "../../../../config";
import Script from "next/script";

initMercadoPago("TEST-2cd9892d-3d8b-49d3-9add-9d7e2b7d0bb2", {
  locale: "pt-BR",
});

interface PaymentStepProps {
  data: {
    linkRedirect: string | undefined;
    tipoOperacao: string;
    estruturaAtendimento: string;
    tipoAtendimento: string;
    volumeClientes: string;
    quantidadeUnidades: string;
    cupom: string;
  };
  plano: {
    nome: string;
    preco: string;
    precoComDesconto: number;
  };
  onNext: () => void;
  onBack: () => void;
  isActive?: boolean;
  linkPayment?: string;
}

export default function Checkout({
  data,
  plano,
  onNext,
  onBack,
  isActive = false,
  linkPayment,
}: PaymentStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const amount = Number(plano?.precoComDesconto)

  const id = typeof window !== "undefined" ? window.localStorage.getItem("id") : false;

  const { cupom } = data;

  const initialization = useMemo(() => {
    return {
      amount,
    };
  }, [amount]);

  const onSubmit = async (formData: unknown) => {
    if (isSubmitting) return; // Prevenir múltiplos envios
    
    try {
      setIsSubmitting(true);
      
      const res = await fetch(`${config.API_URL}/process_payment/preapproval`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          amount,
          planName: plano?.nome || "Éppi Local",
          cupom,
          id,
          //deviceId
        }),
      });

      const data = await res.json();
      console.log("Resposta do pagamento:", data);
      
      if (res.ok) {
        alert("Assinatura criada!");
        onNext();
      } else {
        alert("Erro ao criar assinatura: " + (data.message || "Erro desconhecido"));
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Erro ao criar assinatura");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isActive) return null;

  return (
    <>
      <Script
        id="mp-security"
        src="https://www.mercadopago.com/v2/security.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("security carregado");
          console.log("MP_DEVICE_SESSION_ID", (window as any).MP_DEVICE_SESSION_ID);
          console.log("deviceId", (window as any).deviceId);
        }}
        onError={() => {
          console.error("falha ao carregar security.js");
        }}
      />
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm w-full max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resumo do Plano</h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Plano:</span> {plano?.nome || 'Carregando...'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Valor:</span> {plano?.preco || 'Carregando...'}
            </p>
            {data?.cupom && (
              <p className="text-sm text-green-600">
                <span className="font-medium">Cupom aplicado:</span> {data.cupom}
              </p>
            )}
            {plano?.precoComDesconto && plano.precoComDesconto !== parseInt(plano.preco.replace(/\D/g, '')) && (
              <p className="text-sm text-green-600 font-medium">
                Valor com desconto: R$ {plano.precoComDesconto.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="border rounded-lg p-4 w-full max-w-md bg-white">
          <CardPayment
            initialization={initialization}
            onSubmit={onSubmit}
            onReady={() => console.log("Brick pronto")}
            onError={(error) => console.error("MP Brick error:", error)}
            customization={{
              visual: {
                hideFormTitle: true,
              },
              paymentMethods: {
                maxInstallments: 1,
              },
            }}
          />
          
          {isSubmitting && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#8609A3] mr-2"></div>
                <span className="text-sm text-gray-600">Processando pagamento...</span>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Voltar
        </button>
      </div>
    </>
  );
}