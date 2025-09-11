import { lazy } from 'react'

// Lazy load employee components
const Dashboard = lazy(() => import('../pages/employee/Dashboard'))
const JobsBoard = lazy(() => import('../pages/employee/JobsBoard'))
const JobDetail = lazy(() => import('../pages/employee/JobDetail'))
const MyApplications = lazy(() => import('../pages/employee/MyApplications'))
const Profile = lazy(() => import('../pages/employee/Profile'))

export const employeeRoutes = [
  {
    path: '/employee/dashboard',
    component: Dashboard,
    name: 'Dashboard'
  },
  {
    path: '/employee/jobs',
    component: JobsBoard,
    name: 'Jobs Board'
  },
  {
    path: '/employee/jobs/:id',
    component: JobDetail,
    name: 'Job Detail'
  },
  {
    path: '/employee/applications',
    component: MyApplications,
    name: 'My Applications'
  },
  {
    path: '/employee/profile',
    component: Profile,
    name: 'Profile'
  }
]
