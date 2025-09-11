import { authAPI } from './auth'

const API_BASE_URL = 'http://localhost:8089/api/v1'

export const jobsAPI = {
  postJob: async (jobData, attachments = []) => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    // Format role requirements - convert bullet points to array of sentences
    const formatRequirements = (requirements) => {
      if (!requirements) return []
      
      // Split by bullet points or newlines, clean up each sentence
      return requirements
        .split(/[•\n]/)
        .map(req => req.trim())
        .filter(req => req.length > 0)
        .join('\n')
    }

    // Map form data to API format
    const jobPayload = {
      role: jobData.roles[0]?.name || '',
      roleRequirements: formatRequirements(jobData.roles[0]?.requirements || ''),
      requiredSkills: jobData.roles[0]?.skills || [],
      client: jobData.title, // Company name -> client
      clientDescription: jobData.description, // Company description -> clientDescription
      startDate: jobData.startDate,
      duration: jobData.duration,
      teamContact: jobData.teamContact,
      contactEmail: jobData.contactEmail
    }

    const formData = new FormData()
    formData.append('job', JSON.stringify(jobPayload))
    
    // Add files if any
    attachments.forEach((file, index) => {
      formData.append('file', file)
    })

    const response = await fetch(`${API_BASE_URL}/staffer/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to post job')
    }

    return data
  }
}