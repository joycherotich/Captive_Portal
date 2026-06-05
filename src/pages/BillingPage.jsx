import { useState } from 'react'
import {
  CreditCard, CheckCircle2, Clock, AlertCircle, Download,
  ChevronRight, Plus, Trash2, Star, Wifi, Zap, Droplets,
  ArrowUpRight, ArrowDownLeft, Shield, RefreshCw,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const STATUS = {
  paid:    { label: 'Paid',    color: '#00A651', bg: 'rgba(0,166,81,0.09)',    icon: CheckCircle2 },
  pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.09)', icon: Clock        },
  failed:  { label: 'Failed',  color: '#EF4444', bg: 'rgba(239,68,68,0.09)',  icon: AlertCircle  },
}

const BILLS = [
  { id: 'B-1042', date: '2026-06-01', desc: 'Weekly 20Mbps – Renewal',   amount: 350,  status: 'paid',    category: 'internet' },
  { id: 'B-1039', date: '2026-05-25', desc: 'KIWASCO Water Bill',         amount: 1200, status: 'paid',    category: 'utility'  },
  { id: 'B-1038', date: '2026-05-24', desc: 'Weekly 20Mbps – Renewal',   amount: 350,  status: 'paid',    category: 'internet' },
  { id: 'B-1035', date: '2026-05-18', desc: 'Electricity Token Top-up',  amount: 500,  status: 'paid',    category: 'utility'  },
  { id: 'B-1031', date: '2026-05-17', desc: 'Weekly 20Mbps – Renewal',   amount: 350,  status: 'paid',    category: 'internet' },
  { id: 'B-1028', date: '2026-05-10', desc: 'Weekly 20Mbps – Renewal',   amount: 350,  status: 'failed',  category: 'internet' },
  { id: 'B-1027', date: '2026-05-09', desc: 'KIWASCO Water Bill',         amount: 1100, status: 'pending', category: 'utility'  },
]

const METHODS = [
  { id: 'm1', type: 'mpesa',  label: 'M-Pesa', detail: '+254 765 489 009', primary: true  },
  { id: 'm2', type: 'card',   label: 'Visa',   detail: '**** 4821',         primary: false },
]

const CAT_ICON = { internet: Wifi, utility: Zap }
const CAT_CLR  = { internet: '#F47820', utility: '#10B981' }

function StatusBadge({ status }) {
  const s = STATUS[status]
  const Icon = s.icon
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{ background: s.bg, color: s.color }}>
      <Icon size={10} /> {s.label}
    </span>
  )
}

export default function BillingPage() {
  const { user } = useApp()
  const navigate  = useNavigate()
  const [filter, setFilter]   = useState('all')
  const [methods, setMethods] = useState(METHODS)

  const partyId = user?.partyId ?? ''
  const hasParty = partyId !== ''

  const bills = hasParty ? BILLS : []

  const filtered = filter === 'all' ? bills : bills.filter(b => b.status === filter)

  const totalPaid    = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0)
  const totalPending = bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0)
  const nextDue      = hasParty ? 350 : 0

  const setPrimary = (id) =>
    setMethods(ms => ms.map(m => ({ ...m, primary: m.id === id })))
  const removeMethod = (id) =>
    setMethods(ms => ms.filter(m => m.id !== id))

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Billing</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Charges, payments & payment methods</p>
        </div>
        <button
          onClick={() => navigate('/packages')}
          className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
          <RefreshCw size={13} /> Renew Plan
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Paid (30 days)', value: `KES ${totalPaid.toLocaleString()}`, icon: ArrowDownLeft, color: '#00A651', bg: 'rgba(0,166,81,0.08)'   },
          { label: 'Pending',              value: `KES ${totalPending.toLocaleString()}`, icon: Clock,     color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Next Due',             value: `KES ${nextDue.toLocaleString()}`,      icon: ArrowUpRight, color: '#F47820', bg: 'rgba(244,120,32,0.08)' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card-elevated rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              <p className="text-lg font-black mt-0.5" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Billing history ── */}
        <div className="lg:col-span-2 card-elevated rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Billing History</h3>
            <div className="flex gap-1">
              {['all', 'paid', 'pending', 'failed'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize"
                  style={{
                    background: filter === f ? 'var(--orange)' : 'rgba(244,120,32,0.07)',
                    color: filter === f ? '#fff' : 'var(--orange)',
                    border: `1px solid ${filter === f ? 'var(--orange)' : 'rgba(244,120,32,0.2)'}`,
                  }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {!hasParty ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <CreditCard size={32} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No billing history</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>Link your account to view charges.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <CheckCircle2 size={28} style={{ color: '#00A651', opacity: 0.5 }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No {filter} bills</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(bill => {
                const CatIcon = CAT_ICON[bill.category] ?? Wifi
                const catClr  = CAT_CLR[bill.category]  ?? '#F47820'
                return (
                  <div key={bill.id}
                    className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                    style={{ border: '1px solid var(--border)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${catClr}18` }}>
                      <CatIcon size={15} style={{ color: catClr }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>{bill.desc}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {bill.id} · {bill.date}
                      </p>
                    </div>
                    <StatusBadge status={bill.status} />
                    <p className="text-sm font-black ml-2 flex-shrink-0" style={{ color: 'var(--text-main)' }}>
                      KES {bill.amount.toLocaleString()}
                    </p>
                    <button className="p-1.5 rounded-lg ml-1 flex-shrink-0 transition-all"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                      <Download size={13} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">

          {/* Payment methods */}
          <div className="card-elevated rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Payment Methods</h3>
              <button className="w-7 h-7 rounded-xl flex items-center justify-center transition-all"
                style={{ background: 'rgba(244,120,32,0.08)', color: '#F47820' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,120,32,0.08)'}>
                <Plus size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {methods.map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{ background: m.primary ? 'rgba(244,120,32,0.06)' : 'rgba(0,0,0,0.02)', border: `1px solid ${m.primary ? 'rgba(244,120,32,0.2)' : 'var(--border)'}` }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: m.primary ? 'rgba(244,120,32,0.1)' : 'rgba(0,0,0,0.04)' }}>
                    <CreditCard size={14} style={{ color: m.primary ? '#F47820' : 'var(--text-muted)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>{m.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{m.detail}</p>
                  </div>
                  {m.primary && (
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: 'rgba(244,120,32,0.1)', color: '#F47820' }}>
                      Primary
                    </span>
                  )}
                  {!m.primary && (
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => setPrimary(m.id)}
                        className="p-1 rounded-lg transition-all text-xs"
                        style={{ color: 'var(--text-muted)' }}
                        title="Set as primary"
                        onMouseEnter={e => e.currentTarget.style.color = '#F47820'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                        <Star size={12} />
                      </button>
                      <button onClick={() => removeMethod(m.id)}
                        className="p-1 rounded-lg transition-all"
                        style={{ color: 'var(--text-muted)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Auto-renew notice */}
          <div className="card-elevated rounded-3xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(0,166,81,0.09)' }}>
              <Shield size={14} color="#00A651" />
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Auto-Renew Enabled</p>
              <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Your plan renews automatically via M-Pesa. Next charge on{' '}
                <span style={{ color: 'var(--orange)', fontWeight: 600 }}>
                  {hasParty ? (user?.expiry ?? '—') : '—'}
                </span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}