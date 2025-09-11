import { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { employeeRoutes } from './employeeRoutes'
import { stafferRoutes } from './stafferRoutes'
import { preloadRoutes, canAccessRoute } from './routeUtils'

const AppRoutes = ({ userType }) => {
  const location = useLocation()

  // Preload routes on mount
  useEffect(() => {
    preloadRoutes(userType)
  }, [userType])

  // Check route access
  useEffect(() => {
    if (!canAccessRoute(location.pathname, userType)) {
      console.warn(`Access denied to ${location.pathname} for user type: ${userType}`)
    }
  }, [location.pathname, userType])

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Employee Routes */}
          {userType === 'employee' && employeeRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          
          {/* Staffer Routes */}
          {userType === 'staffer' && stafferRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          
          {/* Default redirects */}
          <Route path="/" element={
            <Navigate to={userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs'} replace />
          } />
          <Route path="/employee" element={<Navigate to="/employee/dashboard" replace />} />
          <Route path="/staffer" element={<Navigate to="/staffer/jobs" replace />} />
          
          {/* Access denied route */}
          <Route path="/access-denied" element={
            <div className="access-denied">
              <div className="card text-center p-6">
                <div className="text-6xl mb-4">🚫</div>
                <h2 className="mb-2">Access Denied</h2>
                <p className="text-gray mb-4">
                  You don't have permission to access this page.
                </p>
                <Navigate to={userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs'} replace />
              </div>
            </div>
          } />
          
          {/* Catch-all route for 404 */}
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
    </ErrorBoundary>
  )
}

export default AppRoutes
