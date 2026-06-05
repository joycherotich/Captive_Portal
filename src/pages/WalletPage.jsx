import { useState } from 'react'
import {
  Wallet, ArrowDownLeft, ArrowUpRight, Plus, Clock,
  CheckCircle2, AlertCircle, Wifi, Zap, Droplets,
  CreditCard, Phone, ChevronRight, X, RefreshCw,
  TrendingUp, Shield,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const TXN_TYPES = {
  credit:  { color: '#00A651', bg: 'rgba(0,166,81,0.09)',   icon: ArrowDownLeft,  sign: '+' },
  debit:   { color: '#EF4444', bg: 'rgba(239,68,68,0.09)',  icon: ArrowUpRight,   sign: '-' },
}

const TRANSACTIONS = [
  { id: 'T-8821', date: '2026-06-01 10:42', desc: 'M-Pesa Top-up',                type: 'credit', amount: 1000, ref: 'QHJ8827TYS' },
  { id: 'T-8820', date: '2026-06-01 10:43', desc: 'Weekly 20Mbps – Auto-renew',   type: 'debit',  amount: 350,  ref: 'INV-2026-042' },
  { id: 'T-8815', date: '2026-05-25 09:10', desc: 'M-Pesa Top-up',                type: 'credit', amount: 2000, ref: 'RYK7193MMX' },
  { id: 'T-8814', date: '2026-05-25 09:11', desc: 'KIWASCO Water Bill',            type: 'debit',  amount: 1200, ref: 'INV-2026-041' },
  { id: 'T-8810', date: '2026-05-24 11:00', desc: 'Weekly 20Mbps – Auto-renew',   type: 'debit',  amount: 350,  ref: 'INV-2026-040' },
  { id: 'T-8805', date: '2026-05-18 14:22', desc: 'M-Pesa Top-up',                type: 'credit', amount: 500,  ref: 'XPA2881KLZ' },
  { id: 'T-8804', date: '2026-05-18 14:23', desc: 'Electricity Token Top-up',     type: 'debit',  amount: 500,  ref: 'INV-2026-039' },
  { id: 'T-8800', date: '2026-05-17 08:55', desc: 'Weekly 20Mbps – Auto-renew',   type: 'debit',  amount: 350,  ref: 'INV-2026-038' },
]

const TOP_UP_AMOUNTS = [200, 500, 1000, 2000]

const CATEGORY_ICON = {
  'Weekly 20Mbps': Wifi,
  'KIWASCO':       Droplets,
  'Electricity':   Zap,
  'M-Pesa':        Phone,
}

function getCategoryIcon(desc) {
  for (const [key, Icon] of Object.entries(CATEGORY_ICON)) {
    if (desc.includes(key)) return Icon
  }
  return Wallet
}

function TopUpModal({ onClose, onConfirm }) {
  const [amount,  setAmount]  = useState('')
  const [custom,  setCustom]  = useState(false)
  const [method,  setMethod]  = useState('mpesa')
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return
    setLoading(true)
    setTimeout(() => { setLoading(false); onConfirm(Number(amount)); onClose() }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 pt-6 pb-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-lg font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Top Up Wallet</h2>
          <button onClick={onClose}
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>
            <X size={14} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Quick amounts */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Quick Amount (KES)</p>
            <div className="grid grid-cols-4 gap-2">
              {TOP_UP_AMOUNTS.map(a => (
                <button key={a}
                  onClick={() => { setAmount(String(a)); setCustom(false) }}
                  className="py-2 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: amount === String(a) && !custom ? 'var(--orange)' : 'rgba(244,120,32,0.07)',
                    color: amount === String(a) && !custom ? '#fff' : 'var(--orange)',
                    border: `1px solid ${amount === String(a) && !custom ? 'var(--orange)' : 'rgba(244,120,32,0.2)'}`,
                  }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div>
            <p className="text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>Custom Amount</p>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ border: `1px solid ${custom ? 'var(--orange)' : 'var(--border)'}`, background: 'rgba(0,0,0,0.02)' }}>
              <span className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>KES</span>
              <input
                type="number"
                value={custom ? amount : ''}
                onChange={e => { setAmount(e.target.value); setCustom(true) }}
                onFocus={() => setCustom(true)}
                placeholder="Enter amount"
                className="flex-1 bg-transparent text-sm outline-none font-semibold"
                style={{ color: 'var(--text-main)' }}
              />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Pay Via</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'mpesa', label: 'M-Pesa', icon: Phone },
                { id: 'card',  label: 'Card',   icon: CreditCard },
              ].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setMethod(id)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all text-sm font-semibold"
                  style={{
                    background: method === id ? 'rgba(244,120,32,0.08)' : 'rgba(0,0,0,0.02)',
                    border: `1px solid ${method === id ? 'rgba(244,120,32,0.3)' : 'var(--border)'}`,
                    color: method === id ? 'var(--orange)' : 'var(--text-muted)',
                  }}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button onClick={handleConfirm} disabled={!amount || loading}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
            style={{
              background: amount && !loading ? 'var(--orange)' : 'rgba(244,120,32,0.3)',
              color: '#fff',
              cursor: amount && !loading ? 'pointer' : 'not-allowed',
            }}>
            {loading
              ? <><RefreshCw size={14} className="animate-spin" /> Processing…</>
              : <>Top Up KES {amount || '0'}</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WalletPage() {
  const { user } = useApp()
  const partyId  = user?.partyId ?? ''
  const hasParty = partyId !== ''

  const [balance,   setBalance]   = useState(hasParty ? 650 : 0)
  const [txns,      setTxns]      = useState(hasParty ? TRANSACTIONS : [])
  const [showTopUp, setShowTopUp] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')

  const handleTopUp = (amount) => {
    const newTxn = {
      id: `T-${Math.floor(Math.random() * 9000) + 1000}`,
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      desc: 'M-Pesa Top-up',
      type: 'credit',
      amount,
      ref: Math.random().toString(36).slice(2, 12).toUpperCase(),
    }
    setBalance(b => b + amount)
    setTxns(t => [newTxn, ...t])
  }

  const filtered = typeFilter === 'all' ? txns : txns.filter(t => t.type === typeFilter)

  const totalIn  = txns.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const totalOut = txns.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Wallet</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Balance, top-ups & spending</p>
        </div>
        {hasParty && (
          <button onClick={() => setShowTopUp(true)}
            className="btn-primary text-xs px-4 py-2 rounded-xl flex items-center gap-1.5">
            <Plus size={13} /> Top Up
          </button>
        )}
      </div>

      {/* ── Balance hero ── */}
      <div className="card-elevated rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F47820, transparent)' }} />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1B3A8F, transparent)' }} />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
            Available Balance
          </p>
          <p className="text-4xl font-black mt-1 mb-3" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>
            KES {balance.toLocaleString()}
            <span className="text-lg font-normal ml-1" style={{ color: 'var(--text-muted)' }}>.00</span>
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(0,166,81,0.12)' }}>
                <ArrowDownLeft size={11} color="#00A651" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Money In</p>
                <p className="text-sm font-bold" style={{ color: '#00A651' }}>KES {totalIn.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.1)' }}>
                <ArrowUpRight size={11} color="#EF4444" />
              </div>
              <div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Money Out</p>
                <p className="text-sm font-bold" style={{ color: '#EF4444' }}>KES {totalOut.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick top-up chips ── */}
      {hasParty && (
        <div className="flex gap-2 flex-wrap">
          {TOP_UP_AMOUNTS.map(a => (
            <button key={a}
              onClick={() => handleTopUp(a)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
              style={{ background: 'rgba(244,120,32,0.08)', color: '#F47820', border: '1px solid rgba(244,120,32,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,120,32,0.08)'}>
              <Plus size={11} /> KES {a}
            </button>
          ))}
          <button onClick={() => setShowTopUp(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            style={{ background: 'rgba(27,58,143,0.07)', color: '#1B3A8F', border: '1px solid rgba(27,58,143,0.18)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(27,58,143,0.13)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(27,58,143,0.07)'}>
            Custom <ChevronRight size={11} />
          </button>
        </div>
      )}

      {/* ── Transactions ── */}
      <div className="card-elevated rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Transactions</h3>
          <div className="flex gap-1">
            {['all', 'credit', 'debit'].map(f => (
              <button key={f} onClick={() => setTypeFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize"
                style={{
                  background: typeFilter === f ? 'var(--orange)' : 'rgba(244,120,32,0.07)',
                  color: typeFilter === f ? '#fff' : 'var(--orange)',
                  border: `1px solid ${typeFilter === f ? 'var(--orange)' : 'rgba(244,120,32,0.2)'}`,
                }}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {!hasParty ? (
          <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
            <Wallet size={36} style={{ color: 'var(--text-muted)', opacity: 0.35 }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No transactions</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>Link your account to see wallet activity.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <TrendingUp size={28} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No {typeFilter} transactions</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(txn => {
              const t    = TXN_TYPES[txn.type]
              const Icon = getCategoryIcon(txn.desc)
              const TIcon = t.icon
              return (
                <div key={txn.id}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                  style={{ border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: t.bg }}>
                    <Icon size={15} style={{ color: t.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>{txn.desc}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {txn.date} · {txn.ref}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <TIcon size={11} style={{ color: t.color }} />
                    <span className="text-sm font-black" style={{ color: t.color }}>
                      {t.sign}KES {txn.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Security note ── */}
      <div className="card-elevated rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,166,81,0.08)' }}>
          <Shield size={14} color="#00A651" />
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          All wallet transactions are encrypted and processed securely via M-Pesa & PCI-DSS compliant gateways.
        </p>
      </div>

      {/* ── Top-up modal ── */}
      {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} onConfirm={handleTopUp} />}
    </div>
  )
}