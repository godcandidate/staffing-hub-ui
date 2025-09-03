import { Download, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'

const Analytics = () => {
  const stats = {
    jobsPosted: 12,
    rolesFilled: 85,
    avgTimeToFill: 14,
    acceptanceRate: 78
  }

  const applicationData = [
    { month: 'Nov', applications: 45 },
    { month: 'Dec', applications: 62 },
    { month: 'Jan', applications: 38 },
    { month: 'Feb', applications: 71 }
  ]

  const topSkills = [
    { skill: 'JavaScript', demand: 95 },
    { skill: 'Python', demand: 88 },
    { skill: 'React', demand: 82 },
    { skill: 'AWS', demand: 76 },
    { skill: 'Node.js', demand: 71 },
    { skill: 'TypeScript', demand: 68 },
    { skill: 'Docker', demand: 62 },
    { skill: 'SQL', demand: 58 }
  ]

  const maxApplications = Math.max(...applicationData.map(d => d.applications))

  return (
    <div className="analytics">
      <div className="page-header mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>Analytics Dashboard</h1>
            <p className="text-gray">Insights into your staffing performance</p>
          </div>
          <button className="btn btn-secondary">
            <Download size={16} />
            Download Report (CSV)
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="metric-card card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-icon bg-blue-100">
              <Users className="text-primary" size={24} />
            </div>
            <span className="metric-trend text-accent-green">+15%</span>
          </div>
          <h3 className="metric-value">{stats.jobsPosted}</h3>
          <p className="metric-label">Jobs Posted (30 days)</p>
        </div>

        <div className="metric-card card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-icon bg-green-100">
              <CheckCircle className="text-accent-green" size={24} />
            </div>
            <span className="metric-trend text-accent-green">+8%</span>
          </div>
          <h3 className="metric-value">{stats.rolesFilled}%</h3>
          <p className="metric-label">Roles Filled</p>
        </div>

        <div className="metric-card card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-icon bg-amber-100">
              <Clock className="text-accent-amber" size={24} />
            </div>
            <span className="metric-trend text-accent-green">-2 days</span>
          </div>
          <h3 className="metric-value">{stats.avgTimeToFill}</h3>
          <p className="metric-label">Avg. Time to Fill (days)</p>
        </div>

        <div className="metric-card card">
          <div className="flex items-center justify-between mb-2">
            <div className="metric-icon bg-teal-100">
              <TrendingUp className="text-primary" size={24} />
            </div>
            <span className="metric-trend text-accent-green">+5%</span>
          </div>
          <h3 className="metric-value">{stats.acceptanceRate}%</h3>
          <p className="metric-label">Acceptance Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications Chart */}
        <div className="card">
          <h3 className="mb-6">Applications Over Time</h3>
          <div className="chart-container">
            <div className="chart-bars">
              {applicationData.map((data, index) => (
                <div key={index} className="chart-bar-container">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(data.applications / maxApplications) * 200}px` 
                    }}
                  >
                    <div className="bar-value">{data.applications}</div>
                  </div>
                  <div className="bar-label">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Word Cloud */}
        <div className="card">
          <h3 className="mb-6">Top Skills in Demand</h3>
          <div className="skills-demand">
            {topSkills.map((item, index) => (
              <div key={index} className="skill-demand-item">
                <div className="flex justify-between items-center mb-2">
                  <span className="skill-name">{item.skill}</span>
                  <span className="skill-percentage">{item.demand}%</span>
                </div>
                <div className="skill-demand-bar">
                  <div 
                    className="skill-demand-fill"
                    style={{ width: `${item.demand}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h3 className="mb-4">Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon bg-green-100">
              <CheckCircle className="text-accent-green" size={16} />
            </div>
            <div className="activity-content">
              <p><strong>Sarah Johnson</strong> accepted the Senior Data Analyst role</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon bg-blue-100">
              <Users className="text-primary" size={16} />
            </div>
            <div className="activity-content">
              <p>New application received for <strong>Frontend Developer</strong></p>
              <span className="activity-time">4 hours ago</span>
            </div>
          </div>
          
          <div className="activity-item">
            <div className="activity-icon bg-amber-100">
              <Clock className="text-accent-amber" size={16} />
            </div>
            <div className="activity-content">
              <p><strong>DevOps Engineer</strong> role posted successfully</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics