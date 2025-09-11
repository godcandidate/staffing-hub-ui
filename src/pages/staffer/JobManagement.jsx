import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../api/jobs'
import { CircularProgress, Box } from '@mui/material'

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await jobsAPI.getAllJobs()
      // Map API data to component format
      const mappedJobs = response.data.map(job => ({
        id: job.id,
        title: job.role,
        team: job.client,
        status: job.status === 'OPEN' ? 'active' : 'filled',
        applications: job.applicationCount,
        postedDate: new Date(job.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }))
      setJobs(mappedJobs)
    } catch (error) {
      setError(error.message || 'Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'active') return job.status === 'active'
    if (activeTab === 'filled') return job.status === 'filled'
    return true
  })

  const getStatusBadge = (job) => {
    if (job.status === 'filled') return 'badge-accepted'
    if (job.rolesFilled > 0) return 'badge-pending'
    return 'badge badge-secondary'
  }

  const getStatusText = (job) => {
    if (job.status === 'filled') return 'Completed'
    if (job.rolesFilled > 0) return 'In Progress'
    return 'Open'
  }

  return (
    <div className="job-management">
      <div className="page-header mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Job Management</h1>
            <p className="text-gray">Manage your posted opportunities</p>
          </div>
          <Link to="/staffer/post-job" className="btn btn-primary">
            <Plus size={16} />
            New Job
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container mb-6">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active ({jobs.filter(j => j.status === 'active').length})
          </button>
          <button
            className={`tab ${activeTab === 'filled' ? 'active' : ''}`}
            onClick={() => setActiveTab('filled')}
          >
            Filled ({jobs.filter(j => j.status === 'filled').length})
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      {isLoading ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight={300}
          gap={2}
        >
          <CircularProgress 
            size={48} 
            thickness={4}
            sx={{ 
              color: '#dd5928' // Primary brand color
            }}
          />
          <p className="text-gray-600 text-sm">Loading jobs...</p>
        </Box>
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
        <div className="jobs-table card">
        <div className="table-header">
          <div className="table-row font-semibold text-neutral-600 border-b border-neutral-200 pb-3">
            <div>#</div>
            <div>Job Title</div>
            <div>Client</div>
            <div>Applications</div>
            <div>Posted</div>
            <div className="text-center">Status</div>
            <div className="text-center">Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          {filteredJobs.map((job, index) => (
            <div key={job.id} className="table-row py-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div>
                <span className="text-neutral-400 font-mono text-sm">{index + 1}</span>
              </div>
              <div>
                <span className="font-semibold text-neutral-900 text-sm">{job.title}</span>
              </div>
              <div>
                <span className="text-neutral-600">{job.team}</span>
              </div>
              <div>
                <span className="font-medium">{job.applications}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-sm">{job.postedDate}</span>
              </div>
              <div className="text-center">
                <span className={`badge ${getStatusBadge(job)}`}>
                  {getStatusText(job)}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                {job.status === 'active' && (
                  <>
                    <Link
                      to={`/staffer/matching/${job.id}`}
                      className="btn btn-ghost btn-sm"
                    >
                      Matches
                    </Link>
                    <Link
                      to={`/staffer/applicants/${job.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Review
                    </Link>
                  </>
                )}
                <button className="icon-btn" title="Edit">
                  <Edit size={16} />
                </button>
                <button className="icon-btn text-error" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {!isLoading && !error && filteredJobs.length === 0 && (
        <div className="empty-state card text-center p-6">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="mb-2">No jobs in this category</h3>
          <p className="text-gray mb-4">
            {activeTab === 'active' && "You don't have any active job postings."}
            {activeTab === 'filled' && "No jobs have been completed yet."}
          </p>
          {activeTab === 'active' && (
            <Link to="/staffer/post-job" className="btn btn-primary">
              Post Your First Job
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default JobManagement