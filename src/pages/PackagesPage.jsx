import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, Clock, Infinity, Check, Star, TrendingUp,
  ArrowRight, Tag, Wifi, Search, MapPin, AlertCircle,
  X, ShoppingCart, Info
} from 'lucide-react'
import { useApp } from '../context/AppContext'

/* ── Package data ────────────────────────────────────────────────── */
const PACKAGES = [
  // Hourly
  { id:1,  name:'Flash',      price:20,    currency:'KES', period:'1 Hour',   category:'Hourly',  speed:'5 Mbps',   data:'500 MB',     features:['WhatsApp & Social','Basic Browsing','Email Access'],          accent:'#4D78E8', gradient:'linear-gradient(135deg,#1B3A8F,#2E54C4)', badge:null,          icon:Zap },
  { id:5,  name:'Turbo',      price:50,    currency:'KES', period:'3 Hours',  category:'Hourly',  speed:'15 Mbps',  data:'1 GB',       features:['HD Streaming','All Social','Fast Browse'],                    accent:'#4D78E8', gradient:'linear-gradient(135deg,#1B3A8F,#2E54C4)', badge:null,          icon:Zap },
  { id:6,  name:'Night',      price:60,    currency:'KES', period:'8 Hours',  category:'Hourly',  speed:'10 Mbps',  data:'1.5 GB',     features:['Night Hours Only','Social Media','Streaming'],                accent:'#6366F1', gradient:'linear-gradient(135deg,#4338CA,#6366F1)', badge:'Night Only',   icon:Star },
  { id:7,  name:'Blitz',      price:30,    currency:'KES', period:'2 Hours',  category:'Hourly',  speed:'8 Mbps',   data:'750 MB',     features:['Social Media','Light Streaming','Email'],                     accent:'#EC4899', gradient:'linear-gradient(135deg,#BE185D,#EC4899)', badge:null,          icon:Zap },
  { id:8,  name:'Rush',       price:80,    currency:'KES', period:'5 Hours',  category:'Hourly',  speed:'12 Mbps',  data:'2 GB',       features:['All Social','Video Calls','Gaming Boost'],                    accent:'#F59E0B', gradient:'linear-gradient(135deg,#D97706,#F59E0B)', badge:'Limited',      icon:TrendingUp },
  // Daily
  { id:2,  name:'Daily',      price:100,   currency:'KES', period:'24 Hours', category:'Daily',   speed:'10 Mbps',  data:'2 GB',       features:['All Social Media','Video Streaming','Gaming'],                accent:'#0F766E', gradient:'linear-gradient(135deg,#0D5C56,#0F766E)', badge:'Popular',      icon:TrendingUp, featured:true },
  { id:9,  name:'Day Pro',    price:150,   currency:'KES', period:'24 Hours', category:'Daily',   speed:'20 Mbps',  data:'5 GB',       features:['HD Video','Priority Support','All Apps'],                     accent:'#10B981', gradient:'linear-gradient(135deg,#059669,#10B981)', badge:'Pro',          icon:Star },
  { id:10, name:'Day Lite',   price:70,    currency:'KES', period:'24 Hours', category:'Daily',   speed:'5 Mbps',   data:'1 GB',       features:['Social Media Only','WhatsApp Calls','Basic Browsing'],        accent:'#64748B', gradient:'linear-gradient(135deg,#475569,#64748B)', badge:null,          icon:Zap },
  // Weekly
  { id:3,  name:'Weekly',     price:500,   currency:'KES', period:'7 Days',   category:'Weekly',  speed:'20 Mbps',  data:'10 GB',      features:['Everything in Daily','4K Streaming','Priority Queue'],        accent:'#7C3AED', gradient:'linear-gradient(135deg,#5B21B6,#7C3AED)', badge:'Best Value',   icon:Star },
  { id:11, name:'Week Pro',   price:750,   currency:'KES', period:'7 Days',   category:'Weekly',  speed:'30 Mbps',  data:'20 GB',      features:['4K Streaming','Gaming','VPN Access','Priority Support'],      accent:'#8B5CF6', gradient:'linear-gradient(135deg,#6D28D9,#8B5CF6)', badge:'Pro',          icon:TrendingUp },
  { id:12, name:'Week Lite',  price:300,   currency:'KES', period:'7 Days',   category:'Weekly',  speed:'10 Mbps',  data:'5 GB',       features:['Social Media','Standard Streaming','Email'],                  accent:'#A78BFA', gradient:'linear-gradient(135deg,#7C3AED,#A78BFA)', badge:null,          icon:Zap },
  { id:13, name:'Family',     price:900,   currency:'KES', period:'7 Days',   category:'Weekly',  speed:'30 Mbps',  data:'30 GB',      features:['Up to 5 Devices','4K Streaming','Parental Controls'],        accent:'#F43F5E', gradient:'linear-gradient(135deg,#BE123C,#F43F5E)', badge:'Family',       icon:Star },
  // Monthly
  { id:4,  name:'Monthly',    price:1500,  currency:'KES', period:'30 Days',  category:'Monthly', speed:'50 Mbps',  data:'Unlimited',  features:['Unlimited Data','Fastest Speeds','Static IP'],               accent:'#0891B2', gradient:'linear-gradient(135deg,#0E7490,#0891B2)', badge:'Enterprise',   icon:Infinity },
  { id:14, name:'Month Lite', price:800,   currency:'KES', period:'30 Days',  category:'Monthly', speed:'20 Mbps',  data:'30 GB',      features:['All Social Media','HD Streaming','Email & Work Apps'],       accent:'#0EA5E9', gradient:'linear-gradient(135deg,#0284C7,#0EA5E9)', badge:null,          icon:TrendingUp },
  { id:15, name:'Month Pro',  price:2500,  currency:'KES', period:'30 Days',  category:'Monthly', speed:'100 Mbps', data:'Unlimited',  features:['100 Mbps Speed','Dedicated IP','24/7 Support','SLA 99.9%'],  accent:'#06B6D4', gradient:'linear-gradient(135deg,#0891B2,#06B6D4)', badge:'Pro',          icon:Star },
  { id:16, name:'Business',   price:5000,  currency:'KES', period:'30 Days',  category:'Monthly', speed:'200 Mbps', data:'Unlimited',  features:['200 Mbps','5 Static IPs','SLA Guarantee','Account Manager'],accent:'#14B8A6', gradient:'linear-gradient(135deg,#0F766E,#14B8A6)', badge:'Business',     icon:Infinity },
  // Special
  { id:17, name:'Weekend',    price:250,   currency:'KES', period:'Sat–Sun',  category:'Special', speed:'25 Mbps',  data:'8 GB',       features:['Sat & Sun Only','4K Streaming','Gaming','All Social'],       accent:'#FB923C', gradient:'linear-gradient(135deg,#EA580C,#FB923C)', badge:'Weekend',      icon:Star },
  { id:18, name:'Student',    price:400,   currency:'KES', period:'30 Days',  category:'Special', speed:'15 Mbps',  data:'15 GB',      features:['Study Apps Priority','Video Lectures','Social Media'],       accent:'#34D399', gradient:'linear-gradient(135deg,#059669,#34D399)', badge:'Student',      icon:TrendingUp },
  { id:19, name:'Social',     price:55,    currency:'KES', period:'24 Hours', category:'Special', speed:'5 Mbps',   data:'Unlimited*', features:['Facebook','TikTok','Instagram','Twitter/X','WhatsApp'],      accent:'#818CF8', gradient:'linear-gradient(135deg,#4F46E5,#818CF8)', badge:'Social Only',  icon:Zap },
  { id:20, name:'Gamer',      price:350,   currency:'KES', period:'7 Days',   category:'Special', speed:'40 Mbps',  data:'15 GB',      features:['Low Latency <10ms','Gaming Servers Priority','Discord'],     accent:'#EF4444', gradient:'linear-gradient(135deg,#B91C1C,#EF4444)', badge:'Gamer',        icon:Zap },
]

/* ── Provider → available package IDs (location-based mock) ─────── */
const PROVIDER_PACKAGES = {
  1: [1, 2, 3, 4, 5, 9, 11, 17, 18],   // DirectCore Westlands
  2: [2, 3, 4, 10, 12, 14, 15, 16, 19], // Zuku Kilimani
  default: [2, 3, 4, 9, 14],            // fallback
}

/* ── "Not available" modal ───────────────────────────────────────── */
function UnavailableModal({ pkg, providerName, onBuyAnyway, onClose }) {
  if (!pkg) return null
  const Icon = pkg.icon
  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-sm p-6 animate-slide-up"
        style={{ boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: pkg.gradient }}>
              <Icon size={18} color="white" />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{pkg.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{pkg.period} · {pkg.speed}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 transition-all"
            style={{ color: 'var(--text-muted)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Warning box */}
        <div className="rounded-2xl p-4 mb-5 flex items-start gap-3"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}>
          <AlertCircle size={17} color="#F59E0B" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: '#92400E' }}>
              Not available at your location
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#A16207' }}>
              This package is not offered by <strong>{providerName || 'your current provider'}</strong> in your area.
              You can still purchase it, but you won't be able to connect until you're in a supported coverage zone.
            </p>
          </div>
        </div>

        {/* Package summary */}
        <div className="rounded-xl p-3 mb-5" style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
          <div className="flex justify-between text-sm mb-1.5">
            <span style={{ color: 'var(--text-muted)' }}>Plan</span>
            <span className="font-semibold" style={{ color: 'var(--text-main)' }}>{pkg.name} · {pkg.period}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: 'var(--text-muted)' }}>Price</span>
            <span className="font-bold" style={{ color: 'var(--teal)' }}>
              {pkg.currency} {pkg.price.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button onClick={onBuyAnyway} className="btn-primary">
            <ShoppingCart size={14} /> Buy Anyway (won't connect yet)
          </button>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'var(--bg)', color: 'var(--text-sub)', border: '1px solid var(--border)' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Package card ────────────────────────────────────────────────── */
function PackageCard({ pkg, available, loading, onChoose, onUnavailable }) {
  const Icon = pkg.icon

  return (
    <div
      onClick={() => available ? onChoose(pkg) : onUnavailable(pkg)}
      style={{
        background: available ? 'var(--bg-card)' : '#FAFAFA',
        border: `1.5px solid ${pkg.featured && available ? pkg.accent : available ? 'var(--border)' : '#E2E8F0'}`,
        borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'box-shadow .18s, border-color .18s, transform .18s',
        cursor: 'pointer', position: 'relative',
        boxShadow: pkg.featured && available ? `0 4px 16px ${pkg.accent}22` : 'var(--shadow-sm)',
        opacity: available ? 1 : 0.72,
      }}
      onMouseEnter={e => {
        if (available) {
          e.currentTarget.style.borderColor = pkg.accent
          e.currentTarget.style.boxShadow = `0 8px 24px ${pkg.accent}28`
          e.currentTarget.style.transform = 'translateY(-2px)'
        } else {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = pkg.featured && available ? pkg.accent : available ? 'var(--border)' : '#E2E8F0'
        e.currentTarget.style.boxShadow = pkg.featured && available ? `0 4px 16px ${pkg.accent}22` : 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Top bar */}
      <div style={{ height: 3, background: available ? pkg.gradient : 'linear-gradient(90deg,#CBD5E1,#E2E8F0)', flexShrink: 0 }} />

      {/* Not available overlay tag */}
      {!available && (
        <div style={{
          position: 'absolute', top: 8, right: 8, zIndex: 2,
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '2px 7px', borderRadius: 99,
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.3)',
        }}>
          <MapPin size={8} color="#F59E0B" />
          <span style={{ fontSize: 8, fontWeight: 700, color: '#D97706', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
            NOT IN AREA
          </span>
        </div>
      )}

      <div style={{ padding: '11px 11px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {/* Icon + badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: available ? pkg.gradient : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={13} color={available ? 'white' : '#94A3B8'} strokeWidth={2.2} />
          </div>
          {pkg.badge && available && (
            <span style={{ fontSize: 8, fontWeight: 800, padding: '2px 6px', borderRadius: 20, background: pkg.gradient, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
              {pkg.badge}
            </span>
          )}
        </div>

        {/* Name + period */}
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: available ? 'var(--text-main)' : 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {pkg.name}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <Clock size={9} color={available ? pkg.accent : '#CBD5E1'} />
            <span style={{ fontSize: 9, fontWeight: 600, color: available ? pkg.accent : '#CBD5E1' }}>{pkg.period}</span>
          </div>
        </div>

        {/* Price */}
        <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: available ? 'var(--text-main)' : 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1 }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', marginRight: 1 }}>{pkg.currency}</span>
          {pkg.price.toLocaleString()}
        </p>

        {/* Speed + Data */}
        <div style={{ display: 'flex', gap: 4 }}>
          {[{ l: 'Speed', v: pkg.speed }, { l: 'Data', v: pkg.data }].map(({ l, v }) => (
            <div key={l} style={{ flex: 1, background: available ? 'var(--bg)' : '#F1F5F9', borderRadius: 6, padding: '4px 4px', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 8, color: 'var(--text-muted)' }}>{l}</p>
              <p style={{ margin: '1px 0 0', fontSize: 9, fontWeight: 700, color: available ? pkg.accent : '#CBD5E1', fontFamily: 'var(--font-display)' }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
          {pkg.features.slice(0, 3).map(f => (
            <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: available ? 'var(--text-sub)' : 'var(--text-muted)', lineHeight: 1.3 }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: available ? `${pkg.accent}18` : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={7} color={available ? pkg.accent : '#CBD5E1'} strokeWidth={3} />
              </div>
              {f}
            </li>
          ))}
          {pkg.features.length > 3 && (
            <li style={{ fontSize: 9, color: available ? pkg.accent : '#CBD5E1', fontWeight: 600, paddingLeft: 16 }}>+{pkg.features.length - 3} more</li>
          )}
        </ul>

        {/* CTA */}
        <button
          onClick={e => { e.stopPropagation(); available ? onChoose(pkg) : onUnavailable(pkg) }}
          style={{
            width: '100%', padding: '7px 0', borderRadius: 8, border: available ? 'none' : '1px dashed #CBD5E1',
            cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 10,
            fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 4, transition: 'opacity .15s', marginTop: 'auto',
            background: available ? pkg.gradient : 'transparent',
            color: available ? 'white' : '#94A3B8',
            boxShadow: available ? `0 2px 8px ${pkg.accent}28` : 'none',
          }}
          onMouseEnter={e => { if (available) e.currentTarget.style.opacity = '0.85' }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
        >
          {loading === pkg.id
            ? <span style={{ width: 10, height: 10, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: available ? 'white' : '#94A3B8', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
            : available
            ? <><span>Choose</span><ArrowRight size={10} /></>
            : <><Info size={10} /><span>Not in area</span></>
          }
        </button>
      </div>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function PackagesPage() {
  const [loading,          setLoading]          = useState(null)
  const [search,           setSearch]           = useState('')
  const [filter,           setFilter]           = useState('All')
  const [unavailablePkg,   setUnavailablePkg]   = useState(null)
  const { showToast, setActivePlan, user, activeProvider } = useApp()
  const navigate = useNavigate()

  /* Which provider is active — from context (set when switching in ProvidersPage) */
  const providerId   = activeProvider?.id ?? 1
  const providerName = activeProvider?.name ?? 'DirectCore ISP'
  const providerLoc  = activeProvider?.location ?? 'Westlands, Nairobi'

  /* Available package IDs for this provider/location */
  const availableIds = useMemo(() =>
    new Set(PROVIDER_PACKAGES[providerId] ?? PROVIDER_PACKAGES.default),
    [providerId]
  )

  /* All categories */
  const categories = useMemo(() => {
    const cats = [...new Set(PACKAGES.map(p => p.category))]
    return ['All', ...cats]
  }, [])

  /* Filter + search */
  const visible = useMemo(() => PACKAGES.filter(p => {
    const matchFilter = filter === 'All' || p.category === filter
    const matchSearch = !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.data.toLowerCase().includes(search.toLowerCase()) ||
      p.speed.toLowerCase().includes(search.toLowerCase()) ||
      String(p.price).includes(search)
    return matchFilter && matchSearch
  }), [filter, search])

  /* Split: available first, then unavailable */
  const availableVisible   = visible.filter(p => availableIds.has(p.id))
  const unavailableVisible = visible.filter(p => !availableIds.has(p.id))

  const handleChoose = (pkg) => {
    setLoading(pkg.id)
    setTimeout(() => { setLoading(null); setActivePlan(pkg); navigate('/payment') }, 600)
  }

  const handleBuyAnyway = () => {
    if (!unavailablePkg) return
    setLoading(unavailablePkg.id)
    setUnavailablePkg(null)
    setTimeout(() => { setLoading(null); setActivePlan(unavailablePkg); navigate('/payment') }, 600)
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>

      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          {/* Step + provider pill row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            {/* Step pill — teal */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 6px', borderRadius: 20, background: 'rgba(15,118,110,0.1)', border: '1px solid rgba(15,118,110,0.2)' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#0F766E,#0D5C56)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wifi size={10} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>STEP 1 OF 2</span>
            </div>
            {/* Active provider pill */}
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

        {/* Counts badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 10, background: 'var(--teal-pale)', border: '1px solid rgba(15,118,110,0.2)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--teal)', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-display)' }}>{availableIds.size} in your area</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 10, background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CBD5E1', display: 'inline-block' }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>{PACKAGES.length - availableIds.size} outside area</span>
          </div>
        </div>
      </div>

      {/* ── Search + Filter ───────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 160px', minWidth: 130 }}>
          <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search plans…"
            className="portal-input" style={{ paddingLeft: 30, fontSize: 12, height: 35 }} />
        </div>
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
      </div>

      {/* Grid responsive styles */}
      <style>{`
        .pkg-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 900px) { .pkg-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) { .pkg-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 380px) { .pkg-grid { grid-template-columns: 1fr !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── SECTION 1: Available at your location ─────────────────── */}
      {availableVisible.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px 4px 8px', borderRadius: 20, background: 'var(--teal-pale)', border: '1px solid rgba(15,118,110,0.2)' }}>
              <MapPin size={12} color="var(--teal)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', fontFamily: 'var(--font-display)' }}>
                Available in your area
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {providerName} · {availableVisible.length} plan{availableVisible.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="pkg-grid">
            {availableVisible.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} available={true}
                loading={loading} onChoose={handleChoose} onUnavailable={setUnavailablePkg} />
            ))}
          </div>
        </div>
      )}

      {/* ── SECTION 2: Outside your area ──────────────────────────── */}
      {unavailableVisible.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px 4px 8px', borderRadius: 20, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)' }}>
              <AlertCircle size={12} color="#F59E0B" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#D97706', fontFamily: 'var(--font-display)' }}>
                Not available at your location
              </span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Can purchase · won't connect until in coverage area
            </span>
          </div>
          <div className="pkg-grid">
            {unavailableVisible.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} available={false}
                loading={loading} onChoose={handleChoose} onUnavailable={setUnavailablePkg} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <Search size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No packages match your search.</p>
        </div>
      )}

      {/* ── Promo banner ──────────────────────────────────────────── */}
      <div style={{ marginTop: 8, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: 'var(--bg-card)', border: '1.5px solid rgba(15,118,110,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--teal-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Tag size={15} color="var(--teal)" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>Refer & Earn</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Get KES 50 credit for every friend you refer</p>
          </div>
        </div>
        <button className="btn-outline" style={{ width: 'auto', padding: '7px 16px', fontSize: 12 }}>Share Referral</button>
      </div>

      {/* ── Unavailable modal ─────────────────────────────────────── */}
      {unavailablePkg && (
        <UnavailableModal
          pkg={unavailablePkg}
          providerName={providerName}
          onBuyAnyway={handleBuyAnyway}
          onClose={() => setUnavailablePkg(null)}
        />
      )}
    </div>
  )
}