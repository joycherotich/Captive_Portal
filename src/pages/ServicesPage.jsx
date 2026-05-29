import { useState } from 'react'
import { Phone, Zap, Droplets, Tv, ShoppingBag, Car, GraduationCap, HeartPulse, ChevronRight, ArrowRight, X, Check } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SERVICES=[
  {id:'airtime',label:'Airtime & Bundles',icon:Phone,color:'#00A651',desc:'Top up any network instantly',popular:true},
  {id:'electricity',label:'Electricity (KPLC)',icon:Zap,color:'#F47820',desc:'Buy KPLC tokens & pay bills',popular:true},
  {id:'water',label:'Water Bills',icon:Droplets,color:'#0891B2',desc:'Nairobi Water & counties',popular:false},
  {id:'tv',label:'TV Subscription',icon:Tv,color:'#7C3AED',desc:'DStv, Zuku, StarTimes',popular:true},
  {id:'shopping',label:'Online Shopping',icon:ShoppingBag,color:'#EC4899',desc:'Jumia, Kilimall vouchers',popular:false},
  {id:'transport',label:'Transport (Bolt/Uber)',icon:Car,color:'#1B3A8F',desc:'Load ride credits',popular:false},
  {id:'school',label:'School Fees',icon:GraduationCap,color:'#059669',desc:'Pay school fees online',popular:false},
  {id:'health',label:'Health Insurance',icon:HeartPulse,color:'#EF4444',desc:'NHIF & private cover',popular:false},
]

export default function ServicesPage(){
  const [active,setActive]=useState(null)
  const [phone,setPhone]=useState('')
  const [amount,setAmount]=useState('')
  const [ref,setRef]=useState('')
  const [network,setNetwork]=useState('Safaricom')
  const [processing,setProcessing]=useState(false)
  const {showToast}=useApp()
  const svc=SERVICES.find(s=>s.id===active)

  const pay=()=>{ setProcessing(true); setTimeout(()=>{ setProcessing(false); showToast(`${svc?.label} payment processed!`,'success'); setActive(null); setAmount(''); setPhone('') },2000) }

  return(
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>Other Services</h1>
        <p className="text-sm mt-1" style={{color:'var(--text-muted)'}}>Pay bills & top-up while connected to DirectCore WiFi</p>
      </div>

      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-wider mb-3" style={{color:'var(--blue)'}}>Popular Services</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SERVICES.filter(s=>s.popular).map(s=>{const I=s.icon; return(
            <button key={s.id} onClick={()=>setActive(s.id)}
              className="card-elevated rounded-2xl p-4 text-left hover:shadow-lg transition-all group"
              style={{border:`1.5px solid ${s.color}20`}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{background:`${s.color}12`}}>
                <I size={20} style={{color:s.color}}/>
              </div>
              <p className="text-sm font-black mb-0.5" style={{fontFamily:'serif',color:'var(--text-main)'}}>{s.label}</p>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.desc}</p>
              <ArrowRight size={14} className="mt-2 transition-transform group-hover:translate-x-1" style={{color:s.color}}/>
            </button>
          )})}
        </div>
      </div>

      <div className="card-elevated rounded-3xl p-2">
        <p className="text-xs font-black uppercase tracking-wider px-3 py-2" style={{color:'var(--blue)'}}>All Services</p>
        {SERVICES.map(s=>{const I=s.icon; return(
          <button key={s.id} onClick={()=>setActive(s.id)} className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-orange-50 transition-all text-left">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{background:`${s.color}10`}}>
              <I size={17} style={{color:s.color}}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{color:'var(--text-main)'}}>{s.label}</p>
              <p className="text-xs" style={{color:'var(--text-muted)'}}>{s.desc}</p>
            </div>
            {s.popular&&<span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0" style={{background:'rgba(244,120,32,0.1)',color:'var(--orange)'}}>Popular</span>}
            <ChevronRight size={15} style={{color:'var(--text-muted)'}}/>
          </button>
        )})}
      </div>

      {active&&svc&&(
        <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&setActive(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 animate-slide-up" style={{boxShadow:'0 24px 64px rgba(27,58,143,0.2)',border:`1.5px solid ${svc.color}25`}}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:`${svc.color}12`}}>
                  <svc.icon size={20} style={{color:svc.color}}/>
                </div>
                <h3 className="font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>{svc.label}</h3>
              </div>
              <button onClick={()=>setActive(null)} className="p-1.5 rounded-xl hover:bg-gray-100 transition-all" style={{color:'var(--text-muted)'}}><X size={17}/></button>
            </div>

            {active==='airtime'&&(
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {['Safaricom','Airtel','Telkom'].map(n=>(
                    <button key={n} onClick={()=>setNetwork(n)} className="py-2 rounded-xl text-xs font-bold transition-all"
                      style={network===n?{background:'linear-gradient(135deg,#00A651,#007A3D)',color:'white'}:{background:'var(--bg)',color:'var(--text-muted)',border:'1.5px solid var(--border)'}}>
                      {n}
                    </button>
                  ))}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Phone Number</label>
                  <input className="portal-input" placeholder="0712 345 678" value={phone} onChange={e=>setPhone(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Amount (KES)</label>
                  <div className="flex gap-2 mb-2">
                    {[50,100,200,500].map(a=>(
                      <button key={a} onClick={()=>setAmount(String(a))} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                        style={amount===String(a)?{background:'linear-gradient(135deg,#F47820,#D4631A)',color:'white'}:{background:'var(--bg)',color:'var(--text-muted)',border:'1.5px solid var(--border)'}}>
                        {a}
                      </button>
                    ))}
                  </div>
                  <input className="portal-input" placeholder="Custom amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
                </div>
              </div>
            )}

            {active!=='airtime'&&(
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Account / Reference</label>
                  <input className="portal-input" placeholder="Enter reference number" value={ref} onChange={e=>setRef(e.target.value)}/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wide mb-1.5 block" style={{color:'var(--blue)'}}>Amount (KES)</label>
                  <div className="flex gap-2 mb-2">
                    {[200,500,1000,2000].map(a=>(
                      <button key={a} onClick={()=>setAmount(String(a))} className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                        style={amount===String(a)?{background:`linear-gradient(135deg,${svc.color},${svc.color}cc)`,color:'white'}:{background:'var(--bg)',color:'var(--text-muted)',border:'1.5px solid var(--border)'}}>
                        {a}
                      </button>
                    ))}
                  </div>
                  <input className="portal-input" placeholder="Custom amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
                </div>
              </div>
            )}

            <div className="mt-5 pt-4 border-t" style={{borderColor:'var(--border)'}}>
              {amount&&<div className="flex justify-between text-sm mb-3">
                <span style={{color:'var(--text-muted)'}}>Total</span>
                <span className="font-black" style={{color:'var(--orange)'}}>KES {amount}</span>
              </div>}
              <button onClick={pay} disabled={processing||!amount} className="btn-primary" >
                {processing?<span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Processing...</span>
                :<span className="flex items-center justify-center gap-2"><Check size={15}/>Pay via M-Pesa</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}