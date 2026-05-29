import { useState } from 'react'
import { RefreshCw, XCircle, CheckCircle, Clock, Zap, TrendingUp, Star, Plus, Wifi } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const HISTORY = [
  { id:'TXN001', plan:'Weekly 20Mbps',  amount:500, date:'2026-05-28', status:'active',  expiry:'2026-07-05', icon:Star,       color:'#7C3AED' },
  { id:'TXN002', plan:'Daily 10Mbps',   amount:100, date:'2026-05-20', status:'expired', expiry:'2026-06-21', icon:TrendingUp, color:'#F47820' },
  { id:'TXN003', plan:'Flash 5Mbps',    amount:20,  date:'2026-04-18', status:'expired', expiry:'2026-06-18', icon:Zap,        color:'#1B3A8F' },
]

export default function SubscriptionsPage() {
  const [tab, setTab]             = useState('active')
  const [connected, setConnected] = useState(null)   // id of currently connected plan
  const { showToast }             = useApp()
  const navigate                  = useNavigate()

  const active  = HISTORY.filter(h => h.status === 'active')
  const expired = HISTORY.filter(h => h.status === 'expired')
  const shown   = tab === 'active' ? active : expired

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
    <div className="animate-fade-in max-w-2xl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily:'serif', color:'var(--text-main)' }}>Subscriptions</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>Your data plans & payment history</p>
        </div>
        <button onClick={() => navigate('/packages')} className="btn-primary" style={{ width:'auto', padding:'10px 18px', fontSize:'13px' }}>
          <span className="flex items-center gap-1.5"><Plus size={15}/>New Plan</span>
        </button>
      </div>

      {/* Active plan hero card */}
      {active.length > 0 && (
        <div className="rounded-3xl p-5 mb-5 relative overflow-hidden"
          style={{ background:'linear-gradient(135deg,#0A1845,#1B3A8F)', boxShadow:'0 8px 32px rgba(27,58,143,0.2)' }}>
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-15 -translate-y-8 translate-x-8"
            style={{ background:'radial-gradient(circle,#F47820,transparent)' }}/>
          <div className="flex items-start justify-between mb-4 relative">
            <div>
              <p className="text-xs text-blue-200/60 uppercase tracking-widest mb-1">Current Plan</p>
              <h2 className="text-xl font-black text-white" style={{ fontFamily:'serif' }}>{active[0].plan}</h2>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background:'rgba(0,166,81,0.2)', color:'#4ADE80' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 status-pulse"/>Active
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[{ l:'Paid', v:`KES ${active[0].amount}` }, { l:'Activated', v:active[0].date }, { l:'Expires', v:active[0].expiry }].map(({ l, v }) => (
              <div key={l} className="rounded-2xl p-3" style={{ background:'rgba(255,255,255,0.08)' }}>
                <p className="text-xs text-blue-200/50 mb-1">{l}</p>
                <p className="text-sm font-bold text-white">{v}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => showToast('Plan renewed!', 'success')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background:'linear-gradient(135deg,#F47820,#D4631A)', boxShadow:'0 4px 12px rgba(244,120,32,0.4)' }}>
              <RefreshCw size={14}/>Renew
            </button>
            <button onClick={() => showToast('Cancelled.', 'info')}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background:'rgba(239,68,68,0.12)', color:'#f87171', border:'1px solid rgba(239,68,68,0.25)' }}>
              <XCircle size={14}/>Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[{ id:'active', l:`Active (${active.length})` }, { id:'history', l:`History (${expired.length})` }].map(({ id, l }) => (
          <button key={id} onClick={() => setTab(id)} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={tab === id
              ? { background:'rgba(244,120,32,0.1)', color:'var(--orange)', border:'1.5px solid rgba(244,120,32,0.3)' }
              : { background:'white', color:'var(--text-muted)', border:'1.5px solid var(--border)' }}>
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="card-elevated rounded-3xl p-3 space-y-1">
        {shown.map(s => {
          const I            = s.icon
          const isConnected  = connected === s.id
          const canConnect   = s.status === 'active'

          return (
            <div key={s.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-orange-50 transition-all">

              {/* Icon */}
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background:`${s.color}12` }}>
                <I size={18} style={{ color:s.color }}/>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color:'var(--text-main)' }}>{s.plan}</p>
                <p className="text-xs" style={{ color:'var(--text-muted)' }}>{s.date} · #{s.id}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {s.status === 'active'
                    ? <CheckCircle size={11} color="#00A651"/>
                    : <Clock size={11} style={{ color:'var(--text-muted)' }}/>}
                  <span className="text-xs font-medium"
                    style={{ color: s.status === 'active' ? '#00A651' : 'var(--text-muted)' }}>
                    {s.status === 'active' ? 'Active' : 'Expired'} · KES {s.amount}
                  </span>
                </div>
              </div>

              {/* Connect / Activate button */}
              <button
                onClick={() => canConnect ? handleConnect(s) : navigate('/packages')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0 transition-all"
                style={
                  !canConnect
                    ? { background:'rgba(244,120,32,0.08)', color:'var(--orange)', border:'1.5px solid rgba(244,120,32,0.25)' }
                    : isConnected
                      ? { background:'rgba(0,166,81,0.1)', color:'#00A651', border:'1.5px solid rgba(0,166,81,0.3)' }
                      : { background:'rgba(27,58,143,0.08)', color:'#1B3A8F', border:'1.5px solid rgba(27,58,143,0.2)' }
                }>
                <Wifi size={12}/>
                {!canConnect ? 'Activate' : isConnected ? 'Connected' : 'Connect'}
              </button>

            </div>
          )
        })}

        {shown.length === 0 && (
          <div className="text-center py-6 text-sm" style={{ color:'var(--text-muted)' }}>
            No {tab} subscriptions
          </div>
        )}
      </div>

    </div>
  )
}