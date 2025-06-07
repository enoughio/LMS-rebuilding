import type { Library } from "@/types/library"

class LibraryService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `/api${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || data.error || 'API request failed')
    }

    return data
  }

  async getLibrary() {
    try {
      const response = await this.makeRequest('/library/profile')
      return response.data
    } catch (error) {
      console.error('Error fetching library:', error)
      throw error
    }
  }

  async updateLibrary(updates: Partial<Library>): Promise<Library> {
    try {
      const response = await this.makeRequest('/library/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      })
      return response.data
    } catch (error) {
      console.error('Error updating library:', error)
      throw error
    }
  }
}

export const libraryService = new LibraryService()
