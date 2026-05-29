import { NavLink, useNavigate } from 'react-router-dom'
import { X, ChevronRight, LogOut } from 'lucide-react'

import { useApp } from '../context/AppContext'
import { NAV_GROUPS } from './Sidebarconfig'
import UserCard from './UserCard'
import logo from '../assets/logo_white.png'

const SIDEBAR_BG   = '#0e1525'
const BORDER_FAINT = 'rgba(255,255,255,0.07)'

function NavItem({ to, icon: Icon, label, onNavigate }) {
  return (
    <NavLink to={to} onClick={onNavigate} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 10,
            marginBottom: 1, cursor: 'pointer',
            background: isActive ? 'rgba(244,120,32,0.14)' : 'transparent',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
          onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
        >
          <Icon size={15} style={{ color: isActive ? '#F47820' : 'rgba(238,242,255,0.30)', flexShrink: 0 }} />
          <span style={{
            flex: 1, fontSize: 13, fontWeight: 500,
            color: isActive ? '#fff' : 'rgba(238,242,255,0.50)',
          }}>
            {label}
          </span>
          {isActive && <ChevronRight size={12} style={{ color: 'rgba(244,120,32,0.45)' }} />}
        </div>
      )}
    </NavLink>
  )
}

function NavGroup({ title, items, onNavigate }) {
  return (
    <div style={{ marginBottom: 6 }}>
      {/* Group title */}
      <p style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.18)',
        padding: '0 10px',
        marginBottom: 3,
        marginTop: 14,
      }}>
        {title}
      </p>
      {items.map(({ to, icon, label }) => (
        <NavItem key={to} to={to} icon={icon} label={label} onNavigate={onNavigate} />
      ))}
    </div>
  )
}

export default function Sidebar({ mobile = false }) {
  const { user, logout, setSidebarOpen } = useApp()
  const navigate = useNavigate()

  const closeMobile = () => { if (mobile) setSidebarOpen(false) }
  const handleLogout = () => { logout(); navigate('/'); closeMobile() }

  return (
    <aside style={{
      width: mobile ? 280 : '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: SIDEBAR_BG,
    }}>

      {/* Logo */}
      <div style={{
        padding: '18px 18px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${BORDER_FAINT}`,
      }}>
        <img src={logo} alt="DirectCore" style={{ height: 32, objectFit: 'contain', filter: 'brightness(1.15) saturate(1.1)' }} />
        {mobile && (
          <button
            onClick={closeMobile}
            aria-label="Close menu"
            style={{
              padding: 6, borderRadius: 8, border: 'none',
              background: 'transparent', cursor: 'pointer',
              color: 'rgba(255,255,255,0.30)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)'; e.currentTarget.style.background = 'transparent' }}
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* User card */}
      <UserCard user={user} />

      {/* Nav groups */}
      <nav
        style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 8px' }}
        aria-label="Main navigation"
      >
        {NAV_GROUPS.map(({ title, items }) => (
          <NavGroup key={title} title={title} items={items} onNavigate={closeMobile} />
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '10px 10px 14px', borderTop: `1px solid ${BORDER_FAINT}` }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 10, border: 'none',
            background: 'transparent', cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
            color: 'rgba(248,113,113,0.55)',
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.10)'; e.currentTarget.style.color = 'rgb(248,113,113)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(248,113,113,0.55)' }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  )
}