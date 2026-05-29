import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Clock, Infinity, Check, Star, TrendingUp, ArrowRight, Tag, Wifi, Search } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PACKAGES = [
  // ── Hourly ────────────────────────────────────────────────────────────────
  { id:1,  name:'Flash',      price:20,    currency:'KES', period:'1 Hour',   category:'Hourly',   speed:'5 Mbps',   data:'500 MB',     features:['WhatsApp & Social','Basic Browsing','Email Access'],           accent:'#4D78E8', gradient:'linear-gradient(135deg,#1B3A8F,#2E54C4)', badge:null,           icon:Zap },
  { id:5,  name:'Turbo',      price:50,    currency:'KES', period:'3 Hours',  category:'Hourly',   speed:'15 Mbps',  data:'1 GB',       features:['HD Streaming','All Social','Fast Browse'],                     accent:'#4D78E8', gradient:'linear-gradient(135deg,#1B3A8F,#2E54C4)', badge:null,           icon:Zap },
  { id:6,  name:'Night',      price:60,    currency:'KES', period:'8 Hours',  category:'Hourly',   speed:'10 Mbps',  data:'1.5 GB',     features:['Night Hours Only','Social Media','Streaming'],                 accent:'#6366F1', gradient:'linear-gradient(135deg,#4338CA,#6366F1)', badge:'Night Only',    icon:Star },
  { id:7,  name:'Blitz',      price:30,    currency:'KES', period:'2 Hours',  category:'Hourly',   speed:'8 Mbps',   data:'750 MB',     features:['Social Media','Light Streaming','Email'],                      accent:'#EC4899', gradient:'linear-gradient(135deg,#BE185D,#EC4899)', badge:null,           icon:Zap },
  { id:8,  name:'Rush',       price:80,    currency:'KES', period:'5 Hours',  category:'Hourly',   speed:'12 Mbps',  data:'2 GB',       features:['All Social','Video Calls','Gaming Boost'],                     accent:'#F59E0B', gradient:'linear-gradient(135deg,#D97706,#F59E0B)', badge:'Limited',       icon:TrendingUp },

  // ── Daily ─────────────────────────────────────────────────────────────────
  { id:2,  name:'Daily',      price:100,   currency:'KES', period:'24 Hours', category:'Daily',    speed:'10 Mbps',  data:'2 GB',       features:['All Social Media','Video Streaming','Gaming'],                 accent:'#F47820', gradient:'linear-gradient(135deg,#D4631A,#F47820)', badge:'Popular',       icon:TrendingUp, featured:true },
  { id:9,  name:'Day Pro',    price:150,   currency:'KES', period:'24 Hours', category:'Daily',    speed:'20 Mbps',  data:'5 GB',       features:['HD Video','Priority Support','All Apps'],                      accent:'#10B981', gradient:'linear-gradient(135deg,#059669,#10B981)', badge:'Pro',           icon:Star },
  { id:10, name:'Day Lite',   price:70,    currency:'KES', period:'24 Hours', category:'Daily',    speed:'5 Mbps',   data:'1 GB',       features:['Social Media Only','WhatsApp Calls','Basic Browsing'],         accent:'#64748B', gradient:'linear-gradient(135deg,#475569,#64748B)', badge:null,           icon:Zap },

  // ── Weekly ────────────────────────────────────────────────────────────────
  { id:3,  name:'Weekly',     price:500,   currency:'KES', period:'7 Days',   category:'Weekly',   speed:'20 Mbps',  data:'10 GB',      features:['Everything in Daily','4K Streaming','Priority Queue'],         accent:'#7C3AED', gradient:'linear-gradient(135deg,#5B21B6,#7C3AED)', badge:'Best Value',    icon:Star },
  { id:11, name:'Week Pro',   price:750,   currency:'KES', period:'7 Days',   category:'Weekly',   speed:'30 Mbps',  data:'20 GB',      features:['4K Streaming','Gaming','VPN Access','Priority Support'],       accent:'#8B5CF6', gradient:'linear-gradient(135deg,#6D28D9,#8B5CF6)', badge:'Pro',           icon:TrendingUp },
  { id:12, name:'Week Lite',  price:300,   currency:'KES', period:'7 Days',   category:'Weekly',   speed:'10 Mbps',  data:'5 GB',       features:['Social Media','Standard Streaming','Email'],                   accent:'#A78BFA', gradient:'linear-gradient(135deg,#7C3AED,#A78BFA)', badge:null,           icon:Zap },
  { id:13, name:'Family',     price:900,   currency:'KES', period:'7 Days',   category:'Weekly',   speed:'30 Mbps',  data:'30 GB',      features:['Up to 5 Devices','4K Streaming','Parental Controls'],         accent:'#F43F5E', gradient:'linear-gradient(135deg,#BE123C,#F43F5E)', badge:'Family',        icon:Star },

  // ── Monthly ───────────────────────────────────────────────────────────────
  { id:4,  name:'Monthly',    price:1500,  currency:'KES', period:'30 Days',  category:'Monthly',  speed:'50 Mbps',  data:'Unlimited',  features:['Unlimited Data','Fastest Speeds','Static IP'],                accent:'#0891B2', gradient:'linear-gradient(135deg,#0E7490,#0891B2)', badge:'Enterprise',    icon:Infinity },
  { id:14, name:'Month Lite', price:800,   currency:'KES', period:'30 Days',  category:'Monthly',  speed:'20 Mbps',  data:'30 GB',      features:['All Social Media','HD Streaming','Email & Work Apps'],        accent:'#0EA5E9', gradient:'linear-gradient(135deg,#0284C7,#0EA5E9)', badge:null,           icon:TrendingUp },
  { id:15, name:'Month Pro',  price:2500,  currency:'KES', period:'30 Days',  category:'Monthly',  speed:'100 Mbps', data:'Unlimited',  features:['100 Mbps Speed','Dedicated IP','24/7 Support','SLA 99.9%'],   accent:'#06B6D4', gradient:'linear-gradient(135deg,#0891B2,#06B6D4)', badge:'Pro',           icon:Star },
  { id:16, name:'Business',   price:5000,  currency:'KES', period:'30 Days',  category:'Monthly',  speed:'200 Mbps', data:'Unlimited',  features:['200 Mbps','5 Static IPs','SLA Guarantee','Account Manager'], accent:'#14B8A6', gradient:'linear-gradient(135deg,#0F766E,#14B8A6)', badge:'Business',      icon:Infinity },

  // ── Special / Bundles ─────────────────────────────────────────────────────
  { id:17, name:'Weekend',    price:250,   currency:'KES', period:'Sat–Sun',  category:'Special',  speed:'25 Mbps',  data:'8 GB',       features:['Sat & Sun Only','4K Streaming','Gaming','All Social'],        accent:'#FB923C', gradient:'linear-gradient(135deg,#EA580C,#FB923C)', badge:'Weekend',       icon:Star },
  { id:18, name:'Student',    price:400,   currency:'KES', period:'30 Days',  category:'Special',  speed:'15 Mbps',  data:'15 GB',      features:['Study Apps Priority','Video Lectures','Social Media'],        accent:'#34D399', gradient:'linear-gradient(135deg,#059669,#34D399)', badge:'Student',       icon:TrendingUp },
  { id:19, name:'Social',     price:55,    currency:'KES', period:'24 Hours', category:'Special',  speed:'5 Mbps',   data:'Unlimited*', features:['Facebook','TikTok','Instagram','Twitter/X','WhatsApp'],       accent:'#818CF8', gradient:'linear-gradient(135deg,#4F46E5,#818CF8)', badge:'Social Only',   icon:Zap },
  { id:20, name:'Gamer',      price:350,   currency:'KES', period:'7 Days',   category:'Special',  speed:'40 Mbps',  data:'15 GB',      features:['Low Latency <10ms','Gaming Servers Priority','Discord'],      accent:'#EF4444', gradient:'linear-gradient(135deg,#B91C1C,#EF4444)', badge:'Gamer',         icon:Zap },
]

export default function PackagesPage() {
  const [loading, setLoading]   = useState(null)
  const [search,  setSearch]    = useState('')
  const [filter,  setFilter]    = useState('All')
  const { showToast, setActivePlan, user } = useApp()
  const navigate = useNavigate()

  // Build filter tabs dynamically from data
  const categories = useMemo(() => {
    const cats = [...new Set(PACKAGES.map(p => p.category))]
    return ['All', ...cats]
  }, [])

  const visible = useMemo(() => PACKAGES.filter(p => {
    const matchFilter = filter === 'All' || p.category === filter
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.data.toLowerCase().includes(search.toLowerCase()) ||
      p.speed.toLowerCase().includes(search.toLowerCase()) ||
      String(p.price).includes(search)
    return matchFilter && matchSearch
  }), [filter, search])

  const handleChoose = (pkg) => {
    setLoading(pkg.id)
    setTimeout(() => { setLoading(null); setActivePlan(pkg); navigate('/payment') }, 600)
  }

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 22, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          {/* Step pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px 4px 6px', borderRadius: 20, background: 'rgba(244,120,32,0.1)', border: '1px solid rgba(244,120,32,0.2)' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg,#F47820,#D4631A)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wifi size={10} color="white" strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#F47820', fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}>STEP 1 OF 2</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>choose a plan, then pay</span>
          </div>

          {/* Main heading */}
          <h1 style={{ margin: '0 0 6px', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, letterSpacing: '-0.03em', color: 'var(--text-main)', lineHeight: 1.15 }}>
            Hi {user?.name?.split(' ')[0] || 'there'},{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ background: 'linear-gradient(90deg,#F47820,#D4631A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                choose a plan
              </span>
              <span style={{ position: 'absolute', bottom: -3, left: 0, right: 0, height: 2, borderRadius: 2, background: 'linear-gradient(90deg,#F47820,rgba(244,120,32,0.15))' }} />
            </span>
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            All plans activate instantly · upgrade or switch anytime.
          </p>
        </div>

        {/* Live count badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 12, background: 'var(--bg-card)', border: '1px solid var(--border)', flexShrink: 0, marginBottom: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16A34A', display: 'inline-block', boxShadow: '0 0 0 2px rgba(22,163,74,0.25)' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)', fontFamily: 'var(--font-display)' }}>{PACKAGES.length} plans available</span>
        </div>
      </div>

      {/* ── Search + Filter row ── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 140 }}>
          <Search size={13} color="var(--text-muted)" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search plans..."
            className="portal-input"
            style={{ paddingLeft: 32, fontSize: 13, height: 36, boxSizing: 'border-box' }}
          />
        </div>

        {/* Dynamic filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                fontFamily: 'var(--font-display)', cursor: 'pointer', border: 'none',
                transition: 'all .15s', whiteSpace: 'nowrap',
                ...(filter === cat
                  ? { background: 'linear-gradient(135deg,#F47820,#D4631A)', color: 'white', boxShadow: '0 3px 10px rgba(244,120,32,0.3)' }
                  : { background: 'var(--bg-card)', color: 'var(--text-muted)', border: '1.5px solid var(--border)' })
              }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* ── Count ── */}
      {search || filter !== 'All' ? (
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          {visible.length} plan{visible.length !== 1 ? 's' : ''} found
        </p>
      ) : null}

      {/* ── Package Grid ── */}
      <style>{`
        .pkg-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        @media (max-width: 900px) { .pkg-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 640px) { .pkg-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 400px) { .pkg-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {visible.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 14 }}>
          No packages match your search.
        </div>
      ) : (
        <div className="pkg-grid">
          {visible.map(pkg => {
            const Icon = pkg.icon
            return (
              <div key={pkg.id}
                style={{
                  background: 'var(--bg-card)',
                  border: `1.5px solid ${pkg.featured ? pkg.accent : 'var(--border)'}`,
                  borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  transition: 'box-shadow .18s, border-color .18s, transform .18s', cursor: 'pointer',
                  boxShadow: pkg.featured ? `0 4px 16px ${pkg.accent}25` : 'var(--shadow)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = pkg.accent; e.currentTarget.style.boxShadow = `0 8px 24px ${pkg.accent}30`; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = pkg.featured ? pkg.accent : 'var(--border)'; e.currentTarget.style.boxShadow = pkg.featured ? `0 4px 16px ${pkg.accent}25` : 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* Gradient top bar */}
                <div style={{ height: 3, background: pkg.gradient, flexShrink: 0 }} />

                <div style={{ padding: '12px 12px 10px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>

                  {/* Icon + badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: pkg.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={14} color="white" strokeWidth={2.2} />
                    </div>
                    {pkg.badge && (
                      <span style={{ fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 20, background: pkg.gradient, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                        {pkg.badge}
                      </span>
                    )}
                  </div>

                  {/* Name + period */}
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{pkg.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
                      <Clock size={9} color={pkg.accent} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: pkg.accent }}>{pkg.period}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', marginRight: 1 }}>{pkg.currency}</span>
                    {pkg.price.toLocaleString()}
                  </p>

                  {/* Speed + Data row */}
                  <div style={{ display: 'flex', gap: 5 }}>
                    {[{ l: 'Speed', v: pkg.speed }, { l: 'Data', v: pkg.data }].map(({ l, v }) => (
                      <div key={l} style={{ flex: 1, background: 'var(--bg)', borderRadius: 7, padding: '4px 5px', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 9, color: 'var(--text-muted)' }}>{l}</p>
                        <p style={{ margin: '1px 0 0', fontSize: 10, fontWeight: 700, color: pkg.accent, fontFamily: 'var(--font-display)' }}>{v}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features — max 3 shown */}
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                    {pkg.features.slice(0, 3).map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-sub)', lineHeight: 1.3 }}>
                        <div style={{ width: 13, height: 13, borderRadius: '50%', background: `${pkg.accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={7} color={pkg.accent} strokeWidth={3} />
                        </div>
                        {f}
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li style={{ fontSize: 10, color: pkg.accent, fontWeight: 600, paddingLeft: 18 }}>+{pkg.features.length - 3} more</li>
                    )}
                  </ul>

                  {/* CTA */}
                  <button
                    onClick={() => handleChoose(pkg)}
                    style={{
                      width: '100%', padding: '7px 0', borderRadius: 9, border: 'none',
                      cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 11,
                      fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 5, transition: 'opacity .15s', background: pkg.gradient, color: 'white',
                      boxShadow: `0 2px 10px ${pkg.accent}28`, marginTop: 'auto',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    {loading === pkg.id
                      ? <><span style={{ width: 11, height: 11, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />...</>
                      : <>Choose <ArrowRight size={11} /></>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Promo banner ── */}
      <div style={{ marginTop: 20, borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', background: 'var(--bg-card)', border: '1.5px solid rgba(244,120,32,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(244,120,32,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Tag size={16} color="#F47820" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>Refer & Earn</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Get KES 50 credit for every friend you refer</p>
          </div>
        </div>
        <button className="btn-outline" style={{ width: 'auto', padding: '8px 18px', fontSize: 12 }}>Share Referral</button>
      </div>
    </div>
  )
}