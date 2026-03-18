'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '../../../utils/api/service'
import { toast } from 'react-toastify';

const userMail = typeof window !== "undefined" ? window.localStorage.getItem("email") : false;

export default function Pendencia() {
  const router = useRouter()

  useEffect(() => {
    // Opcional: verificar status do pagamento periodicamente
    const checkPaymentStatus = async () => {
      try {
        getUser(userMail).then((res) => {
      if (res && !res.lastPaymentStatus) {
        router.push('/welcome');
        return;
      }
      
      if (res.lastPaymentStatus == "waiting_payment") {
        return router.push('/pendencia')
      }
      
      if (res.lastPaymentStatus == "reproved" || res.lastPaymentStatus == "pending" || res.lastPaymentStatus == "in_process" || res.lastPaymentStatus == "rejected") {
        return router.push(`statusInProcess/${res.lastPaymentId}`)
      }

      if (res.lastPaymentStatus == "in_process") {
        return router.push(`status/${res.lastPaymentId}`)
      }
  
      if (res.lastPaymentStatus == "approved"){
        return toast.info("Você já possui um plano ativo. Entre em contato com o suporte para mais informações.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }).catch((error)=>{
      console.error("Erro ao verificar plano do usuário:", error);
    })

      } catch (error) {
        console.error('Erro ao verificar status do pagamento:', error)
      }
    }

    // Verificar a cada 30 segundos (opcional)
    const interval = setInterval(checkPaymentStatus, 30000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      {/* Ícone Central - Relógio */}
      <div className="mb-8">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-[#8609A3] to-[#5b056e] flex items-center justify-center shadow-lg">
            <svg 
              className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
          
          {/* Anéis de loading */}
          <div className="absolute inset-0 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-[#8609A3] border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-[#8609A3] border-b-transparent animate-spin animation-delay-150"></div>
        </div>
      </div>

      {/* Texto Centralizado */}
      <div className="text-center max-w-md mx-auto space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Pagamento em Processamento
        </h1>
        
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Seu pagamento está sendo processado. Assim que for aprovado, as features do plano serão liberadas automaticamente.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Atenção:</span> Este processo pode levar alguns minutos. Você receberá uma confirmação por e-mail assim que for concluído.
          </p>
        </div>
      </div>

      {/* Ações */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] transition-colors"
        >
          Verificar Status
        </button>
        
        <button
          onClick={() => router.push('/tab?options=3')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Ir para Perfil
        </button>
      </div>

      {/* Informações Adicionais */}
      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Dúvidas? Entre em contato com nosso suporte
        </p>
        <button
          onClick={() => router.push('/support')}
          className="text-sm text-[#8609A3] hover:text-[#5b056e] font-medium mt-1"
        >
          Suporte
        </button>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animation-delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  )
}
