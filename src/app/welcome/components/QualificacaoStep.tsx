'use client'

import { useState } from 'react'

interface QualificacaoStepProps {
  data: {
    tipoOperacao: string
    estruturaAtendimento: string
    tipoAtendimento: string
    volumeClientes: string
    quantidadeUnidades: string
  }
  onNext: () => void
  onBack: () => void
  onUpdate: (data: {
    tipoOperacao: string
    estruturaAtendimento: string
    tipoAtendimento: string
    volumeClientes: string
    quantidadeUnidades: string
  }) => void
}

export default function QualificacaoStep({ data, onNext, onBack, onUpdate }: QualificacaoStepProps) {
  const questions = [
    {
      id: 'tipoOperacao',
      title: 'Tipo de operação?',
      options: [
        { value: 'autonomo', label: 'Autônomo' },
        { value: 'estabelecimento', label: 'Estabelecimento com ponto físico' },
        { value: 'multiunidade', label: 'Multiunidade / franquia' }
      ]
    },
    {
      id: 'estruturaAtendimento',
      title: 'Estrutura de atendimento?',
      options: [
        { value: 'apenas_eu', label: 'Apenas eu' },
        { value: '2a5', label: '2 a 5 pessoas' },
        { value: '6mais', label: '6 ou mais pessoas' }
      ]
    },
    {
      id: 'tipoAtendimento',
      title: 'Tipo de atendimento?',
      options: [
        { value: 'agendamento', label: 'Sob agendamento' },
        { value: 'local_fixo', label: 'Local fixo aberto ao público' },
        { value: 'ambos', label: 'Ambos' }
      ]
    },
    {
      id: 'volumeClientes',
      title: 'Volume mensal de clientes?',
      options: [
        { value: 'ate50', label: 'Até 50 clientes/mês' },
        { value: '50a150', label: '50 a 150 clientes/mês' },
        { value: 'mais150', label: 'Mais de 150 clientes/mês' }
      ]
    },
    {
      id: 'quantidadeUnidades',
      title: 'Quantas unidades você tem?',
      options: [
        { value: '1', label: '1 unidade' },
        { value: '2', label: '2 unidades' },
        { value: '3mais', label: '3 ou mais unidades' }
      ]
    }
  ]

  const handleOptionChange = (questionId: string, value: string) => {
    onUpdate({ ...data, [questionId]: value })
  }

  const isFormValid = () => {
    return Object.values(data).every(value => value !== '')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Qualifiquemos seu negócio
      </h1>
      <p className="text-gray-600 mb-8">
        Responda algumas perguntas para personalizar sua experiência
      </p>

      <div className="space-y-8">
        {questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">
              {question.title}
            </h3>
            <div className="space-y-2">
              {question.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={data[question.id as keyof typeof data] === option.value}
                    onChange={() => handleOptionChange(question.id, option.value)}
                    className="w-4 h-4 text-[#8609A3] border-gray-300 focus:ring-[#8609A3] focus:ring-2"
                  />
                  <span className="ml-3 text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
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
          disabled={!isFormValid()}
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors outline-none focus:ring-2 focus:ring-offset-2 ${
            isFormValid()
              ? 'bg-[#8609A3] text-white hover:bg-[#5b056e] focus:ring-[#8609A3]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  )
}
