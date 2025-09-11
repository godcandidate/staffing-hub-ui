import { useState, useEffect } from 'react'
import { Search, Eye, Plus, X, Save } from 'lucide-react'
import { jobsAPI } from '../../api/jobs'
import { talentAPI } from '../../api/talent'
import { CircularProgress, Box } from '@mui/material'

const TalentMatching = () => {
  const [selectedJob, setSelectedJob] = useState(null)
  const [matchedEmployees, setMatchedEmployees] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [showEmployeeModal, setShowEmployeeModal] = useState(null)
  const [isMatching, setIsMatching] = useState(false)
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
      const response = await jobsAPI.getOpenJobs()
      setJobs(response.data)
    } catch (error) {
      setError(error.message || 'Failed to load jobs')
    } finally {
      setIsLoading(false)
    }
  }



  const handleMatchEmployees = async (job) => {
    setSelectedJob(job)
    setIsMatching(true)
    setSelectedEmployees([])
    
    try {
      const response = await talentAPI.matchEmployees(job.id)
      const employees = response.data.map(emp => ({
        id: emp.user_id,
        name: emp.name,
        matchScore: parseInt(emp.match_score.replace('%', '')),
        role: 'Employee', // Default role since not provided by API
        department: 'Various', // Default department
        experience: 'N/A', // Not provided by API
        skills: [], // Not provided by API
        availability: 'Available' // Default availability
      }))
      setMatchedEmployees(employees)
    } catch (error) {
      console.error('Failed to match employees:', error)
      setMatchedEmployees([])
    } finally {
      setIsMatching(false)
    }
  }

  const toggleEmployeeSelection = (employee) => {
    setSelectedEmployees(prev => 
      prev.find(emp => emp.id === employee.id)
        ? prev.filter(emp => emp.id !== employee.id)
        : [...prev, employee]
    )
  }

  const removeEmployee = (employeeId) => {
    setMatchedEmployees(prev => prev.filter(emp => emp.id !== employeeId))
    setSelectedEmployees(prev => prev.filter(emp => emp.id !== employeeId))
  }

  const saveSelection = () => {
    alert(`Saved ${selectedEmployees.length} employees for ${selectedJob.title}`)
  }

  return (
    <div className="talent-matching">
      <div className="page-header mb-6">
        <h1>Talent Matching</h1>
        <p className="text-neutral-500">Match the right talent to your projects</p>
      </div>

      {isMatching ? (
        <div className="ai-matching-animation">
          <div className="card text-center p-8">
            <div className="ai-brain mb-6">
              <div className="brain-core"></div>
              <div className="brain-pulse pulse-1"></div>
              <div className="brain-pulse pulse-2"></div>
              <div className="brain-pulse pulse-3"></div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">AI Matching in Progress</h2>
            <p className="text-neutral-500 mb-6">Analyzing {selectedJob.title} requirements and matching with available talent...</p>
            <div className="matching-steps">
              <div className="step active">📊 Analyzing project requirements</div>
              <div className="step active">🔍 Scanning talent database</div>
              <div className="step active">🤖 Calculating compatibility scores</div>
              <div className="step">✨ Generating recommendations</div>
            </div>
          </div>
        </div>
      ) : !selectedJob ? (
        <div className="job-selection">
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
                size={56} 
                thickness={4}
                sx={{ 
                  color: '#dd5928' // Primary brand color
                }}
              />
              <p className="text-gray-600 text-sm">Loading available jobs...</p>
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
            <div className="card mb-6">
              <h2 className="text-xl font-semibold mb-4">Select a Project</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="job-card card-minimal card-hover">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{job.role}</h3>
                        <p className="text-sm text-neutral-500">{job.client}</p>
                      </div>
                      <span className="text-xs text-neutral-400">📅 {job.startDate}</span>
                    </div>
                    <div className="roles mb-4 mt-3">
                      {job.requiredSkills.map((skill) => (
                        <span key={skill} className="skill-chip skill-chip-neutral mr-2 mb-2">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button 
                      className="btn btn-primary w-full"
                      onClick={() => handleMatchEmployees(job)}
                    >
                      Match Employees
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="matching-interface">
          <div className="selected-job-header card mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedJob.role}</h2>
                <p className="text-neutral-500">{selectedJob.client}</p>
              </div>
              <div className="flex gap-3">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSelectedJob(null)}
                >
                  ← Back to Projects
                </button>
                <button 
                  className="btn btn-success"
                  onClick={saveSelection}
                  disabled={selectedEmployees.length === 0}
                >
                  <Save size={16} />
                  Save Selection ({selectedEmployees.length})
                </button>
              </div>
            </div>
          </div>

          <div className="employees-list card">
            <div className="list-header">
              <h3 className="font-semibold">Matched Candidates ({matchedEmployees.length})</h3>
            </div>
            <div className="employee-list-items">
              {matchedEmployees.map((employee) => (
                <div key={employee.id} className="employee-list-item">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.find(emp => emp.id === employee.id)}
                      onChange={() => toggleEmployeeSelection(employee)}
                      className="employee-checkbox"
                    />
                    <div className="employee-name">
                      <span className="font-medium">{employee.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="match-score-simple">
                      <span className="text-success font-semibold">{employee.matchScore}%</span>
                    </div>
                    <div className="employee-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setShowEmployeeModal(employee)}
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => removeEmployee(employee.id)}
                      >
                        <X size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
                  <div className="detail-section mb-4">
                    <h5 className="font-medium mb-2">Experience</h5>
                    <p>{showEmployeeModal.experience}</p>
                  </div>
                  <div className="detail-section mb-4">
                    <h5 className="font-medium mb-2">Skills</h5>
                    <div className="skills-grid">
                      {showEmployeeModal.skills.map((skill) => (
                        <span key={skill} className="skill-chip">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="detail-section">
                    <h5 className="font-medium mb-2">Availability</h5>
                    <span className={`badge ${
                      showEmployeeModal.availability === 'Available' ? 'badge-accepted' : 'badge-pending'
                    }`}>
                      {showEmployeeModal.availability}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  toggleEmployeeSelection(showEmployeeModal)
                  setShowEmployeeModal(null)
                }}
              >
                {selectedEmployees.find(emp => emp.id === showEmployeeModal.id) ? 'Remove' : 'Add'} to Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TalentMatching