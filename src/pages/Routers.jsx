import { useState } from 'react'
import {
  Router, Wifi, Signal, AlertTriangle,
  CheckCircle2, Clock, RefreshCw, Plus,
  MoreVertical, ChevronRight, Activity,
  Zap, Globe, Lock, Unlock, Trash2,
  Edit3, Eye, EyeOff, Copy, Check,
  WifiOff, Settings2
} from 'lucide-react'

/* ── Mock data ── */
const MOCK_ROUTERS = [
  {
    id: 'r1',
    name: 'Main Office Router',
    model: 'Huawei B818-263',
    mac: 'A4:C3:F0:85:AC:2D',
    ip: '192.168.1.1',
    signal: 87,
    status: 'online',
    uptime: '12d 4h 32m',
    connectedDevices: 14,
    download: '45.2',
    upload: '12.8',
    ssid: 'Office_5G',
    band: '5GHz',
    firmware: 'v3.21.1',
    lastSeen: 'Just now',
  },
  {
    id: 'r2',
    name: 'Branch Router',
    model: 'ZTE MF286R',
    mac: 'B8:E8:56:42:1A:4F',
    ip: '192.168.2.1',
    signal: 62,
    status: 'online',
    uptime: '3d 11h 8m',
    connectedDevices: 6,
    download: '22.1',
    upload: '7.4',
    ssid: 'Branch_WiFi',
    band: '2.4GHz',
    firmware: 'v2.14.0',
    lastSeen: '2 min ago',
  },
  {
    id: 'r3',
    name: 'Backup Router',
    model: 'Netgear LM1200',
    mac: 'C0:FF:D4:A1:9B:3E',
    ip: '—',
    signal: 0,
    status: 'offline',
    uptime: '—',
    connectedDevices: 0,
    download: '—',
    upload: '—',
    ssid: 'Backup_Net',
    band: '2.4GHz',
    firmware: 'v1.9.5',
    lastSeen: '2 days ago',
  },
]

/* ── Signal bar component ── */
function SignalBars({ value }) {
  const bars = [25, 50, 75, 100]
  return (
    <div className="flex items-end gap-0.5" style={{ height: 14 }}>
      {bars.map((threshold, i) => (
        <div key={i} style={{
          width: 4,
          height: `${40 + i * 20}%`,
          borderRadius: 1.5,
          background: value >= threshold
            ? (value >= 75 ? '#3B8FE8' : value >= 50 ? '#FBBF24' : '#F87171')
            : 'rgba(255,255,255,0.1)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )
}

/* ── Status badge ── */
function StatusBadge({ status }) {
  const cfg = {
    online:  { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.2)',  dot: true  },
    offline: { color: '#F87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', dot: false },
    warning: { color: '#FBBF24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.2)',  dot: true  },
  }[status] ?? {}

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{
      background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color,
    }}>
      {cfg.dot && <span className="w-1.5 h-1.5 rounded-full status-pulse" style={{ background: cfg.color }} />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

/* ── Router detail drawer ── */
function RouterDrawer({ router, onClose }) {
  const [showPassword, setShowPassword] = useState(false)
  const [copied, setCopied] = useState(null)

  if (!router) return null

  const copy = (val, key) => {
    navigator.clipboard.writeText(val).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 1800)
  }

  const rows = [
    { label: 'IP Address',  value: router.ip,      key: 'ip'   },
    { label: 'MAC Address', value: router.mac,      key: 'mac'  },
    { label: 'Firmware',    value: router.firmware, key: 'fw'   },
    { label: 'SSID',        value: router.ssid,     key: 'ssid' },
    { label: 'Band',        value: router.band,     key: 'band' },
  ]

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 360,
          background: 'linear-gradient(180deg,#0F1E38 0%,#091530 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '-24px 0 60px rgba(0,0,0,0.4)',
        }}
      >

        {/* Header */}
        <div
          className="p-5 flex items-start justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: 'rgba(186,213,255,0.4)' }}>Router Details</p>
            <h3 className="text-base font-bold text-white">{router.name}</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(186,213,255,0.45)' }}>{router.model}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: 'none' }}>

          {/* Live stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Download', value: router.status === 'online' ? `${router.download} Mbps` : '—', icon: Activity, color: '#3B8FE8' },
              { label: 'Upload',   value: router.status === 'online' ? `${router.upload} Mbps`   : '—', icon: Zap,      color: '#A78BFA' },
              { label: 'Devices',  value: router.connectedDevices,                                        icon: Wifi,    color: '#60A5FA' },
              { label: 'Uptime',   value: router.uptime,                                                  icon: Clock,   color: '#FBBF24' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon size={11} style={{ color: `${color}88` }} />
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{label}</span>
                </div>
                <p className="text-sm font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Info rows */}
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {rows.map(({ label, value, key }, i) => (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
              >
                <span className="text-xs" style={{ color: 'rgba(186,213,255,0.4)' }}>{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-white font-mono">{value}</span>
                  {['ip', 'mac', 'ssid'].includes(key) && (
                    <button
                      onClick={() => copy(value, key)}
                      className="p-1 rounded transition-colors"
                      style={{ color: copied === key ? '#3B8FE8' : 'rgba(255,255,255,0.2)' }}
                    >
                      {copied === key ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2">
            {[
              { label: 'Restart Router', icon: RefreshCw, color: '#60A5FA', danger: false },
              { label: 'Edit Settings',  icon: Edit3,     color: '#A78BFA', danger: false },
              { label: 'Remove Router',  icon: Trash2,    color: '#F87171', danger: true  },
            ].map(({ label, icon: Icon, color, danger }) => (
              <button
                key={label}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 text-sm font-medium"
                style={{
                  background: danger ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${danger ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`,
                  color,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

/* ── Router card ── */
function RouterCard({ router, onSelect }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-200 cursor-pointer group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(29,111,216,0.05)'
        e.currentTarget.style.border = '1px solid rgba(29,111,216,0.18)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
        e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'
      }}
      onClick={() => onSelect(router)}
    >

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: router.status === 'online'
                ? 'linear-gradient(135deg,#1D6FD8,#1452A8)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: router.status === 'online' ? '0 2px 12px rgba(29,111,216,0.3)' : 'none',
            }}
          >
            {router.status === 'online'
              ? <Router size={18} color="white" strokeWidth={2} />
              : <WifiOff size={18} color="rgba(255,255,255,0.3)" strokeWidth={2} />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white leading-none">{router.name}</h3>
            <p className="text-xs mt-1" style={{ color: 'rgba(186,213,255,0.4)' }}>{router.model}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={router.status} />
          <ChevronRight
            size={14}
            style={{ color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Download', value: router.status === 'online' ? `${router.download}` : '—', unit: router.status === 'online' ? 'Mbps' : '' },
          { label: 'Devices',  value: router.connectedDevices, unit: 'connected' },
          { label: 'Uptime',   value: router.status === 'online' ? router.uptime.split(' ')[0] + ' ' + router.uptime.split(' ')[1] : '—', unit: '' },
        ].map(({ label, value, unit }) => (
          <div
            key={label}
            className="text-center px-2 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-base font-bold text-white leading-none">{value}</p>
            {unit && <p className="text-xs mt-1" style={{ color: 'rgba(186,213,255,0.3)' }}>{unit}</p>}
            <p className="text-xs mt-0.5" style={{ color: 'rgba(186,213,255,0.25)', fontSize: 10 }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <SignalBars value={router.signal} />
          <span className="text-xs" style={{ color: 'rgba(186,213,255,0.4)' }}>
            {router.status === 'online' ? `${router.signal}% signal` : 'No signal'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Globe size={11} style={{ color: 'rgba(186,213,255,0.25)' }} />
          <span className="text-xs font-mono" style={{ color: 'rgba(186,213,255,0.35)', fontSize: 11 }}>
            {router.ip}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function Routers() {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter]     = useState('all')

  const filtered = MOCK_ROUTERS.filter(r =>
    filter === 'all' ? true : r.status === filter
  )

  const onlineCount  = MOCK_ROUTERS.filter(r => r.status === 'online').length
  const offlineCount = MOCK_ROUTERS.filter(r => r.status === 'offline').length

  return (
    <div className="min-h-full p-6" style={{ background: 'transparent', color: 'white' }}>

      {/* Page header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Routers</h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(186,213,255,0.45)' }}>
            Manage and monitor your network hardware
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
          style={{
            background: 'linear-gradient(135deg,#1D6FD8,#1452A8)',
            color: 'white',
            boxShadow: '0 2px 12px rgba(29,111,216,0.35)',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Router
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Routers', value: MOCK_ROUTERS.length, color: '#3B8FE8',  icon: Router        },
          { label: 'Online',        value: onlineCount,          color: '#4ADE80',  icon: CheckCircle2  },
          { label: 'Offline',       value: offlineCount,         color: '#F87171',  icon: AlertTriangle },
        ].map(({ label, value, color, icon: Icon }) => (
          <div
            key={label}
            className="p-4 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs" style={{ color: 'rgba(186,213,255,0.4)' }}>{label}</span>
              <Icon size={13} style={{ color: `${color}88` }} />
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-1 mb-5 p-1 rounded-xl w-fit"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {['all', 'online', 'offline'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
            style={{
              background: filter === f ? 'rgba(29,111,216,0.15)' : 'transparent',
              color: filter === f ? '#60A5FA' : 'rgba(186,213,255,0.4)',
              border: filter === f ? '1px solid rgba(29,111,216,0.28)' : '1px solid transparent',
            }}
          >
            {f === 'all' ? `All (${MOCK_ROUTERS.length})` : f === 'online' ? `Online (${onlineCount})` : `Offline (${offlineCount})`}
          </button>
        ))}
      </div>

      {/* Router cards */}
      <div className="grid gap-3 grid-cols-1 xl:grid-cols-2">
        {filtered.map(router => (
          <RouterCard key={router.id} router={router} onSelect={setSelected} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <WifiOff size={32} style={{ color: 'rgba(255,255,255,0.1)', margin: '0 auto 12px' }} />
          <p className="text-sm" style={{ color: 'rgba(186,213,255,0.3)' }}>No routers found</p>
        </div>
      )}

      {/* Detail drawer */}
      <RouterDrawer router={selected} onClose={() => setSelected(null)} />
    </div>
  )
}