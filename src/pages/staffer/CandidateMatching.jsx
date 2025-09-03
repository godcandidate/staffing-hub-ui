import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { X, Send, Star } from 'lucide-react'

const CandidateMatching = () => {
  const { jobId } = useParams()
  const [selectedCandidates, setSelectedCandidates] = useState([])

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
        <div className="recommendations-section">
          <h2 className="mb-4">AI Recommendations</h2>
          
          <div className="candidates-list">
            {aiRecommendations.map((candidate) => (
              <div key={candidate.id} className="candidate-card card mb-4">
                <div className="candidate-header">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCandidates.includes(candidate.id)}
                      onChange={() => toggleCandidateSelection(candidate.id)}
                      className="candidate-checkbox"
                    />
                    <div className="candidate-avatar">
                      {candidate.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <button
                          onClick={() => removeRecommendation(candidate.id)}
                          className="remove-btn"
                          title="Remove from recommendations"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray mb-2">
                        {candidate.role} • {candidate.department}
                      </p>
                      <div className="match-info mb-3">
                        <span className="match-percent">
                          <Star size={16} className="text-accent-amber" />
                          {candidate.matchPercent}% match
                        </span>
                        <span className="text-sm text-gray">
                          {candidate.experience} experience
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="candidate-skills">
                  {candidate.skills.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Applicants */}
        <div className="applicants-section">
          <h2 className="mb-4">Direct Applicants</h2>
          
          <div className="applicants-list">
            {applicants.map((applicant) => (
              <div key={applicant.id} className="applicant-card card mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="candidate-avatar">
                      {applicant.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold">{applicant.name}</h3>
                      <p className="text-sm text-gray">
                        {applicant.role} • {applicant.department}
                      </p>
                      <p className="text-xs text-gray">
                        Applied {applicant.appliedDate}
                      </p>
                    </div>
                  </div>
                  
                  <div className="applicant-actions">
                    <button className="btn btn-success btn-sm">
                      Accept
                    </button>
                    <button className="btn btn-danger btn-sm">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {applicants.length === 0 && (
              <div className="empty-state text-center p-6">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray">No direct applications yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateMatching