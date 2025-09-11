import { authAPI } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://44.248.50.194:8080/api/v1'

export const employeeAPI = {
  getEmployeeDetails: async (employeeId) => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE_URL}/employee/${employeeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch employee details')
    }

    return data
  }
}