import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState('active')

  const jobs = [
    {
      id: 1,
      title: "Senior Data Analyst",
      team: "Analytics Team",
      rolesTotal: 2,
      rolesFilled: 1,
      status: "active",
      postedDate: "Dec 15, 2023",
      applications: 8
    },
    {
      id: 2,
      title: "Frontend Developer",
      team: "Product Team",
      rolesTotal: 3,
      rolesFilled: 0,
      status: "active",
      postedDate: "Dec 20, 2023",
      applications: 12
    },
    {
      id: 3,
      title: "DevOps Engineer",
      team: "Infrastructure",
      rolesTotal: 1,
      rolesFilled: 1,
      status: "filled",
      postedDate: "Dec 10, 2023",
      applications: 6
    },
    {
      id: 4,
      title: "UX Designer",
      team: "Design Team",
      rolesTotal: 2,
      rolesFilled: 0,
      status: "archived",
      postedDate: "Nov 28, 2023",
      applications: 4
    }
  ]

  const filteredJobs = jobs.filter(job => {
    if (activeTab === 'active') return job.status === 'active'
    if (activeTab === 'filled') return job.status === 'filled'
    if (activeTab === 'archived') return job.status === 'archived'
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
          <button
            className={`tab ${activeTab === 'archived' ? 'active' : ''}`}
            onClick={() => setActiveTab('archived')}
          >
            Archived ({jobs.filter(j => j.status === 'archived').length})
          </button>
        </div>
      </div>

      {/* Jobs List */}
      <div className="jobs-list">
        {filteredJobs.map((job) => (
          <div key={job.id} className="card mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{job.title}</h3>
                  <span className={`badge ${getStatusBadge(job)}`}>
                    {getStatusText(job)}
                  </span>
                </div>
                
                <p className="text-gray mb-3">{job.team}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray">
                  <span>
                    Roles: {job.rolesFilled}/{job.rolesTotal} filled
                  </span>
                  <span>
                    Applications: {job.applications}
                  </span>
                  <span>
                    Posted: {job.postedDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {job.status === 'active' && (
                  <>
                    <Link
                      to={`/staffer/matching/${job.id}`}
                      className="btn btn-secondary btn-sm"
                    >
                      View Matches
                    </Link>
                    <Link
                      to={`/staffer/applicants/${job.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Review ({job.applications})
                    </Link>
                  </>
                )}
                
                <div className="job-actions">
                  <button className="icon-btn" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button className="icon-btn" title="Mark Unavailable">
                    <EyeOff size={16} />
                  </button>
                  <button className="icon-btn text-accent-coral" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {job.status === 'active' && (
              <div className="progress-section mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Filling Progress</span>
                  <span>{Math.round((job.rolesFilled / job.rolesTotal) * 100)}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${(job.rolesFilled / job.rolesTotal) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="empty-state card text-center p-6">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="mb-2">No jobs in this category</h3>
          <p className="text-gray mb-4">
            {activeTab === 'active' && "You don't have any active job postings."}
            {activeTab === 'filled' && "No jobs have been completed yet."}
            {activeTab === 'archived' && "No archived jobs found."}
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