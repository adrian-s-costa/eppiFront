'use client'

import { useState } from 'react'

interface LeadStepProps {
  data: {
    fullName: string
    whatsapp: string
    email: string
  }
  onNext: () => void
  onUpdate: (data: { fullName: string; whatsapp: string; email: string }) => void
}

export default function LeadStep({ data, onNext, onUpdate }: LeadStepProps) {
  const [errors, setErrors] = useState({
    fullName: '',
    whatsapp: '',
    email: ''
  })

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      whatsapp: '',
      email: ''
    }

    // Validate full name
    if (!data.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório'
    } else if (data.fullName.trim().length < 3) {
      newErrors.fullName = 'Nome deve ter pelo menos 3 caracteres'
    }

    // Validate WhatsApp
    const whatsappRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/
    if (!data.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório'
    } else if (!whatsappRegex.test(data.whatsapp)) {
      newErrors.whatsapp = 'Formato inválido. Use (11) 99999-9999'
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!data.email.trim()) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!emailRegex.test(data.email)) {
      newErrors.email = 'E-mail inválido'
    }

    setErrors(newErrors)
    return !newErrors.fullName && !newErrors.whatsapp && !newErrors.email
  }

  const handleInputChange = (field: string, value: string) => {
    onUpdate({ ...data, [field]: value })
    
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const formatWhatsApp = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '')
    
    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return digits
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
    }
  }

  const handleWhatsAppChange = (value: string) => {
    const formatted = formatWhatsApp(value)
    handleInputChange('whatsapp', formatted)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Lead data:', data)
      onNext()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">

        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo à Éppi
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Preencha seus dados para criar sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Full Name Field */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              id="fullName"
              value={data.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Seu nome completo"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors ${
                errors.fullName
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* WhatsApp Field */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
              WhatsApp
            </label>
            <input
              type="tel"
              id="whatsapp"
              value={data.whatsapp}
              onChange={(e) => handleWhatsAppChange(e.target.value)}
              placeholder="(11) 99999-9999"
              maxLength={15}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors ${
                errors.whatsapp
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
            {errors.whatsapp && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.whatsapp}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={data.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#8609A3] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#5b056e] focus:ring-2 focus:ring-[#8609A3] focus:ring-offset-2 outline-none transition-colors text-sm sm:text-base"
          >
            Continuar
          </button>
        </form>
      </div>

      {/* Privacy Message */}
      <p className="text-xs text-gray-500 text-center">
        Seus dados serão protegidos e usados apenas para sua conta
      </p>
    </div>
  )
}
