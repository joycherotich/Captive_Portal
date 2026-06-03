import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'   // ← this was missing

/* ─────────────────────────────────────────────────────────
   TENANT CONFIG
───────────────────────────────────────────────────────── */
const TENANT_CONFIG = null
// const TENANT_CONFIG = { name: 'The Hub Mall', subtitle: 'Premium High-Speed Wi-Fi Zone', logo: null }

/* ─── Mock data ─────────────────────────────────────── */
const REGISTERED_PHONES = new Set(['0712345678', '0700000000', '0722111222'])
const REGISTERED_EMAILS = new Set(['john@gmail.com', 'jane@company.com'])

/* ─── Countries ─────────────────────────────────────── */
const COUNTRIES = [
  { code:'KE', flag:'🇰🇪', name:'Kenya',         dial:'+254', placeholder:'7XX XXX XXX',  min:9  },
  { code:'UG', flag:'🇺🇬', name:'Uganda',        dial:'+256', placeholder:'7XX XXX XXX',  min:9  },
  { code:'TZ', flag:'🇹🇿', name:'Tanzania',      dial:'+255', placeholder:'7XX XXX XXX',  min:9  },
  { code:'RW', flag:'🇷🇼', name:'Rwanda',        dial:'+250', placeholder:'7XX XXX XXX',  min:9  },
  { code:'ET', flag:'🇪🇹', name:'Ethiopia',      dial:'+251', placeholder:'9X XXX XXXX',  min:9  },
  { code:'NG', flag:'🇳🇬', name:'Nigeria',       dial:'+234', placeholder:'8XX XXX XXXX', min:10 },
  { code:'GH', flag:'🇬🇭', name:'Ghana',         dial:'+233', placeholder:'2X XXX XXXX',  min:9  },
  { code:'ZA', flag:'🇿🇦', name:'South Africa',  dial:'+27',  placeholder:'8X XXX XXXX',  min:9  },
  { code:'US', flag:'🇺🇸', name:'United States', dial:'+1',   placeholder:'XXX XXX XXXX', min:10 },
  { code:'GB', flag:'🇬🇧', name:'United Kingdom',dial:'+44',  placeholder:'7XXX XXX XXX', min:10 },
  { code:'IN', flag:'🇮🇳', name:'India',         dial:'+91',  placeholder:'XXXXX XXXXX',  min:10 },
  { code:'AE', flag:'🇦🇪', name:'UAE',           dial:'+971', placeholder:'5X XXX XXXX',  min:9  },
]

const ORG_SIZES = ['1–10','11–50','51–200','201–500','500+']

/* ─── Detection helpers ─────────────────────────────── */
function detectType(v) {
  const s = v.trim()
  if (!s) return null
  if (/^[A-Z0-9]{3,}-[A-Z0-9]/i.test(s)) return 'voucher'
  if (s.includes('@') && s.includes('.'))  return 'email'
  if (/^[\d\s]{5,}$/.test(s))             return 'phone'
  return null
}
function isInputValid(v, type, country) {
  if (!type) return false
  if (type === 'phone')   return v.replace(/\D/g,'').length >= country.min
  if (type === 'email')   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
  if (type === 'voucher') return /^[A-Z0-9]{3,}(-[A-Z0-9]{2,})+$/i.test(v.trim())
  return false
}

const TYPE_META = {
  phone:   { label:'Phone number',  color:'#34d399' },
  email:   { label:'Email address', color:'#60a5fa' },
  voucher: { label:'Voucher code',  color:'#f59e0b' },
}

const S = { TYPE:'type', IDENTIFY:'identify', OTP:'otp', REGISTER:'register', ORG_FORM:'org_form', SUCCESS:'success' }

/* ─── Spinner ───────────────────────────────────────── */
function Spinner() {
  return <span style={{ display:'inline-block',width:15,height:15,border:'2px solid rgba(255,255,255,.25)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin .7s linear infinite' }} />
}

/* ─── Country picker ────────────────────────────────── */
function CountryPicker({ selected, onSelect }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  const filtered = COUNTRIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search))
  return (
    <div ref={ref} style={{ position:'relative',flexShrink:0 }}>
      <button type="button" className="cc-btn" onClick={() => { setOpen(o=>!o); setSearch('') }}>
        <span style={{ fontSize:18,lineHeight:1 }}>{selected.flag}</span>
        <span style={{ fontFamily:'DM Mono,monospace',fontSize:13 }}>{selected.dial}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ opacity:.5 }}><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      </button>
      {open && (
        <div style={{ position:'absolute',top:'calc(100% + 6px)',left:0,zIndex:300,width:240,background:'#111827',border:'.5px solid rgba(255,255,255,.15)',borderRadius:14,boxShadow:'0 16px 48px rgba(0,0,0,.7)',overflow:'hidden' }}>
          <div style={{ padding:'10px 10px 6px' }}>
            <input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…"
              style={{ width:'100%',background:'rgba(255,255,255,.07)',border:'.5px solid rgba(255,255,255,.12)',borderRadius:8,padding:'8px 12px',fontSize:13,color:'#fff',outline:'none',fontFamily:'Syne,sans-serif' }} />
          </div>
          <div style={{ maxHeight:220,overflowY:'auto' }}>
            {filtered.map(c => (
              <button key={c.code} type="button" onClick={()=>{ onSelect(c); setOpen(false) }}
                style={{ width:'100%',display:'flex',alignItems:'center',gap:10,padding:'9px 14px',background:c.code===selected.code?'rgba(245,158,11,.12)':'transparent',border:'none',cursor:'pointer',borderBottom:'.5px solid rgba(255,255,255,.05)',transition:'background .1s' }}
                onMouseEnter={e=>{ if(c.code!==selected.code) e.currentTarget.style.background='rgba(255,255,255,.06)' }}
                onMouseLeave={e=>{ if(c.code!==selected.code) e.currentTarget.style.background='transparent' }}>
                <span style={{ fontSize:18 }}>{c.flag}</span>
                <span style={{ flex:1,fontSize:13,color:'#fff',fontFamily:'Syne,sans-serif' }}>{c.name}</span>
                <span style={{ fontSize:12,color:'rgba(255,255,255,.4)',fontFamily:'DM Mono,monospace' }}>{c.dial}</span>
              </button>
            ))}
            {!filtered.length && <p style={{ fontSize:12,color:'rgba(255,255,255,.3)',textAlign:'center',padding:'1rem',margin:0 }}>No results</p>}
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── OTP boxes ──────────────────────────────────────── */
function OtpRow({ value, onChange, error }) {
  const refs = useRef([])
  const digits = value.padEnd(6,'').split('').slice(0,6)
  const focus = i => refs.current[i]?.focus()
  const handleChange = (i,e) => { const d=e.target.value.replace(/\D/g,'').slice(-1); const n=[...digits]; n[i]=d; onChange(n.join('').trimEnd()); if(d&&i<5) focus(i+1) }
  const handleKey = (i,e) => {
    if(e.key==='Backspace') { if(!digits[i]&&i>0){focus(i-1);const n=[...digits];n[i-1]='';onChange(n.join('').trimEnd())}else{const n=[...digits];n[i]='';onChange(n.join('').trimEnd())} }
    if(e.key==='ArrowLeft'&&i>0) focus(i-1)
    if(e.key==='ArrowRight'&&i<5) focus(i+1)
  }
  const handlePaste = e => { const p=e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6); onChange(p); focus(Math.min(p.length,5)); e.preventDefault() }
  return (
    <div style={{ display:'flex',gap:8,justifyContent:'center',marginBottom:8 }} onPaste={handlePaste}>
      {[0,1,2,3,4,5].map(i=>(
        <input key={i} ref={el=>refs.current[i]=el} type="text" inputMode="numeric" maxLength={1}
          value={digits[i]||''} onChange={e=>handleChange(i,e)} onKeyDown={e=>handleKey(i,e)} autoFocus={i===0}
          style={{ width:48,height:56,background:digits[i]?'rgba(245,158,11,.1)':'rgba(255,255,255,.05)',border:`1.5px solid ${error?'rgba(248,113,113,.6)':digits[i]?'rgba(245,158,11,.5)':'rgba(255,255,255,.12)'}`,borderRadius:12,fontSize:22,fontWeight:600,color:'#fff',textAlign:'center',outline:'none',fontFamily:'DM Mono,monospace',transition:'border-color .15s,background .15s' }}/>
      ))}
    </div>
  )
}

/* ─── Brand header ──────────────────────────────────── */
function BrandHeader({ tenant }) {
  if (tenant?.logo) return (
    <div style={{ textAlign:'center',marginBottom:'1.6rem' }}>
      <img src={tenant.logo} alt={tenant.name} style={{ maxHeight:52,maxWidth:180,objectFit:'contain',marginBottom:8 }}/>
      {tenant.subtitle && <p style={{ fontSize:12,color:'rgba(255,255,255,.35)',margin:0 }}>{tenant.subtitle}</p>}
    </div>
  )
  if (tenant?.name) return (
    <div style={{ textAlign:'center',marginBottom:'1.6rem' }}>
      <p style={{ fontSize:9,letterSpacing:'.2em',textTransform:'uppercase',color:'rgba(245,158,11,.7)',margin:'0 0 5px',fontFamily:'Syne,sans-serif' }}>Welcome to browsing core</p>
      <h1 style={{ fontSize:28,fontWeight:700,color:'#fff',margin:'0 0 4px',fontFamily:'Cormorant Garamond,Georgia,serif' }}>{tenant.name}</h1>
      {tenant.subtitle && <p style={{ fontSize:12,color:'rgba(255,255,255,.35)',margin:0 }}>{tenant.subtitle}</p>}
    </div>
  )
  return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',marginBottom:'1.6rem' }}>
      <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:8 }}>
        <div style={{ width:38,height:38,borderRadius:12,background:'linear-gradient(135deg,#f59e0b,#d97706)',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <span style={{ fontFamily:'Cormorant Garamond,Georgia,serif',fontSize:26,fontWeight:700,color:'#fff' }}>One<span style={{ color:'#f59e0b' }}>lynq</span></span>
      </div>
      <div style={{ display:'flex',alignItems:'center',gap:6 }}>
        <span style={{ width:6,height:6,borderRadius:'50%',background:'#34d399',display:'inline-block',animation:'pulse 2s ease-in-out infinite' }}/>
        <span style={{ fontSize:11,color:'rgba(255,255,255,.4)' }}>Secure Wi-Fi Portal</span>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════ */
export default function AuthPage({ tenantConfig = TENANT_CONFIG }) {
  const navigate = useNavigate()  // ← React Router navigation
  const { login } = useApp()

  const [screen, setScreen]       = useState(S.TYPE)
  const [accountType, setAccType] = useState(null)   // 'individual' | 'organisation'

  /* individual flow */
  const [inputMode, setInputMode] = useState('phone')
  const [inputVal, setInputVal]   = useState('')
  const [country, setCountry]     = useState(COUNTRIES[0])
  const [displayId, setDisplayId] = useState('')
  const [inputType, setInputType] = useState(null)
  const [otp, setOtp]             = useState('')
  const [otpError, setOtpError]   = useState('')
  const [countdown, setCountdown] = useState(0)
  const [isNew, setIsNew]         = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [regName, setRegName]     = useState('')
  const [regEmail, setRegEmail]   = useState('')

  /* org flow */
  const [orgName, setOrgName]     = useState('')
  const [orgEmail, setOrgEmail]   = useState('')
  const [orgSize, setOrgSize]     = useState('')
  const [orgPhone, setOrgPhone]   = useState('')
  const [orgContact, setOrgContact] = useState('')

  const [loading, setLoading]     = useState(false)
  const timerRef = useRef(null)

  const liveType = detectType(inputVal)
  const valid    = isInputValid(inputVal, liveType || inputMode, country)

  useEffect(() => {
    if (countdown <= 0) return
    timerRef.current = setTimeout(() => setCountdown(c=>c-1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [countdown])

  useEffect(() => {
    if (otp.length === 6 && screen === S.OTP) doVerify()
  }, [otp])

  /* ── OTP verified: registered → /dashboard, new → /packages ── */
  const doVerify = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login({ name: regName || displayId, phone: displayId })  // set real user data
      navigate(isRegistered ? '/dashboard' : '/packages')
    }, 1000)
  }, [otp, isRegistered, navigate, login, regName, displayId])

  const handleSelectType = type => {
    setAccType(type)
    setScreen(type === 'organisation' ? S.ORG_FORM : S.IDENTIFY)
  }

  const handleIndividualSubmit = () => {
    if (!valid || loading) return
    const t = liveType || inputMode
    setInputType(t)

    /* voucher → /packages */
    if (t === 'voucher') {
      setDisplayId(inputVal.trim().toUpperCase())
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        login({ name: 'Guest', voucher: inputVal.trim().toUpperCase() })
        navigate('/packages')
      }, 1200)
      return
    }

    /* phone lookup */
    if (t === 'phone') {
      const digits = inputVal.replace(/\D/g,'')
      const norm   = '0' + digits.replace(/^0+/,'')
      setDisplayId(`${country.dial} ${digits}`)
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        const registered = REGISTERED_PHONES.has(norm)
        setIsRegistered(registered)
        if (registered) {
          setIsNew(false); setOtp(''); setOtpError(''); setCountdown(30); setScreen(S.OTP)
        } else {
          setIsNew(true); setScreen(S.REGISTER)
        }
      }, 1100)
      return
    }

    /* email lookup */
    if (t === 'email') {
      const em = inputVal.trim().toLowerCase()
      setDisplayId(em)
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        const registered = REGISTERED_EMAILS.has(em)
        setIsRegistered(registered)
        if (registered) {
          setIsNew(false); setOtp(''); setOtpError(''); setCountdown(30); setScreen(S.OTP)
        } else {
          setIsNew(true); setScreen(S.REGISTER)
        }
      }, 1100)
    }
  }

  /* org submit → /dashboard */
  const handleOrgSubmit = () => {
    if (!orgName.trim() || !orgEmail.trim() || !orgSize || loading) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login({ name: orgContact || orgName, email: orgEmail, org: orgName })
      navigate('/dashboard')
    }, 1400)
  }
  /* new user registration → /packages */
  const handleRegister = () => {
    if (!regName.trim() || loading) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login({ name: regName, phone: displayId, email: regEmail })
      navigate('/packages')
    }, 1200)
  }

  const handleResend = () => { setOtp(''); setOtpError(''); setCountdown(30) }
  const reset = () => { setInputVal(''); setInputType(null); setScreen(S.TYPE); setAccType(null) }

  const orgValid = orgName.trim() && orgEmail.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orgEmail) && orgSize

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Syne:wght@400;500;700;800&family=DM+Mono:wght@400;500&display=swap');
    @keyframes spin    { to{transform:rotate(360deg)} }
    @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes pulse   { 0%,100%{opacity:.5;transform:scale(.95)} 50%{opacity:1;transform:scale(1.05)} }
    @keyframes glow    { 0%,100%{box-shadow:0 0 20px rgba(245,158,11,.15)} 50%{box-shadow:0 0 40px rgba(245,158,11,.38)} }
    @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
    * { box-sizing:border-box; }
    .hub-page { min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.5rem 1rem;font-family:'Syne',sans-serif;background:#080c14;position:relative;overflow:hidden; }
    .orb1 { position:fixed;top:-140px;left:-80px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle at 40% 40%,rgba(245,158,11,.2) 0%,transparent 65%);pointer-events:none;animation:pulse 7s ease-in-out infinite; }
    .orb2 { position:fixed;bottom:-100px;right:-60px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(245,158,11,.07) 0%,transparent 65%);pointer-events:none; }
    .hub-card { width:100%;max-width:420px;position:relative;z-index:1;background:rgba(14,19,30,.9);border:.5px solid rgba(255,255,255,.09);border-radius:28px;padding:2.25rem 2rem;backdrop-filter:blur(28px);animation:slideUp .5s cubic-bezier(.22,1,.36,1) both; }
    .divider { border:none;border-top:.5px solid rgba(255,255,255,.07);margin:0 0 1.4rem; }
    .screen-inner { animation:fadeIn .28s cubic-bezier(.22,1,.36,1) both; }
    .back-btn { background:none;border:none;color:rgba(255,255,255,.3);font-size:12px;cursor:pointer;padding:0;display:flex;align-items:center;gap:4px;margin-bottom:1.25rem;font-family:'Syne',sans-serif;transition:color .15s; }
    .back-btn:hover { color:rgba(255,255,255,.65); }
    .field-label { font-size:9px;letter-spacing:.16em;text-transform:uppercase;color:rgba(245,158,11,.6);display:block;margin-bottom:8px;font-weight:500; }
    .type-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:.25rem; }
    .type-card { background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:18px;padding:1.4rem 1rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:10px;transition:background .2s,border-color .2s,transform .15s;position:relative;overflow:hidden; }
    .type-card:hover { background:rgba(255,255,255,.07);border-color:rgba(255,255,255,.15);transform:translateY(-2px); }
    .type-card.selected { background:rgba(245,158,11,.08);border-color:rgba(245,158,11,.45); }
    .type-icon { width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;background:rgba(255,255,255,.06);transition:background .2s; }
    .type-card.selected .type-icon { background:rgba(245,158,11,.15); }
    .type-label { font-size:13px;font-weight:700;color:rgba(255,255,255,.7);letter-spacing:.02em;transition:color .2s; }
    .type-card.selected .type-label { color:#fff; }
    .type-desc { font-size:10.5px;color:rgba(255,255,255,.3);text-align:center;line-height:1.5;transition:color .2s; }
    .type-card.selected .type-desc { color:rgba(255,255,255,.5); }
    .type-check { position:absolute;top:10px;right:10px;width:18px;height:18px;border-radius:50%;background:rgba(245,158,11,.9);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s; }
    .type-card.selected .type-check { opacity:1; }
    .mode-tabs { display:flex;gap:4px;background:rgba(255,255,255,.045);border-radius:12px;padding:4px;margin-bottom:16px; }
    .mode-tab { flex:1;border:none;border-radius:9px;padding:8px 4px;font-size:11px;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:background .15s,color .15s;font-family:'Syne',sans-serif;background:transparent;color:rgba(255,255,255,.3); }
    .mode-tab.active { background:rgba(245,158,11,.16);color:rgba(245,158,11,.95); }
    .mode-tab:hover:not(.active) { color:rgba(255,255,255,.55); }
    .phone-row { display:flex;gap:8px; }
    .cc-btn { display:flex;align-items:center;gap:5px;background:rgba(255,255,255,.06);border:.5px solid rgba(255,255,255,.11);border-radius:12px;padding:0 12px;color:#fff;cursor:pointer;white-space:nowrap;height:52px;transition:background .15s; }
    .cc-btn:hover { background:rgba(255,255,255,.1); }
    .main-input { width:100%;background:rgba(255,255,255,.06);border:.5px solid rgba(255,255,255,.11);border-radius:12px;padding:0 16px;font-size:15px;font-weight:500;color:#fff;height:52px;outline:none;transition:border-color .15s,background .15s;font-family:'Syne',sans-serif; }
    .main-input::placeholder { color:rgba(255,255,255,.2);font-weight:400;font-size:13.5px; }
    .main-input:focus { border-color:rgba(245,158,11,.4);background:rgba(255,255,255,.08); }
    .main-input.voucher { font-family:'DM Mono',monospace;letter-spacing:.12em;text-transform:uppercase;font-size:14px; }
    .form-input { width:100%;background:rgba(255,255,255,.05);border:.5px solid rgba(255,255,255,.1);border-radius:11px;padding:13px 15px;font-size:13.5px;color:#fff;outline:none;margin-bottom:10px;font-family:'Syne',sans-serif;transition:border-color .15s,background .15s; }
    .form-input::placeholder { color:rgba(255,255,255,.2); }
    .form-input:focus { border-color:rgba(245,158,11,.38);background:rgba(255,255,255,.08); }
    .form-row { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:0; }
    .size-grid { display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px; }
    .size-pill { border:none;border-radius:20px;padding:7px 14px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:'Syne',sans-serif;transition:background .15s,color .15s,border-color .15s;background:rgba(255,255,255,.05);border:.5px solid rgba(255,255,255,.1);color:rgba(255,255,255,.45); }
    .size-pill.active { background:rgba(245,158,11,.14);border-color:rgba(245,158,11,.45);color:rgba(245,158,11,.95); }
    .size-pill:hover:not(.active) { background:rgba(255,255,255,.09);color:rgba(255,255,255,.7); }
    .btn-main { width:100%;border:none;border-radius:14px;padding:15px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#0a0a0a;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);margin-top:.75rem;transition:opacity .15s,transform .1s;font-family:'Syne',sans-serif;animation:glow 3s ease-in-out infinite; }
    .btn-main:hover:not(:disabled) { opacity:.9;transform:translateY(-1px); }
    .btn-main:active:not(:disabled) { transform:scale(.99) translateY(0); }
    .btn-main:disabled { opacity:.32;cursor:not-allowed;animation:none; }
    .info-box { background:rgba(0,0,0,.28);border:.5px solid rgba(255,255,255,.065);border-radius:14px;padding:13px 15px;margin-top:1.2rem;display:flex;gap:10px; }
    .new-badge { display:inline-flex;align-items:center;gap:5px;background:rgba(245,158,11,.1);border:.5px solid rgba(245,158,11,.28);border-radius:8px;padding:4px 10px;font-size:10px;color:rgba(245,158,11,.85);font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.9rem; }
    .success-ring { width:72px;height:72px;border-radius:50%;border:1.5px solid rgba(245,158,11,.35);background:rgba(245,158,11,.1);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem;font-size:28px;animation:glow 2s ease-in-out infinite; }
    .footer { font-size:10.5px;color:rgba(255,255,255,.22);text-align:center;margin-top:1.25rem;letter-spacing:.06em;font-family:'Syne',sans-serif; }
    .footer-accent { color:rgba(245,158,11,.6);font-weight:600; }
    select.form-input { appearance:none;background-image:url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.3)' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 14px center;padding-right:36px; }
    select.form-input option { background:#111827;color:#fff; }
  `

  return (
    <>
      <style>{css}</style>
      <div className="hub-page">
        <div className="orb1"/><div className="orb2"/>

        <div style={{ width:'100%',maxWidth:420,position:'relative',zIndex:1 }}>
          <div className="hub-card">

            {/* ══════════════════════════════════
                STEP 0 — Choose account type
            ══════════════════════════════════ */}
            {screen === S.TYPE && (
              <div className="screen-inner">
                <BrandHeader tenant={tenantConfig}/>
                <hr className="divider"/>
                <label className="field-label" style={{ marginBottom:12 }}>How are you connecting?</label>
                <div className="type-grid">
                  <button type="button" className={`type-card${accountType==='individual'?' selected':''}`}
                    onClick={() => handleSelectType('individual')}>
                    <div className="type-check">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="type-icon">👤</div>
                    <span className="type-label">Individual</span>
                    <span className="type-desc">Personal use &amp; roaming</span>
                  </button>
                  <button type="button" className={`type-card${accountType==='organisation'?' selected':''}`}
                    onClick={() => handleSelectType('organisation')}>
                    <div className="type-check">
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="type-icon">🏢</div>
                    <span className="type-label">Organisation</span>
                    <span className="type-desc">Teams &amp; businesses</span>
                  </button>
                </div>
                <div className="info-box" style={{ marginTop:'1.1rem' }}>
                  <span style={{ fontSize:15,color:'rgba(245,158,11,.7)',flexShrink:0,marginTop:1 }}>⚡</span>
                  <div>
                    <p style={{ fontSize:13,fontWeight:700,color:'rgba(255,255,255,.8)',margin:'0 0 2px' }}>Automatic one-click roaming</p>
                    <p style={{ fontSize:11.5,color:'rgba(255,255,255,.35)',margin:0,lineHeight:1.55 }}>Download OneLynq App to skip validation next time.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 1a — Individual identify
            ══════════════════════════════════ */}
            {screen === S.IDENTIFY && (
              <div className="screen-inner">
                <button className="back-btn" onClick={reset}>← Back</button>
                <BrandHeader tenant={tenantConfig}/>
                <hr className="divider"/>
                <div className="mode-tabs">
                  {['phone','email','voucher'].map(m=>(
                    <button key={m} className={`mode-tab${inputMode===m?' active':''}`}
                      onClick={()=>{ setInputMode(m); setInputVal('') }}>
                      {m==='phone'?'📱 Phone':m==='email'?'✉️ Email':'🎟️ Voucher'}
                    </button>
                  ))}
                </div>
                <label className="field-label">
                  {inputMode==='phone'?'Phone number':inputMode==='email'?'Email address':'Voucher code'}
                </label>
                {inputMode === 'phone' ? (
                  <div className="phone-row">
                    <CountryPicker selected={country} onSelect={c=>{ setCountry(c); setInputVal('') }}/>
                    <input className="main-input" type="tel" inputMode="numeric"
                      placeholder={country.placeholder} value={inputVal}
                      onChange={e=>setInputVal(e.target.value.replace(/[^\d\s]/g,''))}
                      onKeyDown={e=>e.key==='Enter'&&valid&&handleIndividualSubmit()}
                      autoFocus maxLength={14}/>
                  </div>
                ) : (
                  <input className={`main-input${inputMode==='voucher'?' voucher':''}`}
                    type={inputMode==='email'?'email':'text'}
                    placeholder={inputMode==='email'?'you@example.com':'XXXX-YYYY-ZZZZ'}
                    value={inputVal}
                    onChange={e=>setInputVal(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&valid&&handleIndividualSubmit()}
                    autoFocus spellCheck={false}/>
                )}
                <div style={{ minHeight:24,marginTop:7,display:'flex',alignItems:'center' }}>
                  {inputVal.length>0 && (
                    valid
                      ? <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'3px 9px',borderRadius:20,fontSize:10,fontWeight:600,background:`${TYPE_META[liveType||inputMode]?.color}18`,color:TYPE_META[liveType||inputMode]?.color }}>
                          ● {TYPE_META[liveType||inputMode]?.label} detected
                        </span>
                      : <span style={{ fontSize:11,color:'rgba(255,255,255,.3)' }}>
                          {inputMode==='voucher'?'Format: XXXX-YYYY or XXXX-YYYY-ZZZZ':inputMode==='email'?'Enter a valid email':'Enter a valid number'}
                        </span>
                  )}
                </div>
                <button className="btn-main" onClick={handleIndividualSubmit} disabled={!valid||loading}>
                  {loading
                    ? <><Spinner/>{inputMode==='voucher'?'Activating…':'Checking…'}</>
                    : inputMode==='voucher'
                      ? <>🎟️&nbsp;Activate voucher</>
                      : <>&#9673;&nbsp;Continue</>}
                </button>
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 1b — Organisation form
            ══════════════════════════════════ */}
            {screen === S.ORG_FORM && (
              <div className="screen-inner">
                <button className="back-btn" onClick={reset}>← Back</button>
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:'1.25rem' }}>
                  <div style={{ width:40,height:40,borderRadius:12,background:'rgba(245,158,11,.12)',border:'.5px solid rgba(245,158,11,.25)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>🏢</div>
                  <div>
                    <h2 style={{ fontSize:18,fontWeight:700,color:'#fff',margin:0,fontFamily:'Cormorant Garamond,Georgia,serif' }}>Organisation Details</h2>
                    <p style={{ fontSize:11.5,color:'rgba(255,255,255,.35)',margin:0 }}>Set up your team account</p>
                  </div>
                </div>
                <hr className="divider"/>
                <label className="field-label">Organisation info</label>
                <input className="form-input" type="text" placeholder="Organisation name *"
                  value={orgName} onChange={e=>setOrgName(e.target.value)} autoFocus/>
                <div className="form-row">
                  <input className="form-input" style={{ marginBottom:0 }} type="email" placeholder="Work email *"
                    value={orgEmail} onChange={e=>setOrgEmail(e.target.value)}/>
                  <input className="form-input" style={{ marginBottom:0 }} type="tel" placeholder="Phone (optional)"
                    value={orgPhone} onChange={e=>setOrgPhone(e.target.value)}/>
                </div>
                <div style={{ height:10 }}/>
                <input className="form-input" type="text" placeholder="Contact person name (optional)"
                  value={orgContact} onChange={e=>setOrgContact(e.target.value)}/>
                <label className="field-label" style={{ marginTop:4 }}>Organisation size *</label>
                <div className="size-grid">
                  {ORG_SIZES.map(s=>(
                    <button key={s} type="button" className={`size-pill${orgSize===s?' active':''}`}
                      onClick={()=>setOrgSize(s)}>{s} people</button>
                  ))}
                </div>
                <p style={{ fontSize:10,color:'rgba(255,255,255,.25)',margin:'0 0 2px' }}>* Required fields</p>
                <button className="btn-main" onClick={handleOrgSubmit} disabled={!orgValid||loading}>
                  {loading ? <><Spinner/>Registering…</> : <>🏢&nbsp;Register &amp; connect</>}
                </button>
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 2 — OTP
            ══════════════════════════════════ */}
            {screen === S.OTP && (
              <div className="screen-inner">
                <button className="back-btn" onClick={reset}>← Back</button>
                <h2 style={{ fontSize:22,fontWeight:700,color:'#fff',textAlign:'center',margin:'0 0 6px',fontFamily:'Cormorant Garamond,serif' }}>Enter OTP</h2>
                <p style={{ fontSize:12.5,color:'rgba(255,255,255,.4)',textAlign:'center',margin:'0 0 3px' }}>We sent a 6-digit code to</p>
                <p style={{ fontSize:14,fontWeight:500,color:'rgba(245,158,11,.85)',textAlign:'center',margin:'0 0 1.5rem',fontFamily:'DM Mono,monospace' }}>{displayId}</p>
                <OtpRow value={otp} onChange={v=>{ setOtp(v); setOtpError('') }} error={!!otpError}/>
                <p style={{ fontSize:11.5,color:'#f87171',textAlign:'center',minHeight:18,marginBottom:2 }}>{otpError}</p>
                <button className="btn-main" onClick={doVerify} disabled={otp.length<6||loading}>
                  {loading?<><Spinner/>Verifying…</>:<>✓&nbsp;Confirm &amp; connect</>}
                </button>
                <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10 }}>
                  <span style={{ fontSize:11.5,color:'rgba(255,255,255,.3)' }}>{countdown>0?`Resend in ${countdown}s`:' '}</span>
                  <button onClick={handleResend} disabled={countdown>0}
                    style={{ background:'none',border:'none',fontSize:11.5,fontWeight:600,color:countdown>0?'rgba(255,255,255,.22)':'rgba(245,158,11,.75)',cursor:countdown>0?'not-allowed':'pointer',fontFamily:'Syne,sans-serif',padding:0 }}>
                    Resend OTP
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════
                STEP 2b — Register (new individual)
            ══════════════════════════════════ */}
            {screen === S.REGISTER && (
              <div className="screen-inner">
                <button className="back-btn" onClick={reset}>← Back</button>
                <span className="new-badge">✦ New account</span>
                <h2 style={{ fontSize:21,fontWeight:700,color:'#fff',margin:'0 0 6px',fontFamily:'Cormorant Garamond,serif' }}>Create your account</h2>
                <p style={{ fontSize:12.5,color:'rgba(255,255,255,.38)',margin:'0 0 1.25rem' }}>
                  No account for{' '}
                  <span style={{ color:'rgba(245,158,11,.85)',fontWeight:600,fontFamily:'DM Mono,monospace' }}>{displayId}</span>
                </p>
                <input className="form-input" type="text" placeholder="Full name *" value={regName} onChange={e=>setRegName(e.target.value)} autoFocus/>
                {inputType !== 'email' && (
                  <input className="form-input" type="email" placeholder="Email address (optional)" value={regEmail} onChange={e=>setRegEmail(e.target.value)}/>
                )}
                <button className="btn-main" onClick={handleRegister} disabled={!regName.trim()||loading}>
                  {loading?<><Spinner/>Creating…</>:<>✦&nbsp;Create account &amp; connect</>}
                </button>
              </div>
            )}

          </div>

          <p className="footer">
            Powered via secure fabric · <span className="footer-accent">OneLynq</span>{' '}
            <span style={{ opacity:.4 }}>App</span>
          </p>
        </div>
      </div>
    </>
  )
}