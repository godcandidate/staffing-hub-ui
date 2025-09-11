import { useState, useEffect } from 'react'
import { MessageCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../api/jobs'

const Dashboard = () => {
  const [allJobsData, setAllJobsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 4

  useEffect(() => {
    fetchJobs()
  }, [])

  const totalPages = Math.ceil(allJobsData.length / jobsPerPage)
  
  // Calculate current page jobs
  const startIndex = (currentPage - 1) * jobsPerPage
  const endIndex = startIndex + jobsPerPage
  const currentJobs = allJobsData.slice(startIndex, endIndex)

  const goToPage = (page) => {
    setCurrentPage(page)
  }

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await jobsAPI.getEmployeeJobs()
      setAllJobsData(response.data)
    } catch (error) {
      setError(error.message || 'Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const mockJobs = [
    {
      id: 1,
      title: "Senior Data Analyst",
      team: "Analytics Team",
      duration: "6 months",
      matchPercent: 92,
      skills: ["Python", "SQL", "Power BI"],
      startDate: "Jan 15, 2024",
      isRecommended: true
    },
    {
      id: 2,
      title: "Frontend Developer",
      team: "Product Team",
      duration: "4 months",
      matchPercent: 87,
      skills: ["React", "TypeScript", "CSS"],
      startDate: "Feb 1, 2024",
      isRecommended: true
    },
    {
      id: 3,
      title: "DevOps Engineer",
      team: "Infrastructure",
      duration: "8 months",
      skills: ["AWS", "Docker", "Kubernetes"],
      startDate: "Jan 22, 2024",
      isRecommended: false
    },
    {
      id: 4,
      title: "UX Designer",
      team: "Design Team",
      duration: "3 months",
      skills: ["Figma", "User Research", "Prototyping"],
      startDate: "Feb 5, 2024",
      isRecommended: false
    },
    {
      id: 5,
      title: "Backend Developer",
      team: "Engineering",
      duration: "12 months",
      matchPercent: 78,
      skills: ["Node.js", "MongoDB", "API Design"],
      startDate: "Jan 30, 2024",
      isRecommended: true
    }
  ]

  const recommendedJobs = allJobsData.slice(0, 3)

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Hi, Alex 👋</h1>
        <p>Welcome back to your staffing dashboard</p>
      </div>

      <div className="stats-cards grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card card-compact">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-primary-600 mb-1">3</h3>
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
              <h3 className="text-3xl font-bold text-warning mb-1">2</h3>
              <p className="text-sm text-neutral-600">Applications pending</p>
            </div>
            <div className="p-3 bg-warning-bg rounded-lg">
              <div className="w-6 h-6 bg-warning rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="card card-compact">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-bold text-success mb-1">85%</h3>
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
            <h2 className="text-xl font-semibold text-neutral-900">All Available Jobs</h2>
            <p className="text-sm text-neutral-500 mt-1">Browse all current opportunities</p>
          </div>
          <Link to="/employee/jobs" className="btn btn-secondary">
            View Recommended
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-lg">Loading jobs...</div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-error">{error}</div>
            <button 
              className="btn btn-secondary mt-4"
              onClick={fetchJobs}
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
                  <span className="badge badge-secondary">
                    Available
                  </span>
                </div>

                <div className="skills-section mb-6">
                  {job.requiredSkills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <span className="text-sm text-neutral-500">Starts {job.startDate}</span>
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