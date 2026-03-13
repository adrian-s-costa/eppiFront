'use client'

import { use, useEffect, useRef, useState } from 'react'
import { createApproval } from '../../../../utils/api/service'

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
    brandName: string
  }
  setData: (data: any) => void
  onNext: () => void
  onBack: () => void
  setLinkPayment: (link: string) => void
  setPlanoData: (plano: { nome: string; preco: string; precoComDesconto: number }) => void
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

function getPlanoRecomendado(data: PlanoStepProps['data']): Plano {
  // Lógica para determinar o plano baseado nas respostas
  const { tipoOperacao, estruturaAtendimento, volumeClientes, quantidadeUnidades } = data
  
  // Plano Local para autônomos e pequenos negócios
  if (tipoOperacao === 'autonomo' || 
      (estruturaAtendimento === 'apenas_eu' && volumeClientes === 'ate50')) {
    return {
      nome: 'Éppi Local',
      preco: 'R$5/mês',
      descricao: 'Perfeito para autônomos e pequenos negócios',
      features: [
        'Perfil completo no app',
        'Até 50 clientes/mês',
        'Agendamento online',
        'Gestão de atendimentos'
      ],
      recomendadoPara: 'autônomos e pequenos negócios'
    }
  }
  
  // Plano Pro para negócios em crescimento
  if (tipoOperacao === 'estabelecimento' || 
      volumeClientes === '50a150' || 
      estruturaAtendimento === '2a5') {
    return {
      nome: 'Éppi Pro',
      preco: 'R$ 497/mês',
      descricao: 'Ideal para negócios em crescimento',
      features: [
        'Tudo do plano Local',
        '50+ clientes/mês',
        'Múltiplos atendentes',
        'Local fixo ou ambos',
        'Relatórios avançados'
      ],
      recomendadoPara: 'negócios em crescimento'
    }
  }
  
  // Plano Enterprise para multiunidades e grandes volumes
  return {
    nome: 'Éppi Enterprise',
    preco: 'R$ 997/mês',
    descricao: 'Completo para multiunidades e grandes operações',
    features: [
      'Tudo do plano Pro',
      'Clientes ilimitados',
      'Múltiplas unidades',
      'API personalizada',
      'Suporte prioritário',
      'Relatórios customizados'
    ],
    recomendadoPara: 'multiunidades e grandes operações'
  }
}

export default function PlanoStep({ data, leadData, setData, onNext, onBack, setLinkPayment, setPlanoData }: PlanoStepProps) {
  const [cupom, setCupom] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState('')
  const [desconto, setDesconto] = useState(0)
  const [erroCupom, setErroCupom] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const linkRef = useRef<any>(null);
  
  const plano = getPlanoRecomendado(data)
  
  // Aplicar desconto ao preço
  const precoNumerico = parseInt(plano.preco.replace(/\D/g, ''))
  const precoComDesconto = desconto > 0 ? precoNumerico - (precoNumerico * desconto / 100) : precoNumerico
  const precoFormatado = desconto > 0 ? `R$ ${precoComDesconto}/mês` : plano.preco
  const precoOriginalFormatado = desconto > 0 ? plano.preco : undefined
  const id = typeof window !== "undefined" ? window.localStorage.getItem("id") : false;

  const handleNextWithApproval = async () => {
    setIsLoading(true)
    try {
      // Passar os dados do plano para o PaymentStep
      setPlanoData({
        nome: plano.nome,
        preco: plano.preco,
        precoComDesconto: precoComDesconto
      })

      // Atualizar o qualificacao com o cupom usado
      setData((prev: any) => ({
        ...prev,
        qualificacao: {
          ...prev.qualificacao,
          cupom: cupomAplicado
        }
      }))

      const approvalData = { 
        brandName: leadData.brandName,
        plan: plano.nome,
        amount: precoComDesconto,
        userId: id
      }
    
      //await createApproval(approvalData).then((res) => {
      onNext()
    } finally {
      setIsLoading(false)
    }
  }

  const aplicarCupom = () => {
    if (!cupom.trim()) {
      setErroCupom('Digite um código de cupom')
      return
    }

    const cuponsValidos: { [key: string]: number } = {
      'BEMVINDO10': 10,
      'LAUNCH20': 20,
      'ESPECIAL30': 30,
      'TESTE50': 50
    }

    const cupomUpper = cupom.toUpperCase().trim()
    
    if (cuponsValidos[cupomUpper]) {
      setDesconto(cuponsValidos[cupomUpper])
      setCupomAplicado(cupomUpper)
      setErroCupom('')
      setCupom('')
    } else {
      setErroCupom('Cupom inválido')
      setCupomAplicado('')
      setDesconto(0)
    }
  }

  const removerCupom = () => {
    setCupomAplicado('')
    setDesconto(0)
    setCupom('')
    setErroCupom('')
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="text-center sm:text-left">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Seu plano ideal
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Com base nas suas respostas, recomendamos o plano perfeito para você
        </p>
      </div>

      {/* Plano Recomendado */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-[#8609A3] text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
          RECOMENDADO
        </div>
        
        <div className="mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{plano.nome}</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{plano.descricao}</p>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-3 sm:mb-4">
            <div className="text-2xl sm:text-3xl font-bold text-[#8609A3]">{precoFormatado}</div>
            {precoOriginalFormatado && (
              <div className="text-base sm:text-lg text-gray-400 line-through">{precoOriginalFormatado}</div>
            )}
            {desconto > 0 && (
              <div className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 py-1 rounded-full font-medium w-fit">
                -{desconto}%
              </div>
            )}
          </div>
        </div>

        {/* Campo de Cupom */}
        <div className="mb-4 sm:mb-6">
          {!cupomAplicado ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={cupom}
                onChange={(e) => {
                  setCupom(e.target.value)
                  setErroCupom('')
                }}
                placeholder="Digite seu cupom"
                className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-[#8609A3] outline-none transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && aplicarCupom()}
              />
              <button
                type="button"
                onClick={aplicarCupom}
                className="px-4 sm:px-6 py-2 bg-[#8609A3] text-white text-sm sm:text-base rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors whitespace-nowrap"
              >
                Aplicar
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 sm:w-5 h-4 sm:h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-800 font-medium text-sm sm:text-base">Cupom {cupomAplicado} aplicado!</span>
              </div>
              <button
                type="button"
                onClick={removerCupom}
                className="text-green-600 hover:text-green-800 font-medium text-sm underline self-end sm:self-auto"
              >
                Remover
              </button>
            </div>
          )}
          {erroCupom && (
            <p className="text-red-600 text-xs sm:text-sm mt-2">{erroCupom}</p>
          )}
        </div>

        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {plano.features.map((feature, index) => (
            <div key={index} className="flex items-start sm:items-center">
              <div className="w-4 sm:w-5 h-4 sm:h-5 bg-green-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0">
                <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Informação sobre a seleção */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Este plano foi selecionado automaticamente com base em suas respostas. 
          Você pode prosseguir para o pagamento ou voltar para revisar suas informações.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6 sm:mt-8">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-full px-4 sm:px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleNextWithApproval}
          disabled={isLoading}
          className="w-full sm:w-full px-4 sm:px-6 py-3 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processando...
            </>
          ) : (
            'Continuar para Pagamento'
          )}
        </button>
      </div>
    </div>
  )
}
