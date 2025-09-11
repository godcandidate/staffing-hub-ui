import { useState, useEffect } from 'react'
import { User, Briefcase, Calendar, Mail, Edit, X } from 'lucide-react'
import { authAPI } from '../../api/auth'
import { LoadingSpinner } from '../../components/LoadingSpinner'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      setError('')
      const token = authAPI.getStoredToken()
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://44.248.50.194:8080/api/v1'}/employee/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch profile')
      }
      
      const employee = data.data.employee
      setProfile({
        name: "Alex Johnson",
        email: "alex.johnson@company.com",
        department: employee.department,
        roles: employee.roles,
        experience: employee.experience,
        skills: Object.entries(employee.skills).map(([name, level]) => ({ name, level })),
        joinDate: new Date(employee.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })
      })
    } catch (error) {
      setError(error.message || 'Failed to load profile')
    } finally {
      setIsLoading(false)
    }
  }

  const getSkillLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case 'expert': return 'bg-green-100 text-green-800'
      case 'advanced': return 'bg-blue-100 text-blue-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="profile-view">
        <div className="page-header mb-6">
          <h1>My Profile</h1>
          <p className="text-gray">Manage your professional information</p>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-view">
        <div className="text-center py-8">
          <div className="text-error">{error}</div>
          <button 
            className="btn btn-secondary mt-4"
            onClick={fetchProfile}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-view">
        <div className="text-center py-8">
          <div className="text-lg">Profile not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-view">
      <div className="page-header mb-6">
        <h1>My Profile</h1>
        <p className="text-gray">Manage your professional information</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-100">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white flex-shrink-0">
              {profile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">{profile.name}</h2>
                <div className="flex items-center gap-3 text-lg text-gray-600">
                  <span className="flex items-center gap-2">
                    <Briefcase size={20} className="text-primary-600" />
                    {profile.department}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-2">
                    <Calendar size={20} className="text-primary-600" />
                    {profile.experience} experience
                  </span>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Current Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.roles.map((role, index) => (
                    <span key={index} className="px-4 py-2 bg-white border border-primary-200 text-primary-700 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2 border-t border-primary-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active Employee
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  Joined {profile.joinDate}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray font-medium">Email</div>
                  <div className="text-lg">{profile.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Briefcase size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray font-medium">Department</div>
                  <div className="text-lg">{profile.department}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-gray-600" />
                </div>
                <div>
                  <div className="text-sm text-gray font-medium">Joined</div>
                  <div className="text-lg">{profile.joinDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-6">Skills & Expertise</h3>
            <div className="space-y-3">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="font-medium text-lg">{skill.name}</div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)}`}>
                    {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile