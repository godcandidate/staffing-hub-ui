import { useState, useEffect } from 'react'
import { Search, Filter, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { jobsAPI } from '../../api/jobs'

const JobsBoard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        setLoading(true)
        const response = await jobsAPI.getRecommendedJobs()
        
        // Check if response has the expected structure
        if (!response || !response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid response format from recommended jobs API')
        }
        
        // Transform the API response to match the expected format
        const transformedJobs = response.data.map(jobItem => {
          // Defensive checks for nested data
          const jobData = jobItem.job_posting_data || {}
          const matchScore = jobItem.match_score || '0%'
          
          return {
            id: jobData.id,
            title: jobData.role || 'Unknown Role',
            team: `${jobData.client || 'Unknown Company'} Team`,
            duration: jobData.duration || 'TBD',
            skills: jobData.required_skills || [],
            startDate: jobData.start_date ? 
              new Date(jobData.start_date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              }) : 'TBD',
            isRecommended: true,
            matchPercent: parseInt(matchScore.replace('%', '')) || 0,
            company: jobData.client || 'Unknown Company',
            status: jobData.status || 'UNKNOWN',
            // Add additional data needed for job detail page
            companyDescription: jobData.client_description || 'No description available',
            responsibilities: jobData.role_requirements ? 
              jobData.role_requirements.split('\\n').filter(req => req.trim()) : 
              [],
            teamContact: {
              name: jobData.team_contact || "Team Lead",
              role: "Team Manager", 
              email: jobData.contact_email || "team@company.com"
            },
            attachments: jobData.attachments || []
          }
        })

        // Sort by match percentage (highest first)
        transformedJobs.sort((a, b) => b.matchPercent - a.matchPercent)
        
        setJobs(transformedJobs)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching recommended jobs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedJobs()
  }, [])

  // Extract unique skills and durations from jobs for filter options
  const skills = jobs.length > 0 ? [...new Set(jobs.flatMap(job => job.skills || []))].filter(skill => skill).sort() : []
  const durations = jobs.length > 0 ? [...new Set(jobs.map(job => job.duration).filter(duration => duration))].sort() : []

  // Filter out closed jobs for both filtering and counting
  const openJobs = jobs.filter(job => job.status === 'OPEN')

  const filteredJobs = openJobs.filter(job => {
    const matchesSearch = (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.team || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.company || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = !selectedSkill || (job.skills && job.skills.includes(selectedSkill))
    const matchesDuration = !selectedDuration || job.duration === selectedDuration
    
    return matchesSearch && matchesSkill && matchesDuration
  })

  if (loading) {
    return (
      <div className="jobs-board">
        <div className="page-header mb-6">
          <h1>Recommended Jobs</h1>
          <p className="text-gray">AI-curated opportunities that match your skills and interests</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading recommended jobs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="jobs-board">
        <div className="page-header mb-6">
          <h1>Recommended Jobs</h1>
          <p className="text-gray">AI-curated opportunities that match your skills and interests</p>
        </div>
        <div className="error-container">
          <p className="error-message">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-secondary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="jobs-board">
      <div className="page-header mb-6">
        <h1>Recommended Jobs</h1>
        <p className="text-gray">AI-curated opportunities that match your skills and interests</p>
      </div>

      {/* Filters */}
      <div className="filters-section card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="search-input">
            <Search size={20} className="text-gray" />
            <input
              type="text"
              placeholder="Search jobs or teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
            />
          </div>

          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="filter-select"
          >
            <option value="">All Skills</option>
            {skills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>

          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="filter-select"
          >
            <option value="">All Durations</option>
            {durations.map(duration => (
              <option key={duration} value={duration}>{duration}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="results-header mb-4">
        <p className="text-gray">
          Showing {filteredJobs.length} of {openJobs.length} available opportunities
        </p>
      </div>

      {/* Job Cards */}
      <div className="jobs-grid grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="card card-hover job-card">
            <div className="job-header">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{job.title}</h3>
                  <p className="text-sm text-gray">{job.company}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {job.matchPercent > 80 && (
                    <span className="badge badge-recommended">
                      Recommended
                    </span>
                  )}
                  <span className="match-percent">
                    {job.matchPercent}% match
                  </span>
                </div>
              </div>
            </div>

            <div className="job-details mb-4">
              <div className="flex items-center gap-4 text-sm text-gray mb-3">
                <span>Duration: {job.duration}</span>
                <span>Starts: {job.startDate}</span>
              </div>

              <div className="skills-section">
                {job.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="skill-chip skill-more">
                    +{job.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            <div className="job-actions flex justify-between">
              <Link 
                to={`/employee/jobs/${job.id}`}
                state={{ jobData: job }}
                className="btn btn-secondary"
              >
                View Details
              </Link>
              <button className="btn btn-primary">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="empty-state card text-center p-6">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="mb-2">No jobs found</h3>
          <p className="text-gray">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  )
}

export default JobsBoard