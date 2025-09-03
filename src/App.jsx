import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import EmployeeDashboard from './pages/employee/Dashboard'
import JobsBoard from './pages/employee/JobsBoard'
import JobDetail from './pages/employee/JobDetail'
import MyApplications from './pages/employee/MyApplications'
import ProfileView from './pages/employee/ProfileView'
import PostJob from './pages/staffer/PostJob'
import JobManagement from './pages/staffer/JobManagement'
import CandidateMatching from './pages/staffer/CandidateMatching'
import ApplicantReview from './pages/staffer/ApplicantReview'
import Analytics from './pages/staffer/Analytics'
import './App.css'

function App() {
  const [userType, setUserType] = useState('employee') // 'employee' or 'staffer'
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return (
      <Router>
        <div className="app">
          <Routes>
            <Route 
              path="*" 
              element={
                <Login 
                  setUserType={setUserType} 
                  setIsAuthenticated={setIsAuthenticated} 
                />
              } 
            />
          </Routes>
        </div>
      </Router>
    )
  }

  return (
    <Router>
      <div className="app">
        <Layout 
          userType={userType}
          setIsAuthenticated={setIsAuthenticated}
        >
          <Routes>
            {/* Employee Routes */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/jobs" element={<JobsBoard />} />
            <Route path="/employee/jobs/:id" element={<JobDetail />} />
            <Route path="/employee/applications" element={<MyApplications />} />
            <Route path="/employee/profile" element={<ProfileView />} />
            
            {/* Staffer Routes */}
            <Route path="/staffer/post-job" element={<PostJob />} />
            <Route path="/staffer/jobs" element={<JobManagement />} />
            <Route path="/staffer/matching/:jobId" element={<CandidateMatching />} />
            <Route path="/staffer/applicants/:jobId" element={<ApplicantReview />} />
            <Route path="/staffer/analytics" element={<Analytics />} />
            
            {/* Default redirects */}
            <Route path="/" element={
              <Navigate to={userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs'} replace />
            } />
            <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
            <Route path="/staffer" element={<Navigate to="/staffer/jobs" replace />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  )
}

export default App