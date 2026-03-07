'use client'

interface PlanoStepProps {
  data: {
    tipoOperacao: string
    estruturaAtendimento: string
    tipoAtendimento: string
    volumeClientes: string
    quantidadeUnidades: string
  }
  onNext: () => void
  onBack: () => void
}

interface Plano {
  nome: string
  preco: string
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
      preco: 'R$ 297/mês',
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

export default function PlanoStep({ data, onNext, onBack }: PlanoStepProps) {
  const plano = getPlanoRecomendado(data)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Seu plano ideal
      </h1>
      <p className="text-gray-600 mb-8">
        Com base nas suas respostas, recomendamos o plano perfeito para você
      </p>

      {/* Plano Recomendado */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-[#8609A3] text-white text-xs px-3 py-1 rounded-full font-medium">
          RECOMENDADO
        </div>
        
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{plano.nome}</h2>
          <p className="text-gray-600 mb-4">{plano.descricao}</p>
          <div className="text-3xl font-bold text-[#8609A3]">{plano.preco}</div>
        </div>

        <div className="space-y-3 mb-6">
          {plano.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Informação sobre a seleção */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Este plano foi selecionado automaticamente com base em suas respostas. 
          Você pode prosseguir para o pagamento ou voltar para revisar suas informações.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-8">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none transition-colors"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors"
        >
          Continuar para Pagamento
        </button>
      </div>
    </div>
  )
}
