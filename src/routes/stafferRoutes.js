import { lazy } from 'react'

// Lazy load staffer components
const PostJob = lazy(() => import('../pages/staffer/PostJob'))
const JobManagement = lazy(() => import('../pages/staffer/JobManagement'))
const TalentMatching = lazy(() => import('../pages/staffer/TalentMatching'))
const CandidateMatching = lazy(() => import('../pages/staffer/CandidateMatching'))
const ApplicantReview = lazy(() => import('../pages/staffer/ApplicantReview'))
const Analytics = lazy(() => import('../pages/staffer/Analytics'))

export const stafferRoutes = [
  {
    path: '/staffer/post-job',
    component: PostJob,
    name: 'Post Job'
  },
  {
    path: '/staffer/jobs',
    component: JobManagement,
    name: 'Job Management'
  },
  {
    path: '/staffer/talent-matching',
    component: TalentMatching,
    name: 'Talent Matching'
  },
  {
    path: '/staffer/matching/:jobId',
    component: CandidateMatching,
    name: 'Candidate Matching'
  },
  {
    path: '/staffer/applicants/:jobId',
    component: ApplicantReview,
    name: 'Applicant Review'
  },
  {
    path: '/staffer/analytics',
    component: Analytics,
    name: 'Analytics'
  }
]
