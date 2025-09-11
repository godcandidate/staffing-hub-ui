import { useState, useEffect } from 'react'
import { Search, Eye, Plus, X, Save } from 'lucide-react'
import { jobsAPI } from '../../api/jobs'
import { talentAPI } from '../../api/talent'
import { employeeAPI } from '../../api/employee'
import { CircularProgress, Box } from '@mui/material'

const TalentMatching = () => {
  const [selectedJob, setSelectedJob] = useState(null)
  const [matchedEmployees, setMatchedEmployees] = useState([])
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [showEmployeeModal, setShowEmployeeModal] = useState(null)
  const [employeeDetails, setEmployeeDetails] = useState(null)
  const [loadingEmployee, setLoadingEmployee] = useState(false)
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
    if (confirm('Are you sure you want to remove this employee from the matches?')) {
      setMatchedEmployees(prev => prev.filter(emp => emp.id !== employeeId))
      setSelectedEmployees(prev => prev.filter(emp => emp.id !== employeeId))
    }
  }

  const viewEmployeeDetails = async (employee) => {
    setShowEmployeeModal(employee)
    setLoadingEmployee(true)
    setEmployeeDetails(null)
    
    try {
      const response = await employeeAPI.getEmployeeDetails(employee.id)
      setEmployeeDetails(response.data)
    } catch (error) {
      console.error('Failed to fetch employee details:', error)
      // Use basic info if API fails
      setEmployeeDetails({
        data: {
          employee: {
            roles: ['Employee'],
            experience: 'N/A',
            skills: {}
          },
          user: {
            name: employee.name
          }
        }
      })
    } finally {
      setLoadingEmployee(false)
    }
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
                        onClick={() => viewEmployeeDetails(employee)}
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
              <button onClick={() => {
                setShowEmployeeModal(null)
                setEmployeeDetails(null)
              }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-content p-6">
              {loadingEmployee ? (
                <div className="text-center py-12">
                  <CircularProgress size={48} sx={{ color: '#f97316' }} />
                  <p className="mt-4 text-neutral-500 text-lg">Loading employee details...</p>
                </div>
              ) : (
                <div className="employee-profile">
                  {/* Header Section */}
                  <div className="profile-header mb-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                        {showEmployeeModal.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-2xl font-bold text-gray-800 mb-2">{employeeDetails?.data?.user?.name || showEmployeeModal.name}</h4>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-lg font-semibold text-green-700">{showEmployeeModal.matchScore}%</span>
                            <span className="text-green-600 text-sm">match</span>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {employeeDetails && (
                    <div className="profile-details space-y-6">
                      {/* Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-semibold mb-3 text-gray-800 text-lg">Roles</h5>
                          <div className="flex flex-wrap gap-2">
                            {employeeDetails.data.employee.roles.map((role, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-medium">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-semibold mb-3 text-gray-800 text-lg">Experience</h5>
                          <p className="text-gray-700 font-medium text-lg">{employeeDetails.data.employee.experience}</p>
                        </div>
                      </div>
                      
                      {/* Skills Section */}
                      {Object.keys(employeeDetails.data.employee.skills).length > 0 && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                          <h5 className="font-semibold mb-4 text-gray-800 text-lg">Skills & Expertise</h5>
                          <div className="space-y-3">
                            {Object.entries(employeeDetails.data.employee.skills).map(([skill, level]) => (
                              <div key={skill} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <span className="font-medium text-gray-800 text-base">{skill}</span>
                                <span className={`px-3 py-1 rounded-full font-medium text-sm ${
                                  level === 'Expert' ? 'bg-green-500 text-white' :
                                  level === 'Advanced' ? 'bg-blue-500 text-white' :
                                  level === 'Intermediate' ? 'bg-yellow-500 text-white' :
                                  'bg-gray-500 text-white'
                                }`}>
                                  {level}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="modal-actions p-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
              <button 
                className="btn btn-secondary px-6 py-2"
                onClick={() => {
                  setShowEmployeeModal(null)
                  setEmployeeDetails(null)
                }}
              >
                Close
              </button>
              <button 
                className={`btn px-6 py-2 ${
                  selectedEmployees.find(emp => emp.id === showEmployeeModal.id) 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
                onClick={() => {
                  toggleEmployeeSelection(showEmployeeModal)
                  setShowEmployeeModal(null)
                  setEmployeeDetails(null)
                }}
              >
                {selectedEmployees.find(emp => emp.id === showEmployeeModal.id) ? 'Remove from' : 'Add to'} Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TalentMatching