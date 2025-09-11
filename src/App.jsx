import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, Suspense, lazy, useEffect } from 'react'
import Layout from './components/Layout'
import Login from './pages/Login'
import RouteGuard from './components/RouteGuard'
import { LoadingSpinner } from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import { authAPI } from './api/auth'
import './App.css'

// Lazy load components
const EmployeeDashboard = lazy(() => import('./pages/employee/Dashboard'))
const JobsBoard = lazy(() => import('./pages/employee/JobsBoard'))
const JobDetail = lazy(() => import('./pages/employee/JobDetail'))
const MyApplications = lazy(() => import('./pages/employee/MyApplications'))
const Profile = lazy(() => import('./pages/employee/Profile'))
const PostJob = lazy(() => import('./pages/staffer/PostJob'))
const JobManagement = lazy(() => import('./pages/staffer/JobManagement'))
const TalentMatching = lazy(() => import('./pages/staffer/TalentMatching'))
const CandidateMatching = lazy(() => import('./pages/staffer/CandidateMatching'))
const ApplicantReview = lazy(() => import('./pages/staffer/ApplicantReview'))
const Analytics = lazy(() => import('./pages/staffer/Analytics'))

function App() {
  const [userType, setUserType] = useState('employee')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing authentication on app load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = authAPI.getStoredToken()
        const user = authAPI.getStoredUser()
        
        if (token && user) {
          setIsAuthenticated(true)
          setUserType(user.userType === 'EMPLOYEE' ? 'employee' : 'staffer')
        }
      } catch (error) {
        console.warn('Auth check failed:', error)
        // Clear invalid auth data
        authAPI.clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Reset routing when user type changes
  useEffect(() => {
    if (isAuthenticated) {
      // Force navigation to appropriate dashboard when user type changes
      window.history.replaceState(null, '', userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs')
    }
  }, [userType, isAuthenticated])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="app">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <Router key={`${userType}-${isAuthenticated}`}>
      <div className="app">
        <ErrorBoundary>
          {!isAuthenticated ? (
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
          ) : (
            <Layout 
              userType={userType}
              setIsAuthenticated={setIsAuthenticated}
            >
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Employee Routes - Protected */}
                  <Route path="/employee/dashboard" element={
                    <RouteGuard userType={userType} allowedUserTypes={['employee']}>
                      <EmployeeDashboard />
                    </RouteGuard>
                  } />
                  <Route path="/employee/jobs" element={
                    <RouteGuard userType={userType} allowedUserTypes={['employee']}>
                      <JobsBoard />
                    </RouteGuard>
                  } />
                  <Route path="/employee/jobs/:id" element={
                    <RouteGuard userType={userType} allowedUserTypes={['employee']}>
                      <JobDetail />
                    </RouteGuard>
                  } />
                  <Route path="/employee/applications" element={
                    <RouteGuard userType={userType} allowedUserTypes={['employee']}>
                      <MyApplications />
                    </RouteGuard>
                  } />
                  <Route path="/employee/profile" element={
                    <RouteGuard userType={userType} allowedUserTypes={['employee']}>
                      <Profile />
                    </RouteGuard>
                  } />
                  
                  {/* Staffer Routes - Protected */}
                  <Route path="/staffer/post-job" element={
                    <RouteGuard userType={userType} allowedUserTypes={['staffer']}>
                      <PostJob />
                    </RouteGuard>
                  } />
                  <Route path="/staffer/jobs" element={
                    <RouteGuard userType={userType} allowedUserTypes={['staffer']}>
                      <JobManagement />
                    </RouteGuard>
                  } />
                  <Route path="/staffer/talent-matching" element={
                    <RouteGuard userType={userType} allowedUserTypes={['staffer']}>
                      <TalentMatching />
                    </RouteGuard>
                  } />
                  <Route path="/staffer/matching/:jobId" element={
                    <RouteGuard userType={userType} allowedUserTypes={['staffer']}>
                      <CandidateMatching />
                    </RouteGuard>
                  } />
                  <Route path="/staffer/applicants/:jobId" element={
                    <RouteGuard userType={userType} allowedUserTypes={['staffer']}>
                      <ApplicantReview />
                    </RouteGuard>
                  } />
                  <Route path="/staffer/analytics" element={
                    <RouteGuard userType={userType} allowedUserTypes={['staffer']}>
                      <Analytics />
                    </RouteGuard>
                  } />
                  
                  {/* Default redirects */}
                  <Route path="/" element={
                    <Navigate to={userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs'} replace />
                  } />
                  <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
                  <Route path="/staffer" element={<Navigate to="/staffer/jobs" replace />} />
                  
                  {/* 404 handler */}
                  <Route path="*" element={
                    <div className="not-found">
                      <div className="card text-center p-6">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="mb-2">Page Not Found</h2>
                        <p className="text-gray mb-4">
                          The page you're looking for doesn't exist.
                        </p>
                        <Navigate to={userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs'} replace />
                      </div>
                    </div>
                  } />
                </Routes>
              </Suspense>
            </Layout>
          )}
        </ErrorBoundary>
      </div>
    </Router>
  )
}

export default App