import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

const MyApplications = () => {
  const applications = [
    {
      id: 1,
      jobTitle: "Senior Data Analyst",
      team: "Analytics Team",
      appliedDate: "Dec 15, 2023",
      status: "accepted",
      startDate: "Jan 15, 2024",
      duration: "6 months"
    },
    {
      id: 2,
      jobTitle: "Frontend Developer",
      team: "Product Team",
      appliedDate: "Dec 20, 2023",
      status: "pending",
      startDate: "Feb 1, 2024",
      duration: "4 months"
    },
    {
      id: 3,
      jobTitle: "UX Researcher",
      team: "Design Team",
      appliedDate: "Dec 10, 2023",
      status: "rejected",
      startDate: "Jan 8, 2024",
      duration: "3 months"
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={20} className="text-accent-green" />
      case 'rejected':
        return <XCircle size={20} className="text-accent-coral" />
      case 'pending':
        return <AlertCircle size={20} className="text-accent-amber" />
      default:
        return null
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      accepted: 'badge-accepted',
      rejected: 'badge-rejected',
      pending: 'badge-pending'
    }
    return `badge ${badges[status]}`
  }

  return (
    <div className="my-applications">
      <div className="page-header mb-6">
        <h1>My Applications</h1>
        <p className="text-gray">Track the status of your job applications</p>
      </div>

      {applications.length > 0 ? (
        <div className="applications-list">
          {applications.map((application) => (
            <div key={application.id} className="card mb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(application.status)}
                    <h3 className="font-semibold">{application.jobTitle}</h3>
                    <span className={getStatusBadge(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  
                  <p className="text-gray mb-3">{application.team}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      Applied {application.appliedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {application.duration}
                    </span>
                    {application.status === 'accepted' && (
                      <span className="flex items-center gap-1 text-accent-green font-medium">
                        <CheckCircle size={16} />
                        Starts {application.startDate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {application.status === 'pending' && (
                    <button className="btn btn-secondary btn-sm">
                      Withdraw
                    </button>
                  )}
                  {application.status === 'accepted' && (
                    <button className="btn btn-primary btn-sm">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state card text-center p-6">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="mb-2">No applications yet</h3>
          <p className="text-gray mb-4">You haven't applied to any roles yet.</p>
          <a href="/employee/jobs" className="btn btn-primary">
            Browse Jobs
          </a>
        </div>
      )}
    </div>
  )
}

export default MyApplications