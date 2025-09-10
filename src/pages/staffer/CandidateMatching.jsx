import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { X, Send, Star, Eye } from 'lucide-react'

const CandidateMatching = () => {
  const { jobId } = useParams()
  const [selectedCandidates, setSelectedCandidates] = useState([])
  const [showEmployeeModal, setShowEmployeeModal] = useState(null)
  const [activeTab, setActiveTab] = useState('ai')

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
      avatar: "AT",
      role: "Software Engineer"
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Data Scientist",
      department: "Analytics",
      matchPercent: 89,
      skills: ["Python", "R", "Machine Learning", "SQL"],
      experience: "4.2 years",
      avatar: "MG",
      role: "Data Scientist"
    },
    {
      id: 3,
      name: "David Chen",
      role: "Business Analyst",
      department: "Operations",
      matchPercent: 85,
      skills: ["SQL", "Tableau", "Excel", "Statistics"],
      experience: "2.8 years",
      avatar: "DC",
      role: "Business Analyst"
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
      avatar: "SW",
      role: "Marketing Analyst",
      experience: "2.5 years"
    },
    {
      id: 5,
      name: "James Rodriguez",
      role: "Financial Analyst",
      department: "Finance",
      appliedDate: "Dec 18, 2023",
      status: "pending",
      avatar: "JR",
      role: "Financial Analyst",
      experience: "3.1 years"
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

  const selectAll = () => {
    const currentList = activeTab === 'ai' ? aiRecommendations : applicants
    const allIds = currentList.map(item => item.id)
    setSelectedCandidates(allIds)
  }

  const deselectAll = () => {
    setSelectedCandidates([])
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

      {/* Tabs */}
      <div className="tabs-container mb-6">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            AI Recommendations ({aiRecommendations.length})
          </button>
          <button
            className={`tab ${activeTab === 'applicants' ? 'active' : ''}`}
            onClick={() => setActiveTab('applicants')}
          >
            Direct Applicants ({applicants.length})
          </button>
        </div>
      </div>

      {/* Selection Controls */}
      <div className="selection-controls mb-4 flex items-center gap-4">
        <button 
          className="btn btn-ghost btn-sm"
          onClick={selectedCandidates.length > 0 ? deselectAll : selectAll}
        >
          {selectedCandidates.length > 0 ? 'Deselect All' : 'Select All'}
        </button>
        <span className="text-sm text-neutral-500">
          {selectedCandidates.length} selected
        </span>
      </div>

      {/* Table */}
      <div className="candidates-table card">
        <div className="table-header">
          <div className="table-row font-semibold text-neutral-600 border-b border-neutral-200 pb-3">
            <div>#</div>
            <div>Select</div>
            <div>Name</div>
            <div>Role</div>
            <div>Experience</div>
            <div>{activeTab === 'ai' ? 'Match %' : ''}</div>
            <div>Actions</div>
          </div>
        </div>
        
        <div className="table-body">
          {(activeTab === 'ai' ? aiRecommendations : applicants).map((person, index) => (
            <div key={person.id} className="table-row py-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
              <div>
                <span className="text-neutral-400 font-mono text-sm">{index + 1}</span>
              </div>
              <div>
                <input
                  type="checkbox"
                  checked={selectedCandidates.includes(person.id)}
                  onChange={() => toggleCandidateSelection(person.id)}
                  className="candidate-checkbox"
                />
              </div>
              <div>
                <span className="font-semibold text-neutral-900 text-sm">{person.name}</span>
              </div>
              <div>
                <span className="text-neutral-600">{person.role}</span>
              </div>
              <div>
                <span className="text-neutral-600">{person.experience}</span>
              </div>
              {activeTab === 'ai' ? (
                <div>
                  <span className="badge badge-recommended">
                    {person.matchPercent}%
                  </span>
                </div>
              ) : (
                <div></div>
              )}
              <div className="flex items-center gap-2">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowEmployeeModal(person)}
                >
                  <Eye size={16} />
                  View
                </button>
                {activeTab === 'ai' ? (
                  <button
                    onClick={() => removeRecommendation(person.id)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <X size={16} />
                    Remove
                  </button>
                ) : (
                  <>
                    <button className="btn btn-success btn-sm">
                      Accept
                    </button>
                    <button className="btn btn-danger btn-sm">
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
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