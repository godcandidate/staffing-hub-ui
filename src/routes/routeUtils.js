import { employeeRoutes } from './employeeRoutes'
import { stafferRoutes } from './stafferRoutes'

// Preload routes based on user type to improve performance
export const preloadRoutes = (userType) => {
  const routes = userType === 'employee' ? employeeRoutes : stafferRoutes
  
  // Preload the most common routes
  const priorityRoutes = userType === 'employee' 
    ? ['/employee/dashboard', '/employee/jobs']
    : ['/staffer/jobs', '/staffer/post-job']
  
  priorityRoutes.forEach(routePath => {
    const route = routes.find(r => r.path === routePath)
    if (route) {
      // Preload the component
      route.component()
    }
  })
}

// Get route metadata for breadcrumbs, titles, etc.
export const getRouteInfo = (pathname) => {
  const allRoutes = [...employeeRoutes, ...stafferRoutes]
  return allRoutes.find(route => {
    // Handle dynamic routes like /employee/jobs/:id
    const routePattern = route.path.replace(/:[^/]+/g, '[^/]+')
    const regex = new RegExp(`^${routePattern}$`)
    return regex.test(pathname)
  })
}

// Check if user has access to route
export const canAccessRoute = (pathname, userType) => {
  const isEmployeeRoute = pathname.startsWith('/employee')
  const isStafferRoute = pathname.startsWith('/staffer')
  
  if (userType === 'employee' && isEmployeeRoute) return true
  if (userType === 'staffer' && isStafferRoute) return true
  
  return false
}
