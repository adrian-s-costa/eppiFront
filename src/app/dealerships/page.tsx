'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { config } from '../../../config'

interface Dealership {
  id: string
  name: string
  description: string
  address: string
  distance: string
  offerId: string
  image: string
  rating: number
  reviews: number
  storeCode?: string
  brandId?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export default function DealershipsList() {
  const router = useRouter()
  const [dealerships, setDealerships] = useState<Dealership[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDealerships()
  }, [])

  const fetchDealerships = async () => {
    try {
      const response = await fetch(`${config.API_URL}/dealerships`)
      if (response.ok) {
        const data = await response.json()
        setDealerships(data)
      } else {
        throw new Error('Erro ao carregar concessionárias')
      }
    } catch (error) {
      console.error('Erro:', error)
      setError('Não foi possível carregar as concessionárias')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta concessionária?')) {
      return
    }

    try {
      const response = await fetch(`${config.API_URL}/dealerships/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDealerships(prev => prev.filter(d => d.id !== id))
      } else {
        throw new Error('Erro ao excluir concessionária')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Não foi possível excluir a concessionária')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8609A3]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchDealerships}
            className="px-4 py-2 bg-[#8609A3] text-white rounded-lg hover:bg-[#5b056e]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Concessionárias</h1>
              <p className="text-gray-600">Gerencie as concessionárias cadastradas</p>
            </div>
            <button
              onClick={() => router.push('/dealerships/create')}
              className="px-4 py-2 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] transition-colors"
            >
              Nova Concessionária
            </button>
          </div>
        </div>

        {/* Lista */}
        {dealerships.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma concessionária cadastrada</h3>
            <p className="text-gray-600 mb-4">Comece cadastrando sua primeira concessionária</p>
            <button
              onClick={() => router.push('/dealerships/create')}
              className="px-4 py-2 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] transition-colors"
            >
              Cadastrar Concessionária
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealerships.map((dealership) => (
              <div key={dealership.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Imagem */}
                <div className="h-48 bg-gray-200 relative">
                  {dealership.image ? (
                    <img
                      src={dealership.image}
                      alt={dealership.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Sem+Imagem'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Rating */}
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full shadow-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                      <span className="text-xs font-medium ml-1">{dealership.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{dealership.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dealership.description}</p>
                  
                  <div className="space-y-1 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {dealership.address}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {dealership.distance}
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      {dealership.reviews} avaliações
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => router.push(`/dealerships/edit/${dealership.id}`)}
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(dealership.id)}
                      className="flex-1 px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
