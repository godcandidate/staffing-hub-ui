import { Construction, ArrowLeft } from 'lucide-react'

const MyApplications = () => {
  return (
    <div className="my-applications">
      <div className="page-header mb-6">
        <h1>My Applications</h1>
        <p className="text-gray">Track the status of your job applications</p>
      </div>

      <div className="under-construction card text-center p-8">
        <div className="mb-6">
          <Construction size={80} className="text-accent-amber mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-3">Page Under Construction</h2>
          <p className="text-gray text-lg mb-6">
            We're working hard to bring you the My Applications feature. 
            This page will allow you to track all your job applications and their status.
          </p>
          <div className="bg-accent-blue/10 border border-accent-blue/20 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Coming Soon:</h3>
            <ul className="text-left text-sm text-gray space-y-1">
              <li>• View all your submitted applications</li>
              <li>• Track application status (pending, accepted, rejected)</li>
              <li>• Withdraw pending applications</li>
              <li>• View job details and start dates</li>
              <li>• Get notifications on status updates</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>
          <a href="/employee/jobs" className="btn btn-primary">
            Browse Jobs
          </a>
        </div>
      </div>
    </div>
  )
}

export default MyApplications