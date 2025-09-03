import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Users, Briefcase } from 'lucide-react'
import './Login.css'

const Login = ({ setUserType, setIsAuthenticated }) => {
  const [selectedRole, setSelectedRole] = useState('')
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const mockUsers = {
    employee: {
      email: 'alex@company.com',
      password: 'employee123',
      name: 'Alex Thompson',
      role: 'employee'
    },
    staffer: {
      email: 'sarah@company.com',
      password: 'staffer123',
      name: 'Sarah Johnson',
      role: 'staffer'
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    
    if (!selectedRole) {
      alert('Please select a role first')
      return
    }

    const user = mockUsers[selectedRole]
    
    if (credentials.email === user.email && credentials.password === user.password) {
      setUserType(selectedRole)
      setIsAuthenticated(true)
      
      // Redirect to appropriate dashboard
      if (selectedRole === 'employee') {
        navigate('/employee/dashboard')
      } else {
        navigate('/staffer/jobs')
      }
    } else {
      alert('Invalid credentials. Please check the demo credentials below.')
    }
  }

  const quickLogin = (role) => {
    const user = mockUsers[role]
    setCredentials({
      email: user.email,
      password: user.password
    })
    setSelectedRole(role)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>AI Staffing Hub</h1>
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
            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-with-icon">
                <User size={20} />
                <input
                  type="email"
                  className="form-input"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
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
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Sign In as {selectedRole === 'employee' ? 'Employee' : 'Staffer'}
            </button>
          </form>
        )}

        <div className="demo-credentials">
          <h3>Demo Credentials</h3>
          <div className="demo-users">
            <div className="demo-user">
              <div className="demo-user-header">
                <User size={20} />
                <strong>Employee Demo</strong>
              </div>
              <p>Email: alex@company.com</p>
              <p>Password: employee123</p>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => quickLogin('employee')}
              >
                Quick Login
              </button>
            </div>
            
            <div className="demo-user">
              <div className="demo-user-header">
                <Briefcase size={20} />
                <strong>Staffer Demo</strong>
              </div>
              <p>Email: sarah@company.com</p>
              <p>Password: staffer123</p>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => quickLogin('staffer')}
              >
                Quick Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login