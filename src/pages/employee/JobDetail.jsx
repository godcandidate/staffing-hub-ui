import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, MessageCircle, Calendar, Users, Clock } from 'lucide-react'

const JobDetail = () => {
  const { id } = useParams()
  const [showChat, setShowChat] = useState(false)

  // Mock job data - in real app, fetch by ID
  const job = {
    id: 1,
    title: "Senior Data Analyst",
    team: "Analytics Team",
    duration: "6 months",
    rolesAvailable: 2,
    startDate: "January 15, 2024",
    matchPercent: 92,
    companyName: "Microsoft",
    companyDescription: `Microsoft is a leading technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.

We are committed to empowering every person and organization on the planet to achieve more. Our mission is to enable digital transformation for the era of an intelligent cloud and an intelligent edge.

Join our team and be part of creating technology that makes a difference in the world.`,
    responsibilities: [
      "Analyze large datasets to identify trends and patterns",
      "Create interactive dashboards and reports using Power BI",
      "Collaborate with cross-functional teams on data requirements",
      "Present findings to leadership and stakeholders",
      "Mentor junior analysts and promote data literacy"
    ],
    requiredSkills: ["Python", "SQL", "Power BI", "Statistics", "Data Visualization"],
    preferredSkills: ["R", "Tableau", "Machine Learning", "A/B Testing"],
    attachments: [
      { name: "Job Description.pdf", size: "245 KB" },
      { name: "Team Overview.pdf", size: "180 KB" }
    ],
    teamContact: {
      name: "Sarah Johnson",
      role: "Analytics Manager",
      email: "sarah.johnson@company.com"
    }
  }

  const handleApply = () => {
    // Mock application logic
    alert('Application submitted successfully!')
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
            <h1 className="mb-2">{job.title}</h1>
            <div className="flex items-center gap-4 text-gray mb-4">
              <span className="flex items-center gap-1">
                <Users size={16} />
                {job.team}
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
            <span className="badge badge-recommended">
              {job.matchPercent}% match
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
            <h2 className="mb-4">About {job.companyName}</h2>
            <div className="job-description">
              {job.companyDescription.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="mb-4">Role Requirements</h2>
            <ul className="responsibilities-list">
              {job.responsibilities.map((responsibility, index) => (
                <li key={index} className="mb-2">
                  <span className="bullet">•</span>
                  {responsibility}
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
            <h3 className="mb-4">Job Details</h3>
            <div className="job-stats">
              <div className="stat-item">
                <span className="stat-label">Roles Available</span>
                <span className="stat-value">{job.rolesAvailable}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Duration</span>
                <span className="stat-value">{job.duration}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Start Date</span>
                <span className="stat-value">{job.startDate}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Your Match</span>
                <span className="stat-value text-accent-green">{job.matchPercent}%</span>
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <h3 className="mb-4">Team Contact</h3>
            <div className="contact-info">
              <div className="contact-avatar mb-3">
                <div className="avatar-circle">
                  {job.teamContact.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium">{job.teamContact.name}</div>
                  <div className="text-sm text-gray">{job.teamContact.role}</div>
                </div>
              </div>
              <a href={`mailto:${job.teamContact.email}`} className="btn btn-secondary w-full">
                Contact Team
              </a>
            </div>
          </div>

          <div className="card">
            <h3 className="mb-4">Attachments</h3>
            <div className="attachments-list">
              {job.attachments.map((file, index) => (
                <div key={index} className="attachment-item">
                  <div className="flex items-center gap-3">
                    <Download size={16} className="text-gray" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-gray">{file.size}</div>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm">
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Ruth Chat */}
      {showChat && (
        <div className="embedded-chat card mt-6">
          <div className="chat-header-embedded">
            <h3>Ask Ruth about this role</h3>
            <button onClick={() => setShowChat(false)}>×</button>
          </div>
          <div className="chat-content">
            <div className="ruth-message">
              <p>Hi! I can help answer questions about this {job.title} role. What would you like to know?</p>
            </div>
            <div className="quick-questions">
              <button className="quick-question">Do I need AWS experience?</button>
              <button className="quick-question">What's the team culture like?</button>
              <button className="quick-question">Is remote work possible?</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobDetail