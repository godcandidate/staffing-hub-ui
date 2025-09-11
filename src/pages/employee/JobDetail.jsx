import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, Download, MessageCircle, Calendar, Users, Clock } from 'lucide-react'
import { jobsAPI } from '../../api/jobs'
import RuthPanel from '../../components/RuthPanel'

const JobDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const [showChat, setShowChat] = useState(false)

  const [job, setJob] = useState(location.state?.job || null)
  const [isLoading, setIsLoading] = useState(!location.state?.job)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!job) {
      fetchJobDetails()
    }
  }, [id, job])

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await jobsAPI.getJobById(id)
      setJob(response.data)
    } catch (error) {
      setError(error.message || 'Failed to load job details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleApply = () => {
    // Mock application logic
    alert('Application submitted successfully!')
  }

  if (isLoading) {
    return (
      <div className="job-detail">
        <div className="text-center py-8">
          <div className="text-lg">Loading job details...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="job-detail">
        <div className="text-center py-8">
          <div className="text-error">{error}</div>
          <button 
            className="btn btn-secondary mt-4"
            onClick={fetchJobDetails}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="job-detail">
        <div className="text-center py-8">
          <div className="text-lg">Job not found</div>
          <Link to="/employee/jobs" className="btn btn-secondary mt-4">
            Back to Jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="job-detail">
      {/* Header */}
      <div className="job-header mb-6">
        <Link to="/employee/jobs" className="back-link flex items-center gap-2 mb-4">
          <ArrowLeft size={20} />
          Back to Jobs
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="mb-2">{job.role}</h1>
            <div className="flex items-center gap-4 text-gray mb-4">
              <span className="flex items-center gap-1">
                <Users size={16} />
                {job.client}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {job.duration}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                Starts {job.startDate}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <span className="badge badge-secondary">
              Available
            </span>
            <div className="flex gap-2">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle size={16} />
                Ask Ruth
              </button>
              <button className="btn btn-primary" onClick={handleApply}>
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="job-content grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <h2 className="mb-4">About {job.client}</h2>
            <div className="job-description">
              {job.clientDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="mb-4">Role Requirements</h2>
            <ul className="responsibilities-list">
              {job.roleRequirements.replace(/\\n/g, '\n').split('\n').filter(req => req.trim()).map((requirement, index) => (
                <li key={index} className="mb-2">
                  <span className="bullet">•</span>
                  {requirement.trim()}
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h2 className="mb-4">Required Skills</h2>
            <div className="skills-grid">
              {job.requiredSkills.map((skill) => (
                <span key={skill} className="skill-chip skill-required">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">


          <div className="card mb-6">
            <h3 className="mb-4">Team Contact</h3>
            <div className="contact-info">
              <div className="contact-avatar mb-3">
                <div className="avatar-circle">
                  {job.teamContact.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium">{job.teamContact}</div>
                  <div className="text-sm text-gray">Team Contact</div>
                </div>
              </div>
              <a href={`mailto:${job.contactEmail}`} className="btn btn-secondary w-full">
                Contact Team
              </a>
            </div>
          </div>


        </div>
      </div>

      {/* Ruth Panel */}
      <RuthPanel isOpen={showChat} onClose={() => setShowChat(false)} jobId={job?.id} />
    </div>
  )
}

export default JobDetail