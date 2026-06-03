import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search, Menu, Bell, ChevronDown,
  User, Settings, LogOut, Shield, HelpCircle, CreditCard
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import logo from '../assets/logo.png'

function SearchBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--bg)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '7px 12px', width: 260,
    }}>
      <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
      <input placeholder="Search…" style={{
        background: 'transparent', border: 'none', outline: 'none',
        fontSize: 13, color: 'var(--text-main)', width: '100%',
      }} />
    </div>
  )
}

function BellButton() {
  return (
    <button aria-label="Notifications" style={{
      position: 'relative', width: 36, height: 36, borderRadius: 10,
      background: 'var(--bg)', border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
    >
      <Bell size={17} style={{ color: 'var(--text-muted)' }} />
      <span style={{
        position: 'absolute', top: 7, right: 7,
        width: 7, height: 7, borderRadius: '50%',
        background: '#f59e0b', border: '1.5px solid white',
      }} />
    </button>
  )
}

function DropdownMenu({ user, onClose }) {
  const navigate   = useNavigate()
  const { logout } = useApp()

  const go = (path) => { onClose(); navigate(path) }
  const handleLogout = () => { onClose(); logout(); navigate('/') }

  const ITEMS = [
    { icon: User,       label: 'My Profile',      action: () => go('/profile'),       danger: false },
    { icon: CreditCard, label: 'Subscriptions',    action: () => go('/subscriptions'), danger: false },
    { icon: Settings,   label: 'Account Settings', action: () => go('/profile'),       danger: false },
    { icon: Shield,     label: 'Security',          action: () => go('/profile'),       danger: false, dividerAfter: true },
    { icon: HelpCircle, label: 'Support & FAQs',   action: () => go('/support'),       danger: false, dividerAfter: true },
    { icon: LogOut,     label: 'Sign Out',          action: handleLogout,               danger: true  },
  ]

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
      width: 218, background: 'white', borderRadius: 14,
      border: '1px solid var(--border)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
      zIndex: 100, overflow: 'hidden',
      animation: 'slideUp 0.18s ease',
    }}>
      {/* Header */}
      <div style={{
        padding: '13px 14px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#0a0a0a',
            fontFamily: 'var(--font-display)',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 13, fontWeight: 700,
              color: 'var(--text-main)', fontFamily: 'var(--font-display)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.name ?? 'User'}
            </p>
            <p style={{
              margin: '1px 0 0', fontSize: 11, color: 'var(--text-muted)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.email || user?.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ padding: '6px' }}>
        {ITEMS.map(({ icon: Icon, label, action, danger, dividerAfter }) => (
          <div key={label}>
            <button onClick={action} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 10px', borderRadius: 10,
              border: 'none', background: 'transparent',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 0.12s',
              color: danger ? '#EF4444' : 'var(--text-sub)',
            }}
              onMouseEnter={e => e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.06)' : 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: danger ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${danger ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.18)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={13} strokeWidth={2}
                  style={{ color: danger ? '#EF4444' : '#d97706' }} />
              </div>
              <span style={{
                fontSize: 13, fontWeight: 600,
                fontFamily: 'var(--font-display)',
                color: danger ? '#EF4444' : 'var(--text-main)',
              }}>
                {label}
              </span>
            </button>
            {dividerAfter && (
              <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function UserPill({ user }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const initial   = user?.name?.charAt(0)?.toUpperCase() ?? 'U'
  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 10px', borderRadius: 10,
          background: open ? 'rgba(245,158,11,0.06)' : 'var(--bg)',
          border: `1px solid ${open ? 'rgba(245,158,11,0.30)' : 'var(--border)'}`,
          cursor: 'pointer', transition: 'all 0.15s',
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = 'rgba(245,158,11,0.06)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.22)' } }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--border)' } }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#f59e0b,#d97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 800, color: '#0a0a0a',
          fontFamily: 'var(--font-display)',
        }}>
          {initial}
        </div>
        <span style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--text-main)', fontFamily: 'var(--font-display)',
        }}>
          {firstName}
        </span>
        <ChevronDown size={13} style={{
          color: 'var(--text-muted)',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        }} />
      </button>

      {open && <DropdownMenu user={user} onClose={() => setOpen(false)} />}
    </div>
  )
}

export default function Topbar() {
  const { user, setSidebarOpen, isOnNet, tenantConfig } = useApp()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      height: 58, display: 'flex', alignItems: 'center',
      padding: '0 20px', gap: 10,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        <button className="md:hidden" aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
          style={{
            padding: 7, borderRadius: 9, border: 'none',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted)', transition: 'background 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Menu size={20} />
        </button>

        <img
          src={isOnNet && tenantConfig?.logo ? tenantConfig.logo : logo}
          alt={isOnNet ? tenantConfig?.name || 'Portal' : 'Onelynq'}
          className="md:hidden"
          style={{ height: 27, objectFit: 'contain' }}
        />

        <div className="hidden md:flex">
          <SearchBar />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <BellButton />
        <UserPill user={user} />
      </div>
    </header>
  )
}