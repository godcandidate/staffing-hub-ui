import { authAPI } from './auth'

const TALENT_API_URL = import.meta.env.VITE_TALENT_API_URL || 'http://localhost:8090/api/ai/chatbot'

export const talentAPI = {
  matchEmployees: async (jobId) => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${TALENT_API_URL}/match_employees/${jobId}`, {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to match employees')
    }

    return data
  }
}