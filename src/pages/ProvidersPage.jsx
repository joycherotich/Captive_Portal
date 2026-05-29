import { useState } from 'react'
import {
  Wifi, MapPin, Phone, Star, ChevronRight,
  RefreshCw, CheckCircle, Clock, PhoneCall
} from 'lucide-react'

const PROVIDERS = [
  {
    id: 1,
    name: 'NetConnect ISP',
    type: 'Primary ISP',
    status: 'active',
    location: 'Westlands, Nairobi',
    phone: '+254 20 123 4567',
    speed: '50 Mbps',
    uptime: '99.8',
    rating: 4.8,
    since: 'Jan 2024',
    initials: 'NC',
    accent: 'green',
  },
  // {
  //   id: 2,
  //   name: 'SwiftNet Kenya',
  //   type: 'Backup ISP',
  //   status: 'inactive',
  //   location: 'CBD, Nairobi',
  //   phone: '+254 20 765 4321',
  //   speed: '20 Mbps',
  //   uptime: '97.2',
  //   rating: 4.2,
  //   since: 'Mar 2024',
  //   initials: 'SN',
  //   accent: 'blue',
  // },
]

const SLA_ROWS = [
  { label: 'SLA Uptime Guarantee', value: '99.5%',     ok: true  },
  { label: 'Fault Response Time',  value: '< 4 hours', ok: true  },
  { label: 'Data Fair Usage',      value: '100 GB/mo', ok: true  },
  { label: 'IP Address Type',      value: 'Dynamic',   ok: false },
]

// ─── Accent tokens ────────────────────────────────────────────────
const ACCENTS = {
  green: {
    color:        '#1a6641',
    avatarBg:     'rgba(26,102,65,0.10)',
    avatarBorder: 'rgba(26,102,65,0.20)',
    badgeBg:      'rgba(26,102,65,0.12)',
    btnBg:        '#1a6641',
    btnShadow:    'rgba(26,102,65,0.30)',
    barBg:        '#1a6641',
  },
  blue: {
    color:        '#1B3A8F',
    avatarBg:     'rgba(27,58,143,0.10)',
    avatarBorder: 'rgba(27,58,143,0.20)',
    badgeBg:      'rgba(27,58,143,0.12)',
    btnBg:        '#1B3A8F',
    btnShadow:    'rgba(27,58,143,0.30)',
    barBg:        '#1B3A8F',
  },
}

// ─── Fonts (inject once) ─────────────────────────────────────────
const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap'

function useGoogleFonts() {
  if (typeof document !== 'undefined' && !document.getElementById('__serif_fonts__')) {
    const link = document.createElement('link')
    link.id   = '__serif_fonts__'
    link.rel  = 'stylesheet'
    link.href = FONT_LINK
    document.head.appendChild(link)
  }
}

// ─── Sub-components ───────────────────────────────────────────────
function StarRow({ rating }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 5 }}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={11}
          fill={i < Math.floor(rating) ? '#f59e0b' : 'none'}
          color="#f59e0b"
        />
      ))}
      <span style={{ fontFamily: 'Lora, serif', fontSize: 12, color: '#888', marginLeft: 4 }}>
        {rating}
      </span>
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div style={{
      background: 'var(--bg-card2, #f5f5f5)',
      borderRadius: 10,
      padding: '10px 12px',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'Lora, serif',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-muted, #888)',
        marginBottom: 3,
      }}>
        {label}
      </p>
      <p style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: 14,
        fontWeight: 600,
        color,
      }}>
        {value}
      </p>
    </div>
  )
}

function ProviderCard({ p, expanded, onToggle, onToast }) {
  const ac = ACCENTS[p.accent]

  return (
    <div style={{
      background: 'var(--bg-card, #fff)',
      border: '0.5px solid var(--border, #e5e7eb)',
      borderRadius: 16,
      overflow: 'hidden',
      transition: 'box-shadow 0.2s',
      boxShadow: expanded
        ? '0 4px 24px rgba(0,0,0,0.10)'
        : '0 1px 4px rgba(0,0,0,0.05)',
    }}>

      {/* ── Header ── */}
      <div
        onClick={onToggle}
        style={{ padding: '18px 20px', cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          {/* Avatar */}
          <div style={{
            width: 50, height: 50, borderRadius: 12, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 15,
            background: ac.avatarBg,
            border: `1px solid ${ac.avatarBorder}`,
            color: ac.color,
          }}>
            {p.initials}
          </div>

          {/* Name block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 2 }}>
              <span style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 15, fontWeight: 700,
                color: 'var(--text-main, #111)',
              }}>
                {p.name}
              </span>
              <span style={{
                fontFamily: 'Lora, serif',
                fontSize: 11, fontWeight: 600,
                padding: '2px 9px', borderRadius: 20,
                background: p.status === 'active' ? ac.badgeBg : 'var(--bg-card2, #f5f5f5)',
                color: p.status === 'active' ? ac.color : 'var(--text-muted, #888)',
              }}>
                {p.status === 'active' ? '● Active' : '○ Inactive'}
              </span>
            </div>
            <p style={{
              fontFamily: 'Lora, serif', fontStyle: 'italic',
              fontSize: 12, color: 'var(--text-muted, #888)',
            }}>
              {p.type}
            </p>
            <StarRow rating={p.rating} />
          </div>

          {/* Chevron */}
          <ChevronRight
            size={18}
            style={{
              color: 'var(--text-muted, #aaa)',
              flexShrink: 0,
              marginTop: 2,
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          <StatBox label="Speed"  value={p.speed}         color={ac.color} />
          <StatBox label="Uptime" value={`${p.uptime}%`}  color={ac.color} />
          <StatBox label="Since"  value={p.since}         color={ac.color} />
        </div>
      </div>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div style={{
          padding: '16px 20px 20px',
          borderTop: '0.5px solid var(--border, #e5e7eb)',
        }}>
          {/* Meta */}
          <div style={{ marginBottom: 14 }}>
            {[
              { icon: MapPin, text: p.location },
              { icon: Phone,  text: p.phone    },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: 'Lora, serif', fontSize: 13,
                color: 'var(--text-sub, #555)', marginBottom: 7,
              }}>
                <Icon size={13} color={ac.color} />
                {text}
              </div>
            ))}
          </div>

          {/* Uptime bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: 'Lora, serif', fontSize: 12, marginBottom: 6,
            }}>
              <span style={{ color: 'var(--text-muted, #888)' }}>Network uptime (30d)</span>
              <span style={{ color: ac.color, fontWeight: 600 }}>{p.uptime}%</span>
            </div>
            <div style={{
              height: 5, borderRadius: 3,
              background: 'var(--bg-card2, #f0f0f0)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 3,
                width: `${p.uptime}%`,
                background: ac.barBg,
                transition: 'width 0.7s ease',
              }} />
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => onToast(`Switched to ${p.name}`)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                fontFamily: 'Lora, serif', fontSize: 13, fontWeight: 600,
                color: '#fff', background: ac.btnBg, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                boxShadow: `0 3px 12px ${ac.btnShadow}`,
                transition: 'opacity 0.15s, transform 0.1s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1';   e.currentTarget.style.transform = 'translateY(0)'  }}
            >
              <RefreshCw size={13} /> Switch to this
            </button>
            <button
              onClick={() => onToast('Support ticket created')}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10,
                fontFamily: 'Lora, serif', fontSize: 13, fontWeight: 600,
                background: 'transparent',
                border: '0.5px solid var(--border-strong, #ccc)',
                color: 'var(--text-sub, #555)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card2, #f5f5f5)'; e.currentTarget.style.color = ac.color }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-sub, #555)' }}
            >
              <PhoneCall size={13} /> Contact ISP
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Toast({ message }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 50,
      background: 'var(--text-main, #111)',
      color: 'var(--bg-card, #fff)',
      fontFamily: 'Lora, serif', fontSize: 13, fontWeight: 500,
      padding: '10px 16px', borderRadius: 10,
      display: 'flex', alignItems: 'center', gap: 8,
      boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
      animation: 'slideUp 0.25s ease',
    }}>
      <CheckCircle size={15} color="#4ade80" />
      {message}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────
export default function ProvidersPage() {
  useGoogleFonts()

  const [selected, setSelected] = useState(null)
  const [toast, setToast]       = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }

  return (
    <div style={{ maxWidth: 620, fontFamily: 'Lora, serif' }}>
      <style>{`@keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <Wifi size={22} color="#d97706" />
          <h1 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 26, fontWeight: 700,
            color: 'var(--text-main, #111)',
            letterSpacing: '-0.02em', margin: 0,
          }}>
            My Providers
          </h1>
        </div>
        <p style={{
          fontFamily: 'Lora, serif', fontStyle: 'italic',
          fontSize: 14, color: 'var(--text-muted, #888)',
        }}>
          View and manage your network providers
        </p>
        <div style={{
          marginTop: 14, height: 2, width: 42, borderRadius: 2,
          background: 'linear-gradient(90deg, #d97706, #fbbf24)',
        }} />
      </div>

      {/* Provider cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 16 }}>
        {PROVIDERS.map(p => (
          <ProviderCard
            key={p.id}
            p={p}
            expanded={selected === p.id}
            onToggle={() => setSelected(selected === p.id ? null : p.id)}
            onToast={showToast}
          />
        ))}
      </div>

      {/* Service Agreements */}
      <div style={{
        background: 'var(--bg-card, #fff)',
        border: '0.5px solid var(--border, #e5e7eb)',
        borderRadius: 16, padding: '18px 20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <h3 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 16, fontWeight: 600,
          color: 'var(--text-main, #111)',
          letterSpacing: '-0.01em', marginBottom: 14,
        }}>
          Service agreements
        </h3>
        {SLA_ROWS.map(({ label, value, ok }, i) => (
          <div
            key={label}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i < SLA_ROWS.length - 1 ? '0.5px solid var(--border, #e5e7eb)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {ok
                ? <CheckCircle size={13} color="#1a6641" />
                : <Clock size={13} color="#d97706" />
              }
              <span style={{
                fontFamily: 'Lora, serif', fontSize: 13,
                color: 'var(--text-sub, #555)',
              }}>
                {label}
              </span>
            </div>
            <span style={{
              fontFamily: 'Lora, serif', fontSize: 13, fontWeight: 600,
              color: ok ? 'var(--text-main, #111)' : 'var(--text-muted, #888)',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {toast && <Toast message={toast} />}
    </div>
  )
}