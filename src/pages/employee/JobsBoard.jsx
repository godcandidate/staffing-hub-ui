import { useState } from 'react'
import { Search, Filter, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

const JobsBoard = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [selectedDuration, setSelectedDuration] = useState('')

  const jobs = [
    {
      id: 1,
      title: "Senior Data Analyst",
      team: "Analytics Team",
      duration: "6 months",
      skills: ["Python", "SQL", "Power BI"],
      startDate: "Jan 15, 2024",
      isRecommended: true,
      matchPercent: 92
    },
    {
      id: 2,
      title: "Frontend Developer",
      team: "Product Team",
      duration: "4 months",
      skills: ["React", "TypeScript", "CSS"],
      startDate: "Feb 1, 2024",
      isRecommended: true,
      matchPercent: 87
    },
    {
      id: 3,
      title: "DevOps Engineer",
      team: "Infrastructure",
      duration: "8 months",
      skills: ["AWS", "Docker", "Kubernetes"],
      startDate: "Jan 22, 2024",
      isRecommended: false
    },
    {
      id: 4,
      title: "UX Designer",
      team: "Design Team",
      duration: "3 months",
      skills: ["Figma", "User Research", "Prototyping"],
      startDate: "Feb 5, 2024",
      isRecommended: false
    },
    {
      id: 5,
      title: "Backend Developer",
      team: "Engineering",
      duration: "12 months",
      skills: ["Node.js", "MongoDB", "API Design"],
      startDate: "Jan 30, 2024",
      isRecommended: true,
      matchPercent: 78
    }
  ]

  const skills = ["Python", "React", "AWS", "SQL", "TypeScript", "Docker", "Figma", "Node.js"]
  const durations = ["3 months", "4 months", "6 months", "8 months", "12 months"]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.team.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkill = !selectedSkill || job.skills.includes(selectedSkill)
    const matchesDuration = !selectedDuration || job.duration === selectedDuration
    
    return job.isRecommended && matchesSearch && matchesSkill && matchesDuration
  })

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
          Showing {filteredJobs.length} of {jobs.length} opportunities
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
                  <p className="text-sm text-gray">{job.team}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {job.isRecommended && (
                    <span className="badge badge-recommended">
                      Recommended
                    </span>
                  )}
                  {job.matchPercent && (
                    <span className="match-percent">
                      {job.matchPercent}% match
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="job-details mb-4">
              <div className="flex items-center gap-4 text-sm text-gray mb-3">
                <span>Duration: {job.duration}</span>
                <span>Starts: {job.startDate}</span>
              </div>

              <div className="skills-section">
                {job.skills.map((skill) => (
                  <span key={skill} className="skill-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="job-actions flex justify-between">
              <Link 
                to={`/employee/jobs/${job.id}`}
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