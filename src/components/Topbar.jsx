import { Search, Menu, Bell, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'
import logo from '../assets/logo.png'

function SearchBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: 'var(--bg, #f4f5f8)',
      border: '1px solid var(--border, #eaecf0)',
      borderRadius: 10,
      padding: '7px 12px',
      width: 260,
    }}>
      <Search size={14} style={{ color: 'var(--text-muted, #9ca3af)', flexShrink: 0 }} />
      <input
        placeholder="Search…"
        style={{
          background: 'transparent', border: 'none', outline: 'none',
          fontSize: 13, color: 'var(--text-main, #111)', width: '100%',
        }}
      />
    </div>
  )
}

function BellButton() {
  return (
    <button
      aria-label="Notifications"
      style={{
        position: 'relative',
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--bg, #f4f5f8)',
        border: '1px solid var(--border, #eaecf0)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg, #f4f5f8)'}
    >
      <Bell size={17} style={{ color: 'var(--text-muted, #6b7280)' }} />
      <span style={{
        position: 'absolute', top: 7, right: 7,
        width: 7, height: 7, borderRadius: '50%',
        background: '#F47820',
        border: '1.5px solid var(--bg-page, #f8f9fc)',
      }} />
    </button>
  )
}

function UserPill({ user }) {
  const initial   = user?.name?.charAt(0)?.toUpperCase() ?? 'U'
  const firstName = user?.name?.split(' ')[0] ?? ''

  return (
    <button style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '5px 10px', borderRadius: 10,
      background: 'var(--bg, #f4f5f8)',
      border: '1px solid var(--border, #eaecf0)',
      cursor: 'pointer', transition: 'background 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg, #f4f5f8)'}
    >
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: '#F47820',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
      }}>
        {initial}
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-main, #111)' }}>
        {firstName}
      </span>
      <ChevronDown size={13} style={{ color: 'var(--text-muted, #9ca3af)' }} />
    </button>
  )
}

export default function Topbar() {
  const { user, setSidebarOpen } = useApp()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      height: 58,
      display: 'flex', alignItems: 'center',
      padding: '0 20px',
      gap: 10,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border, #eaecf0)',
    }}>

      {/* LEFT — mobile: hamburger + logo | desktop: search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
        {/* Hamburger — mobile only */}
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
          style={{
            padding: 7, borderRadius: 9, border: 'none',
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-muted, #6b7280)',
            transition: 'background 0.15s', flexShrink: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg, #f4f5f8)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Menu size={20} />
        </button>

        {/* Logo — mobile only, sits right after hamburger = far left */}
        <img
          src={logo}
          alt="DirectCore"
          className="md:hidden"
          style={{ height: 27, objectFit: 'contain', filter: 'brightness(1.1) saturate(1.1)' }}
        />

        {/* Search — desktop only, anchored to left */}
        <div className="hidden md:flex">
          <SearchBar />
        </div>
      </div>

      {/* RIGHT — bell + user pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <BellButton />
        <UserPill user={user} />
      </div>
    </header>
  )
}