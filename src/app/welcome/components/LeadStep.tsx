'use client'

import { useState, useEffect } from 'react'
import { getAllDealerships } from '../../../../utils/api/service'
import router from 'next/router'

interface Brand {
  id: string
  name: string
}

interface LeadStepProps {
  data: {
    brandName: string
  }
  onNext: () => void
  onUpdate: (data: { brandName: string }) => void
}

export default function LeadStep({ data, onNext, onUpdate }: LeadStepProps) {
  const [errors, setErrors] = useState({
    brandName: ''
  })
  const [searchResults, setSearchResults] = useState<Brand[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const validateForm = () => {
    const newErrors = {
      brandName: ''
    }

    if (!data.brandName.trim()) {
      newErrors.brandName = 'Nome da marca é obrigatório'
    } else if (data.brandName.trim().length < 2) {
      newErrors.brandName = 'Nome deve ter pelo menos 2 caracteres'
    }

    setErrors(newErrors)
    return !newErrors.brandName
  }

  const handleInputChange = async (field: string, value: string) => {
    onUpdate({ ...data, [field]: value })

    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }

    if (field === 'brandName' && value.trim().length > 1) {
      setIsSearching(true)
      try {
        const results = await getAllDealerships()
        const filteredResults = results.filter((dealership: any) => 
          dealership.name.toLowerCase().includes(value.toLowerCase())
        )
        setSearchResults(filteredResults)
        setShowResults(true)
      } catch (error) {
        console.error('Erro ao buscar marcas:', error)
        setSearchResults([])
        setShowResults(true)
      } finally {
        setIsSearching(false)
      }
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  const handleSelectBrand = (brand: Brand) => {
    onUpdate({ ...data, brandName: brand.name })
    setSearchResults([])
    setShowResults(false)
    setErrors(prev => ({ ...prev, brandName: '' }))
  }

  const handleCreateNewBrand = () => {
    // Marca já está no campo data.brandName, só precisamos limpar os resultados
    setSearchResults([])
    setShowResults(false)
    setErrors(prev => ({ ...prev, brandName: '' }))
    // Avança para a próxima página
    if (validateForm()) {
      console.log('Brand name:', data.brandName)
      onNext()
    }
  }

  const shouldShowCreateNewBrand = () => {
    return data.brandName.trim().length > 1 && 
           searchResults.length === 0 && 
           showResults &&
           !isSearching
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      console.log('Brand name:', data.brandName)
      onNext()
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Nome da Marca
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Digite o nome da marca para buscar marcas existentes ou criar uma nova.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Brand Name Field */}
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar marca
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                id="brandName"
                value={data.brandName}
                onChange={(e) => handleInputChange('brandName', e.target.value)}
                placeholder="Ex: Starbucks, McDonald's, Subway..."
                className={`w-full pl-10 pr-3 sm:pl-10 sm:pr-4 py-2 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors ${
                  errors.brandName
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300'
                }`}
              />
            </div>
            {errors.brandName && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.brandName}</p>
            )}
          </div>

          {/* Search Results */}
          {showResults && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8609A3]"></div>
                  <span className="ml-2 text-sm text-gray-600">Buscando...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-600">
                      MARCAS ENCONTRADAS ({searchResults.length})
                    </span>
                  </div>
                  {searchResults.map((brand, index) => (
                    <div
                      key={brand.id}
                      onClick={() => handleSelectBrand(brand)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-700">{brand.name}</span>
                        <span className="text-xs text-gray-500">Similaridade: 100%</span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Existente</span>
                      </div>
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </>
              ) : shouldShowCreateNewBrand() ? (
                <div className="px-4 py-3">
                  <div
                    onClick={handleCreateNewBrand}
                    className="flex items-center justify-center space-x-2 text-[#8609A3] hover:text-[#5b056e] cursor-pointer font-medium text-sm transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>
                      Criar nova marca: {data.brandName}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
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
