'use client'

import { useState } from 'react'

interface VinculoStepProps {
  data: {
    tipoVinculo: string
  }
  brandName: string
  onNext: () => void
  onBack: () => void
  onUpdate: (data: { tipoVinculo: string }) => void
}

export default function VinculoStep({ data, brandName, onNext, onBack, onUpdate }: VinculoStepProps) {
  const [errors, setErrors] = useState({
    tipoVinculo: ''
  })

  const vinculoOptions = [
    { id: 'existente', label: 'Sim, é uma filial/franquia', desc: "A empresa faz parte da mesma rede ou grupo. Será vinculada ao ID da marca existente"},
    { id: 'nova', label: 'Não', desc: "É uma empresa diferente. Será criada uma nova marca com flag de conflito"}
  ]

  const validateForm = () => {
    const newErrors = {
      tipoVinculo: ''
    }

    if (!data.tipoVinculo) {
      newErrors.tipoVinculo = 'Selecione uma opção'
    }

    setErrors(newErrors)
    return !newErrors.tipoVinculo
  }

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value })
    
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Vínculo:', data.tipoVinculo)
      onNext()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Vínculo de Rede ou Grupo
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Você está cadastrando uma unidade para a marca <span className="font-semibold text-[#8609A3]">{brandName}</span>. Essa empresa faz parte das mesma rede ou grupo? 
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Tipo de Vínculo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Selecione uma opção
            </label>
            <div className="space-y-2">
              {vinculoOptions.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="tipoVinculo"
                    value={option.id}
                    checked={data.tipoVinculo === option.id}
                    onChange={(e) => handleInputChange('tipoVinculo', e.target.value)}
                    className="h-4 w-4 text-[#8609A3] focus:ring-[#8609A3] border-gray-300"
                  />
                  <div className="flex flex-col">
                    <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                    <span className="ml-2 text-xs text-gray-500">{option.desc}</span>
                  </div>
                </label>
              ))}
            </div>
            {errors.tipoVinculo && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.tipoVinculo}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#8609A3] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base"
          >
            Próximo
          </button>
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors"
        >
          Próximo
        </button>
      </div>
    </div>
  )
}
