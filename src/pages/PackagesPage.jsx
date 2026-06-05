import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, Clock, Infinity, Check, Star, TrendingUp,
  ArrowRight, Tag, Wifi, Search, MapPin, AlertCircle,
  X, ShoppingCart, Info, RefreshCw
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const API    = window.location.origin
const NAS_IP = '102.218.210.12'

/* ── Period / category maps ──────────────────────────────────────── */
const PERIOD_LABELS = {
  HOURLY: '1 Hour', DAILY: '24 Hours', WEEKLY: '7 Days',
  MONTHLY: '30 Days', HOUR: 'Per Hour', DAY: '24 Hours',
}
const CATEGORY_MAP = {
  HOURLY: 'Hourly', DAILY: 'Daily', WEEKLY: 'Weekly',
  MONTHLY: 'Monthly', HOUR: 'Hourly', DAY: 'Daily',
}
const ACCENT_POOL = [
  { accent: '#0F766E', gradient: 'linear-gradient(135deg,#0D5C56,#0F766E)' },
  { accent: '#7C3AED', gradient: 'linear-gradient(135deg,#5B21B6,#7C3AED)' },
  { accent: '#0891B2', gradient: 'linear-gradient(135deg,#0E7490,#0891B2)' },
  { accent: '#F59E0B', gradient: 'linear-gradient(135deg,#D97706,#F59E0B)' },
  { accent: '#EC4899', gradient: 'linear-gradient(135deg,#BE185D,#EC4899)' },
  { accent: '#10B981', gradient: 'linear-gradient(135deg,#059669,#10B981)' },
  { accent: '#EF4444', gradient: 'linear-gradient(135deg,#B91C1C,#EF4444)' },
  { accent: '#6366F1', gradient: 'linear-gradient(135deg,#4338CA,#6366F1)' },
]
const ICONS = [Zap, Star, TrendingUp, Infinity, Wifi]

function mapPackages(raw) {
  return raw.map((p, i) => {
    const colors   = ACCENT_POOL[i % ACCENT_POOL.length]
    const period   = PERIOD_LABELS[p.billingPeriod] || p.billingPeriod || '—'
    const category = CATEGORY_MAP[p.billingPeriod]  || 'Special'
    const dataVal  = p.hasFup && p.fupDataCap
      ? `${p.fupDataCap}${p.fupDataCapUnit ? ' ' + p.fupDataCapUnit : ' GB'}`
      : 'Unlimited'
    const features = [
      p.maxDownloadSpeed && `↓ ${p.maxDownloadSpeed}`,
      p.maxUploadSpeed   && `↑ ${p.maxUploadSpeed}`,
      p.canRoam ? 'Roaming enabled' : 'No roaming',
      p.hasFup  ? `FUP ${dataVal}`  : 'Unlimited data',
      p.unitQuantity && `${p.unitQuantity} ${p.unitOfMeasure?.toLowerCase() || 'units'}`,
    ].filter(Boolean)

    return {
      id:          p.productOfferingPriceId,
      name:        p.packageName,
      description: p.description || '',
      price:       p.price,
      currency:    'KES',
      period,
      category,
      speed:       p.maxDownloadSpeed || '—',
      data:        dataVal,
      features,
      badge:       p.canRoam ? 'Roaming' : null,
      featured:    false,
      icon:        ICONS[i % ICONS.length],
      raw:         p,
      ...colors,
    }
  })
}

/* ── Package card ────────────────────────────────────────────────── */
function PackageCard({ pkg, loading, onChoose }) {
  const Icon = pkg.icon
  return (
    <div
      onClick={() => onChoose(pkg)}
      style={{
        background: 'var(--bg-card)',
        border: `1.5px solid ${pkg.featured ? pkg.accent : 'var(--border)'}`,
        borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow .18s, border-color .18s, transform .18s',
        cursor: 'pointer', position: 'relative',
        boxShadow: pkg.featured ? `0 4px 16px ${pkg.accent}22` : 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = pkg.accent
        e.currentTarget.style.boxShadow   = `0 8px 24px ${pkg.accent}28`
        e.currentTarget.style.transform   = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = pkg.featured ? pkg.accent : 'var(--border)'
        e.currentTarget.style.boxShadow   = pkg.featured ? `0 4px 16px ${pkg.accent}22` : 'var(--shadow-sm)'
        e.currentTarget.style.transform   = 'translateY(0)'
      }}
    >
      {/* Top colour bar */}
      <div style={{ height: 3, background: pkg.gradient, flexShrink: 0 }} />

      <div style={{ padding: '11px 11px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {/* Icon + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: pkg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={13} color="white" strokeWidth={2.2} />
          </div>
          {pkg.badge && (
            <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 20, background: pkg.gradient, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
              {pkg.badge}
            </span>
          )}
        </div>

        {/* Name + period */}
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {pkg.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <Clock size={9} color={pkg.accent} />
            <span style={{ fontSize: 9, fontWeight: 600, color: pkg.accent }}>{pkg.period}</span>
          </div>
        </div>

        {/* Price */}
        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', marginRight: 1 }}>{pkg.currency}</span>
          {pkg.price.toLocaleString()}
        </p>

        {/* Speed + Data chips */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ l: 'Speed', v: pkg.speed }, { l: 'Data', v: pkg.data }].map(({ l, v }) => (
            <div key={l} style={{ flex: 1, background: 'var(--bg)', borderRadius: 6, padding: '4px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 8, color: 'var(--text-muted)' }}>{l}</p>
              <p style={{ margin: '1px 0 0', fontSize: 9, fontWeight: 700, color: pkg.accent, fontFamily: 'var(--font-display)' }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {pkg.features.slice(0, 3).map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: 'var(--text-sub)', lineHeight: 1.3 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: `${pkg.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={7} color={pkg.accent} strokeWidth={3} />
              </div>
              {f}
            </li>
          ))}
          {pkg.features.length > 3 && (
            <li style={{ fontSize: 9, color: pkg.accent, fontWeight: 600, paddingLeft: 16 }}>+{pkg.features.length - 3} more</li>
          )}
        </ul>

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); onChoose(pkg) }}
          style={{
            width: '100%', padding: '7px 0', borderRadius: 8, border: 'none',
            cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 10,
            fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 4, transition: 'opacity .15s', marginTop: 'auto',
            background: pkg.gradient, color: 'white',
            boxShadow: `0 2px 8px ${pkg.accent}28`,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          {loading === pkg.id
            ? <span style={{ width: 10, height: 10, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            : <><span>Choose</span><ArrowRight size={10} /></>
          }
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════
   PAGE
════════════════════════════════════════════════════════════════ */
export default function PackagesPage() {
  const [packages,  setPackages]  = useState([])
  const [fetching,  setFetching]  = useState(true)
  const [fetchErr,  setFetchErr]  = useState(null)
  const [loading,   setLoading]   = useState(null)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('All')

  const { showToast, setActivePlan, user, activeProvider } = useApp()
  const navigate = useNavigate()

  const providerName = activeProvider?.name     ?? 'DirectCore ISP'
  const providerLoc  = activeProvider?.location ?? 'Westlands, Nairobi'

  /* ── Fetch packages ── */
  const fetchPackages = async () => {
    const tenantId = sessionStorage.getItem('onelynq_tenantId') || ''
    setFetching(true); setFetchErr(null)
    try {
      const res    = await fetch(`${API}/api/captive-portal/packages?nasIp=${NAS_IP}&tenantId=${tenantId}`)
      const result = await res.json()
      if (result.success && result.data?.packages) {
        setPackages(mapPackages(result.data.packages))
      } else {
        setFetchErr(result.message || 'Failed to load packages')
      }
    } catch (err) {
      console.error('Packages fetch error:', err)
      setFetchErr('Network error loading packages')
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => { fetchPackages() }, []) // eslint-disable-line

  /* ── Categories ── */
  const categories = useMemo(() => {
    const cats = [...new Set(packages.map(p => p.category))]
    return ['All', ...cats]
  }, [packages])

  /* ── Filter + search ── */
  const visible = useMemo(() => packages.filter(p => {
    const matchFilter = filter === 'All' || p.category === filter
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.data.toLowerCase().includes(search.toLowerCase()) ||
      p.speed.toLowerCase().includes(search.toLowerCase()) ||
      String(p.price).includes(search)
    return matchFilter && matchSearch
  }), [filter, search, packages])

  const handleChoose = (pkg) => {
    setLoading(pkg.id)
    setTimeout(() => { setLoading(null); setActivePlan(pkg); navigate('/payment') }, 600)
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>

      <style>{`
        .pkg-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 900px) { .pkg-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) { .pkg-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 380px) { .pkg-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pkg-fade { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .pkg-grid > * { animation: pkg-fade .3s ease both; }
      `}</style>

      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 6px', borderRadius: 20, background: 'rgba(15,118,110,0.1)', border: '1px solid rgba(15,118,110,0.2)' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#0F766E,#0D5C56)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wifi size={10} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>STEP 1 OF 2</span>
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <MapPin size={11} color="var(--teal)" />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-sub)', fontFamily: 'var(--font-display)' }}>
                {providerName} · {providerLoc}
              </span>
            </div>
          </div>

          <h1 style={{ margin: '0 0 5px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.15 }}>
            Hi {user?.name?.split(' ')[0] || 'there'},{' '}
            <span style={{ background: 'linear-gradient(90deg,#0F766E,#14B8A6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              choose a plan
            </span>
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
            Plans activate instantly · upgrade or switch anytime.
          </p>
        </div>

        {/* Count badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 10, background: 'var(--teal-pale)', border: '1px solid rgba(15,118,110,0.2)', flexShrink: 0 }}>
          {fetching
            ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block', animation: 'spin .7s linear infinite' }} />
            : <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
          }
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-display)' }}>
            {fetching ? 'Loading…' : `${packages.length} plan${packages.length !== 1 ? 's' : ''} available`}
          </span>
        </div>
      </div>

      {/* ── Search + Filter ────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 160px', minWidth: 130 }}>
          <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plans…"
            className="portal-input" style={{ paddingLeft: 30, fontSize: 12, height: 35 }} />
        </div>
        {!fetching && packages.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} style={{
                padding: '5px 13px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                fontFamily: 'var(--font-display)', cursor: 'pointer', border: 'none',
                transition: 'all .15s', whiteSpace: 'nowrap',
                ...(filter === cat
                  ? { background: 'linear-gradient(135deg,#0F766E,#0D5C56)', color: 'white', boxShadow: '0 3px 10px rgba(15,118,110,0.3)' }
                  : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1.5px solid var(--border)' })
              }}>{cat}</button>
            ))}
          </div>
        )}
      </div>

      {/* ── Loading state ─────────────────────────────────────── */}
      {fetching && (
        <div style={{ textAlign: 'center', padding: '56px 0' }}>
          <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'spin .7s linear infinite', margin: '0 auto 14px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Loading packages…</p>
        </div>
      )}

      {/* ── Error state ───────────────────────────────────────── */}
      {fetchErr && !fetching && (
        <div style={{ textAlign: 'center', padding: '56px 0' }}>
          <AlertCircle size={36} color="#F59E0B" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: 'var(--text-sub)', fontSize: 14, margin: '0 0 16px', fontWeight: 600 }}>{fetchErr}</p>
          <button
            onClick={fetchPackages}
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, width: 'auto', padding: '8px 20px', fontSize: 12 }}
          >
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      {/* ── Package grid ──────────────────────────────────────── */}
      {!fetching && !fetchErr && visible.length > 0 && (
        <div className="pkg-grid">
          {visible.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} loading={loading} onChoose={handleChoose} />
          ))}
        </div>
      )}

      {/* ── Empty search ─────────────────────────────────────── */}
      {!fetching && !fetchErr && packages.length > 0 && visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Search size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px', display: 'block' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>No packages match your search.</p>
        </div>
      )}

      {/* ── Promo banner ─────────────────────────────────────── */}
      {!fetching && !fetchErr && (
        <div style={{ marginTop: 20, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: 'var(--bg-card)', border: '1.5px solid rgba(15,118,110,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Tag size={15} color="var(--teal)" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>Refer &amp; Earn</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Get KES 50 credit for every friend you refer</p>
            </div>
          </div>
          <button className="btn-outline" style={{ width: 'auto', padding: '7px 16px', fontSize: 12 }}>Share Referral</button>
        </div>
      )}
    </div>
  )
}