import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, CheckCircle, XCircle, ArrowLeft } from 'lucide-react'

const ApplicantReview = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [selectedApplicant, setSelectedApplicant] = useState(null)

  const job = {
    title: "Senior Data Analyst",
    progress: "3/5 roles filled"
  }

  const applicants = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Software Engineer",
      department: "Engineering",
      tenure: "3.5 years",
      status: "pending",
      appliedDate: "Dec 20, 2023",
      skills: ["Python", "SQL", "Power BI", "Statistics", "Machine Learning"],
      experience: "3.5 years in software development with focus on data analysis",
      projects: ["Customer Analytics Dashboard", "Sales Forecasting Model"]
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Data Scientist",
      department: "Analytics",
      tenure: "4.2 years",
      status: "pending",
      appliedDate: "Dec 18, 2023",
      skills: ["Python", "R", "Machine Learning", "SQL", "Tableau"],
      experience: "4+ years in data science with expertise in predictive modeling",
      projects: ["Churn Prediction Model", "A/B Testing Framework"]
    },
    {
      id: 3,
      name: "Sarah Wilson",
      role: "Marketing Analyst",
      department: "Marketing",
      tenure: "2.8 years",
      status: "accepted",
      appliedDate: "Dec 15, 2023",
      skills: ["SQL", "Google Analytics", "Tableau", "Excel"],
      experience: "Strong background in marketing analytics and campaign optimization",
      projects: ["Campaign ROI Analysis", "Customer Segmentation"]
    }
  ]

  const handleAction = (applicantId, action) => {
    console.log(`${action} applicant:`, applicantId)
    // Update applicant status
  }

  const openProfile = (applicant) => {
    setSelectedApplicant(applicant)
  }

  const closeProfile = () => {
    setSelectedApplicant(null)
  }

  const handleBackToJobManagement = () => {
    navigate('/staffer/jobs')
  }

  return (
    <div className="applicant-review">
      {/* Back Navigation */}
      <div className="mb-4">
        <button
          onClick={handleBackToJobManagement}
          className="btn btn-outline btn-sm flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Job Management
        </button>
      </div>

      {/* Header */}
      <div className="review-header card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>{job.title}</h1>
            <p className="text-gray">Progress: {job.progress}</p>
          </div>
          <div className="progress-indicator">
            <div className="progress-circle">
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="card">
        <h2 className="mb-4">Applicant Review</h2>
        
        <div className="applicants-table">
          <div className="table-header">
            <div className="table-row">
              <div className="table-cell">Applicant</div>
              <div className="table-cell">Role & Tenure</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
          </div>
          
          <div className="table-body">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="table-row">
                <div className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="applicant-avatar">
                      <User size={20} />
                    </div>
                    <div>
                      <button
                        className="applicant-name-btn"
                        onClick={() => openProfile(applicant)}
                      >
                        {applicant.name}
                      </button>
                      <p className="text-sm text-gray">{applicant.department}</p>
                    </div>
                  </div>
                </div>
                
                <div className="table-cell">
                  <div>
                    <div className="font-medium">{applicant.role}</div>
                    <div className="text-sm text-gray">{applicant.tenure}</div>
                  </div>
                </div>
                
                <div className="table-cell">
                  <span className={`badge ${
                    applicant.status === 'accepted' ? 'badge-accepted' :
                    applicant.status === 'rejected' ? 'badge-rejected' :
                    'badge-pending'
                  }`}>
                    {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                  </span>
                </div>
                
                <div className="table-cell">
                  {applicant.status === 'pending' && (
                    <div className="action-buttons">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleAction(applicant.id, 'accept')}
                      >
                        <CheckCircle size={16} />
                        Accept
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleAction(applicant.id, 'reject')}
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                  {applicant.status === 'accepted' && (
                    <span className="text-accent-green font-medium">Accepted</span>
                  )}
                  {applicant.status === 'rejected' && (
                    <span className="text-accent-coral font-medium">Rejected</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedApplicant && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <div className="modal-header">
              <h3>Employee Profile</h3>
              <button onClick={closeProfile} className="close-btn">
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="profile-summary mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="profile-avatar-large">
                    <User size={32} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{selectedApplicant.name}</h4>
                    <p className="text-gray">{selectedApplicant.role}</p>
                    <p className="text-sm text-gray">{selectedApplicant.department} • {selectedApplicant.tenure}</p>
                  </div>
                </div>
              </div>

              <div className="profile-section mb-6">
                <h5 className="font-semibold mb-3">Skills</h5>
                <div className="skills-grid">
                  {selectedApplicant.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="profile-section mb-6">
                <h5 className="font-semibold mb-3">Experience</h5>
                <p className="text-gray">{selectedApplicant.experience}</p>
              </div>

              <div className="profile-section">
                <h5 className="font-semibold mb-3">Recent Projects</h5>
                <ul className="project-list">
                  {selectedApplicant.projects.map((project, index) => (
                    <li key={index} className="project-item-simple">
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="btn btn-success"
                onClick={() => {
                  handleAction(selectedApplicant.id, 'accept')
                  closeProfile()
                }}
              >
                Accept Candidate
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  handleAction(selectedApplicant.id, 'reject')
                  closeProfile()
                }}
              >
                Reject Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ApplicantReview