import { use, useEffect, useRef } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { CardPayment } from "@mercadopago/sdk-react";

initMercadoPago("APP_USR-8f6a300a-b0ba-4e33-a08a-87b0b8d6614c");

interface PlanoStepProps {
  data: {
    linkRedirect: string | undefined
    tipoOperacao: string
    estruturaAtendimento: string
    tipoAtendimento: string
    volumeClientes: string
    quantidadeUnidades: string
  }
  leadData: {
    fullName: string
    whatsapp: string
    email: string
  }
  setData: (data: any) => void
  onNext: () => void
  onBack: () => void
  isActive?: boolean
}

interface Plano {
  nome: string
  preco: string
  precoOriginal?: string
  descricao: string
  features: string[]
  recomendadoPara: string
}

export default function Checkout({ data, onNext, onBack, isActive = false, linkPayment }: any) {

  const linkRef = useRef<any>(null);

  const initialization = {
    amount: 100
  };

  const customization = {
    paymentMethods: {
      maxInstallments: 1
    }
  };

  useEffect(() => {
    if (linkPayment && linkPayment.trim() !== '' && linkRef.current && isActive) {
      console.log('Redirecionando para:', linkPayment);
      linkRef.current.click();
    }
  }, [linkPayment])


  return (
    <div className="flex flex-col items-center justify-center h-full">
      <a href={linkPayment} ref={linkRef} className="bg-[#8609A3] text-white px-4 py-2 rounded-lg hover:bg-[#6a0dad] transition-colors">Acessar Link de Pagamento</a>
      <button
        type="button"
        onClick={onBack}
        className="mt-4 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
      >
        Voltar
      </button>
    </div>
  );
}