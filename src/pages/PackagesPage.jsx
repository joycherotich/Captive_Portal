import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Clock, Infinity, Check, Star, TrendingUp, ArrowRight, Tag, Wifi } from 'lucide-react'
import { useApp } from '../context/AppContext'

const PACKAGES = [
  { id:1, name:'Flash', price:20, currency:'KES', period:'1 Hour', speed:'5 Mbps', data:'500 MB',
    features:['WhatsApp & Social','Basic Browsing','Email Access'],
    accent:'#4D78E8', gradient:'linear-gradient(135deg,#1B3A8F,#2E54C4)', badge:null, icon:Zap },
  { id:2, name:'Daily', price:100, currency:'KES', period:'24 Hours', speed:'10 Mbps', data:'2 GB',
    features:['All Social Media','Video Streaming','Gaming','Video Calls'],
    accent:'#F47820', gradient:'linear-gradient(135deg,#D4631A,#F47820)', badge:'Most Popular', icon:TrendingUp, featured:true },
  { id:3, name:'Weekly', price:500, currency:'KES', period:'7 Days', speed:'20 Mbps', data:'10 GB',
    features:['Everything in Daily','4K Streaming','Fast Downloads','Priority Queue'],
    accent:'#7C3AED', gradient:'linear-gradient(135deg,#5B21B6,#7C3AED)', badge:'Best Value', icon:Star },
  { id:4, name:'Monthly', price:1500, currency:'KES', period:'30 Days', speed:'50 Mbps', data:'Unlimited',
    features:['Unlimited Data','Fastest Speeds','Static IP','24/7 Support','5 Devices'],
    accent:'#0891B2', gradient:'linear-gradient(135deg,#0E7490,#0891B2)', badge:'Enterprise', icon:Infinity },
]

export default function PackagesPage() {
  const [hovered, setHovered] = useState(null)
  const [loading, setLoading] = useState(null)
  const { showToast, setActivePlan, user } = useApp()
  const navigate = useNavigate()

  const handleChoose = (pkg) => {
    setLoading(pkg.id)
    setTimeout(()=>{ setLoading(null); setActivePlan(pkg); navigate('/payment') }, 600)
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:'rgba(244,120,32,0.1)'}}>
            <Wifi size={16} color="#F47820"/>
          </div>
          <span className="text-sm font-semibold" style={{color:'var(--text-muted)'}}>Step 1 of 2</span>
          <span className="text-sm" style={{color:'var(--text-muted)'}}>— Choose a Plan</span>
        </div>
        <h1 className="text-3xl font-black mb-1" style={{fontFamily:'serif',color:'var(--text-main)'}}>
          Hi {user?.name?.split(' ')[0]} 👋 Choose Your <span className="gradient-text">Package</span>
        </h1>
        <p className="text-sm" style={{color:'var(--text-muted)'}}>Select a data plan that suits your needs. You can always upgrade later.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {['All Plans','Hourly','Daily','Monthly','Business'].map((t,i)=>(
          <button key={t} className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
            style={i===0?{background:'linear-gradient(135deg,#F47820,#D4631A)',color:'white',boxShadow:'0 4px 12px rgba(244,120,32,0.3)'}
            :{background:'white',color:'var(--text-muted)',border:'1.5px solid var(--border)'}}>
            {t}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PACKAGES.map(pkg=>{
          const Icon=pkg.icon
          const active=hovered===pkg.id||pkg.featured
          return (
            <div key={pkg.id}
              onMouseEnter={()=>setHovered(pkg.id)} onMouseLeave={()=>setHovered(null)}
              className={`package-card rounded-3xl overflow-hidden cursor-pointer relative flex flex-col ${pkg.featured?'featured':''}`}
              style={{background:'white',border:active?`2px solid ${pkg.accent}`:'2px solid #E8EDF8',boxShadow:active?`0 20px 40px rgba(27,58,143,0.13),0 0 0 2px ${pkg.accent}20`:'0 2px 16px rgba(27,58,143,0.07)'}}>
              {/* Top colour bar */}
              <div className="h-1.5 w-full" style={{background:pkg.gradient}}/>

              {pkg.badge&&(
                <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-black text-white" style={{background:pkg.gradient,fontSize:'10px',letterSpacing:'0.05em'}}>
                  {pkg.badge}
                </div>
              )}

              <div className="p-5 flex flex-col flex-1">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{background:pkg.gradient}}>
                  <Icon size={22} color="white"/>
                </div>
                <p className="font-black text-lg mb-0.5" style={{fontFamily:'serif',color:'var(--text-main)'}}>{pkg.name}</p>
                <div className="flex items-center gap-1.5 mb-4">
                  <Clock size={11} style={{color:pkg.accent}}/>
                  <span className="text-xs font-semibold" style={{color:pkg.accent}}>{pkg.period}</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>{pkg.currency} {pkg.price.toLocaleString()}</span>
                </div>
                <div className="flex gap-2 mb-4">
                  {[{l:'Speed',v:pkg.speed},{l:'Data',v:pkg.data}].map(({l,v})=>(
                    <div key={l} className="flex-1 rounded-xl p-2.5 text-center" style={{background:'var(--bg)'}}>
                      <p className="text-xs mb-0.5" style={{color:'var(--text-muted)'}}>{l}</p>
                      <p className="text-xs font-black" style={{color:pkg.accent}}>{v}</p>
                    </div>
                  ))}
                </div>
                <ul className="space-y-2 mb-5 flex-1">
                  {pkg.features.map(f=>(
                    <li key={f} className="flex items-center gap-2 text-xs" style={{color:'var(--text-sub)'}}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{background:`${pkg.accent}18`}}>
                        <Check size={10} style={{color:pkg.accent}}/>
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all mt-auto"
                  style={{background:active?pkg.gradient:`${pkg.accent}12`,color:active?'white':pkg.accent,border:`1.5px solid ${pkg.accent}30`}}
                  onClick={()=>handleChoose(pkg)}>
                  {loading===pkg.id?<><span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin"/>Loading...</>
                  :<>Choose Plan <ArrowRight size={14}/></>}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Promo */}
      <div className="mt-8 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{background:'linear-gradient(135deg,rgba(27,58,143,0.05),rgba(244,120,32,0.04))',border:'1.5px solid rgba(244,120,32,0.18)'}}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{background:'rgba(244,120,32,0.1)'}}>
            <Tag size={18} color="#F47820"/>
          </div>
          <div>
            <p className="font-black text-sm" style={{fontFamily:'serif',color:'var(--text-main)'}}>Refer & Earn</p>
            <p className="text-xs" style={{color:'var(--text-muted)'}}>Get KES 50 credit for every friend you refer to DirectCore</p>
          </div>
        </div>
        <button className="btn-outline whitespace-nowrap" style={{width:'auto',padding:'10px 20px',fontSize:'13px'}}>Share Referral</button>
      </div>
    </div>
  )
}