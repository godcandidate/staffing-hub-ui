import { User, MapPin, Calendar, Briefcase, RefreshCw } from 'lucide-react'

const ProfileView = () => {
  const profile = {
    name: "Alex Thompson",
    role: "Senior Software Engineer",
    department: "Engineering",
    tenure: "3.5 years",
    location: "Seattle, WA",
    email: "alex.thompson@company.com",
    lastUpdated: "Synced from HR system - Dec 20, 2023",
    skills: [
      { name: "JavaScript", strength: 95 },
      { name: "React", strength: 90 },
      { name: "Python", strength: 85 },
      { name: "Node.js", strength: 80 },
      { name: "TypeScript", strength: 75 },
      { name: "AWS", strength: 70 },
      { name: "Docker", strength: 65 },
      { name: "GraphQL", strength: 60 },
      { name: "MongoDB", strength: 55 },
      { name: "Kubernetes", strength: 45 }
    ],
    recentProjects: [
      {
        name: "Customer Portal Redesign",
        duration: "6 months",
        role: "Lead Developer",
        skills: ["React", "TypeScript", "AWS"]
      },
      {
        name: "API Gateway Migration",
        duration: "4 months",
        role: "Backend Developer",
        skills: ["Node.js", "Docker", "Kubernetes"]
      }
    ]
  }

  const getSkillSize = (strength) => {
    if (strength >= 80) return 'skill-large'
    if (strength >= 60) return 'skill-medium'
    return 'skill-small'
  }

  return (
    <div className="profile-view">
      <div className="page-header mb-6">
        <h1>My Profile</h1>
        <p className="text-gray">Your skills and experience overview</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="card mb-6">
            <div className="profile-header text-center mb-6">
              <div className="profile-avatar">
                <User size={48} />
              </div>
              <h2 className="mt-4 mb-1">{profile.name}</h2>
              <p className="text-gray">{profile.role}</p>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <Briefcase size={16} className="text-gray" />
                <div>
                  <div className="font-medium">{profile.department}</div>
                  <div className="text-sm text-gray">{profile.tenure} tenure</div>
                </div>
              </div>

              <div className="detail-item">
                <MapPin size={16} className="text-gray" />
                <div>
                  <div className="font-medium">{profile.location}</div>
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={16} className="text-gray" />
                <div>
                  <div className="font-medium">Available</div>
                  <div className="text-sm text-gray">Ready for new opportunities</div>
                </div>
              </div>
            </div>

            <div className="sync-info mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray">
                <RefreshCw size={14} />
                <span>{profile.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Skills & Projects */}
        <div className="lg:col-span-2">
          {/* Skills Cloud */}
          <div className="card mb-6">
            <h3 className="mb-4">Skills Overview</h3>
            <div className="skills-cloud">
              {profile.skills.map((skill) => (
                <span
                  key={skill.name}
                  className={`skill-cloud-item ${getSkillSize(skill.strength)}`}
                  title={`${skill.name} - ${skill.strength}% proficiency`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
            <div className="skills-legend mt-4 text-sm text-gray">
              <span>Skill size indicates proficiency level</span>
            </div>
          </div>

          {/* Skills List */}
          <div className="card mb-6">
            <h3 className="mb-4">Detailed Skills</h3>
            <div className="skills-list">
              {profile.skills.slice(0, 6).map((skill) => (
                <div key={skill.name} className="skill-item">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray">{skill.strength}%</span>
                  </div>
                  <div className="skill-bar">
                    <div 
                      className="skill-progress"
                      style={{ width: `${skill.strength}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="card">
            <h3 className="mb-4">Recent Projects</h3>
            <div className="projects-list">
              {profile.recentProjects.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="text-sm text-gray">{project.duration}</span>
                  </div>
                  <p className="text-sm text-gray mb-3">{project.role}</p>
                  <div className="project-skills">
                    {project.skills.map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileView