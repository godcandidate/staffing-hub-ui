import { authAPI } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8089/api/v1';
const RECOMMENDED_JOB_POSTINGS_URL = import.meta.env.VITE_RECOMMENDED_JOB_POSTINGS_URL || 'http://44.248.50.194:6060/api/ai/chatbot/recommend_job_postings';

export const jobsAPI = {
  getOpenJobs: async () => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE_URL}/staffer/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch jobs')
    }

    // Filter only OPEN status jobs
    const openJobs = data.data.filter(job => job.status === 'OPEN')
    return { ...data, data: openJobs }
  },

  getAllJobs: async () => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE_URL}/staffer/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch jobs')
    }

    return data
  },

  getEmployeeJobs: async () => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE_URL}/staffer/jobs`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch jobs')
    }

    return data
  },

  getJobById: async (jobId) => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${API_BASE_URL}/staffer/jobs/${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch job details')
    }

    return data
  },

  getRecommendedJobs: async () => {
    const user = authAPI.getStoredUser()
    
    if (!user || !user.id) {
      throw new Error('User not found. Please log in again.')
    }

    const response = await fetch(`${RECOMMENDED_JOB_POSTINGS_URL}/${user.id}`, {
      method: 'GET',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch recommended jobs')
    }

    return data
  },

  getEmployeeDashboardStats: async () => {
    const token = authAPI.getStoredToken()
    
    if (!token) {
      throw new Error('Authentication required')
    }

    // Get all jobs and applications data for statistics
    const [jobsResponse, applicationsResponse] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/staffer/jobs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }),
      // For now, we'll calculate applications based on available data
      // In a real app, this would be a separate endpoint
      Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) })
    ])

    const jobs = jobsResponse.status === 'fulfilled' && jobsResponse.value.ok 
      ? await jobsResponse.value.json() 
      : { data: [] }

    // Calculate statistics from available data
    const openJobs = jobs.data.filter(job => job.status === 'OPEN')
    
    // Calculate new matching roles based on user skills
    let newMatchingRoles = 0
    try {
      const profileResponse = await fetch(`${API_BASE_URL}/employee/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const employee = profileData.data.employee
        const userSkills = employee.skills || []
        
        // Count jobs that match user skills
        newMatchingRoles = openJobs.filter(job => {
          const jobSkills = job.requiredSkills || []
          return jobSkills.some(skill => 
            userSkills.some(userSkill => 
              userSkill.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(userSkill.toLowerCase())
            )
          )
        }).length
      }
    } catch (error) {
      console.warn('Could not fetch profile for matching roles calculation:', error)
    }
    
    // Get user profile to calculate completeness
    let profileCompleteness = 0
    try {
      const profileResponse = await fetch(`${API_BASE_URL}/employee/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        const employee = profileData.data.employee
        
        // Calculate profile completeness based on filled fields
        let completeness = 0
        const fields = ['department', 'roles', 'experience', 'skills']
        fields.forEach(field => {
          if (employee[field] && 
              (Array.isArray(employee[field]) ? employee[field].length > 0 : true)) {
            completeness += 25
          }
        })
        profileCompleteness = completeness
      }
    } catch (error) {
      console.warn('Could not fetch profile for completeness calculation:', error)
    }

    // Get actual pending applications count
    let pendingApplications = 0
    try {
      const applicationsResponse = await fetch(`${API_BASE_URL}/employee/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json()
        pendingApplications = applicationsData.data.filter(app => app.status === 'PENDING').length
      }
    } catch (error) {
      console.warn('Could not fetch applications for pending count:', error)
    }

    return {
      data: {
        newMatchingRoles,
        pendingApplications,
        profileCompleteness
      }
    }
  },

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