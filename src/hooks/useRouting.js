import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { canAccessRoute } from '../routes/routeUtils'

export const useRouteGuard = (userType) => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const hasAccess = canAccessRoute(location.pathname, userType)
    
    if (!hasAccess) {
      // Redirect to appropriate dashboard if access denied
      const defaultRoute = userType === 'employee' ? '/employee/dashboard' : '/staffer/jobs'
      navigate(defaultRoute, { replace: true })
    }
  }, [location.pathname, userType, navigate])

  return {
    currentPath: location.pathname,
    hasAccess: canAccessRoute(location.pathname, userType)
  }
}

export const useRoutePreload = () => {
  // Preload route on hover or focus for better UX
  const preloadRoute = (routePath) => {
    try {
      // This would trigger the lazy import
      import(`../pages${routePath}`)
    } catch (error) {
      console.warn('Failed to preload route:', routePath, error)
    }
  }

  return { preloadRoute }
}
