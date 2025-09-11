import { useState } from 'react'
import { Sparkles, Upload, X, List } from 'lucide-react'
import { jobsAPI } from '../../api/jobs'

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    roles: [{ name: '', requirements: '' }],
    startDate: '',
    duration: '',
    rolesCount: 1,
    teamContact: '',
    contactEmail: ''
  })
  const [skillInput, setSkillInput] = useState('')
  const [attachments, setAttachments] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [error, setError] = useState('')

  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 
    'TypeScript', 'SQL', 'MongoDB', 'Kubernetes', 'GraphQL', 'Vue.js'
  ]

  const handleInputChange = (field, value) => {
    if (field === 'rolesCount') {
      const count = parseInt(value)
      const newRoles = Array.from({ length: count }, (_, i) => 
        formData.roles[i] || { name: '', requirements: '' }
      )
      setFormData(prev => ({ ...prev, [field]: count, roles: newRoles }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const updateRoleName = (roleIndex, name) => {
    const newRoles = [...formData.roles]
    newRoles[roleIndex].name = name
    setFormData(prev => ({ ...prev, roles: newRoles }))
  }

  const updateRoleRequirements = (roleIndex, requirements) => {
    const newRoles = [...formData.roles]
    newRoles[roleIndex].requirements = requirements
    setFormData(prev => ({ ...prev, roles: newRoles }))
  }

  const formatToBullets = (roleIndex) => {
    const role = formData.roles[roleIndex]
    if (!role.requirements) return
    
    const lines = role.requirements.split('\n').filter(line => line.trim())
    const bulletPoints = lines.map(line => {
      const trimmed = line.trim()
      return trimmed.startsWith('•') ? trimmed : `• ${trimmed}`
    }).join('\n')
    updateRoleRequirements(roleIndex, bulletPoints)
  }

  const enhanceWithAI = () => {
    // Mock AI enhancement
    const enhancedDescription = `${formData.description}

Key Responsibilities:
• Develop and maintain high-quality software solutions
• Collaborate with cross-functional teams to deliver projects
• Participate in code reviews and technical discussions
• Contribute to architectural decisions and best practices

What You'll Gain:
• Exposure to cutting-edge technologies and methodologies
• Mentorship from senior team members
• Opportunity to make meaningful impact on product development
• Professional growth in a collaborative environment`

    setFormData(prev => ({ ...prev, description: enhancedDescription }))
  }

  const handleNext = (e) => {
    e.preventDefault()
    setCurrentStep(2)
  }

  const handlePublish = async () => {
    try {
      setIsLoading(true)
      setError('')
      await jobsAPI.postJob(formData, attachments)
      setShowSuccessModal(true)
    } catch (error) {
      setError(error.message || 'Failed to post job')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setFormData({
      title: '',
      description: '',
      roles: [{ name: '', requirements: '' }],
      startDate: '',
      duration: '',
      rolesCount: 1,
      teamContact: '',
      contactEmail: ''
    })
    setAttachments([])
    setShowSuccessModal(false)
  }

  return (
    <div className="post-job">
      <div className="page-header mb-6">
        <h1>Post a New Job</h1>
        <p className="text-gray">Create an opportunity for internal talent</p>
      </div>

      {currentStep === 1 ? (
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleNext} className="job-form">
            <div className="card mb-6">
              <h3 className="mb-4">Job Details</h3>
              
              <div className="form-group mb-4">
                <label className="form-label">Client Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Microsoft, Amazon, Google"
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Client Description *</label>
                <textarea
                  className="form-textarea"
                  rows={8}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the client, project overview, and what the engagement involves..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="form-group">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration *</label>
                  <select
                    className="form-input"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    required
                  >
                    <option value="">Select duration</option>
                    <option value="3 months">3 months</option>
                    <option value="6 months">6 months</option>
                    <option value="9 months">9 months</option>
                    <option value="12 months">12 months</option>
                  </select>
                </div>
              </div>

              <div className="form-group mb-4">
                <label className="form-label">Number of Roles *</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="form-input"
                  value={formData.rolesCount}
                  onChange={(e) => handleInputChange('rolesCount', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="card mb-6">
              <h3 className="mb-4">Role Requirements</h3>
              
              {formData.roles.map((role, roleIndex) => (
                <div key={roleIndex} className="role-section mb-6 p-4 border border-neutral-200 rounded-lg">
                  <div className="form-group mb-3">
                    <label className="form-label">Role Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={role.name}
                      onChange={(e) => updateRoleName(roleIndex, e.target.value)}
                      placeholder={`e.g. Senior Developer, Junior Analyst`}
                    />
                  </div>
                  
                  <div className="form-group">
                    <div className="flex items-center justify-between mb-2">
                      <label className="form-label">Role Requirements</label>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => formatToBullets(roleIndex)}
                      >
                        <List size={16} />
                        Bullet List
                      </button>
                    </div>
                    <textarea
                      className="form-textarea"
                      rows={4}
                      value={role.requirements}
                      onChange={(e) => updateRoleRequirements(roleIndex, e.target.value)}
                      placeholder="Enter each requirement on a new line:

3+ years Python experience
Strong knowledge of Django framework
Experience with REST APIs"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="card mb-6">
              <h3 className="mb-4">Team Contact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Contact Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.teamContact}
                    onChange={(e) => handleInputChange('teamContact', e.target.value)}
                    placeholder="e.g. Sarah Johnson"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="e.g. sarah.johnson@company.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="mb-4">Attach Files</h3>
              
              <div className="upload-area mb-4">
                <Upload size={24} className="text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-500 mb-2">Drag & drop files here or click to browse</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const files = Array.from(e.target.files)
                    setAttachments(prev => [...prev, ...files])
                  }}
                />
                <label htmlFor="file-upload" className="btn btn-secondary btn-sm cursor-pointer">
                  Choose Files
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="attachments-list">
                  <p className="text-sm font-medium mb-3">Attached Files ({attachments.length})</p>
                  {attachments.map((file, index) => (
                    <div key={index} className="attachment-item flex items-center justify-between p-3 bg-neutral-50 rounded-md mb-2">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setAttachments(prev => prev.filter((_, i) => i !== index))}
                        className="text-error hover:bg-error hover:text-white p-1 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-actions mt-6">
              <button type="submit" className="btn btn-primary">
                Next: Preview
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="preview-header mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">{formData.title}</h1>
            <div className="flex items-center gap-4 text-neutral-500">
              <span>📅 Starts {formData.startDate}</span>
              <span>⏱️ {formData.duration}</span>
              <span>👥 {formData.rolesCount} positions</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="card mb-6">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div className="prose text-neutral-700 leading-relaxed">
                  {formData.description.split('\n').map((line, i) => (
                    <p key={i} className="mb-3">{line}</p>
                  ))}
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-6">Role Requirements</h2>
                <div className="space-y-6">
                  {formData.roles.map((role, index) => (
                    <div key={index} className="role-card">
                      <h3 className="font-semibold text-lg mb-3 text-primary-700">
                        {role.name || `Role ${index + 1}`}
                      </h3>
                      <div className="requirements-text text-left">
                        {role.requirements.split('\n').map((line, i) => (
                          <p key={i} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card mb-6">
                <h3 className="font-semibold mb-4">Job Details</h3>
                <div className="space-y-4">
                  <div className="detail-row">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{formData.duration}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Positions</span>
                    <span className="detail-value">{formData.rolesCount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Start Date</span>
                    <span className="detail-value">{formData.startDate}</span>
                  </div>
                </div>
              </div>

              <div className="card mb-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                <div className="contact-card">
                  <div className="contact-avatar">
                    {formData.teamContact.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">{formData.teamContact}</p>
                    <p className="text-sm text-neutral-500">{formData.contactEmail}</p>
                  </div>
                </div>
              </div>

              {attachments.length > 0 && (
                <div className="card">
                  <h3 className="font-semibold mb-4">Attached Files</h3>
                  <div className="attached-files-list">
                    {attachments.map((file, index) => (
                      <div key={index} className="attached-file-item flex items-center gap-3 p-3 bg-neutral-50 rounded-md mb-2">
                        <Upload size={16} className="text-neutral-400" />
                        <div className="flex-1">
                          <span className="text-sm font-medium block">{file.name}</span>
                          <span className="text-xs text-neutral-400">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>



          <div className="preview-actions mt-8 flex justify-center gap-4">
            <button 
              className="btn btn-secondary"
              onClick={() => setCurrentStep(1)}
            >
              ← Back to Edit
            </button>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handlePublish}
              disabled={isLoading}
            >
              {isLoading ? 'Publishing...' : 'Publish Job'}
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-icon">✅</div>
            <h2>Job Posted Successfully!</h2>
            <p>Your job posting has been published and is now live.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Add Another Job
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setShowSuccessModal(false)
                  window.location.href = '/staffer/talent-matching'
                }}
              >
                Find Talent Match
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <div className="error-content">
            <span className="error-text">{error}</span>
            <button 
              className="error-close"
              onClick={() => setError('')}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostJob