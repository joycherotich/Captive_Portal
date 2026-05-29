import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Shield, Download, Upload, Activity, Clock, AlertCircle, ArrowUpRight } from 'lucide-react'
import { useApp } from '../context/AppContext'

const usageData=[
  {time:'Mon',download:0.8,upload:0.2},{time:'Tue',download:1.4,upload:0.4},
  {time:'Wed',download:0.6,upload:0.1},{time:'Thu',download:2.1,upload:0.6},
  {time:'Fri',download:1.8,upload:0.5},{time:'Sat',download:3.2,upload:0.8},
  {time:'Today',download:1.2,upload:0.3},
]

const CT=({active,payload,label})=>active&&payload?.length?(
  <div className="bg-white rounded-xl p-3 text-xs" style={{border:'1px solid var(--border)',boxShadow:'0 4px 16px rgba(27,58,143,0.1)'}}>
    <p className="font-bold mb-2" style={{color:'var(--text-sub)'}}>{label}</p>
    {payload.map(p=>(
      <p key={p.name} className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full" style={{background:p.color}}/>
        <span style={{color:'var(--text-muted)'}}>{p.name}: </span>
        <span className="font-bold" style={{color:'var(--text-main)'}}>{p.value} GB</span>
      </p>
    ))}
  </div>
):null

function DataRing({used,total}){
  const pct=Math.min((used/total)*100,100)
  const circ=2*Math.PI*45, offset=circ-(pct/100)*circ
  return(
    <div className="relative w-28 h-28">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#EEF2FF" strokeWidth="9"/>
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#rg)" strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{transition:'stroke-dashoffset 1.5s ease',filter:'drop-shadow(0 0 6px rgba(244,120,32,0.5))'}}/>
        <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1B3A8F"/><stop offset="100%" stopColor="#F47820"/>
        </linearGradient></defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>{pct.toFixed(0)}%</span>
        <span className="text-xs" style={{color:'var(--text-muted)'}}>Used</span>
      </div>
    </div>
  )
}

export default function DashboardPage(){
  const {user}=useApp()
  const stats=[
    {label:'Download',value:'18.4',unit:'Mbps',icon:Download,color:'#F47820',change:'+2.1',bg:'rgba(244,120,32,0.08)'},
    {label:'Upload',value:'4.2',unit:'Mbps',icon:Upload,color:'#1B3A8F',change:'+0.4',bg:'rgba(27,58,143,0.08)'},
    {label:'Latency',value:'12',unit:'ms',icon:Activity,color:'#7C3AED',change:'-3',bg:'rgba(124,58,237,0.08)'},
    {label:'Session',value:'2h 14m',unit:'',icon:Clock,color:'#0891B2',change:null,bg:'rgba(8,145,178,0.08)'},
  ]
  return(
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{color:'var(--text-muted)'}}>Real-time network usage & stats</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white" style={{border:'1.5px solid rgba(0,166,81,0.25)'}}>
          <div className="w-2 h-2 rounded-full bg-green-500 status-pulse"/>
          <span className="font-semibold" style={{color:'#00A651'}}>Connected</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({label,value,unit,icon:Icon,color,change,bg})=>(
          <div key={label} className="card-elevated p-4 relative overflow-hidden rounded-2xl">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-60" style={{background:bg}}/>
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:bg}}>
                <Icon size={17} style={{color}}/>
              </div>
              {change&&<span className="text-xs font-bold flex items-center gap-0.5" style={{color:change.startsWith('-')&&label==='Latency'?'#00A651':'var(--orange)'}}>
                <ArrowUpRight size={12}/>{change}
              </span>}
            </div>
            <p className="text-2xl font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>
              {value}<span className="text-sm font-normal ml-1" style={{color:'var(--text-muted)'}}>{unit}</span>
            </p>
            <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-elevated rounded-3xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>Weekly Usage</h3>
              <p className="text-xs mt-0.5" style={{color:'var(--text-muted)'}}>Download & Upload (GB)</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{background:'#F47820'}}/>Download</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{background:'#1B3A8F'}}/>Upload</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={usageData} margin={{top:5,right:5,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="dlG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F47820" stopOpacity={0.25}/><stop offset="95%" stopColor="#F47820" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="ulG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B3A8F" stopOpacity={0.2}/><stop offset="95%" stopColor="#1B3A8F" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{fill:'var(--text-muted)',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'var(--text-muted)',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CT/>}/>
              <Area type="monotone" dataKey="download" name="Download" stroke="#F47820" strokeWidth={2.5} fill="url(#dlG)"/>
              <Area type="monotone" dataKey="upload" name="Upload" stroke="#1B3A8F" strokeWidth={2.5} fill="url(#ulG)"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card-elevated rounded-3xl p-5 flex flex-col">
          <h3 className="font-black" style={{fontFamily:'serif',color:'var(--text-main)'}}>Data Usage</h3>
          <p className="text-xs mt-0.5 mb-4" style={{color:'var(--text-muted)'}}>{user?.plan}</p>
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <DataRing used={user?.dataUsed||4.2} total={user?.dataTotal||10}/>
            <div className="w-full space-y-2">
              {[{l:'Used',v:`${user?.dataUsed||4.2} GB`,c:'var(--text-main)'},{l:'Remaining',v:`${((user?.dataTotal||10)-(user?.dataUsed||4.2)).toFixed(1)} GB`,c:'var(--orange)'}].map(({l,v,c})=>(
                <div key={l} className="flex justify-between text-xs">
                  <span style={{color:'var(--text-muted)'}}>{l}</span>
                  <span className="font-bold" style={{color:c}}>{v}</span>
                </div>
              ))}
              <div className="w-full h-2 rounded-full" style={{background:'#EEF2FF'}}>
                <div className="h-full rounded-full transition-all" style={{width:`${((user?.dataUsed||4.2)/(user?.dataTotal||10))*100}%`,background:'linear-gradient(90deg,#1B3A8F,#F47820)'}}/>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl p-3 text-xs flex items-center gap-2" style={{background:'rgba(244,120,32,0.07)',border:'1px solid rgba(244,120,32,0.2)'}}>
            <AlertCircle size={13} color="#F47820"/>
            <span style={{color:'var(--orange)'}}>Expires {user?.expiry||'2024-07-15'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card-elevated rounded-3xl p-5">
          <h3 className="font-black mb-4" style={{fontFamily:'serif',color:'var(--text-main)'}}>Active Session</h3>
          {[{label:'IP Address',value:'192.168.1.45'},{label:'MAC Address',value:'A1:B2:C3:D4:E5'},{label:'Gateway',value:'192.168.1.1'},{label:'Connected Since',value:'10:32 AM'}].map(({label,value})=>(
            <div key={label} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{borderColor:'var(--border)'}}>
              <span className="text-xs" style={{color:'var(--text-muted)'}}>{label}</span>
              <span className="text-xs font-mono font-semibold" style={{color:'var(--blue)'}}>{value}</span>
            </div>
          ))}
        </div>
        <div className="card-elevated rounded-3xl p-5">
          <h3 className="font-black mb-4" style={{fontFamily:'serif',color:'var(--text-main)'}}>Network Quality</h3>
          {[{label:'Signal Strength',value:92,color:'#F47820'},{label:'Reliability',value:98,color:'#1B3A8F'},{label:'Coverage',value:85,color:'#7C3AED'}].map(({label,value,color})=>(
            <div key={label} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{color:'var(--text-muted)'}}>{label}</span>
                <span className="font-bold" style={{color}}>{value}%</span>
              </div>
              <div className="h-1.5 rounded-full" style={{background:'#EEF2FF'}}>
                <div className="h-full rounded-full transition-all" style={{width:`${value}%`,background:`linear-gradient(90deg,${color}80,${color})`}}/>
              </div>
            </div>
          ))}
          <div className="mt-4 flex items-center gap-2 text-xs" style={{color:'var(--text-muted)'}}>
            <Shield size={12} color="#F47820"/><span>Secured · WPA3 · DirectCore Network</span>
          </div>
        </div>
      </div>
    </div>
  )
}