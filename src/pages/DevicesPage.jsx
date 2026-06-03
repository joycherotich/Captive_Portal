import { useState } from 'react'
import {
  Cpu, Smartphone, Laptop, Tablet, Tv, Wifi,
  MoreVertical, Trash2, ShieldCheck, Plus, X,
  Router, Signal, RefreshCw, Settings2, AlertCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'

/* ── icon maps ───────────────────────────────────────── */
const DEVICE_ICONS = {
  phone:  Smartphone,
  laptop: Laptop,
  tablet: Tablet,
  tv:     Tv,
  other:  Cpu,
}

/* ── mock data ───────────────────────────────────────── */
const MOCK_DEVICES = [
  { id: 1, name: 'My Android Phone', type: 'phone',  mac: 'A4:C3:F0:12:34:56', ip: '192.168.1.101', status: 'active',  lastSeen: 'Now',       trusted: true  },
  { id: 2, name: 'Work Laptop',      type: 'laptop', mac: 'B8:27:EB:44:55:66', ip: '192.168.1.102', status: 'active',  lastSeen: 'Now',       trusted: true  },
  { id: 3, name: 'iPad Mini',        type: 'tablet', mac: 'DC:A6:32:77:88:99', ip: '192.168.1.103', status: 'idle',   lastSeen: '2h ago',    trusted: false },
  { id: 4, name: 'Smart TV',         type: 'tv',     mac: '00:1A:2B:3C:4D:5E', ip: '192.168.1.104', status: 'offline',lastSeen: 'Yesterday', trusted: false },
  { id: 5, name: 'Unknown Device',   type: 'other',  mac: 'FF:EE:DD:CC:BB:AA', ip: '192.168.1.105', status: 'active', lastSeen: 'Now',       trusted: false },
]

const MOCK_ROUTERS = [
  { id: 1, name: 'Main Gateway',    model: 'MikroTik hEX S',      ip: '192.168.1.1',   mac: 'E4:8D:8C:AA:11:22', firmware: 'RouterOS 7.10', status: 'active',  uptime: '14d 6h',  signal: 98 },
  { id: 2, name: 'Office AP',       model: 'Ubiquiti UAP-AC-Pro', ip: '192.168.1.2',   mac: '78:45:58:BB:33:44', firmware: 'v6.5.60',       status: 'active',  uptime: '14d 6h',  signal: 87 },
  { id: 3, name: 'Backup Router',   model: 'TP-Link Archer C7',   ip: '192.168.1.3',   mac: '50:C7:BF:CC:55:66', firmware: 'v5.3.0',        status: 'idle',    uptime: '2d 11h',  signal: 62 },
  { id: 4, name: 'Remote Branch',   model: 'Cisco RV340',         ip: '10.0.0.1',      mac: '00:AA:BB:DD:77:88', firmware: 'v1.0.03.29',    status: 'offline', uptime: '—',       signal: 0  },
]

/* ── status styles ───────────────────────────────────── */
const STATUS = {
  active:  { color: '#10B981', bg: 'rgba(16,185,129,0.10)', label: 'Active'  },
  idle:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', label: 'Idle'    },
  offline: { color: '#94A3B8', bg: 'rgba(148,163,184,0.10)',label: 'Offline' },
}

/* ── signal bar ──────────────────────────────────────── */
function SignalBar({ pct }) {
  const color = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : pct > 0 ? '#EF4444' : '#CBD5E1'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
        {[3, 5, 7, 9, 11].map((h, i) => (
          <div key={i} style={{
            width: 3, height: h, borderRadius: 2,
            background: pct >= (i + 1) * 20 ? color : 'rgba(0,0,0,0.08)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600 }}>{pct > 0 ? `${pct}%` : '—'}</span>
    </div>
  )
}

/* ── device row ──────────────────────────────────────── */
function DeviceRow({ device, onRemove, onToggleTrust, removing }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const Icon = DEVICE_ICONS[device.type] ?? Cpu
  const st   = STATUS[device.status]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '44px 1fr auto auto auto',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 14,
      background: removing ? 'rgba(239,68,68,0.04)' : 'transparent',
      opacity: removing ? 0.5 : 1,
      transition: 'all 0.3s',
      position: 'relative',
    }}
      onMouseEnter={e => { if (!removing) e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }}
      onMouseLeave={e => { e.currentTarget.style.background = removing ? 'rgba(239,68,68,0.04)' : 'transparent' }}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(245,158,11,0.08)',
        border: '1px solid rgba(245,158,11,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={19} style={{ color: '#d97706' }} />
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {device.name}
          </p>
          {device.trusted && <ShieldCheck size={13} style={{ color: '#10B981', flexShrink: 0 }} />}
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0', fontFamily: 'monospace' }}>
          {device.mac} · {device.ip}
        </p>
      </div>

      {/* Last seen */}
      <span style={{ fontSize: 11.5, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {device.lastSeen}
      </span>

      {/* Status badge */}
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
        background: st.bg, color: st.color, whiteSpace: 'nowrap',
      }}>
        {st.label}
      </span>

      {/* Menu */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(o => !o)} style={{
          width: 30, height: 30, borderRadius: 8, border: 'none',
          background: 'transparent', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <MoreVertical size={15} />
        </button>
        {menuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setMenuOpen(false)} />
            <div style={{
              position: 'absolute', right: 0, top: 34, zIndex: 20,
              background: 'white', borderRadius: 12, padding: '4px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.12)', border: '1px solid var(--border)', width: 168,
            }}>
              <button onClick={() => { onToggleTrust(device.id); setMenuOpen(false) }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', fontSize: 13, color: 'var(--text-main)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <ShieldCheck size={13} style={{ color: '#10B981' }} />
                {device.trusted ? 'Remove Trust' : 'Mark Trusted'}
              </button>
              <button onClick={() => { onRemove(device.id); setMenuOpen(false) }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', fontSize: 13, color: '#EF4444',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Trash2 size={13} />
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ── router row ──────────────────────────────────────── */
function RouterRow({ router }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const st = STATUS[router.status]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '44px 1fr auto auto auto',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 14,
      transition: 'background 0.15s',
      position: 'relative',
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'rgba(29,111,216,0.08)',
        border: '1px solid rgba(29,111,216,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Router size={19} style={{ color: '#1D6FD8' }} />
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
            {router.name}
          </p>
          <span style={{ fontSize: 10.5, color: 'var(--text-muted)', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '1px 6px' }}>
            {router.model}
          </span>
        </div>
        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0', fontFamily: 'monospace' }}>
          {router.ip} · Up {router.uptime} · {router.firmware}
        </p>
      </div>

      {/* Signal */}
      <SignalBar pct={router.signal} />

      {/* Status badge */}
      <span style={{
        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
        background: st.bg, color: st.color, whiteSpace: 'nowrap',
      }}>
        {st.label}
      </span>

      {/* Menu */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(o => !o)} style={{
          width: 30, height: 30, borderRadius: 8, border: 'none',
          background: 'transparent', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <MoreVertical size={15} />
        </button>
        {menuOpen && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 10 }} onClick={() => setMenuOpen(false)} />
            <div style={{
              position: 'absolute', right: 0, top: 34, zIndex: 20,
              background: 'white', borderRadius: 12, padding: '4px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.12)', border: '1px solid var(--border)', width: 168,
            }}>
              <button style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', fontSize: 13, color: 'var(--text-main)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,111,216,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <RefreshCw size={13} style={{ color: '#1D6FD8' }} />
                Reboot
              </button>
              <button style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px', borderRadius: 8, border: 'none', background: 'transparent',
                cursor: 'pointer', fontSize: 13, color: 'var(--text-main)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(29,111,216,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Settings2 size={13} style={{ color: '#1D6FD8' }} />
                Configure
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════ */
export default function DevicesPage() {
  const { showToast } = useApp()
  const [tab, setTab]           = useState('devices')
  const [devices, setDevices]   = useState(MOCK_DEVICES)
  const [removing, setRemoving] = useState(null)
  const [showAdd, setShowAdd]   = useState(false)
  const [newName, setNewName]   = useState('')
  const [newType, setNewType]   = useState('phone')

  const activeDevices  = devices.filter(d => d.status === 'active').length
  const trustedDevices = devices.filter(d => d.trusted).length
  const activeRouters  = MOCK_ROUTERS.filter(r => r.status === 'active').length

  const removeDevice = (id) => {
    setRemoving(id)
    setTimeout(() => {
      setDevices(prev => prev.filter(d => d.id !== id))
      setRemoving(null)
      showToast('Device removed.', 'success')
    }, 700)
  }

  const toggleTrust = (id) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, trusted: !d.trusted } : d))
    showToast('Trust updated.', 'success')
  }

  const addDevice = () => {
    if (!newName.trim()) return
    setDevices(prev => [...prev, {
      id: Date.now(), name: newName.trim(), type: newType,
      mac: 'XX:XX:XX:XX:XX:XX', ip: '—',
      status: 'offline', lastSeen: 'Never', trusted: false,
    }])
    setNewName(''); setNewType('phone'); setShowAdd(false)
    showToast('Device added!', 'success')
  }

  const TABS = [
    { id: 'devices', label: 'Client Devices', icon: Cpu   },
    { id: 'routers', label: 'Routers & APs',  icon: Router },
  ]

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
            Network Devices
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Manage clients, routers and access points on your network
          </p>
        </div>
        {tab === 'devices' && (
          <button onClick={() => setShowAdd(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            color: '#0a0a0a', border: 'none', borderRadius: 10,
            padding: '9px 16px', fontSize: 13, fontWeight: 700,
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
          }}>
            <Plus size={14} />Add Device
          </button>
        )}
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Devices',   value: devices.length,  color: 'var(--text-main)', sub: 'clients'        },
          { label: 'Active Now',      value: activeDevices,   color: '#10B981',           sub: 'online'         },
          { label: 'Trusted',         value: trustedDevices,  color: '#F59E0B',           sub: 'verified'       },
          { label: 'Routers & APs',   value: MOCK_ROUTERS.length, color: '#1D6FD8',       sub: `${activeRouters} active` },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', border: '1px solid var(--border)',
            borderRadius: 14, padding: '14px 16px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <p style={{ fontSize: 24, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-main)', margin: '5px 0 1px' }}>{s.label}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'rgba(0,0,0,0.04)', borderRadius: 12,
        padding: 4, marginBottom: 16, width: 'fit-content',
      }}>
        {TABS.map(t => {
          const Icon    = t.icon
          const isActive = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', borderRadius: 9, border: 'none',
              background: isActive ? 'white' : 'transparent',
              color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: isActive ? 600 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}>
              <Icon size={14} style={{ color: isActive ? '#f59e0b' : 'var(--text-muted)' }} />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ── Table header ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: tab === 'devices'
          ? '44px 1fr 80px 80px 30px'
          : '44px 1fr 90px 80px 30px',
        gap: 12, padding: '6px 16px',
        marginBottom: 4,
      }}>
        {(tab === 'devices'
          ? ['', 'Device', 'Last Seen', 'Status', '']
          : ['', 'Router / AP', 'Signal', 'Status', '']
        ).map((h, i) => (
          <span key={i} style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {h}
          </span>
        ))}
      </div>

      {/* ── List ── */}
      <div style={{
        background: 'white', border: '1px solid var(--border)',
        borderRadius: 18, overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {tab === 'devices' ? (
          devices.length === 0 ? (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <AlertCircle size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>No devices found</p>
            </div>
          ) : (
            <div style={{ padding: '6px' }}>
              {devices.map((d, i) => (
                <div key={d.id}>
                  <DeviceRow
                    device={d}
                    onRemove={removeDevice}
                    onToggleTrust={toggleTrust}
                    removing={removing === d.id}
                  />
                  {i < devices.length - 1 && (
                    <div style={{ height: 1, background: 'rgba(0,0,0,0.04)', margin: '0 16px' }} />
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={{ padding: '6px' }}>
            {MOCK_ROUTERS.map((r, i) => (
              <div key={r.id}>
                <RouterRow router={r} />
                {i < MOCK_ROUTERS.length - 1 && (
                  <div style={{ height: 1, background: 'rgba(0,0,0,0.04)', margin: '0 16px' }} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Add Device Modal ── */}
      {showAdd && (
        <div className="modal-bg">
          <div style={{
            background: 'white', borderRadius: 20,
            width: '100%', maxWidth: 380,
            padding: '24px', animation: 'slideUp 0.2s ease',
            boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
                Add Device
              </h3>
              <button onClick={() => setShowAdd(false)} style={{
                width: 28, height: 28, borderRadius: 8, border: 'none',
                background: 'var(--bg)', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)',
              }}>
                <X size={15} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                  Device Name
                </label>
                <input className="portal-input" placeholder="e.g. My Phone"
                  value={newName} onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addDevice()} autoFocus />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: 6 }}>
                  Device Type
                </label>
                <select className="portal-input" value={newType} onChange={e => setNewType(e.target.value)}>
                  {Object.keys(DEVICE_ICONS).map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <button onClick={addDevice} disabled={!newName.trim()} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              width: '100%', marginTop: 20,
              background: newName.trim() ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(0,0,0,0.08)',
              color: newName.trim() ? '#0a0a0a' : 'var(--text-muted)',
              border: 'none', borderRadius: 10, padding: '11px',
              fontSize: 13, fontWeight: 700, cursor: newName.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}>
              <Plus size={14} />Add Device
            </button>
          </div>
        </div>
      )}
    </div>
  )
}