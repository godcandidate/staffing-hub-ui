import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, Briefcase, FileText, User, BarChart3, 
  Plus, Users, Bell, Search, MessageCircle, Menu, Bot 
} from 'lucide-react'
import RuthChat from './RuthChat'
import './Layout.css'

const Layout = ({ children, userType, setIsAuthenticated }) => {
  const location = useLocation()
  const [showChat, setShowChat] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const employeeNav = [
    { path: '/employee/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/employee/jobs', icon: Briefcase, label: 'Jobs' },
    { path: '/employee/applications', icon: FileText, label: 'Applications' },
    { path: '/employee/profile', icon: User, label: 'Profile' }
  ]

  const stafferNav = [
    { path: '/staffer/jobs', icon: Briefcase, label: 'Job Management' },
    { path: '/staffer/post-job', icon: Plus, label: 'Post Job' },
    { path: '/staffer/analytics', icon: BarChart3, label: 'Analytics' }
  ]

  const currentNav = userType === 'employee' ? employeeNav : stafferNav
  const userTitle = userType === 'employee' ? 'Employee Portal' : 'Staffer Portal'

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
              <h2>AI Staffing Hub</h2>
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
          <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Search jobs, people, skills..." />
          </div>
          
          <div className="top-bar-actions">
            <button className="icon-btn">
              <Bell size={20} />
            </button>
            <button 
              className="talk-to-ruth-btn"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle size={16} />
              Talk to Ruth
            </button>
            <div className="user-menu">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <button 
                className="logout-btn"
                onClick={() => setIsAuthenticated(false)}
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

      <RuthChat isOpen={showChat} onClose={() => setShowChat(false)} />
    </div>
    
    {!showChat && (
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