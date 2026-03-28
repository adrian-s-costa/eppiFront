'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { config } from '../../../../config'
import axios from 'axios'
import crypto from 'crypto'
import ImageCropper from '../../_components/ImageCropper/ImageCropper'

interface DealershipData {
  name: string
  description: string
  address: string
  image: string
  storeCode: string
  brandId: string
  coordinates: {
    lat: number
    lng: number
  }
}

export default function CreateDealership() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof DealershipData, string>>>({})
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState<boolean>(false)
  const [originalImage, setOriginalImage] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<DealershipData>({
    name: '',
    description: '',
    address: '',
    image: '',
    storeCode: '',
    brandId: '',
    coordinates: {
      lat: -23.5505,
      lng: -46.6333
    }
  })

  const validateForm = () => {
    const newErrors: Partial<Record<keyof DealershipData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome da concessionária é obrigatório'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Endereço é obrigatório'
    }

    if (!formData.image.trim() && !file) {
      newErrors.image = 'Imagem é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    
    if (!selectedFile) return
    
    const fileType = selectedFile.type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
    const maxSizeMB = 5
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    if (!allowedTypes.includes(fileType)) {
      toast.error('Por favor, envie um arquivo PNG ou JPEG.')
      return
    }

    if (selectedFile.size > maxSizeBytes) {
      toast.error(`O arquivo é muito grande. O tamanho máximo permitido é ${maxSizeMB}MB.`)
      return
    }

    setFile(selectedFile)
    
    // Create preview URL
    const fileURL = URL.createObjectURL(selectedFile)
    setUrl(fileURL)
    setFormData(prev => ({ ...prev, image: fileURL }))
  }

  const handleRemoveImage = () => {
    setFile(null)
    setUrl(null)
    setFormData(prev => ({ ...prev, image: '' }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const uploadFileToSignedUrl = async (signedUrl: string, file: File) => {
    try {
      const response = await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
      return { message: 'Upload realizado com sucesso', data: response }
    } catch (error: any) {
      console.error('Erro durante o upload:', error.message);
      throw error;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      let imageUrl = url || formData.image
      let awsResponse: any = null

      // Se tiver arquivo, fazer upload
      if (file) {
        const mimeToExtension: { [key: string]: string } = {
          'image/jpeg': '.jpg',
          'image/png': '.png',
          'image/heic': '.heic',
          'image/heif': '.heif',
        }

        const mimeType = file.type
        const fileExtension = mimeToExtension[mimeType]
        const uniqueFileName = `dealerships/${crypto.randomBytes(16).toString('hex')}${fileExtension}`
        
        const res = await axios.get(`${config.API_URL}/upload-file/teste/${encodeURIComponent(uniqueFileName)}/${encodeURIComponent(file.type)}`, { 
          headers: { "ngrok-skip-browser-warning": "69420" } 
        })

        if (file && file !== null && url && url !== null) {
          awsResponse = await uploadFileToSignedUrl(res.data, file)
        }
  
        if (awsResponse && awsResponse.data) {
          imageUrl = `https://storage.googleapis.com/videos-grupo-fera/profile-pictures/${uniqueFileName}` 
        } else {
          throw new Error('Erro no upload da imagem')
        }
      }

      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        image: imageUrl,
        ...(formData.storeCode && { storeCode: formData.storeCode }),
        ...(formData.brandId && { brandId: formData.brandId }),
        coordinates: {
          lat: formData.coordinates.lat,
          lng: formData.coordinates.lng
        }
      }

      const response = await fetch(`${config.API_URL}/dealerships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success('Concessionária cadastrada com sucesso!', {
          position: 'top-center',
          autoClose: 3000,
        })
        
        setTimeout(() => {
          router.push('/tab?options=0')
        }, 1500)

      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao cadastrar concessionária')
      }
    } catch (error) {
      console.error('Erro ao cadastrar concessionária:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao cadastrar concessionária', {
        position: 'top-center',
        autoClose: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: keyof DealershipData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleCoordinateChange = (field: 'lat' | 'lng', value: string) => {
    const numValue = parseFloat(value) || 0
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [field]: numValue
      }
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cadastrar Concessionária</h1>
          <p className="text-gray-600">Preencha as informações abaixo para cadastrar uma nova concessionária</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Concessionária *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ex: Concessionária São Paulo"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Descrição */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors ${
                  errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Descreva a concessionária..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Endereço */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço *
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors ${
                  errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Upload de Imagem */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagem *
              </label>
              <div className="space-y-3">
                {/* Input de Upload */}
                <div className="flex items-center justify-center w-full">
                  <input
                    id="image-upload-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  <label
                    htmlFor="image-upload-input"
                    className="flex flex-col items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#8609A3] hover:bg-[#8609A3] hover:bg-opacity-5 transition-all duration-200 bg-white"
                  >
                    <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2.828L12.828 23a2 2 0 012.828 0l6.586 6.586a1 1 0 011.414 1.414l8.586 8.586a1 1 0 011.414 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-600">
                      Clique para selecionar imagem ou arraste aqui
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPEG ou JPG (máx. 5MB)
                    </span>
                  </label>
                </div>

                {/* Preview e Nome do Arquivo */}
                {(url || formData.image) && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={url || formData.image}
                        alt="Preview"
                        className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file?.name || 'imagem-selecionada.jpg'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Imagem selecionada com sucesso
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover imagem"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Store Code (Opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código da Loja (Opcional)
              </label>
              <input
                type="text"
                value={formData.storeCode}
                onChange={(e) => handleInputChange('storeCode', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors"
                placeholder="Ex: SP001"
              />
            </div>

            {/* Brand ID (Opcional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID da Brand (Opcional)
              </label>
              <input
                type="text"
                value={formData.brandId}
                onChange={(e) => handleInputChange('brandId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors"
                placeholder="Ex: brand_12345"
              />
            </div>

            {/* Coordenadas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.coordinates.lat}
                onChange={(e) => handleCoordinateChange('lat', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors"
                placeholder="-23.5505"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.coordinates.lng}
                onChange={(e) => handleCoordinateChange('lng', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8609A3] focus:border-transparent outline-none transition-colors"
                placeholder="-46.6333"
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#8609A3] text-white rounded-lg font-medium hover:bg-[#5b056e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cadastrando...
                </span>
              ) : (
                'Cadastrar Concessionária'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
