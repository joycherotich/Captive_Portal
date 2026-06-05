import { useState, useEffect } from 'react'
import {
  RefreshCw, XCircle, CheckCircle, Clock, Zap, TrendingUp,
  Star, Plus, Wifi, WifiOff, Calendar, CreditCard, Activity,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const css = `
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes connPing { 0%,100%{box-shadow:0 0 0 0 rgba(0,166,81,0.5)} 60%{box-shadow:0 0 0 7px rgba(0,166,81,0)} }

  .sub-page { width:100%; box-sizing:border-box; animation:fadeUp .4s ease both; }

  .sub-hero {
    border-radius:20px; overflow:hidden; margin-bottom:14px;
    background:linear-gradient(135deg,#060E2B 0%,#0D1F4F 45%,#1B3A8F 100%);
    box-shadow:0 10px 40px rgba(11,25,66,0.26); position:relative;
  }
  .sub-hero-glow1 { position:absolute;top:-60px;right:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(244,120,32,0.22),transparent 70%);pointer-events:none; }
  .sub-hero-glow2 { position:absolute;bottom:-80px;left:-40px;width:190px;height:190px;border-radius:50%;background:radial-gradient(circle,rgba(46,84,196,0.3),transparent 70%);pointer-events:none; }
  .sub-hero-grid  { position:absolute;inset:0;opacity:.06;background-image:linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px);background-size:32px 32px;pointer-events:none; }
  .sub-hero-inner { position:relative; padding:20px 22px 18px; }
  .sub-hero-top   { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:14px; flex-wrap:wrap; }
  .sub-hero-label { font-size:10px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:rgba(180,200,255,.5); margin-bottom:4px; }
  .sub-hero-name  { font-size:22px; font-weight:800; letter-spacing:-.03em; color:#fff; font-family:var(--font-display); margin:0; }

  .sub-active-badge { display:flex;align-items:center;gap:6px;padding:5px 11px;border-radius:99px;font-size:11px;font-weight:700;background:rgba(0,166,81,.18);color:#4ADE80;border:1px solid rgba(0,166,81,.3);animation:connPing 2.4s ease-in-out infinite;flex-shrink:0; }
  .sub-active-dot   { width:6px;height:6px;border-radius:50%;background:#4ADE80; }

  .sub-stats { display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:7px;margin-bottom:14px; }
  .sub-stat  { background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:13px;padding:10px 13px;backdrop-filter:blur(8px); }
  .sub-stat-l { font-size:9px;color:rgba(180,200,255,.5);letter-spacing:.08em;text-transform:uppercase;margin-bottom:3px; }
  .sub-stat-v { font-size:13px;font-weight:800;color:#fff;font-family:var(--font-display);letter-spacing:-.02em; }

  .sub-actions   { display:flex;gap:8px; }
  .sub-btn-renew { flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;border-radius:12px;font-size:12px;font-weight:700;color:#fff;border:none;cursor:pointer;background:linear-gradient(135deg,#F47820,#D4631A);box-shadow:0 4px 16px rgba(244,120,32,.4);font-family:var(--font-display);transition:all .2s; }
  .sub-btn-renew:hover { transform:translateY(-2px);box-shadow:0 7px 24px rgba(244,120,32,.5); }
  .sub-btn-cancel { flex:1;display:flex;align-items:center;justify-content:center;gap:7px;padding:10px;border-radius:12px;font-size:12px;font-weight:700;color:#f87171;cursor:pointer;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);font-family:var(--font-display);transition:all .2s; }
  .sub-btn-cancel:hover { background:rgba(239,68,68,.18); }

  .sub-summary  { display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin-bottom:14px; }
  .sub-sum-card { background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:11px 14px;box-shadow:var(--shadow);display:flex;align-items:center;gap:11px; }
  .sub-sum-icon  { width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
  .sub-sum-label { font-size:10px;color:var(--text-muted);margin-bottom:2px; }
  .sub-sum-value { font-size:13px;font-weight:800;color:var(--text-main);font-family:var(--font-display);letter-spacing:-.01em; }

  .sub-tabs { display:flex;gap:6px;margin-bottom:12px; }
  .sub-tab  { padding:7px 16px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid var(--border);background:var(--bg-card);color:var(--text-muted);transition:all .18s;font-family:var(--font-display); }
  .sub-tab.active { background:rgba(244,120,32,.1);color:var(--orange);border-color:rgba(244,120,32,.3); }

  .sub-list      { background:var(--bg-card);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow-md);overflow:hidden; }
  .sub-list-head { padding:13px 18px 11px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between; }
  .sub-list-title{ font-size:13px;font-weight:700;color:var(--text-main);font-family:var(--font-display); }

  .sub-row           { display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border);transition:background .15s;cursor:default; }
  .sub-row:last-child{ border-bottom:none; }
  .sub-row:hover     { background:rgba(244,120,32,.03); }
  .sub-row-icon  { width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
  .sub-row-info  { flex:1;min-width:0; }
  .sub-row-name  { font-size:13px;font-weight:700;color:var(--text-main);font-family:var(--font-display);letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
  .sub-row-meta  { font-size:11px;color:var(--text-muted);margin-top:2px; }
  .sub-row-badge { display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;margin-top:3px; }
  .sub-row-right { display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0; }
  .sub-row-amount{ font-size:13px;font-weight:800;color:var(--text-main);font-family:var(--font-display); }

  .sub-conn-btn { display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:9px;font-size:11px;font-weight:700;cursor:pointer;font-family:var(--font-display);transition:all .2s;white-space:nowrap;border:1.5px solid;position:relative;overflow:hidden; }
  .sub-conn-btn.connect   { background:rgba(27,58,143,.07);color:#1B3A8F;border-color:rgba(27,58,143,.2); }
  .sub-conn-btn.connect:hover { background:rgba(27,58,143,.14);transform:translateY(-1px); }
  .sub-conn-btn.connected { background:rgba(0,166,81,.1);color:#00A651;border-color:rgba(0,166,81,.3);animation:connPing 2.4s ease-in-out infinite; }
  .sub-conn-btn.activate  { background:rgba(244,120,32,.08);color:var(--orange);border-color:rgba(244,120,32,.25); }
  .sub-conn-btn.activate:hover { background:rgba(244,120,32,.16);transform:translateY(-1px); }

  .sub-empty      { padding:36px 20px;text-align:center;color:var(--text-muted);font-size:13px; }
  .sub-empty-icon { width:44px;height:44px;border-radius:12px;background:var(--bg);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin:0 auto 10px; }

  .sub-loading { padding:36px 20px;text-align:center;color:var(--text-muted);font-size:13px; }

  @media(max-width:600px){
    .sub-hero-inner { padding:16px 15px 14px; }
    .sub-hero-name  { font-size:18px; }
    .sub-stats      { grid-template-columns:repeat(2,1fr); }
    .sub-summary    { grid-template-columns:1fr; }
    .sub-row        { padding:10px 12px;gap:9px; }
  }
`

const PLAN_ICONS = [Star, TrendingUp, Zap, Activity]
const PLAN_COLORS = ['#7C3AED', '#F47820', '#1B3A8F', '#0891B2']

function planIcon(index) { return PLAN_ICONS[index % PLAN_ICONS.length] }
function planColor(index) { return PLAN_COLORS[index % PLAN_COLORS.length] }

export default function SubscriptionsPage() {
  const [tab,        setTab]        = useState('active')
  const [connected,  setConnected]  = useState(null)
  const [subs,       setSubs]       = useState([])
  const [loading,    setLoading]    = useState(false)
  const { user, showToast }         = useApp()
  const navigate                    = useNavigate()

  const partyId  = user?.partyId ?? ''
  const hasParty = partyId !== ''

  // ── Fetch subscriptions from API when partyId exists ──────
  useEffect(() => {
    if (!hasParty) { setSubs([]); return }

    let cancelled = false
    setLoading(true)

    fetch(`/api/captive-portal/subscriptions/party/${partyId}`, {
      headers: { Authorization: `Bearer ${user?.accessToken ?? ''}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (cancelled) return
        // Normalise API response to the shape this page expects
        const normalised = (Array.isArray(data) ? data : data?.content ?? []).map((s, i) => ({
          id:      s.id         ?? s.subscriptionId ?? `SUB-${i}`,
          plan:    s.planName   ?? s.name           ?? '—',
          amount:  s.amount     ?? s.price          ?? 0,
          date:    s.startDate  ?? s.createdAt      ?? '—',
          expiry:  s.expiryDate ?? s.endDate        ?? '—',
          status:  s.status?.toLowerCase() === 'active' ? 'active' : 'expired',
          speed:   s.speed      ?? s.downloadSpeed  ?? '—',
          data:    s.dataLimit  ?? s.data           ?? '—',
          icon:    planIcon(i),
          color:   planColor(i),
        }))
        setSubs(normalised)
        setLoading(false)
      })
      .catch(() => { if (!cancelled) { setSubs([]); setLoading(false) } })

    return () => { cancelled = true }
  }, [partyId, user?.accessToken])

  const active  = subs.filter(s => s.status === 'active')
  const expired = subs.filter(s => s.status === 'expired')
  const shown   = tab === 'active' ? active : expired
  const current = active[0] ?? null

  const totalSpent = subs.reduce((a, s) => a + (s.amount ?? 0), 0)

  function handleConnect(s) {
    if (connected === s.id) {
      setConnected(null)
      showToast(`Disconnected from ${s.plan}`, 'info')
    } else {
      setConnected(s.id)
      showToast(`Connected to ${s.plan}!`, 'success')
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="sub-page">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--orange)', marginBottom:2, fontFamily:'var(--font-display)' }}>Account</p>
            <h1 style={{ fontSize:24, fontWeight:800, letterSpacing:'-.03em', color:'var(--text-main)', fontFamily:'var(--font-display)', margin:0 }}>Subscriptions</h1>
            <p style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>Manage your data plans & history</p>
          </div>
          <button onClick={() => navigate('/packages')} className="btn-primary" style={{ width:'auto', padding:'9px 18px', fontSize:'12px' }}>
            <Plus size={14}/> New Plan
          </button>
        </div>

        {/* ── No partyId notice ── */}
        {!hasParty && (
          <div style={{ marginBottom:14, padding:'14px 18px', borderRadius:14, background:'rgba(244,120,32,0.07)', border:'1px solid rgba(244,120,32,0.22)', display:'flex', alignItems:'center', gap:10 }}>
            <WifiOff size={16} color="#F47820" style={{ flexShrink:0 }} />
            <div>
              <p style={{ margin:0, fontSize:13, fontWeight:700, color:'var(--text-main)' }}>Account not linked</p>
              <p style={{ margin:'2px 0 0', fontSize:12, color:'var(--text-muted)' }}>Purchase a package to activate your subscription.</p>
            </div>
            <button onClick={() => navigate('/packages')} style={{ marginLeft:'auto', flexShrink:0, fontSize:11, fontWeight:700, color:'#F47820', background:'none', border:'none', cursor:'pointer' }}>
              Browse →
            </button>
          </div>
        )}

        {/* ── Hero — current active plan ── */}
        {hasParty && current && (
          <div className="sub-hero">
            <div className="sub-hero-glow1"/><div className="sub-hero-glow2"/><div className="sub-hero-grid"/>
            <div className="sub-hero-inner">
              <div className="sub-hero-top">
                <div>
                  <p className="sub-hero-label">Current Plan</p>
                  <h2 className="sub-hero-name">{current.plan}</h2>
                </div>
                <div className="sub-active-badge">
                  <div className="sub-active-dot"/> Active
                </div>
              </div>
              <div className="sub-stats">
                {[
                  { l:'Paid',      v: current.amount ? `KES ${current.amount}` : '—' },
                  { l:'Speed',     v: current.speed  },
                  { l:'Data',      v: current.data   },
                  { l:'Activated', v: current.date   },
                  { l:'Expires',   v: current.expiry },
                ].map(({ l, v }) => (
                  <div key={l} className="sub-stat">
                    <div className="sub-stat-l">{l}</div>
                    <div className="sub-stat-v">{v}</div>
                  </div>
                ))}
              </div>
              <div className="sub-actions">
                <button className="sub-btn-renew" onClick={() => showToast('Plan renewed!', 'success')}>
                  <RefreshCw size={13}/> Renew Plan
                </button>
                <button className="sub-btn-cancel" onClick={() => showToast('Plan cancelled.', 'info')}>
                  <XCircle size={13}/> Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Summary cards ── */}
        <div className="sub-summary">
          {[
            { icon:CreditCard, label:'Total Spent',  value: hasParty ? `KES ${totalSpent.toLocaleString()}` : 'KES 0',   color:'#F47820', bg:'rgba(244,120,32,.12)' },
            { icon:Activity,   label:'Total Plans',  value: hasParty ? `${subs.length} Plans`               : '0 Plans', color:'#3B82F6', bg:'rgba(59,130,246,.12)' },
            { icon:CheckCircle,label:'Active Plans', value: hasParty ? `${active.length} Active`            : '0 Active',color:'#00A651', bg:'rgba(0,166,81,.12)'   },
            { icon:Calendar,   label:'Next Renewal', value: hasParty && current?.expiry ? current.expiry    : '—',       color:'#8B5CF6', bg:'rgba(139,92,246,.12)' },
          ].map(({ icon:Icon, label, value, color, bg }) => (
            <div key={label} className="sub-sum-card">
              <div className="sub-sum-icon" style={{ background:bg }}>
                <Icon size={16} color={color} strokeWidth={1.8}/>
              </div>
              <div>
                <div className="sub-sum-label">{label}</div>
                <div className="sub-sum-value">{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="sub-tabs">
          {[
            { id:'active',  l:`Active (${hasParty ? active.length : 0})`  },
            { id:'history', l:`History (${hasParty ? expired.length : 0})` },
          ].map(({ id, l }) => (
            <button key={id} onClick={() => setTab(id)} className={`sub-tab ${tab === id ? 'active' : ''}`}>{l}</button>
          ))}
        </div>

        {/* ── List ── */}
        <div className="sub-list">
          <div className="sub-list-head">
            <span className="sub-list-title">{tab === 'active' ? 'Active Plans' : 'Past Subscriptions'}</span>
            <span style={{ fontSize:11, color:'var(--text-muted)' }}>{shown.length} record{shown.length !== 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="sub-loading">
              <RefreshCw size={18} style={{ animation:'spin 1s linear infinite', margin:'0 auto 8px', display:'block', color:'var(--orange)' }}/>
              Loading subscriptions…
            </div>
          ) : !hasParty || shown.length === 0 ? (
            <div className="sub-empty">
              <div className="sub-empty-icon"><WifiOff size={18} color="var(--text-muted)"/></div>
              {!hasParty ? 'Link your account to view subscriptions' : `No ${tab} subscriptions found`}
            </div>
          ) : shown.map((s, i) => {
            const Icon        = s.icon
            const isConnected = connected === s.id
            const canConnect  = s.status === 'active'

            return (
              <div key={s.id} className="sub-row">
                <div className="sub-row-icon" style={{ background:`${s.color}14` }}>
                  <Icon size={18} style={{ color:s.color }}/>
                </div>
                <div className="sub-row-info">
                  <div className="sub-row-name">{s.plan}</div>
                  <div className="sub-row-meta">{s.date} · #{s.id} · {s.speed} · {s.data}</div>
                  <div className="sub-row-badge" style={{ color: s.status === 'active' ? '#00A651' : 'var(--text-muted)' }}>
                    {s.status === 'active'
                      ? <><CheckCircle size={10}/> Active</>
                      : <><Clock size={10}/> Expired {s.expiry}</>}
                  </div>
                </div>
                <div className="sub-row-right">
                  <div className="sub-row-amount">{s.amount ? `KES ${s.amount}` : '—'}</div>
                  <button
                    onClick={() => canConnect ? handleConnect(s) : navigate('/packages')}
                    className={`sub-conn-btn ${!canConnect ? 'activate' : isConnected ? 'connected' : 'connect'}`}
                  >
                    <Wifi size={11}/>
                    {!canConnect ? 'Activate' : isConnected ? 'Connected ✓' : 'Connect'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </>
  )
}