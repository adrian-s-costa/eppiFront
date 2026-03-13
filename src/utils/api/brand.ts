import { config } from "../../../config"

interface Brand {
  id: string
  name: string
}

export async function searchBrands(query: string): Promise<Brand[]> {
  try {
    const response = await fetch(`${config.API_URL}/brands/search?q=${encodeURIComponent(query)}`)
    
    if (!response.ok) {
      throw new Error('Erro ao buscar marcas')
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Erro na busca de marcas:', error)
    // Retorna array vazio em caso de erro
    return []
  }
}
