import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Users, Briefcase, Mail } from 'lucide-react'
import { authAPI } from '../api/auth'
import './Login.css'

const Login = ({ setUserType, setIsAuthenticated }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!selectedRole) {
      setError('Please select a role first')
      return
    }
    
    if (!email || !password) {
      setError('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      const data = await authAPI.login(email, password)
      
      if (data.success) {
        const userType = data.data.user.userType
        const expectedType = selectedRole === 'employee' ? 'EMPLOYEE' : 'STAFFER'
        
        if (userType !== expectedType) {
          setError('Access denied. Please select the correct role.')
          return
        }
        
        // Store auth data
        authAPI.storeAuthData(data.data.token, data.data.user)
        
        setUserType(selectedRole)
        setIsAuthenticated(true)
        
        // Redirect to appropriate dashboard
        if (selectedRole === 'employee') {
          navigate('/employee/dashboard')
        } else {
          navigate('/staffer/jobs')
        }
      }
    } catch (error) {
      setError(error.message || 'Server error. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>SmartStaff</h1>
          <p>Connect talent with opportunities using intelligent matching</p>
        </div>

        <div className="role-selection">
          <h2>Choose Your Role</h2>
          <div className="role-cards">
            <div 
              className={`role-card ${selectedRole === 'employee' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('employee')}
            >
              <User size={32} />
              <h3>Employee</h3>
              <p>Find opportunities that match your skills</p>
            </div>
            
            <div 
              className={`role-card ${selectedRole === 'staffer' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('staffer')}
            >
              <Briefcase size={32} />
              <h3>Staffer</h3>
              <p>Manage jobs and find the right talent</p>
            </div>
          </div>
        </div>

        {selectedRole && (
          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-toast">
                <div className="error-content">

                  <span className="error-text">{error}</span>
                  <button 
                    className="error-close"
                    onClick={() => setError('')}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <Mail size={20} />
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-with-icon">
                <Lock size={20} />
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : `Sign In as ${selectedRole === 'employee' ? 'Employee' : 'Staffer'}`}
            </button>
          </form>
        )}


      </div>
    </div>
  )
}

export default Login