import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wifi, MapPin, Phone, Star, ChevronRight,
  RefreshCw, CheckCircle, Clock, PhoneCall,
  Home, Briefcase, Globe, X, Tag,
  Settings, WifiOff, AlertCircle,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

/* ── Category config ─────────────────────────────────── */
const CATEGORIES = [
  { id: 'home',    label: 'Home',    icon: Home,      color: '#0F766E', bg: '#F0FDFA', border: 'rgba(15,118,110,0.25)' },
  { id: 'office',  label: 'Office',  icon: Briefcase, color: '#0369A1', bg: '#F0F9FF', border: 'rgba(3,105,161,0.25)'  },
  { id: 'roaming', label: 'Roaming', icon: Globe,     color: '#7C3AED', bg: '#FAF5FF', border: 'rgba(124,58,237,0.25)' },
]

const SLA_ROWS = [
  { label: 'SLA Uptime Guarantee', value: '99.5%',     ok: true  },
  { label: 'Fault Response Time',  value: '< 4 hours', ok: true  },
  { label: 'Data Fair Usage',      value: '100 GB/mo', ok: true  },
  { label: 'IP Address Type',      value: 'Dynamic',   ok: false },
]

/* ── Read olUser from sessionStorage ─────────────────── */
function getOlUser() {
  try { return JSON.parse(sessionStorage.getItem('olUser') || '{}') } catch { return {} }
}

/* ── Helpers ─────────────────────────────────────────── */
function StarRow({ rating }) {
  if (!rating) return null
  return (
    <div className="flex items-center gap-0.5 mt-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={11} fill={i < Math.floor(rating) ? '#F59E0B' : 'none'} color="#F59E0B" />
      ))}
      <span className="text-xs ml-1.5" style={{ color: 'var(--text-muted)' }}>{rating}</span>
    </div>
  )
}

function CategoryPill({ cat, onRemove }) {
  const cfg = CATEGORIES.find(c => c.id === cat)
  if (!cfg) return null
  const Icon = cfg.icon
  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
      <Icon size={10} />
      {cfg.label}
      {onRemove && (
        <button onClick={e => { e.stopPropagation(); onRemove(cat) }}
          className="ml-0.5 rounded-full hover:opacity-70 transition-opacity">
          <X size={10} />
        </button>
      )}
    </div>
  )
}

function CategoryEditor({ providerName, current, onSave, onClose }) {
  const [selected, setSelected] = useState([...current])
  const toggle = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 animate-slide-up"
        style={{ boxShadow: 'var(--shadow-lg)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold" style={{ color: 'var(--text-main)' }}>Manage Categories</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{providerName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 transition-all"
            style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
          Where do you use this provider?
        </p>
        <div className="space-y-2 mb-6">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isOn = selected.includes(cat.id)
            return (
              <button key={cat.id} onClick={() => toggle(cat.id)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all text-left"
                style={{
                  background: isOn ? cat.bg : 'var(--bg)',
                  border: `1.5px solid ${isOn ? cat.border : 'var(--border)'}`,
                  boxShadow: isOn ? `0 2px 8px ${cat.border}` : 'none',
                }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: isOn ? cat.color : '#E2E8F0' }}>
                  <Icon size={15} color={isOn ? 'white' : '#94A3B8'} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{ color: isOn ? cat.color : 'var(--text-main)' }}>{cat.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {cat.id === 'home'    && 'Your residential connection'}
                    {cat.id === 'office'  && 'Workplace or business use'}
                    {cat.id === 'roaming' && 'When travelling or mobile'}
                  </p>
                </div>
                <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ borderColor: isOn ? cat.color : '#CBD5E1', background: isOn ? cat.color : 'transparent' }}>
                  {isOn && <CheckCircle size={10} color="white" fill="white" />}
                </div>
              </button>
            )
          })}
        </div>
        <button className="btn-primary" onClick={() => { onSave(selected); onClose() }}>
          <CheckCircle size={15} /> Save Categories
        </button>
      </div>
    </div>
  )
}

function ProviderCard({ p, expanded, onToggle, onCategoryUpdate, onSwitch }) {
  const [showCatEditor, setShowCatEditor] = useState(false)
  const navigate = useNavigate()

  const handleSwitch = (e) => {
    e.stopPropagation()
    onSwitch(p)
    navigate('/packages')
  }

  return (
    <>
      <div className="card-elevated rounded-2xl overflow-hidden transition-all"
        style={{
          boxShadow: expanded ? 'var(--shadow-md)' : 'var(--shadow-sm)',
          border: p.status === 'active' ? '1.5px solid rgba(15,118,110,0.2)' : '1px solid var(--border)',
        }}>

        <div className="h-1 w-full" style={{
          background: p.status === 'active'
            ? 'linear-gradient(90deg, #0F766E, #14B8A6)'
            : 'linear-gradient(90deg, #CBD5E1, #E2E8F0)',
        }} />

        <div className="p-5 cursor-pointer select-none" onClick={onToggle}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{
                background: p.status === 'active' ? 'rgba(15,118,110,0.1)' : 'var(--bg)',
                border: p.status === 'active' ? '1px solid rgba(15,118,110,0.2)' : '1px solid var(--border)',
                color: p.status === 'active' ? 'var(--teal)' : 'var(--text-muted)',
                fontFamily: 'var(--font-display)',
              }}>
              {p.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{p.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={p.status === 'active'
                    ? { background: '#F0FDFA', color: 'var(--teal)', border: '1px solid rgba(15,118,110,0.2)' }
                    : { background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {p.status === 'active' ? '● Active' : '○ Inactive'}
                </span>
              </div>
              <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{p.companyName ?? '—'}</p>
              {p.rating && <StarRow rating={p.rating} />}

              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {(p.categories ?? []).length > 0
                  ? (p.categories ?? []).map(c => (
                      <CategoryPill key={c} cat={c}
                        onRemove={cat => onCategoryUpdate(p.id, (p.categories ?? []).filter(x => x !== cat))} />
                    ))
                  : <span className="text-xs" style={{ color: 'var(--text-muted)' }}>No categories set</span>
                }
                <button
                  onClick={e => { e.stopPropagation(); setShowCatEditor(true) }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold transition-all hover:opacity-80"
                  style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px dashed #CBD5E1' }}>
                  <Tag size={9} /> Edit
                </button>
              </div>
            </div>

            <ChevronRight size={17} style={{
              color: 'var(--text-muted)', flexShrink: 0, marginTop: 2,
              transition: 'transform 0.2s',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }} />
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { l: 'Mode',  v: p.mode ?? '—' },
              { l: 'Plan',  v: p.plan ?? 'No plan' },
              { l: 'Data',  v: p.dataTotal > 0 ? `${p.dataTotal} GB` : 'Unlimited' },
            ].map(({ l, v }) => (
              <div key={l} className="rounded-xl p-2.5 text-center" style={{ background: 'var(--bg)' }}>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{l}</p>
                <p className="text-xs font-bold" style={{ color: 'var(--teal)' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {expanded && (
          <div className="px-5 pb-5 pt-0" style={{ borderTop: '1px solid var(--border)' }}>
            <div className="pt-4 space-y-2 mb-4">
              {[
                p.email && { icon: Phone, text: p.email },
                p.phone && { icon: Phone, text: p.phone },
              ].filter(Boolean).map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-sub)' }}>
                  <Icon size={13} color="var(--teal)" /> {text}
                </div>
              ))}
            </div>

            {/* Data usage bar */}
            {p.dataTotal > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: 'var(--text-muted)' }}>Data used</span>
                  <span className="font-semibold" style={{ color: 'var(--teal)' }}>
                    {p.dataUsed} / {p.dataTotal} GB
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min((p.dataUsed / p.dataTotal) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, #0D5C56, #14B8A6)',
                    }} />
                </div>
              </div>
            )}

            <div className="rounded-2xl p-3.5 mb-4 flex items-center justify-between"
              style={{ background: 'var(--teal-pale)', border: '1px solid rgba(15,118,110,0.15)' }}>
              <div className="flex items-center gap-2">
                <Settings size={14} color="var(--teal)" />
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--teal-dark)' }}>Categories</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {(p.categories ?? []).length > 0
                      ? (p.categories ?? []).map(c => CATEGORIES.find(x => x.id === c)?.label).join(', ')
                      : 'None assigned'}
                  </p>
                </div>
              </div>
              <button onClick={e => { e.stopPropagation(); setShowCatEditor(true) }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
                style={{ background: 'var(--teal)', color: 'white' }}>
                Manage
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={handleSwitch}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: 'linear-gradient(135deg, #0F766E, #0D5C56)', boxShadow: '0 3px 12px rgba(15,118,110,0.3)' }}>
                <RefreshCw size={14} /> Switch Location
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'var(--bg)', color: 'var(--text-sub)', border: '1px solid var(--border)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--teal)'; e.currentTarget.style.borderColor = 'rgba(15,118,110,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-sub)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                <PhoneCall size={14} /> Contact ISP
              </button>
            </div>
          </div>
        )}
      </div>

      {showCatEditor && (
        <CategoryEditor
          providerName={p.name}
          current={p.categories ?? []}
          onSave={cats => onCategoryUpdate(p.id, cats)}
          onClose={() => setShowCatEditor(false)}
        />
      )}
    </>
  )
}

/* ── Page ────────────────────────────────────────────── */
export default function ProvidersPage() {
  const { showToast, setActiveProvider } = useApp()
  const navigate = useNavigate()

  // Read provider directly from olUser in sessionStorage — no API call needed
  const olUser = getOlUser()

  const providerName = olUser.provider ?? olUser.companyName ?? null

  // Build a single normalised provider card from the session data
  const [providers, setProviders] = useState(() => {
    if (!providerName) return []
    return [{
      id:          olUser.partyId ?? 'session-provider',
      name:        providerName,
      companyName: olUser.companyName ?? providerName,
      status:      olUser.mode === 'onnet' ? 'active' : 'inactive',
      mode:        olUser.mode ?? null,
      plan:        olUser.plan ?? null,
      dataUsed:    olUser.dataUsed ?? 0,
      dataTotal:   olUser.dataTotal ?? 0,
      expiry:      olUser.expiry ?? null,
      email:       olUser.email ?? null,
      phone:       olUser.phone ?? null,
      rating:      null,
      initials:    providerName.slice(0, 2).toUpperCase(),
      categories:  [],
    }]
  })

  const [expanded, setExpanded] = useState(null)

  const updateCategories = (id, cats) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, categories: cats } : p))
    showToast('Categories updated', 'success')
  }

  const handleSwitch = (provider) => {
    setActiveProvider?.({ id: provider.id, name: provider.name })
    showToast(`Switched to ${provider.name} — loading packages…`, 'success')
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Wifi size={20} color="var(--teal)" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>Providers</h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Manage your ISP connections
        </p>
        <div className="mt-3 h-0.5 w-10 rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--teal), var(--teal-light))' }} />
      </div>

      {/* Category legend */}
      {providers.length > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Categories:</span>
          {CATEGORIES.map(c => {
            const Icon = c.icon
            return (
              <div key={c.id} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                <Icon size={10} />{c.label}
              </div>
            )
          })}
        </div>
      )}

      {/* No provider */}
      {providers.length === 0 && (
        <div className="card-elevated rounded-2xl p-10 flex flex-col items-center gap-3 mb-5 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-1"
            style={{ background: 'rgba(15,118,110,0.08)' }}>
            <WifiOff size={26} color="var(--teal)" />
          </div>
          <p className="font-bold text-base" style={{ color: 'var(--text-main)' }}>No provider found</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Please log in again to load your provider.
          </p>
        </div>
      )}

      {/* Provider cards */}
      {providers.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {providers.map(p => (
            <ProviderCard
              key={p.id}
              p={p}
              expanded={expanded === p.id}
              onToggle={() => setExpanded(expanded === p.id ? null : p.id)}
              onCategoryUpdate={updateCategories}
              onSwitch={handleSwitch}
            />
          ))}
        </div>
      )}

      {/* SLA */}
      {providers.length > 0 && (
        <div className="card-elevated rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-main)' }}>Service Agreements</h3>
          {SLA_ROWS.map(({ label, value, ok }, i) => (
            <div key={label} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: i < SLA_ROWS.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div className="flex items-center gap-2">
                {ok
                  ? <CheckCircle size={13} color="var(--teal)" />
                  : <Clock size={13} color="var(--warning)" />
                }
                <span className="text-sm" style={{ color: 'var(--text-sub)' }}>{label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: ok ? 'var(--text-main)' : 'var(--text-muted)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}