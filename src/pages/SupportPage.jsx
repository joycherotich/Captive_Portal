import { useState } from 'react'
import {
  Ticket, Phone, ChevronDown, ChevronUp, MessageSquare,
  AlertCircle, Send, X, Plus, CheckCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const FAQS = [
  { q: 'How do I renew my plan?',       a: 'Go to Subscriptions → click Renew, or visit Packages to buy a new one. Payment via M-Pesa or card.' },
  { q: 'What happens when data runs out?', a: 'Speed slows to 256 Kbps. Purchase a top-up to restore full speed instantly.' },
  { q: 'How do I get a refund?',        a: 'Refund requests within 24h of purchase. Submit a ticket and we process within 2 business days.' },
  { q: 'Can I share my connection?',    a: 'Yes — Weekly plan supports 3 devices, Monthly supports 5. Check plan details under Subscriptions.' },
  { q: 'Why is my connection slow?',    a: 'Could be congestion, device, or distance from access point. Run a speed test and contact support if below plan speed.' },
  { q: 'How do I change my password?',  a: 'My Profile → Account Settings → Change Password. You will receive an OTP to your registered phone.' },
]

const MY_TICKETS = [
  { id: 'TKT-001', title: 'Slow speeds after 8pm',      status: 'resolved', date: '2026-04-25' },
  { id: 'TKT-002', title: 'Billing discrepancy June',   status: 'open',     date: '2026-05-28' },
]

const AMBER       = '#f59e0b'
const AMBER_DARK  = '#d97706'
const AMBER_BG    = 'rgba(245,158,11,0.10)'
const AMBER_BOR   = 'rgba(245,158,11,0.20)'

/* ── Spinner ─────────────────────────────────────────── */
function Spinner() {
  return (
    <span style={{
      display: 'inline-block', width: 15, height: 15,
      border: '2px solid rgba(255,255,255,0.25)',
      borderTopColor: '#fff', borderRadius: '50%',
      animation: 'spin .7s linear infinite',
    }} />
  )
}

export default function SupportPage() {
  const { showToast } = useApp()
  const [tab,       setTab]       = useState('faqs')
  const [openFaq,   setOpenFaq]   = useState(null)
  const [showForm,  setShowForm]  = useState(false)
  const [tf,        setTf]        = useState({ title: '', category: '', message: '' })
  const [cbPhone,   setCbPhone]   = useState('')
  const [cbDate,    setCbDate]    = useState('')
  const [cbTime,    setCbTime]    = useState('')
  const [submitting,setSubmitting]= useState(false)

  const getTodayStr = () => {
    const n = new Date()
    return `${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`
  }
  const getMinTime = (d) => {
    if (d === getTodayStr()) {
      const n = new Date()
      return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`
    }
    return '00:00'
  }
  const handleDateChange = (e) => {
    setCbDate(e.target.value)
    if (cbTime && cbTime < getMinTime(e.target.value)) setCbTime('')
  }

  const submitTicket = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false); setShowForm(false)
      setTf({ title: '', category: '', message: '' })
      showToast('Ticket created! We reply within 4 hours.', 'success')
    }, 1600)
  }

  const requestCb = () => {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      showToast('Callback scheduled!', 'success')
      setCbPhone(''); setCbDate(''); setCbTime('')
    }, 1400)
  }

  const cbReady   = cbPhone && cbDate && cbTime
  const ticketOk  = tf.title.trim() && tf.message.trim()

  const TABS = [
    { id: 'faqs',     label: 'FAQs'       },
    { id: 'tickets',  label: 'My Tickets' },
    { id: 'callback', label: 'Callback'   },
  ]

  return (
    // <div className="animate-fade-in" style={{ maxWidth: 860, width: '100%' }}>
      <div className="animate-fade-in" style={{ width: '100%' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
          Support
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
          FAQs, tickets, and callback requests
        </p>
      </div>

      {/* ── Live chat banner ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 18px', borderRadius: 14, marginBottom: 18,
        background: 'white',
        border: `1px solid ${AMBER_BOR}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 11, flexShrink: 0,
          background: AMBER_BG, border: `1px solid ${AMBER_BOR}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <MessageSquare size={17} style={{ color: AMBER_DARK }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>Live Chat Available</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Mon–Fri 8AM–8PM · Sat 9AM–5PM</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 0 0 rgba(16,185,129,0.5)',
            animation: 'sPulse 2.2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#10B981' }}>Online</span>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'rgba(0,0,0,0.04)', borderRadius: 13,
        padding: 4, marginBottom: 18, width: 'fit-content',
      }}>
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 22px', borderRadius: 10, border: 'none',
              background: active ? 'white' : 'transparent',
              color: active ? 'var(--text-main)' : 'var(--text-muted)',
              fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: active ? '0 1px 4px rgba(0,0,0,0.09)' : 'none',
              fontFamily: 'var(--font-display)',
              borderBottom: active ? `2px solid ${AMBER}` : '2px solid transparent',
            }}>
              {t.label}
            </button>
          )
        })}
      </div>

      {/* ══════════════════ FAQs ══════════════════ */}
      {tab === 'faqs' && (
        <div style={{
          background: 'white', border: '1px solid var(--border)',
          borderRadius: 18, overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          {FAQS.map((f, i) => {
            const isOpen = openFaq === i
            return (
              <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                <button
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: isOpen ? AMBER_BG : 'transparent',
                    transition: 'background 0.15s', gap: 12,
                  }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'rgba(0,0,0,0.02)' }}
                  onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent' }}
                >
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                    {f.q}
                  </p>
                  {isOpen
                    ? <ChevronUp  size={16} style={{ color: AMBER_DARK, flexShrink: 0 }} />
                    : <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  }
                </button>
                {isOpen && (
                  <div style={{
                    padding: '0 20px 16px',
                    borderTop: `1px solid ${AMBER_BOR}`,
                    background: AMBER_BG,
                  }}>
                    <p style={{ fontSize: 13.5, color: 'var(--text-sub)', margin: '12px 0 0', lineHeight: 1.65 }}>
                      {f.a}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ══════════════════ Tickets ══════════════════ */}
      {tab === 'tickets' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
            <button onClick={() => setShowForm(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `linear-gradient(135deg,${AMBER},${AMBER_DARK})`,
              color: '#0a0a0a', border: 'none', borderRadius: 10,
              padding: '9px 16px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(245,158,11,0.28)',
              fontFamily: 'var(--font-display)',
            }}>
              <Plus size={14} />New Ticket
            </button>
          </div>

          <div style={{
            background: 'white', border: '1px solid var(--border)',
            borderRadius: 18, overflow: 'hidden',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            {MY_TICKETS.map((t, i) => {
              const isOpen = t.status === 'open'
              return (
                <div key={t.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '14px 18px',
                  borderBottom: i < MY_TICKETS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: isOpen ? AMBER_BG : 'rgba(16,185,129,0.10)',
                    border: `1px solid ${isOpen ? AMBER_BOR : 'rgba(16,185,129,0.20)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isOpen
                      ? <AlertCircle  size={16} style={{ color: AMBER_DARK }} />
                      : <CheckCircle  size={16} style={{ color: '#10B981'  }} />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title}
                    </p>
                    <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      {t.id} · {t.date}
                    </p>
                  </div>
                  <span style={{
                    fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: 99,
                    background: isOpen ? AMBER_BG : 'rgba(16,185,129,0.10)',
                    color: isOpen ? AMBER_DARK : '#10B981',
                    border: `1px solid ${isOpen ? AMBER_BOR : 'rgba(16,185,129,0.20)'}`,
                    flexShrink: 0, textTransform: 'capitalize',
                  }}>
                    {t.status}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ══════════════════ Callback ══════════════════ */}
      {tab === 'callback' && (
        <div style={{
          background: 'white', border: '1px solid var(--border)',
          borderRadius: 18, padding: '24px 24px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          maxWidth: 520,
        }}>
          {/* Icon + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: AMBER_BG, border: `1px solid ${AMBER_BOR}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Phone size={19} style={{ color: AMBER_DARK }} />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
                Request a Callback
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                We'll call you at your preferred time
              </p>
            </div>
          </div>

          {/* Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: AMBER_DARK, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
                Your Phone
              </label>
              <input className="portal-input" placeholder="+254 712 345 678"
                value={cbPhone} onChange={e => setCbPhone(e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: AMBER_DARK, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
                  Date
                </label>
                <input className="portal-input" type="date"
                  min={getTodayStr()} value={cbDate} onChange={handleDateChange} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: AMBER_DARK, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
                  Time
                </label>
                <input className="portal-input" type="time"
                  min={getMinTime(cbDate)} value={cbTime}
                  onChange={e => { if (e.target.value >= getMinTime(cbDate)) setCbTime(e.target.value) }}
                  disabled={!cbDate}
                  style={{ opacity: cbDate ? 1 : 0.45, cursor: cbDate ? 'pointer' : 'not-allowed' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: AMBER_DARK, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
                Description (optional)
              </label>
              <input className="portal-input" placeholder="Brief description of your issue" />
            </div>

            <button onClick={requestCb} disabled={submitting || !cbReady} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              width: '100%', padding: '11px',
              background: cbReady ? `linear-gradient(135deg,${AMBER},${AMBER_DARK})` : 'rgba(0,0,0,0.07)',
              color: cbReady ? '#0a0a0a' : 'var(--text-muted)',
              border: 'none', borderRadius: 11, fontSize: 13.5, fontWeight: 700,
              cursor: cbReady ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              boxShadow: cbReady ? '0 2px 8px rgba(245,158,11,0.28)' : 'none',
              fontFamily: 'var(--font-display)',
            }}>
              {submitting ? <><Spinner />Scheduling…</> : <><Phone size={14} />Schedule Callback</>}
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════ New Ticket Modal ══════════════════ */}
      {showForm && (
        <div className="modal-bg">
          <div style={{
            background: 'white', borderRadius: 20,
            width: '100%', maxWidth: 440,
            padding: '24px', animation: 'slideUp 0.2s ease',
            boxShadow: '0 24px 64px rgba(0,0,0,0.14)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
                New Support Ticket
              </h3>
              <button onClick={() => setShowForm(false)} style={{
                width: 28, height: 28, borderRadius: 8, border: 'none',
                background: 'var(--bg)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)',
              }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Subject', key: 'title', type: 'input', placeholder: 'Brief description of your issue' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: AMBER_DARK, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
                    {f.label}
                  </label>
                  <input className="portal-input" placeholder={f.placeholder}
                    value={tf[f.key]} onChange={e => setTf(p => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: AMBER_DARK, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
                  Category
                </label>
                <select className="portal-input" value={tf.category}
                  onChange={e => setTf(p => ({ ...p, category: e.target.value }))}>
                  <option value="">Select category</option>
                  {['Connectivity Issue', 'Billing & Payments', 'Account Access', 'Slow Speeds', 'Other'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: AMBER_DARK, textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
                  Description
                </label>
                <textarea className="portal-input" rows={4} placeholder="Describe your issue in detail…"
                  value={tf.message} onChange={e => setTf(p => ({ ...p, message: e.target.value }))}
                  style={{ resize: 'none', lineHeight: 1.6 }} />
              </div>
            </div>

            <button onClick={submitTicket} disabled={submitting || !ticketOk} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
              width: '100%', marginTop: 18,
              background: ticketOk ? `linear-gradient(135deg,${AMBER},${AMBER_DARK})` : 'rgba(0,0,0,0.07)',
              color: ticketOk ? '#0a0a0a' : 'var(--text-muted)',
              border: 'none', borderRadius: 11, padding: '11px',
              fontSize: 13.5, fontWeight: 700,
              cursor: ticketOk ? 'pointer' : 'not-allowed',
              boxShadow: ticketOk ? '0 2px 8px rgba(245,158,11,0.28)' : 'none',
              fontFamily: 'var(--font-display)',
            }}>
              {submitting ? <><Spinner />Submitting…</> : <><Send size={14} />Submit Ticket</>}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes sPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.55); }
          50%     { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
      `}</style>
    </div>
  )
}