import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, Briefcase, FileText, User, BarChart3, 
  Plus, Users, Bell, Search, MessageCircle, Menu, Bot 
} from 'lucide-react'
import { authAPI } from '../api/auth'
import KeziaChat from './KeziaChat'
import './Layout.css'

const Layout = ({ children, userType, setIsAuthenticated }) => {
  const location = useLocation()
  const [showChat, setShowChat] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [ruthChatOpen, setRuthChatOpen] = useState(false)

  useEffect(() => {
    const handleRuthChatToggle = (event) => {
      setRuthChatOpen(event.detail.isOpen)
    }

    window.addEventListener('ruthChatToggle', handleRuthChatToggle)
    return () => window.removeEventListener('ruthChatToggle', handleRuthChatToggle)
  }, [])

  const employeeNav = [
    { path: '/employee/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/employee/jobs', icon: Briefcase, label: 'Recommended Jobs' },
    { path: '/employee/applications', icon: FileText, label: 'Applications' },
    { path: '/employee/profile', icon: User, label: 'Profile' }
  ]

  const stafferNav = [
    { path: '/staffer/jobs', icon: Briefcase, label: 'Job Management' },
    { path: '/staffer/post-job', icon: Plus, label: 'Post Job' },
    { path: '/staffer/talent-matching', icon: Users, label: 'Talent Matching' },
    { path: '/staffer/analytics', icon: BarChart3, label: 'Analytics' }
  ]

  const currentNav = userType === 'employee' ? employeeNav : stafferNav
  const userTitle = userType === 'employee' ? 'Employee Portal' : 'Staffer Portal'

  const handleLogout = () => {
    // Clear all auth data
    authAPI.clearAuthData()
    
    // Reset authentication state
    setIsAuthenticated(false)
    
    // Force reload to clear any cached data
    window.location.href = '/'
  }

  return (
    <>
    <div className="layout">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <Menu size={20} />
          </button>
          {!sidebarCollapsed && (
            <div className="sidebar-title">
              <h2>SmartStaff</h2>
              <p className="user-portal-title">{userTitle}</p>
            </div>
          )}
        </div>
        
        <nav className="sidebar-nav">
          {currentNav.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-item ${location.pathname === path ? 'active' : ''}`}
              title={sidebarCollapsed ? label : ''}
            >
              <Icon size={20} />
              {!sidebarCollapsed && <span>{label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="top-bar">
          <div></div>
          <div className="top-bar-actions">
            <div className="user-menu">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <button 
                className="logout-btn"
                onClick={handleLogout}
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="page-content">
          {children}
        </main>
      </div>

      <KeziaChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
    
    {!showChat && userType === 'employee' && !ruthChatOpen && (
      <button 
        className="ruth-chat"
        onClick={() => setShowChat(true)}
        title="Talk to Ruth AI"
      >
        <Bot size={24} />
        <div className="ai-pulse"></div>
      </button>
    )}
    </>
  )
}

export default Layout