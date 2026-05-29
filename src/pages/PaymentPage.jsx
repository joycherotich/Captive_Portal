import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, Shield, Clock, Smartphone, CreditCard, Globe, ChevronRight, Lock, Wifi, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useApp } from '../context/AppContext'

const METHODS = [
  { id:'mpesa', label:'M-Pesa', sub:'Pay via Safaricom M-Pesa', color:'#00A651', logo:'📱' },
  { id:'pesapal', label:'PesaPal', sub:'Cards, Mobile Money & More', color:'#1B3A8F', logo:'🏦' },
  { id:'paypal', label:'PayPal', sub:'Pay with your PayPal account', color:'#003087', logo:'🅿️' },
]

/* ── M-Pesa Form ── */
function MpesaForm({ plan, onSuccess }) {
  const [phone, setPhone] = useState('+254 ')
  const [step, setStep] = useState('form') // form | pushed | done
  const [countdown, setCountdown] = useState(60)

  const sendSTK = () => {
    setStep('pushed')
    let c = 60
    const t = setInterval(()=>{ c--; setCountdown(c); if(c<=0){clearInterval(t);setStep('done');onSuccess()} },1000)
    // Simulate auto-confirm after 4s
    setTimeout(()=>{ clearInterval(t); setStep('done'); onSuccess() },4000)
  }

  if(step==='pushed') return (
    <div className="text-center py-4 space-y-5">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{background:'rgba(0,166,81,0.1)'}}>
        <Smartphone size={32} color="#00A651"/>
      </div>
      <div>
        <h3 className="font-black text-lg mb-1" style={{fontFamily:'Syne,sans-serif',color:'var(--text-main)'}}>STK Push Sent!</h3>
        <p className="text-sm mb-1" style={{color:'var(--text-muted)'}}>Check your phone <strong style={{color:'var(--text-main)'}}>{phone}</strong></p>
        <p className="text-sm" style={{color:'var(--text-muted)'}}>Enter your M-Pesa PIN to confirm <strong style={{color:'#00A651'}}>KES {plan?.price}</strong></p>
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-5 h-5 border-2 border-t-green-500 border-green-200 rounded-full animate-spin"/>
        <span className="text-sm font-medium" style={{color:'var(--text-muted)'}}>Waiting for confirmation... {countdown}s</span>
      </div>
      <div className="rounded-2xl p-4 text-left" style={{background:'rgba(0,166,81,0.05)',border:'1px solid rgba(0,166,81,0.2)'}}>
        {['1. Phone vibrated with M-Pesa prompt','2. Enter your 4-digit M-Pesa PIN','3. Press OK to confirm payment'].map((s,i)=>(
          <p key={i} className="text-xs mb-1 flex items-center gap-2" style={{color:'var(--text-sub)'}}><span className="w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold text-white flex-shrink-0" style={{background:'#00A651',fontSize:'9px'}}>{i+1}</span>{s.slice(3)}</p>
        ))}
      </div>
      <button className="text-sm font-semibold" style={{color:'var(--orange)'}} onClick={()=>setStep('form')}>← Didn't receive? Try again</button>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{background:'rgba(0,166,81,0.06)',border:'1px solid rgba(0,166,81,0.2)'}}>
        <span className="text-2xl">📱</span>
        <div>
          <p className="font-bold text-sm" style={{color:'var(--text-main)'}}>M-Pesa STK Push</p>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>You'll receive a payment prompt on your phone</p>
        </div>
      </div>
      <div>
        <label className="text-xs font-bold uppercase tracking-wider mb-1.5 block" style={{color:'var(--blue)'}}>M-Pesa Phone Number</label>
        <input className="portal-input" placeholder="+254 7XX XXX XXX" value={phone} onChange={e=>setPhone(e.target.value)}/>
        <p className="text-xs mt-1" style={{color:'var(--text-muted)'}}>Must be a registered Safaricom M-Pesa number</p>
      </div>
      <div className="rounded-2xl p-4" style={{background:'var(--bg)',border:'1px solid var(--border)'}}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{color:'var(--text-muted)'}}>Plan</span>
          <span className="font-bold" style={{color:'var(--text-main)'}}>{plan?.name} — {plan?.period}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span style={{color:'var(--text-muted)'}}>Total</span>
          <span className="font-black text-base" style={{color:'var(--orange)'}}>KES {plan?.price}</span>
        </div>
      </div>
      <button className="btn-primary" style={{background:'linear-gradient(135deg,#00A651,#007A3D)'}} onClick={sendSTK}>
        <span className="flex items-center justify-center gap-2"><Smartphone size={16}/>Send STK Push to {phone.length>8?phone:'My Phone'}</span>
      </button>
    </div>
  )
}

/* ── PesaPal Iframe ── */
function PesaPalForm({ plan, onSuccess }) {
  const [loading, setLoading] = useState(true)
  const [cardData, setCardData] = useState({name:'',number:'',expiry:'',cvv:''})
  const [processing, setProcessing] = useState(false)

  const set=(k,v)=>setCardData(p=>({...p,[k]:v}))
  const formatCard=(v)=>v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
  const formatExpiry=(v)=>{ const d=v.replace(/\D/g,'').slice(0,4); return d.length>=2?`${d.slice(0,2)}/${d.slice(2)}`:d }

  const pay = () => {
    setProcessing(true)
    setTimeout(()=>{ setProcessing(false); onSuccess() },2500)
  }

  return (
    <div className="space-y-4">
      {/* PesaPal branded header */}
      <div className="rounded-2xl overflow-hidden" style={{border:'1.5px solid #1B3A8F30'}}>
        <div className="px-4 py-3 flex items-center justify-between" style={{background:'linear-gradient(135deg,#1B3A8F,#2E54C4)'}}>
          <div className="flex items-center gap-2">
            <span className="text-white font-black text-lg" style={{fontFamily:'Syne,sans-serif'}}>PesaPal</span>
            <span className="text-xs text-blue-200/60 font-medium">Secure Checkout</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-300/80">
            <Lock size={12}/><span>SSL Encrypted</span>
          </div>
        </div>
        <div className="p-4 space-y-3" style={{background:'white'}}>
          {/* Mobile money tabs */}
          <div className="flex gap-2 mb-2">
            {['💳 Card','📱 M-Pesa','📱 Airtel','📱 T-Kash'].map((t,i)=>(
              <button key={t} className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={i===0?{background:'#1B3A8F',color:'white'}:{background:'#F4F6FB',color:'#4A5B8C',border:'1px solid #E0E8F5'}}>
                {t}
              </button>
            ))}
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{color:'#4A5B8C'}}>Cardholder Name</label>
            <input className="portal-input" placeholder="JOHN DOE" value={cardData.name} onChange={e=>set('name',e.target.value.toUpperCase())}/>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{color:'#4A5B8C'}}>Card Number</label>
            <div className="relative">
              <input className="portal-input pr-24" placeholder="0000 0000 0000 0000"
                value={cardData.number} onChange={e=>set('number',formatCard(e.target.value))} maxLength={19}/>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                {['💳','🔵','🔴'].map((ic,i)=><span key={i} className="text-sm">{ic}</span>)}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold mb-1 block" style={{color:'#4A5B8C'}}>Expiry</label>
              <input className="portal-input" placeholder="MM/YY" value={cardData.expiry} onChange={e=>set('expiry',formatExpiry(e.target.value))} maxLength={5}/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold mb-1 block" style={{color:'#4A5B8C'}}>CVV</label>
              <input className="portal-input" placeholder="•••" type="password" value={cardData.cvv} onChange={e=>set('cvv',e.target.value.slice(0,4))} maxLength={4}/>
            </div>
          </div>
          <button onClick={pay} disabled={processing} className="w-full py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all"
            style={{background:'linear-gradient(135deg,#1B3A8F,#2E54C4)',boxShadow:'0 4px 14px rgba(27,58,143,0.35)',opacity:processing?0.75:1}}>
            {processing?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</>
            :<><Lock size={14}/>Pay KES {plan?.price} Securely</>}
          </button>
          <div className="flex items-center justify-center gap-2 pt-1">
            <Shield size={12} color="#9DB0CC"/><span className="text-xs" style={{color:'#9DB0CC'}}>256-bit SSL · PCI-DSS Compliant · 3D Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── PayPal Iframe ── */
function PayPalForm({ plan, onSuccess }) {
  const [processing, setProcessing] = useState(false)
  const [ppEmail, setPpEmail] = useState('')
  const [ppPass, setPpPass] = useState('')

  const pay = () => {
    setProcessing(true)
    setTimeout(()=>{ setProcessing(false); onSuccess() },2200)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden" style={{border:'1.5px solid #003087_30'}}>
        {/* PayPal header */}
        <div className="px-5 py-4 flex items-center justify-between" style={{background:'linear-gradient(135deg,#003087,#009CDE)'}}>
          <div>
            <span className="text-white font-black text-xl tracking-tight">Pay<span style={{color:'#00C2E0'}}>Pal</span></span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-200/70"><Lock size={12}/><span>Buyer Protection</span></div>
        </div>
        <div className="p-4 space-y-3" style={{background:'white'}}>
          {/* Amount display */}
          <div className="text-center py-3 rounded-xl" style={{background:'#F0F5FF',border:'1px solid #C7D7F5'}}>
            <p className="text-xs mb-1" style={{color:'#4A5B8C'}}>You are paying</p>
            <p className="text-2xl font-black" style={{color:'#003087',fontFamily:'Syne,sans-serif'}}>KES {plan?.price}</p>
            <p className="text-xs mt-0.5" style={{color:'#9DB0CC'}}>to DirectCore WiFi Portal</p>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{color:'#4A5B8C'}}>PayPal Email</label>
            <input className="portal-input" type="email" placeholder="your@email.com" value={ppEmail} onChange={e=>setPpEmail(e.target.value)}/>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{color:'#4A5B8C'}}>PayPal Password</label>
            <input className="portal-input" type="password" placeholder="••••••••" value={ppPass} onChange={e=>setPpPass(e.target.value)}/>
          </div>
          <button onClick={pay} disabled={processing} className="w-full py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2"
            style={{background:'linear-gradient(135deg,#003087,#009CDE)',boxShadow:'0 4px 14px rgba(0,48,135,0.35)',opacity:processing?0.75:1}}>
            {processing?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</>
            :<><Globe size={14}/>Pay with PayPal</>}
          </button>
          <p className="text-xs text-center" style={{color:'#9DB0CC'}}>🔒 Your financial details are never shared with DirectCore</p>
        </div>
      </div>
    </div>
  )
}

/* ── Main Payment Page ── */
export default function PaymentPage() {
  const [method, setMethod] = useState('mpesa')
  const [paid, setPaid] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const { activePlan, showToast, user, login } = useApp()
  const navigate = useNavigate()

  useEffect(()=>{
    if(!activePlan) navigate('/packages')
  },[activePlan])

  useEffect(()=>{
    if(paid){
      const t=setInterval(()=>setCountdown(c=>{ if(c<=1){ clearInterval(t); navigate('/dashboard') } return c-1 }),1000)
      return ()=>clearInterval(t)
    }
  },[paid])

  const onSuccess = () => {
    login({...user, plan:`${activePlan?.name} ${activePlan?.speed}`, dataUsed:0, dataTotal:activePlan?.data==='Unlimited'?999:parseInt(activePlan?.data)||10 })
    showToast(`Payment confirmed! ${activePlan?.name} plan activated 🎉`,'success')
    setPaid(true)
  }

  if(!activePlan) return null

  if(paid) return (
    <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] max-w-md mx-auto text-center p-6">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{background:'linear-gradient(135deg,#F47820,#D4631A)',boxShadow:'0 0 40px rgba(244,120,32,0.4)'}}>
        <CheckCircle2 size={40} color="white"/>
      </div>
      <h2 className="text-3xl font-black mb-2" style={{fontFamily:'Syne,sans-serif',color:'var(--text-main)'}}>Payment Confirmed!</h2>
      <p className="mb-2" style={{color:'var(--text-muted)'}}>Your <strong style={{color:'var(--text-main)'}}>{activePlan?.name}</strong> plan is now active.</p>
      <p className="text-sm mb-6" style={{color:'var(--text-muted)'}}>Enjoy {activePlan?.data} at {activePlan?.speed} for {activePlan?.period}.</p>
      <div className="w-full rounded-2xl p-4 mb-6" style={{background:'rgba(244,120,32,0.06)',border:'1.5px solid rgba(244,120,32,0.2)'}}>
        {[{l:'Plan',v:`${activePlan?.name} (${activePlan?.period})`},{l:'Speed',v:activePlan?.speed},{l:'Data',v:activePlan?.data},{l:'Amount Paid',v:`KES ${activePlan?.price}`}].map(({l,v})=>(
          <div key={l} className="flex justify-between py-2 border-b last:border-0" style={{borderColor:'rgba(244,120,32,0.1)'}}>
            <span className="text-sm" style={{color:'var(--text-muted)'}}>{l}</span>
            <span className="text-sm font-bold" style={{color:'var(--text-main)'}}>{v}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm" style={{color:'var(--text-muted)'}}>
        <Wifi size={16} color="#F47820"/>
        <span>Redirecting to Dashboard in <strong style={{color:'var(--orange)'}}>{countdown}s</strong>...</span>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in max-w-xl mx-auto">
      {/* Back + step indicator */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={()=>navigate('/packages')} className="flex items-center gap-1.5 text-sm font-semibold transition-all px-3 py-2 rounded-xl hover:bg-white"
          style={{color:'var(--text-muted)',border:'1.5px solid var(--border)'}}>
          <ArrowLeft size={15}/>Back
        </button>
        <div className="flex items-center gap-1.5 text-sm" style={{color:'var(--text-muted)'}}>
          <span className="font-semibold" style={{color:'var(--blue)'}}>Step 2 of 2</span>
          <span>— Payment</span>
        </div>
      </div>

      <h1 className="text-3xl font-black mb-1" style={{fontFamily:'Syne,sans-serif',color:'var(--text-main)'}}>Complete Payment</h1>
      <p className="text-sm mb-6" style={{color:'var(--text-muted)'}}>Choose your preferred payment method below</p>

      {/* Plan summary */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,#F47820,#D4631A)'}}>
          <Wifi size={22} color="white"/>
        </div>
        <div className="flex-1">
          <p className="font-black" style={{color:'var(--text-main)'}}>{activePlan?.name} Plan · {activePlan?.period}</p>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>{activePlan?.speed} · {activePlan?.data} data</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black" style={{fontFamily:'Syne,sans-serif',color:'var(--orange)'}}>KES {activePlan?.price}</p>
          <p className="text-xs" style={{color:'var(--text-muted)'}}>one-time</p>
        </div>
      </div>

      {/* Payment method selector */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {METHODS.map(m=>(
          <button key={m.id} onClick={()=>setMethod(m.id)}
            className="p-3 rounded-2xl text-center transition-all"
            style={method===m.id?{background:'white',border:`2px solid ${m.color}`,boxShadow:`0 4px 16px ${m.color}22`}:{background:'white',border:'1.5px solid var(--border)'}}>
            <div className="text-2xl mb-1">{m.logo}</div>
            <p className="text-xs font-black" style={{color:method===m.id?m.color:'var(--text-muted)',fontFamily:'Syne,sans-serif'}}>{m.label}</p>
          </button>
        ))}
      </div>

      {/* Payment form panel */}
      <div className="card p-5">
        {method==='mpesa' && <MpesaForm plan={activePlan} onSuccess={onSuccess}/>}
        {method==='pesapal' && <PesaPalForm plan={activePlan} onSuccess={onSuccess}/>}
        {method==='paypal' && <PayPalForm plan={activePlan} onSuccess={onSuccess}/>}
      </div>

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
        {[{icon:Shield,label:'Secure Payment'},{icon:Lock,label:'Encrypted'},{icon:Check,label:'Instant Activation'}].map(({icon:I,label})=>(
          <div key={label} className="flex items-center gap-1.5 text-xs" style={{color:'var(--text-muted)'}}>
            <I size={13} color="#F47820"/>{label}
          </div>
        ))}
      </div>
    </div>
  )
}