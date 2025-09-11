import { Navigate, useLocation } from 'react-router-dom'

const RouteGuard = ({ children, userType, allowedUserTypes }) => {
  const location = useLocation()
  
  // Check if current user type is allowed for this route
  if (!allowedUserTypes.includes(userType)) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs'
    
    console.warn(`Access denied: ${userType} user trying to access ${location.pathname}`)
    
    return <Navigate to={redirectPath} replace />
  }
  
  return children
}

export default RouteGuard
