import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Wifi, Signal, Globe,
  Zap, Grid2X2, Package,
  CreditCard, Receipt, Wallet,
  MapPin, Navigation,
  Settings, Cpu, Router,
  HelpCircle, LogOut,
  ChevronDown, X,
  Building2, FileText
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const NAV_SECTIONS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    single: true,
    to: '/dashboard',
  },
  {
    id: 'connectivity',
    label: 'Connectivity',
    icon: Wifi,
    items: {
      onNet: [
        { to: '/packages',      icon: Package,   label: 'Packages'      },
        { to: '/providers',     icon: Building2, label: 'Providers'     },
        { to: '/subscriptions', icon: Signal,    label: 'Subscriptions' },
      ],
      offNet: [
        { to: '/services',      icon: Globe,     label: 'Global Services' },
        { to: '/subscriptions', icon: Signal,    label: 'My Plans'        },
      ],
    },
  },
  {
    id: 'utilities',
    label: 'Utilities',
    icon: Zap,
    items: {
      onNet: [
        { to: '/services', icon: Grid2X2, label: 'Services'      },
        { to: '/tools',    icon: Zap,     label: 'Network Tools' },
      ],
      offNet: [
        { to: '/tools', icon: Zap, label: 'Tools' },
      ],
    },
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: CreditCard,
    items: {
      onNet: [
        { to: '/billing',  icon: Receipt,  label: 'Billing'  },
        { to: '/wallet',   icon: Wallet,   label: 'Wallet'   },
        { to: '/invoices', icon: FileText, label: 'Invoices' },
      ],
      offNet: [
        { to: '/billing', icon: Receipt, label: 'Billing' },
        { to: '/wallet',  icon: Wallet,  label: 'Wallet'  },
      ],
    },
  },
  {
    id: 'location',
    label: 'Location',
    icon: MapPin,
    single: false,
    items: {
      onNet:  [{ to: '/coverage', icon: Navigation, label: 'Sites' }],
      offNet: [{ to: '/coverage', icon: Navigation, label: 'Sites' }],
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    items: {
      onNet: [
        { to: '/devices',     icon: Cpu,        label: 'Devices'        },
        // { to: '/routers',     icon: Router,     label: 'Routers'        },
        // { to: '/preferences', icon: Settings,   label: 'Preferences'    },
        { to: '/support',     icon: HelpCircle, label: 'Support & FAQs' },
      ],
      offNet: [
        { to: '/preferences', icon: Settings,   label: 'Preferences'    },
        { to: '/support',     icon: HelpCircle, label: 'Support & FAQs' },
      ],
    },
  },
]

/* ── amber colour constants ─────────────────────────────── */
const AMBER       = '#f59e0b'
const AMBER_DIM   = 'rgba(245,158,11,0.65)'
const AMBER_BG    = 'rgba(245,158,11,0.10)'
const AMBER_HOVER = 'rgba(245,158,11,0.06)'
const WHITE_60    = 'rgba(255,255,255,0.60)'
const WHITE_35    = 'rgba(255,255,255,0.35)'
const WHITE_18    = 'rgba(255,255,255,0.18)'
const WHITE_07    = 'rgba(255,255,255,0.07)'
const WHITE_05    = 'rgba(255,255,255,0.05)'

function SectionGroup({ section, isOnNet, mobile, onClose, user, openId, setOpenId }) {
  const location = useLocation()

  const rawItems = section.single
    ? []
    : (isOnNet ? section.items?.onNet : section.items?.offNet) ?? []

  const hasPlan = !!(user?.plan && user?.dataTotal > 0)
  const items = rawItems.filter(item =>
    !(section.id === 'connectivity' && item.to === '/packages' && hasPlan)
  )

  const isOpen      = openId === section.id
  const SectionIcon = section.icon

  useEffect(() => {
    const active = items.some(it => location.pathname.startsWith(it.to))
    if (active && !isOpen) setOpenId(section.id)
  }, [location.pathname])

  /* ── Single link (Dashboard) ── */
  if (section.single) {
    return (
      <NavLink
        to={section.to}
        onClick={() => mobile && onClose()}
        className={({ isActive }) =>
          `flex items-center gap-2.5 mx-2 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150 ${
            isActive ? 'nav-active' : 'nav-item'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div style={{
              width: 2.5, height: 16, borderRadius: 2, flexShrink: 0,
              background: isActive ? AMBER : 'transparent',
              transition: 'background 0.15s',
            }} />
            <SectionIcon
              size={15}
              strokeWidth={isActive ? 2.5 : 1.8}
              style={{ color: isActive ? AMBER : WHITE_35, flexShrink: 0 }}
            />
            <span style={{
              flex: 1,
              color: isActive ? '#fff' : WHITE_60,
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
            }}>
              {section.label}
            </span>
          </>
        )}
      </NavLink>
    )
  }

  if (!items.length) return null

  const anyChildActive = items.some(it => location.pathname.startsWith(it.to))

  return (
    <div className="mx-2 mb-0.5">
      <button
        onClick={() => setOpenId(isOpen ? null : section.id)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150"
        style={{
          background: isOpen || anyChildActive ? AMBER_BG : 'transparent',
          border: 'none', cursor: 'pointer',
        }}
        onMouseEnter={e => { if (!isOpen && !anyChildActive) e.currentTarget.style.background = WHITE_05 }}
        onMouseLeave={e => { if (!isOpen && !anyChildActive) e.currentTarget.style.background = 'transparent' }}
      >
        <div style={{
          width: 2.5, height: 16, borderRadius: 2, flexShrink: 0,
          background: anyChildActive ? AMBER : 'transparent',
          transition: 'background 0.15s',
        }} />
        <SectionIcon
          size={15}
          strokeWidth={anyChildActive ? 2.5 : 1.8}
          style={{ color: anyChildActive ? AMBER : WHITE_35, flexShrink: 0, transition: 'color 0.15s' }}
        />
        <span style={{
          flex: 1, textAlign: 'left',
          color: anyChildActive ? '#fff' : WHITE_60,
          fontSize: 13,
          fontWeight: anyChildActive ? 600 : 500,
          transition: 'color 0.15s',
        }}>
          {section.label}
        </span>
        <ChevronDown
          size={13}
          style={{
            color: WHITE_18, flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.22s ease',
          }}
        />
      </button>

      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? `${items.length * 44}px` : '0px',
        transition: 'max-height 0.25s ease',
      }}>
        <div className="pl-4 pt-0.5 pb-1 space-y-0.5">
          {items.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => mobile && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive ? 'nav-active' : 'nav-item'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div style={{
                    width: 5, height: 5, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? AMBER : WHITE_18,
                    transition: 'background 0.15s',
                    marginLeft: 2,
                  }} />
                  <Icon
                    size={13}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    style={{ color: isActive ? AMBER : WHITE_35, flexShrink: 0 }}
                  />
                  <span style={{
                    flex: 1,
                    color: isActive ? '#fff' : WHITE_60,
                    fontSize: 12.5,
                    fontWeight: isActive ? 600 : 400,
                  }}>
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ mobile = false }) {
  const { user, logout, setSidebarOpen, isOnNet, tenantConfig } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    for (const sec of NAV_SECTIONS) {
      if (sec.single) continue
      const items = isOnNet ? sec.items?.onNet : sec.items?.offNet
      if (items?.some(it => location.pathname.startsWith(it.to))) {
        setOpenId(sec.id)
        break
      }
    }
  }, [])

  const handleLogout = () => { logout(); navigate('/'); if (mobile) setSidebarOpen(false) }
  const handleClose  = () => setSidebarOpen(false)

  return (
    <aside
      className="h-full flex flex-col"
      style={{
        width: mobile ? 272 : '100%',
        background: 'linear-gradient(180deg,#0c1220 0%,#080c14 100%)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="px-5 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2.5">
          {isOnNet && tenantConfig?.logo ? (
            <img src={tenantConfig.logo} alt={tenantConfig.name}
              className="h-7 object-contain" style={{ filter: 'brightness(1.15)' }} />
          ) : (
            <>
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  boxShadow: '0 2px 8px rgba(245,158,11,0.35)',
                }}
              >
                <Wifi size={14} color="#0a0a0a" strokeWidth={2.5} />
              </div>
              <span className="text-base font-bold tracking-tight text-white"
                style={{ fontFamily: 'var(--font-display)' }}>
                One<span style={{ color: AMBER }}>lynq</span>
              </span>
            </>
          )}
        </div>
        {mobile && (
          <button onClick={handleClose} className="p-1.5 rounded-lg transition-all"
            style={{ color: WHITE_35, background: 'none', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = WHITE_35}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* ── Mode badge ── */}
      <div className="mx-3 mt-3 flex-shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{
          background: isOnNet ? AMBER_BG : WHITE_05,
          border: `1px solid ${isOnNet ? 'rgba(245,158,11,0.28)' : WHITE_07}`,
        }}>
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              background: isOnNet ? AMBER : WHITE_35,
              boxShadow: isOnNet ? '0 0 0 0 rgba(245,158,11,0.5)' : 'none',
              animation: isOnNet ? 'aPulse 2.2s ease-in-out infinite' : 'none',
            }} />
          <span className="text-xs font-semibold"
            style={{ color: isOnNet ? AMBER_DIM : WHITE_35 }}>
            {isOnNet ? `On-Net · ${tenantConfig?.name || 'Network'}` : 'Off-Net · Global View'}
          </span>
        </div>
      </div>

      {/* ── User card ── */}
      {user && (
        <div className="mx-3 mt-3 p-3 rounded-2xl flex-shrink-0" style={{
          background: WHITE_05,
          border: `1px solid ${WHITE_07}`,
        }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                color: '#0a0a0a',
              }}>
              {user.name?.charAt(0) ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-none">{user.name}</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: WHITE_35 }}>
                {user.phone || user.email}
              </p>
            </div>
          </div>
          {isOnNet && user.dataTotal > 0 && (
            <div className="mt-2.5 space-y-1">
              <div className="flex justify-between" style={{ fontSize: 11 }}>
                <span style={{ color: WHITE_35 }}>{user.plan}</span>
                <span style={{ color: AMBER, fontWeight: 600 }}>
                  {user.dataUsed ?? 0}/{user.dataTotal} GB
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{
                  width: `${Math.min(((user.dataUsed ?? 0) / user.dataTotal) * 100, 100)}%`,
                  background: 'linear-gradient(90deg,#d97706,#f59e0b)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-2 mt-1" style={{ scrollbarWidth: 'none' }}>
        {NAV_SECTIONS.map(section => (
          <SectionGroup
            key={section.id}
            section={section}
            isOnNet={isOnNet}
            mobile={mobile}
            onClose={handleClose}
            user={user}
            openId={openId}
            setOpenId={setOpenId}
          />
        ))}
      </nav>

      {/* ── Sign out ── */}
      <div className="p-3 flex-shrink-0"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
          style={{ color: 'rgba(248,113,113,0.55)', background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(248,113,113,0.55)'; e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        @keyframes aPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.55); }
          50%     { box-shadow: 0 0 0 5px rgba(245,158,11,0); }
        }
      `}</style>
    </aside>
  )
}