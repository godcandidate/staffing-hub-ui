import { useState, useEffect } from 'react'
import { User, Briefcase, Calendar, Mail, Edit, X } from 'lucide-react'
import { authAPI } from '../../api/auth'

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
        <div className="text-center py-8">
          <div className="text-lg">Loading profile...</div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Header */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="profile-avatar">
                  <div className="w-20 h-20 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-2xl font-semibold">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{profile.name}</h2>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {profile.roles.map((role, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray">{profile.department} • {profile.experience} experience</p>
                </div>
              </div>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? <X size={16} /> : <Edit size={16} />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={20} className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray">Email</div>
                  <div className="font-medium">{profile.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={20} className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray">Department</div>
                  <div className="font-medium">{profile.department}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={20} className="text-gray-400" />
                <div>
                  <div className="text-sm text-gray">Joined</div>
                  <div className="font-medium">{profile.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">{skill.name}</div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)}`}>
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