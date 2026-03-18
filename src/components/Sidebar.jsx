import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, Calendar, Ticket, Users, LogOut, QrCode } from 'lucide-react'

export function Sidebar() {
  const { profile, isAdmin, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const adminLinks = [
    { to: '/admin', icon: Home, label: 'Dashboard' },
    { to: '/admin/events', icon: Calendar, label: 'Manage Events' },
    { to: '/admin/registrations', icon: Ticket, label: 'Registrations' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/checkin', icon: QrCode, label: 'Check-In Desk' },
  ]

  const userLinks = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/events', icon: Calendar, label: 'Browse Events' },
    { to: '/my-tickets', icon: Ticket, label: 'My Tickets' },
  ]

  const links = isAdmin ? adminLinks : userLinks

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

        .sb-wrap {
          width: 220px !important;
          min-height: 100vh !important;
          background: #0c1120 !important;
          border-right: 0.5px solid rgba(99,179,237,0.07) !important;
          display: flex !important;
          flex-direction: column !important;
          position: fixed !important;
          left: 0 !important; top: 0 !important; bottom: 0 !important;
          z-index: 50 !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
        }

        .sb-logo {
          padding: 22px 20px !important;
          border-bottom: 0.5px solid rgba(255,255,255,0.06) !important;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }

        .sb-logo-icon {
          width: 36px !important; height: 36px !important;
          border-radius: 10px !important;
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
          flex-shrink: 0 !important;
        }

        .sb-logo-name {
          font-family: 'Space Grotesk', sans-serif !important;
          font-weight: 700 !important;
          font-size: 16px !important;
          color: #fff !important;
          letter-spacing: -0.4px !important;
          line-height: 1 !important;
          margin: 0 !important;
        }

        .sb-logo-sub {
          font-size: 10px !important;
          color: rgba(255,255,255,0.25) !important;
          letter-spacing: 1.5px !important;
          text-transform: uppercase !important;
          margin-top: 3px !important;
        }

        .sb-nav {
          flex: 1 !important;
          padding: 16px 12px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 3px !important;
        }

        .sb-link {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 10px 12px !important;
          border-radius: 10px !important;
          font-size: 13.5px !important;
          font-weight: 400 !important;
          color: rgba(255,255,255,0.4) !important;
          text-decoration: none !important;
          transition: all 0.15s !important;
          border: 0.5px solid transparent !important;
          position: relative !important;
        }

        .sb-link:hover {
          background: rgba(255,255,255,0.04) !important;
          color: rgba(255,255,255,0.8) !important;
          border-color: rgba(255,255,255,0.06) !important;
        }

        .sb-link.active {
          background: rgba(59,130,246,0.1) !important;
          color: #60a5fa !important;
          border-color: rgba(59,130,246,0.2) !important;
          font-weight: 500 !important;
        }

        .sb-link-dot {
          position: absolute !important;
          left: 0 !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          width: 3px !important;
          height: 18px !important;
          background: #3b82f6 !important;
          border-radius: 0 3px 3px 0 !important;
        }

        .sb-bottom {
          padding: 14px 12px !important;
          border-top: 0.5px solid rgba(255,255,255,0.06) !important;
        }

        .sb-user {
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
          padding: 10px 10px !important;
          border-radius: 10px !important;
          background: rgba(255,255,255,0.02) !important;
          border: 0.5px solid rgba(255,255,255,0.05) !important;
          margin-bottom: 10px !important;
        }

        .sb-avatar {
          width: 32px !important; height: 32px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #3b82f6, #6366f1) !important;
          display: flex !important; align-items: center !important; justify-content: center !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          color: #fff !important;
          flex-shrink: 0 !important;
          font-family: 'Space Grotesk', sans-serif !important;
        }

        .sb-user-name {
          font-size: 13px !important;
          font-weight: 500 !important;
          color: rgba(255,255,255,0.8) !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          margin: 0 !important;
        }

        .sb-user-role {
          font-size: 10px !important;
          color: #60a5fa !important;
          text-transform: capitalize !important;
          font-weight: 300 !important;
        }

        .sb-logout {
          width: 100% !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          padding: 9px !important;
          background: rgba(255,255,255,0.03) !important;
          border: 0.5px solid rgba(255,255,255,0.07) !important;
          border-radius: 10px !important;
          color: rgba(255,255,255,0.35) !important;
          font-size: 13px !important;
          font-family: 'IBM Plex Sans', sans-serif !important;
          cursor: pointer !important;
          transition: all 0.15s !important;
        }

        .sb-logout:hover {
          background: rgba(239,68,68,0.08) !important;
          border-color: rgba(239,68,68,0.2) !important;
          color: #f87171 !important;
        }
      `}</style>

      <aside className="sb-wrap">
        {/* Logo */}
        <div className="sb-logo">
          <div className="sb-logo-icon">
            <Calendar size={17} color="#fff" />
          </div>
          <div>
            <div className="sb-logo-name">EventHub</div>
            <div className="sb-logo-sub">{isAdmin ? 'Admin Portal' : 'FEU Roosevelt'}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sb-nav">
          {links.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/admin' && to !== '/dashboard' && location.pathname.startsWith(to))
            return (
              <Link key={to} to={to} className={`sb-link${active ? ' active' : ''}`}>
                {active && <div className="sb-link-dot" />}
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="sb-bottom">
          <div className="sb-user">
            <div className="sb-avatar">{initials}</div>
            <div style={{ overflow: 'hidden' }}>
              <div className="sb-user-name">{profile?.full_name}</div>
              <div className="sb-user-role">{profile?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="sb-logout">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  )
}