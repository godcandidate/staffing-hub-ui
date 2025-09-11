import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, X, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../api/jobs'
import { CircularProgress, Box } from '@mui/material'

const JobManagement = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingJob, setEditingJob] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

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

  const handleEditJob = (job) => {
    setEditingJob({
      id: job.id,
      title: job.title,
      team: job.team,
      status: job.status
    })
  }

  const handleUpdateJob = async () => {
    if (!editingJob) return

    try {
      setIsUpdating(true)
      await jobsAPI.updateJob(editingJob.id, {
        role: editingJob.title,
        client: editingJob.team,
        status: editingJob.status === 'active' ? 'OPEN' : 'CLOSED'
      })
      
      // Update local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === editingJob.id 
            ? { ...job, title: editingJob.title, team: editingJob.team, status: editingJob.status }
            : job
        )
      )
      
      setEditingJob(null)
    } catch (error) {
      setError(error.message || 'Failed to update job')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteJob = async (jobId) => {
    try {
      setIsLoading(true)
      await jobsAPI.deleteJob(jobId)
      
      // Remove from local state
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId))
      setDeleteConfirm(null)
    } catch (error) {
      setError(error.message || 'Failed to delete job')
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = (job) => {
    setDeleteConfirm(job)
  }

  const cancelEdit = () => {
    setEditingJob(null)
  }

  const cancelDelete = () => {
    setDeleteConfirm(null)
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
                <button 
                  className="icon-btn" 
                  title="Edit"
                  onClick={() => handleEditJob(job)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="icon-btn text-error" 
                  title="Delete"
                  onClick={() => confirmDelete(job)}
                >
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
      
      {/* Edit Job Modal */}
      {editingJob && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Job</h3>
              <button onClick={cancelEdit}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="form-group mb-4">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Client/Team</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingJob.team}
                  onChange={(e) => setEditingJob(prev => ({ ...prev, team: e.target.value }))}
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Status</label>
                <select
                  className="form-input"
                  value={editingJob.status}
                  onChange={(e) => setEditingJob(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="filled">Filled</option>
                </select>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={cancelEdit}
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateJob}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <CircularProgress size={16} />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Update Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Delete Job</h3>
              <button onClick={cancelDelete}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <p className="mb-4">
                Are you sure you want to delete the job "{deleteConfirm.title}"? 
                This action cannot be undone.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-yellow-800 text-sm">
                  ⚠️ This will permanently remove the job posting and all associated applications.
                </p>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-ghost"
                onClick={cancelDelete}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteJob(deleteConfirm.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress size={16} />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Job
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobManagement