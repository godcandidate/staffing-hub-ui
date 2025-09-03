import { useState } from 'react'
import { Sparkles, Upload, X } from 'lucide-react'

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    startDate: '',
    duration: '',
    rolesCount: 1,
    teamContact: '',
    contactEmail: ''
  })
  const [skillInput, setSkillInput] = useState('')
  const [attachments, setAttachments] = useState([])
  const [currentStep, setCurrentStep] = useState(1)

  const suggestedSkills = [
    'JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 
    'TypeScript', 'SQL', 'MongoDB', 'Kubernetes', 'GraphQL', 'Vue.js'
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }))
      setSkillInput('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
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

  const handlePublish = () => {
    console.log('Job posted:', formData)
    alert('Job posted successfully!')
  }

  return (
    <div className="post-job">
      <div className="page-header mb-6">
        <h1>Post a New Job</h1>
        <p className="text-gray">Create an opportunity for internal talent</p>
      </div>

      {currentStep === 1 ? (
        <form onSubmit={handleNext} className="job-form">
        <div className="max-w-4xl">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h3 className="mb-4">Job Details</h3>
              
              <div className="form-group mb-4">
                <label className="form-label">Job Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                />
              </div>

              <div className="form-group mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="form-label">Job Description *</label>
                  <button
                    type="button"
                    className="ai-enhance"
                    onClick={enhanceWithAI}
                  >
                    <Sparkles size={16} />
                    AI Enhance
                  </button>
                </div>
                <textarea
                  className="form-textarea"
                  rows={8}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the role, responsibilities, and what the candidate will work on..."
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
              <h3 className="mb-4">Required Skills</h3>
              
              <div className="form-group mb-4">
                <label className="form-label">Add Skills</label>
                <div className="skill-input-container">
                  <input
                    type="text"
                    className="form-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Type a skill and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill(skillInput)
                      }
                    }}
                  />
                </div>
              </div>

              <div className="suggested-skills mb-4">
                <p className="text-sm text-gray mb-2">Suggested skills:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="skill-suggestion"
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="selected-skills">
                <p className="text-sm text-gray mb-2">Selected skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="skill-chip-removable">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="remove-skill"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
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
          </div>

          <div className="form-actions mt-6">
            <button type="submit" className="btn btn-primary">
              Next: Preview
            </button>
          </div>
        </div>
      </form>
      ) : (
        <div className="preview-section">
          <div className="card">
            <h3 className="mb-4">Job Preview</h3>
            <div className="preview-content">
              <h4>{formData.title}</h4>
              <p className="mb-4">{formData.description}</p>
              <div className="preview-details mb-4">
                <p><strong>Duration:</strong> {formData.duration}</p>
                <p><strong>Roles:</strong> {formData.rolesCount}</p>
                <p><strong>Start Date:</strong> {formData.startDate}</p>
                <p><strong>Contact:</strong> {formData.teamContact}</p>
              </div>
              <div className="preview-skills mb-4">
                <strong>Required Skills:</strong>
                <div className="skills-preview">
                  {formData.skills.map((skill) => (
                    <span key={skill} className="skill-chip">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="preview-actions flex gap-4">
              <button 
                className="btn btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                Back to Edit
              </button>
              <button 
                className="btn btn-primary"
                onClick={handlePublish}
              >
                Publish Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PostJob