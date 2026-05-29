import { useState, useRef, useEffect } from 'react'
import { Search, Plus, Check, X, Lock, Wifi, Loader2, Link2, Unlink } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SERIF = "'DM Serif Display', Georgia, serif"

/* ─── Provider data ───────────────────────────────────────────────────────── */
const ALL_PROVIDERS = [
  { id: 1, name: 'Safaricom Home Fibre', short: 'Safaricom', type: 'Fibre ISP',      coverage: 'Nationwide',        color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0', textColor: '#14532d', icon: SafaricomIcon },
  { id: 2, name: 'Zuku Fibre',           short: 'Zuku',       type: 'Fibre ISP',      coverage: 'Nairobi, Mombasa',  color: '#be123c', bg: '#fff1f2', border: '#fecdd3', textColor: '#881337', icon: ZukuIcon       },
  { id: 3, name: 'Faiba (JTL)',          short: 'Faiba',      type: '4G / Fibre',     coverage: 'Nationwide',        color: '#b45309', bg: '#fffbeb', border: '#fde68a', textColor: '#78350f', icon: FaibaIcon      },
  { id: 4, name: 'Airtel Business',      short: 'Airtel',     type: 'Wireless ISP',   coverage: 'Nationwide',        color: '#dc2626', bg: '#fef2f2', border: '#fecaca', textColor: '#7f1d1d', icon: AirtelIcon     },
  { id: 5, name: 'SwiftNet Kenya',       short: 'SwiftNet',   type: 'Wireless ISP',   coverage: 'Nairobi',           color: '#1B3A8F', bg: '#eff6ff', border: '#bfdbfe', textColor: '#1e3a8a', icon: SwiftNetIcon   },
  { id: 6, name: 'Liquid Telecom',       short: 'Liquid',     type: 'Enterprise ISP', coverage: 'East Africa',       color: '#4f46e5', bg: '#eef2ff', border: '#c7d2fe', textColor: '#3730a3', icon: LiquidIcon     },
  { id: 7, name: 'Poa Internet',         short: 'Poa',        type: 'Community ISP',  coverage: 'Nairobi Low-Cost',  color: '#0891b2', bg: '#ecfeff', border: '#a5f3fc', textColor: '#164e63', icon: PoaIcon        },
  { id: 8, name: 'Telkom Kenya',         short: 'Telkom',     type: '4G / Fibre',     coverage: 'Nationwide',        color: '#0369a1', bg: '#f0f9ff', border: '#bae6fd', textColor: '#0c4a6e', icon: TelkomIcon     },
]

const WHY_LINK = [
  { icon: '⚡', text: 'Seamless failover when your ISP goes down'  },
  { icon: '📊', text: 'Compare speeds & pricing across providers'  },
  { icon: '💳', text: 'Unified billing for all connections'         },
  { icon: '🔄', text: 'Priority switching during peak hours'        },
]

/* ─── Brand SVG icons ─────────────────────────────────────────────────────── */
function SafaricomIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="11" stroke={color} strokeWidth="2" fill="none" />
      <path d="M10 16 Q16 9 22 16 Q16 23 10 16Z" fill={color} />
    </svg>
  )
}
function ZukuIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M7 9h18L9 23h16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function FaibaIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M8 24V12l8-5 8 5v12" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="12" y="17" width="8" height="7" rx="1.5" stroke={color} strokeWidth="2" />
    </svg>
  )
}
function AirtelIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 7C9 7 6 11.5 6 16"     stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M16 7C23 7 26 11.5 26 16"  stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M10 16c0 3.3 2.7 6 6 6s6-2.7 6-6" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.5" fill={color} />
    </svg>
  )
}
function SwiftNetIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <polygon points="6,16 14,8 26,16 14,24" stroke={color} strokeWidth="2.2" strokeLinejoin="round" fill={color} fillOpacity="0.12" />
      <line x1="14" y1="8" x2="14" y2="24" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
function LiquidIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <path d="M16 5C16 5 23 12 23 18C23 21.9 19.9 25 16 25C12.1 25 9 21.9 9 18C9 12 16 5 16 5Z"
        stroke={color} strokeWidth="2.2" fill={color} fillOpacity="0.12" />
    </svg>
  )
}
function PoaIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="19" r="3.2" fill={color} />
      <path d="M9 14Q16 7 23 14"  stroke={color} strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M5 10Q16 2 27 10"  stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.45" />
    </svg>
  )
}
function TelkomIcon({ color, size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="7" y="13" width="18" height="11" rx="2.5" stroke={color} strokeWidth="2.2" fill="none" />
      <path d="M11 13V10Q16 6 21 10V13" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="16" cy="18.5" r="2" fill={color} />
    </svg>
  )
}

/* ─── Code modal ──────────────────────────────────────────────────────────── */
function CodeModal({ provider, onConfirm, onClose }) {
  const [code, setCode]       = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef              = useRef(null)
  const Icon                  = provider.icon

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 80) }, [])

  const handleSubmit = () => {
    const trimmed = code.trim()
    if (trimmed.length < 4) { setError('Enter a valid provider code (min. 4 characters).'); return }
    setError('')
    setLoading(true)
    setTimeout(() => onConfirm(trimmed), 1600)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(10,24,69,0.52)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget && !loading) onClose() }}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden animate-slide-up"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-strong)',
          boxShadow: '0 28px 72px rgba(10,24,69,0.22)',
        }}
      >
        {/* Accent bar */}
        <div style={{ height: 4, background: `linear-gradient(90deg, ${provider.color}, ${provider.color}60)` }} />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: provider.bg, border: `1.5px solid ${provider.border}` }}
              >
                <Icon color={provider.color} size={26} />
              </div>
              <div>
                <p
                  className="font-bold text-base leading-tight"
                  style={{ fontFamily: SERIF, color: 'var(--text-main)', letterSpacing: '-0.01em' }}
                >
                  Link {provider.short}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {provider.type} · {provider.coverage}
                </p>
              </div>
            </div>
            <button
              onClick={onClose} disabled={loading}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--bg-card2)', color: 'var(--text-muted)' }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Info banner */}
          <div
            className="rounded-xl p-3.5 mb-5 flex gap-3"
            style={{ background: 'rgba(27,58,143,0.05)', border: '1px solid rgba(27,58,143,0.12)' }}
          >
            <Lock size={14} style={{ color: 'var(--blue-light)', marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              Find your code in your ISP portal under{' '}
              <strong style={{ color: 'var(--text-main)', fontFamily: SERIF }}>Account → Integration Keys</strong>.
              This authorises DirectCore to manage your connection.
            </p>
          </div>

          {/* Code input */}
          <label
            className="text-xs font-semibold uppercase tracking-widest mb-2 block"
            style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
          >
            Provider Code
          </label>
          <div
            className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-1.5"
            style={{
              background: 'var(--bg)',
              border: `1.5px solid ${error ? '#ef4444' : 'var(--border-strong)'}`,
              transition: 'border-color 0.15s',
            }}
          >
            <span className="text-xs font-bold" style={{ color: 'var(--text-muted)', userSelect: 'none' }}>#</span>
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape' && !loading) onClose() }}
              placeholder="e.g. ISP-AB12-XY99"
              className="flex-1 bg-transparent outline-none text-sm font-mono"
              style={{ color: 'var(--text-main)', letterSpacing: '0.14em' }}
              maxLength={24}
              disabled={loading}
            />
            {code.length > 0 && !loading && (
              <button onClick={() => { setCode(''); setError('') }} style={{ color: 'var(--text-muted)' }}>
                <X size={12} />
              </button>
            )}
          </div>
          {error
            ? <p className="text-xs mb-4" style={{ color: '#ef4444' }}>{error}</p>
            : <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Case-insensitive. Dashes optional.</p>
          }

          {/* Buttons */}
          <div className="flex gap-2.5">
            <button
              onClick={onClose} disabled={loading}
              className="btn-ghost flex-1"
              style={{ padding: '10px 0', fontSize: 13, fontFamily: SERIF, letterSpacing: '0.01em' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || code.trim().length === 0}
              className="btn-primary flex-1"
              style={{ padding: '10px 0', fontSize: 13, fontFamily: SERIF, letterSpacing: '0.01em' }}
            >
              {loading
                ? <><Loader2 size={13} className="animate-spin" /> Linking…</>
                : <><Link2 size={13} /> Confirm & Link</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Provider card ───────────────────────────────────────────────────────── */
function ProviderCard({ p, isLinked, isLinking, onLink, onUnlink }) {
  const Icon = p.icon
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: isLinked ? p.bg : 'var(--bg-card)',
        border: `1px solid ${isLinked ? p.border : hovered ? 'var(--border-strong)' : 'var(--border)'}`,
        boxShadow: hovered || isLinked
          ? `0 4px 24px ${p.color}1a, 0 1px 4px rgba(27,58,143,0.06)`
          : 'var(--shadow)',
        transform: hovered && !isLinked ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Linked top strip */}
      {isLinked && (
        <div style={{ height: 3, background: `linear-gradient(90deg, ${p.color}, ${p.color}50)` }} />
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Icon + badge */}
        <div className="flex items-start justify-between">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: p.bg, border: `1.5px solid ${p.border}` }}
          >
            <Icon color={p.color} size={24} />
          </div>
          {isLinked && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold"
              style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', fontFamily: SERIF }}
            >
              <Check size={10} strokeWidth={2.5} />
              Linked
            </div>
          )}
        </div>

        {/* Name + meta */}
        <div className="flex-1">
          <p
            className="font-bold leading-snug"
            style={{ fontFamily: SERIF, fontSize: 15, color: 'var(--text-main)', letterSpacing: '-0.01em' }}
          >
            {p.name}
          </p>
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-md font-medium mt-1.5"
            style={{ background: p.bg, color: p.textColor, border: `1px solid ${p.border}`, fontFamily: SERIF }}
          >
            {p.type}
          </span>
          <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
            <span style={{ color: p.color }}>📍</span>
            {p.coverage}
          </p>
        </div>

        {/* Action */}
        {isLinked ? (
          <button
            onClick={() => onUnlink(p.id, p.name)}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: 'rgba(239,68,68,0.08)',
              color: '#dc2626',
              border: '1px solid rgba(239,68,68,0.2)',
              fontFamily: SERIF,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
          >
            <Unlink size={11} strokeWidth={2.2} /> Unlink
          </button>
        ) : (
          <button
            onClick={() => onLink(p)}
            disabled={isLinking}
            className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            style={{
              background: isLinking ? p.bg : 'var(--bg-card2)',
              color: isLinking ? p.color : 'var(--text-sub)',
              border: `1px solid ${isLinking ? p.border : 'var(--border)'}`,
              fontFamily: SERIF,
            }}
            onMouseEnter={e => {
              if (!isLinking) {
                e.currentTarget.style.background = p.bg
                e.currentTarget.style.color = p.color
                e.currentTarget.style.border = `1px solid ${p.border}`
              }
            }}
            onMouseLeave={e => {
              if (!isLinking) {
                e.currentTarget.style.background = 'var(--bg-card2)'
                e.currentTarget.style.color = 'var(--text-sub)'
                e.currentTarget.style.border = '1px solid var(--border)'
              }
            }}
          >
            {isLinking
              ? <><Loader2 size={11} className="animate-spin" /> Linking…</>
              : <><Plus size={11} strokeWidth={2.5} /> Link Provider</>
            }
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────────────────── */
export default function LinkProviderPage() {
  const { showToast }                   = useApp()
  const [query, setQuery]               = useState('')
  const [linked, setLinked]             = useState([1])
  const [linking, setLinking]           = useState(null)
  const [modal, setModal]               = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const types = ['All', ...Array.from(new Set(ALL_PROVIDERS.map(p => p.type)))]

  const filtered = ALL_PROVIDERS.filter(p => {
    const q = query.toLowerCase()
    const matchQ = !query ||
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.coverage.toLowerCase().includes(q)
    const matchT = activeFilter === 'All' || p.type === activeFilter
    return matchQ && matchT
  })

  const confirmLink = (provider) => {
    setModal(null)
    setLinking(provider.id)
    setTimeout(() => {
      setLinked(prev => [...prev, provider.id])
      setLinking(null)
      showToast(`${provider.name} linked successfully!`, 'success')
    }, 0)
  }

  const unlink = (id, name) => {
    setLinked(prev => prev.filter(l => l !== id))
    showToast(`${name} unlinked.`, 'info')
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 920 }}>

      {/* ── Page header ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <Wifi size={20} color="var(--orange)" />
          <h1
            className="font-extrabold"
            style={{ fontFamily: SERIF, fontSize: 28, color: 'var(--text-main)', letterSpacing: '-0.02em' }}
          >
            Link Provider
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Connect additional ISPs for failover, unified billing and smart switching
        </p>
        <div
          className="mt-4 h-0.5 w-9 rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--orange), var(--orange-light))' }}
        />
      </div>

      {/* ── Search + counter ── */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="flex items-center gap-2.5 flex-1 rounded-xl px-3.5 py-2.5"
          style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-strong)', boxShadow: 'var(--shadow)' }}
        >
          <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text-main)' }}
            placeholder="Search by name, type or coverage…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>
              <X size={12} />
            </button>
          )}
        </div>
        <div
          className="px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 flex-shrink-0"
          style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', fontFamily: SERIF }}
        >
          <Check size={11} strokeWidth={2.5} />
          {linked.length} / {ALL_PROVIDERS.length} linked
        </div>
      </div>

      {/* ── Filter pills ── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setActiveFilter(t)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={activeFilter === t
              ? { fontFamily: SERIF, background: 'linear-gradient(135deg, var(--orange), var(--orange-dark))', color: 'white', boxShadow: '0 2px 8px rgba(244,120,32,0.3)', border: 'none' }
              : { fontFamily: SERIF, background: 'var(--bg-card)', color: 'var(--text-sub)', border: '1px solid var(--border)' }
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── 4-col grid ── */}
      {filtered.length > 0 ? (
        <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {filtered.map(p => (
            <ProviderCard
              key={p.id} p={p}
              isLinked={linked.includes(p.id)}
              isLinking={linking === p.id}
              onLink={setModal}
              onUnlink={unlink}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl p-12 text-center mb-5 flex flex-col items-center gap-3"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-card2)' }}>
            <Search size={22} style={{ color: 'var(--text-muted)' }} />
          </div>
          <p className="text-sm font-semibold" style={{ fontFamily: SERIF, color: 'var(--text-sub)' }}>
            No providers match "{query || activeFilter}"
          </p>
          <button
            onClick={() => { setQuery(''); setActiveFilter('All') }}
            className="btn-outline text-xs"
            style={{ padding: '8px 18px', fontFamily: SERIF }}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* ── Why link strip ── */}
      <div className="grid grid-cols-4 gap-3">
        {WHY_LINK.map(({ icon, text }) => (
          <div
            key={text}
            className="rounded-xl p-3.5 flex flex-col gap-2"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-orange)' }}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <p className="text-xs leading-relaxed" style={{ fontFamily: SERIF, color: 'var(--text-sub)' }}>
              {text}
            </p>
          </div>
        ))}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <CodeModal
          provider={modal}
          onConfirm={() => confirmLink(modal)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}