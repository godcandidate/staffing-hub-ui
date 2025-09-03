import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { X, Send, Star, Eye } from 'lucide-react'

const CandidateMatching = () => {
  const { jobId } = useParams()
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [showEmployeeModal, setShowEmployeeModal] = useState(null)

  const job = {
    title: "Senior Data Analyst",
    team: "Analytics Team",
    rolesNeeded: 2
  }

  const aiRecommendations = [
    {
      id: 1,
      name: "Alex Thompson",
      role: "Software Engineer",
      department: "Engineering",
      matchPercent: 92,
      skills: ["Python", "SQL", "Power BI", "Statistics"],
      experience: "3.5 years",
      avatar: "AT"
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Data Scientist",
      department: "Analytics",
      matchPercent: 89,
      skills: ["Python", "R", "Machine Learning", "SQL"],
      experience: "4.2 years",
      avatar: "MG"
    },
    {
      id: 3,
      name: "David Chen",
      role: "Business Analyst",
      department: "Operations",
      matchPercent: 85,
      skills: ["SQL", "Tableau", "Excel", "Statistics"],
      experience: "2.8 years",
      avatar: "DC"
    }
  ]

  const applicants = [
    {
      id: 4,
      name: "Sarah Wilson",
      role: "Marketing Analyst",
      department: "Marketing",
      appliedDate: "Dec 20, 2023",
      status: "pending",
      avatar: "SW"
    },
    {
      id: 5,
      name: "James Rodriguez",
      role: "Financial Analyst",
      department: "Finance",
      appliedDate: "Dec 18, 2023",
      status: "pending",
      avatar: "JR"
    }
  ]

  const toggleCandidateSelection = (candidateId) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const removeRecommendation = (candidateId) => {
    // Remove from AI recommendations
    console.log('Removing candidate:', candidateId)
  }

  const sendBatchMessage = () => {
    if (selectedCandidates.length === 0) {
      alert('Please select candidates first')
      return
    }
    alert(`Sending message to ${selectedCandidates.length} candidates`)
  }

  return (
    <div className="candidate-matching">
      {/* Job Header */}
      <div className="job-banner card mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>{job.title}</h1>
            <p className="text-gray">{job.team} • {job.rolesNeeded} roles needed</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={sendBatchMessage}
            disabled={selectedCandidates.length === 0}
          >
            <Send size={16} />
            Send Batch Message ({selectedCandidates.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <div className="recommendations-section card">
          <div className="list-header">
            <h2 className="font-semibold">AI Recommendations ({aiRecommendations.length})</h2>
          </div>
          
          <div className="candidate-list-items">
            {aiRecommendations.map((candidate) => (
              <div key={candidate.id} className="candidate-list-item">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(candidate.id)}
                    onChange={() => toggleCandidateSelection(candidate.id)}
                    className="candidate-checkbox"
                  />
                  <div className="candidate-name">
                    <span className="font-medium">{candidate.name}</span>
                    <span className="badge badge-recommended ml-2">
                      {candidate.matchPercent}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowEmployeeModal(candidate)}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button
                    onClick={() => removeRecommendation(candidate.id)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <X size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applicants */}
        <div className="applicants-section card">
          <div className="list-header">
            <h2 className="font-semibold">Direct Applicants ({applicants.length})</h2>
          </div>
          
          <div className="applicant-list-items">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="applicant-list-item">
                <div className="flex items-center gap-4">
                  <div className="applicant-name">
                    <span className="font-medium">{applicant.name}</span>
                    <span className="text-xs text-neutral-400 block">
                      Applied {applicant.appliedDate}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    className="btn btn-ghost btn-sm"
                    onClick={() => setShowEmployeeModal(applicant)}
                  >
                    <Eye size={16} />
                    View
                  </button>
                  <button className="btn btn-success btn-sm">
                    Accept
                  </button>
                  <button className="btn btn-danger btn-sm">
                    Reject
                  </button>
                </div>
              </div>
            ))}

            {applicants.length === 0 && (
              <div className="empty-state text-center p-6">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-neutral-500">No direct applications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Employee Details Modal */}
      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Employee Details</h3>
              <button onClick={() => setShowEmployeeModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <div className="employee-profile">
                <div className="profile-header mb-4">
                  <div className="employee-avatar-large">
                    {showEmployeeModal.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-semibold">{showEmployeeModal.name}</h4>
                    <p className="text-neutral-500">{showEmployeeModal.role}</p>
                    <p className="text-sm text-neutral-400">{showEmployeeModal.department}</p>
                  </div>
                </div>
                <div className="profile-details">
                  {showEmployeeModal.experience && (
                    <div className="detail-section mb-4">
                      <h5 className="font-medium mb-2">Experience</h5>
                      <p>{showEmployeeModal.experience}</p>
                    </div>
                  )}
                  {showEmployeeModal.skills && (
                    <div className="detail-section mb-4">
                      <h5 className="font-medium mb-2">Skills</h5>
                      <div className="skills-grid">
                        {showEmployeeModal.skills.map((skill) => (
                          <span key={skill} className="skill-chip">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {showEmployeeModal.matchPercent && (
                    <div className="detail-section">
                      <h5 className="font-medium mb-2">Match Score</h5>
                      <span className="text-success font-semibold text-lg">{showEmployeeModal.matchPercent}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowEmployeeModal(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateMatching