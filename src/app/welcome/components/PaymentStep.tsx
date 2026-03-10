import { Payment } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';
import { createApproval } from '../../../../utils/api/service';

// Extender interface Window para incluir propriedades de webview
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    flutter_inappwebview?: {
      callHandler: (handler: string) => void;
    };
  }
}

interface PaymentStepProps {
  data: {
    lead: {
      fullName: string
      whatsapp: string
      email: string
    }
    qualificacao: {
      tipoOperacao: string
      estruturaAtendimento: string
      tipoAtendimento: string
      volumeClientes: string
      quantidadeUnidades: string
    }
  }
  onNext: () => void
  onBack: () => void
  index: number
}

export default function PaymentStep({ data, onNext, onBack, index }: PaymentStepProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const id = typeof window !== "undefined" ? window.localStorage.getItem("id") : false;

  useEffect(() => {
    if (index !== 3) return;

    setIsLoading(true);
    setPaymentError(null);
    
    createApproval({ 
      email: data.lead.email,
      plan: data.qualificacao.tipoOperacao === 'autonomo' ? 'Éppi Local' : 
            data.qualificacao.tipoOperacao === 'estabelecimento' ? 'Éppi Pro' : 'Éppi Enterprise',
      amount: data.qualificacao.tipoOperacao === 'autonomo' ? 297 : 
             data.qualificacao.tipoOperacao === 'estabelecimento' ? 497 : 997,
      userId: id
    }).then((res) => {
      console.log('Resposta da API:', res);
      if (typeof res === 'string' && res.includes('init_point')) {
        setUrl(res);
        setShowPayment(true);
      } else {
        setPaymentError('Erro ao gerar link de pagamento');
      }
    }).catch((err) => {
      console.error('Erro na requisição:', err);
      setPaymentError('Falha ao processar pagamento. Tente novamente.');
    }).finally(() => {
      setIsLoading(false);
    });
  }, [index, data]);

  const handlePaymentSuccess = () => {
    // Em ambiente PWA/webview, fecha a aba ou volta pro app
    if (typeof window !== 'undefined') {
      // Verifica se está em webview
      const isWebview = /(wv|webview)/i.test(navigator.userAgent) || 
                       window.ReactNativeWebView ||
                       window.flutter_inappwebview;
      
      if (isWebview) {
        // Envia mensagem para a webview fechar ou voltar
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            action: 'payment_success',
            close: true
          }));
        } else if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler('paymentSuccess');
        } else {
          // Fallback: tenta fechar a janela
          window.close();
        }
      } else {
        // Browser normal: redireciona ou mostra sucesso
        onNext();
      }
    }
  };

  const handleRedirectPayment = () => {
    if (url) {
      // Abre em nova aba/janela
      const newWindow = window.open(url, '_blank', 'width=400,height=600,scrollbars=yes,resizable=yes');
      
      // Monitora se a janela foi fechada
      if (newWindow) {
        const checkClosed = setInterval(() => {
          if (newWindow.closed) {
            clearInterval(checkClosed);
            // Usuário fechou a janela, assume que pagamento foi feito
            handlePaymentSuccess();
          }
        }, 1000);
      } else {
        // Popup bloqueado, abre na mesma aba
        window.location.href = url;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Processando Pagamento
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Gerando seu link de pagamento seguro...
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-[#8609A3] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentError) {
    return (
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Erro no Pagamento
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            {paymentError}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-full px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="w-full sm:w-full px-4 sm:px-6 py-3 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Finalizar Pagamento
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Escolha a forma de pagamento para concluir sua assinatura
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
        {showPayment && url ? (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Clique no botão abaixo para ser redirecionado ao pagamento seguro
              </p>
            </div>

            {/* Opção 1: Redirecionamento com auto-close */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleRedirectPayment}
                className="w-full bg-[#8609A3] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Pagar com Mercado Pago
              </button>

              <div className="text-xs text-gray-500 text-center">
                Após o pagamento, você será redirecionado automaticamente
              </div>
            </div>

            {/* Debug: Mostrar URL */}
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">Link de pagamento (debug):</p>
              <p className="text-xs font-mono break-all">{url}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-[#8609A3] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-full px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}