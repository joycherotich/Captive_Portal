import { useState } from 'react'
import {
  FileText, Download, Eye, Search, Filter,
  CheckCircle2, Clock, AlertCircle, Wifi,
  Zap, Droplets, ChevronRight, X, Printer,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const STATUS = {
  paid:    { label: 'Paid',    color: '#00A651', bg: 'rgba(0,166,81,0.09)'   },
  pending: { label: 'Pending', color: '#F59E0B', bg: 'rgba(245,158,11,0.09)' },
  overdue: { label: 'Overdue', color: '#EF4444', bg: 'rgba(239,68,68,0.09)'  },
}

const INVOICES = [
  {
    id: 'INV-2026-042', date: '2026-06-01', due: '2026-06-08',
    items: [{ desc: 'Weekly 20Mbps – Internet Package', qty: 1, unit: 350 }],
    status: 'paid', category: 'internet',
  },
  {
    id: 'INV-2026-041', date: '2026-05-25', due: '2026-06-01',
    items: [{ desc: 'KIWASCO Water Supply – May 2026', qty: 1, unit: 1200 }],
    status: 'paid', category: 'utility',
  },
  {
    id: 'INV-2026-040', date: '2026-05-24', due: '2026-05-31',
    items: [{ desc: 'Weekly 20Mbps – Internet Package', qty: 1, unit: 350 }],
    status: 'paid', category: 'internet',
  },
  {
    id: 'INV-2026-039', date: '2026-05-18', due: '2026-05-25',
    items: [
      { desc: 'Kenya Power Electricity Tokens', qty: 1, unit: 500 },
    ],
    status: 'paid', category: 'utility',
  },
  {
    id: 'INV-2026-038', date: '2026-05-17', due: '2026-05-24',
    items: [{ desc: 'Weekly 20Mbps – Internet Package', qty: 1, unit: 350 }],
    status: 'paid', category: 'internet',
  },
  {
    id: 'INV-2026-037', date: '2026-05-09', due: '2026-05-16',
    items: [{ desc: 'KIWASCO Water Supply – Apr 2026', qty: 1, unit: 1100 }],
    status: 'pending', category: 'utility',
  },
  {
    id: 'INV-2026-036', date: '2026-05-10', due: '2026-05-17',
    items: [{ desc: 'Weekly 20Mbps – Internet Package', qty: 1, unit: 350 }],
    status: 'overdue', category: 'internet',
  },
]

const CAT_ICON = { internet: Wifi, utility: Zap, water: Droplets }
const CAT_CLR  = { internet: '#F47820', utility: '#10B981', water: '#0891B2' }

function total(inv) {
  return inv.items.reduce((s, it) => s + it.qty * it.unit, 0)
}

function InvoiceModal({ inv, onClose, user }) {
  if (!inv) return null
  const tot = total(inv)
  const tax = Math.round(tot * 0.16)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1"
              style={{ color: 'var(--text-muted)' }}>Invoice</p>
            <h2 className="text-xl font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>
              {inv.id}
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
            style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}>
            <X size={15} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { l: 'Billed To',   v: user?.name ?? '—'    },
              { l: 'Phone',       v: user?.phone ?? '—'   },
              { l: 'Issue Date',  v: inv.date              },
              { l: 'Due Date',    v: inv.due               },
            ].map(({ l, v }) => (
              <div key={l}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{l}</p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-main)' }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Line items */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="grid grid-cols-12 px-3 py-2 text-xs font-bold uppercase tracking-wide"
              style={{ background: 'rgba(244,120,32,0.05)', color: 'var(--text-muted)' }}>
              <span className="col-span-7">Description</span>
              <span className="col-span-2 text-center">Qty</span>
              <span className="col-span-3 text-right">Amount</span>
            </div>
            {inv.items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 px-3 py-2.5 text-xs border-t"
                style={{ borderColor: 'var(--border)' }}>
                <span className="col-span-7" style={{ color: 'var(--text-main)' }}>{it.desc}</span>
                <span className="col-span-2 text-center" style={{ color: 'var(--text-muted)' }}>{it.qty}</span>
                <span className="col-span-3 text-right font-bold" style={{ color: 'var(--text-main)' }}>
                  KES {(it.qty * it.unit).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 pt-1">
            {[
              { l: 'Subtotal', v: `KES ${tot.toLocaleString()}` },
              { l: 'VAT (16%)', v: `KES ${tax.toLocaleString()}` },
            ].map(({ l, v }) => (
              <div key={l} className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ color: 'var(--text-main)' }}>{v}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-black pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-main)' }}>Total</span>
              <span style={{ color: 'var(--orange)' }}>KES {(tot + tax).toLocaleString()}</span>
            </div>
          </div>

          {/* Status */}
          <div className="rounded-xl p-3 text-xs font-bold text-center"
            style={{ background: STATUS[inv.status].bg, color: STATUS[inv.status].color }}>
            {STATUS[inv.status].label.toUpperCase()}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'rgba(244,120,32,0.08)', color: '#F47820', border: '1px solid rgba(244,120,32,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,120,32,0.08)'}>
            <Download size={14} /> Download PDF
          </button>
          <button className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'rgba(0,0,0,0.04)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}>
            <Printer size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InvoicesPage() {
  const { user } = useApp()
  const partyId  = user?.partyId ?? ''
  const hasParty = partyId !== ''

  const invoices = hasParty ? INVOICES : []

  const [query,    setQuery]    = useState('')
  const [catFilter, setCat]     = useState('all')
  const [preview,  setPreview]  = useState(null)

  const filtered = invoices.filter(inv => {
    const matchQ = !query || inv.id.toLowerCase().includes(query.toLowerCase()) ||
      inv.items.some(it => it.desc.toLowerCase().includes(query.toLowerCase()))
    const matchC = catFilter === 'all' || inv.category === catFilter
    return matchQ && matchC
  })

  const totalAmount = invoices.reduce((s, inv) => s + total(inv), 0)
  const paidAmount  = invoices.filter(i => i.status === 'paid').reduce((s, inv) => s + total(inv), 0)

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Invoices</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>All your service & utility invoices</p>
      </div>

      {/* ── Summary ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Invoices',  value: invoices.length,                             unit: '',    color: '#1B3A8F', bg: 'rgba(27,58,143,0.08)'   },
          { label: 'Total Billed',    value: `KES ${totalAmount.toLocaleString()}`,        unit: '',    color: '#F47820', bg: 'rgba(244,120,32,0.08)'  },
          { label: 'Amount Paid',     value: `KES ${paidAmount.toLocaleString()}`,         unit: '',    color: '#00A651', bg: 'rgba(0,166,81,0.08)'    },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="card-elevated rounded-2xl p-4">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-xl font-black mt-1" style={{ fontFamily: 'serif', color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters & search ── */}
      <div className="card-elevated rounded-3xl p-5">
        <div className="flex flex-wrap gap-3 mb-4">
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}>
            <Search size={13} style={{ color: 'var(--text-muted)' }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search invoices…"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-main)' }}
            />
            {query && (
              <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }}>
                <X size={12} />
              </button>
            )}
          </div>
          {/* Category filter */}
          <div className="flex gap-1">
            {['all', 'internet', 'utility'].map(c => (
              <button key={c} onClick={() => setCat(c)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all capitalize"
                style={{
                  background: catFilter === c ? 'var(--orange)' : 'rgba(244,120,32,0.07)',
                  color: catFilter === c ? '#fff' : 'var(--orange)',
                  border: `1px solid ${catFilter === c ? 'var(--orange)' : 'rgba(244,120,32,0.2)'}`,
                }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice list */}
        {!hasParty ? (
          <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
            <FileText size={36} style={{ color: 'var(--text-muted)', opacity: 0.35 }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No invoices available</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
              Link your account to view invoices.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center gap-2">
            <Filter size={28} style={{ color: 'var(--text-muted)', opacity: 0.35 }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>No invoices match your filter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(inv => {
              const CatIcon = CAT_ICON[inv.category] ?? FileText
              const catClr  = CAT_CLR[inv.category]  ?? '#F47820'
              const tot     = total(inv)
              const st      = STATUS[inv.status]
              return (
                <div key={inv.id}
                  className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
                  style={{ border: '1px solid var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setPreview(inv)}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${catClr}18` }}>
                    <CatIcon size={15} style={{ color: catClr }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: 'var(--text-main)' }}>{inv.id}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                      {inv.items[0].desc}{inv.items.length > 1 ? ` +${inv.items.length - 1} more` : ''}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{inv.date}</p>
                    <p className="text-sm font-black mt-0.5" style={{ color: 'var(--text-main)' }}>
                      KES {tot.toLocaleString()}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                    style={{ background: st.bg, color: st.color }}>
                    {st.label}
                  </span>
                  <Eye size={13} className="flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Invoice preview modal ── */}
      <InvoiceModal inv={preview} onClose={() => setPreview(null)} user={user} />
    </div>
  )
}