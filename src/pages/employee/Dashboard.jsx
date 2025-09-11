import { useState, useEffect } from 'react'
import { MessageCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../api/jobs'
import { authAPI } from '../../api/auth'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const Dashboard = () => {
  const [allJobsData, setAllJobsData] = useState([])
  const [dashboardStats, setDashboardStats] = useState({
    newMatchingRoles: 0,
    applications: 0,
    profileCompleteness: 0
  })
  const [userProfile, setUserProfile] = useState({
    name: 'User'
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 4

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const totalPages = Math.ceil(allJobsData.length / jobsPerPage)
  
  // Calculate current page jobs
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = allJobsData.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Get user info
      const user = authAPI.getStoredUser()
      if (user) {
        setUserProfile({ name: user.name || user.email?.split('@')[0] || 'User' })
      }

      // Fetch jobs and dashboard stats in parallel
      const [jobsResponse, statsResponse] = await Promise.allSettled([
        jobsAPI.getOpenJobs(), // Only fetch OPEN jobs for employee dashboard
        jobsAPI.getEmployeeDashboardStats()
      ])

      // Handle jobs data
      if (jobsResponse.status === 'fulfilled') {
        setAllJobsData(jobsResponse.value.data)
      } else {
        console.warn('Failed to fetch jobs:', jobsResponse.reason)
      }

      // Handle dashboard stats
      if (statsResponse.status === 'fulfilled') {
        setDashboardStats(statsResponse.value.data)
      } else {
        console.warn('Failed to fetch dashboard stats:', statsResponse.reason)
      }

    } catch (error) {
      setError(error.message || 'Failed to load dashboard data')
      console.error('Dashboard fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getJobSkills = (job) => {
    // Handle different possible skill formats from API
    if (Array.isArray(job.requiredSkills)) {
      return job.requiredSkills
    }
    if (typeof job.requiredSkills === 'string') {
      return job.requiredSkills.split(',').map(skill => skill.trim())
    }
    if (Array.isArray(job.skills)) {
      return job.skills
    }
    return ['Skills TBD']
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Hi, {userProfile.name} 👋</h1>
        <p>Welcome back to your staffing dashboard</p>
      </div>

      <div className="stats-cards grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card card-compact">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-primary-600 mb-1">
                {dashboardStats.newMatchingRoles}
              </h3>
              <p className="text-sm text-neutral-600">New roles match your skills</p>
            </div>
            <div className="p-3 bg-primary-50 rounded-lg">
              <TrendingUp className="text-primary-600" size={24} />
            </div>
          </div>
        </div>
        
        <div className="card card-compact">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-warning mb-1">
                {dashboardStats.applications}
              </h3>
              <p className="text-sm text-neutral-600">Total applications</p>
            </div>
            <div className="p-3 bg-warning-bg rounded-lg">
              <div className="w-6 h-6 bg-warning rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="card card-compact">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-success mb-1">
                {dashboardStats.profileCompleteness}%
              </h3>
              <p className="text-sm text-neutral-600">Profile completeness</p>
            </div>
            <div className="p-3 bg-success-bg rounded-lg">
              <div className="w-6 h-6 bg-success rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="recommended-section">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">Open Job Opportunities</h2>
            <p className="text-sm text-neutral-500 mt-1">Currently available positions you can apply for</p>
          </div>
          <Link to="/employee/jobs" className="btn btn-secondary">
            View Recommended Jobs
          </Link>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-error">{error}</div>
            <button 
              className="btn btn-secondary mt-4"
              onClick={fetchDashboardData}
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentJobs.map((job) => (
              <div key={job.id} className="card card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-neutral-900 mb-1">{job.role}</h3>
                    <p className="text-sm text-neutral-500">{job.client} • {job.duration}</p>
                  </div>
                  <span className={`badge ${
                    job.status === 'OPEN' ? 'badge-success' : 
                    job.status === 'CLOSED' ? 'badge-error' : 
                    'badge-secondary'
                  }`}>
                    {job.status || 'Available'}
                  </span>
                </div>

                <div className="skills-section mb-6">
                  {getJobSkills(job).map((skill, skillIndex) => (
                    <span key={skillIndex} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-sm text-neutral-500">
                    Starts {job.startDate ? new Date(job.startDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }) : 'TBD'}
                  </span>
                  <Link 
                    to={`/employee/jobs/${job.id}`}
                    state={{ job }}
                    className="btn btn-primary btn-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!isLoading && !error && totalPages > 1 && (
          <div className="pagination mt-6 flex justify-center gap-2">
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`btn btn-sm ${
                  currentPage === page ? 'btn-primary' : 'btn-ghost'
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard