import { useState } from 'react'
import { Ticket, Phone, ChevronDown, ChevronUp, MessageSquare, Check, AlertCircle, Send, X, Plus, CheckCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'

const FAQS=[
  {q:'How do I renew my plan?',a:'Go to Subscriptions → click Renew, or visit Packages to buy a new one. Payment via M-Pesa or card.'},
  {q:'What happens when data runs out?',a:'Speed slows to 256Kbps. Purchase a top-up to restore full speed instantly.'},
  {q:'How do I get a refund?',a:'Refund requests within 24h of purchase. Submit a ticket and we process within 2 business days.'},
  {q:'Can I share my connection?',a:'Yes — Weekly plan supports 3 devices, Monthly supports 5. Check plan details under Subscriptions.'},
  {q:'Why is my connection slow?',a:'Could be congestion, device, or distance from access point. Run a speed test and contact support if below plan speed.'},
  {q:'How do I change my password?',a:'My Profile → Account Settings → Change Password. You will receive an OTP to your registered phone.'},
]

const MY_TICKETS=[
  {id:'TKT-001',title:'Slow speeds after 8pm',status:'resolved',date:'2026-04-25'},
  {id:'TKT-002',title:'Billing discrepancy June',status:'open',date:'2026-05-28'},
]

export default function SupportPage(){
  const [tab,setTab]=useState('faqs')
  const [openFaq,setOpenFaq]=useState(null)
  const [showForm,setShowForm]=useState(false)
  const [tf,setTf]=useState({title:'',category:'',message:''})
  const [cbPhone,setCbPhone]=useState('')
  const [cbTime,setCbTime]=useState('')
  const [submitting,setSubmitting]=useState(false)
  const {showToast}=useApp()

  const submitTicket=()=>{ setSubmitting(true); setTimeout(()=>{ setSubmitting(false); setShowForm(false); setTf({title:'',category:'',message:''}); showToast('Ticket created! We reply within 4 hours.','success') },1600) }
  const requestCb=()=>{ setSubmitting(true); setTimeout(()=>{ setSubmitting(false); showToast('Callback scheduled!','success'); setCbPhone(''); setCbTime('') },1400) }

  return(
    <div className="animate-fade-in max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>Support</h1>
        <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>FAQs, tickets, and callback requests</p>
      </div>

      {/* Live chat bar */}
      <div className="rounded-2xl p-4 mb-5 flex items-center gap-3" style={{background:'linear-gradient(135deg,rgba(27,58,143,0.06),rgba(244,120,32,0.04))',border:'1.5px solid rgba(244,120,32,0.2)'}}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'rgba(244,120,32,0.1)'}}>
          <MessageSquare size={18} color="#F47820"/>
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{color:'var(--text-main)'}}>Live Chat Available</p>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>Mon–Fri 8AM–8PM · Sat 9AM–5PM</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 status-pulse"/>
          <span className="text-xs font-semibold" style={{color:'#00A651'}}>Online</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[{id:'faqs',l:'FAQs'},{id:'tickets',l:'My Tickets'},{id:'callback',l:'Callback'}].map(({id,l})=>(
          <button key={id} onClick={()=>setTab(id)} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={tab===id?{background:'linear-gradient(135deg,#F47820,#D4631A)',color:'white',boxShadow:'0 4px 12px rgba(244,120,32,0.3)'}:{background:'white',color:'var(--text-muted)',border:'1.5px solid var(--border)'}}>
            {l}
          </button>
        ))}
      </div>

      {tab==='faqs'&&(
        <div className="card-elevated rounded-3xl p-2 space-y-0.5">
          {FAQS.map((f,i)=>(
            <div key={i} className="rounded-2xl overflow-hidden transition-all" style={{background:openFaq===i?'rgba(244,120,32,0.04)':'transparent'}}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full flex items-center gap-3 p-4 text-left hover:bg-orange-50 transition-all rounded-2xl">
                <div className="flex-1">
                  <p className="text-sm font-semibold" style={{color:'var(--text-main)'}}>{f.q}</p>
                </div>
                {openFaq===i?<ChevronUp size={16} style={{color:'var(--orange)'}}/>:<ChevronDown size={16} style={{color:'var(--text-muted)'}}/>}
              </button>
              {openFaq===i&&<div className="px-4 pb-4"><p className="text-sm leading-relaxed border-t pt-3" style={{color:'var(--text-sub)',borderColor:'rgba(244,120,32,0.15)'}}>{f.a}</p></div>}
            </div>
          ))}
        </div>
      )}

      {tab==='tickets'&&(
        <div>
          <div className="flex justify-end mb-3">
            <button onClick={()=>setShowForm(true)} className="btn-primary" style={{width:'auto',padding:'10px 16px',fontSize:'13px'}}>
              <span className="flex items-center gap-1.5"><Plus size={14}/>New Ticket</span>
            </button>
          </div>
          <div className="card-elevated rounded-3xl p-3 space-y-1">
            {MY_TICKETS.map(t=>(
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-orange-50 transition-all cursor-pointer">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:t.status==='open'?'rgba(244,120,32,0.1)':'rgba(0,166,81,0.1)'}}>
                  {t.status==='open'?<AlertCircle size={16} color="#F47820"/>:<CheckCircle size={16} color="#00A651"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{color:'var(--text-main)'}}>{t.title}</p>
                  <p className="text-xs" style={{color:'var(--text-muted)'}}>{t.id} · {t.date}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0"
                  style={{background:t.status==='open'?'rgba(244,120,32,0.1)':'rgba(0,166,81,0.1)',color:t.status==='open'?'var(--orange)':'#00A651'}}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==='callback'&&(
        <div className="card-elevated rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:'rgba(27,58,143,0.08)'}}>
              <Phone size={18} color="#1B3A8F"/>
            </div>
            <div>
              <p className="font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>Request a Callback</p>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>We'll call you at your preferred time</p>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Your Phone</label>
            <input className="portal-input" placeholder="+254 712 345 678" value={cbPhone} onChange={e=>setCbPhone(e.target.value)}/>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Preferred Time</label>
            <div className="grid grid-cols-2 gap-2">
              {['ASAP (< 30 min)','Today 2PM–4PM','Today 4PM–6PM','Tomorrow Morning'].map(t=>(
                <button key={t} onClick={()=>setCbTime(t)} className="py-2.5 px-3 rounded-xl text-xs font-semibold text-left transition-all"
                  style={cbTime===t?{background:'rgba(244,120,32,0.1)',color:'var(--orange)',border:'1.5px solid rgba(244,120,32,0.3)'}:{background:'var(--bg)',color:'var(--text-muted)',border:'1.5px solid var(--border)'}}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <input className="portal-input" placeholder="Brief description (optional)"/>
          <button onClick={requestCb} disabled={submitting||!cbPhone||!cbTime} className="btn-primary" style={{opacity:(!cbPhone||!cbTime)?0.5:1}}>
            {submitting?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Scheduling...</span>
            :<span className="flex items-center justify-center gap-2"><Phone size={15}/>Schedule Callback</span>}
          </button>
        </div>
      )}

      {showForm&&(
        <div className="modal-bg">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 animate-slide-up" style={{boxShadow:'0 24px 64px rgba(27,58,143,0.2)'}}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>New Support Ticket</h3>
              <button onClick={()=>setShowForm(false)} className="p-1.5 rounded-xl hover:bg-gray-100" style={{color:'var(--text-muted)'}}><X size={17}/></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Subject</label>
                <input className="portal-input" placeholder="Brief description" value={tf.title} onChange={e=>setTf(p=>({...p,title:e.target.value}))}/>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Category</label>
                <select className="portal-input" value={tf.category} onChange={e=>setTf(p=>({...p,category:e.target.value}))}>
                  <option value="">Select category</option>
                  {['Connectivity Issue','Billing & Payments','Account Access','Slow Speeds','Other'].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Description</label>
                <textarea className="portal-input" rows={4} placeholder="Describe your issue..." value={tf.message} onChange={e=>setTf(p=>({...p,message:e.target.value}))} style={{resize:'none'}}/>
              </div>
            </div>
            <button onClick={submitTicket} disabled={submitting||!tf.title||!tf.message} className="btn-primary mt-5" style={{opacity:(!tf.title||!tf.message)?0.5:1}}>
              {submitting?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Submitting...</span>
              :<span className="flex items-center justify-center gap-2"><Send size={15}/>Submit Ticket</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}