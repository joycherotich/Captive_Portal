import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ChevronRight, Ticket, UserPlus, LogIn, Zap, Shield, Globe, Wifi, Check, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
// import logo from '../assets/logo.png'

import logo from '../assets/logo_white.png';

/* ─── Animated Network Canvas ─────────────────────────── */
function NetworkAnimation() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let W = canvas.offsetWidth, H = canvas.offsetHeight
    canvas.width = W; canvas.height = H

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight
      canvas.width = W; canvas.height = H
    }
    window.addEventListener('resize', resize)

    // Nodes
    const nodeCount = 18
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 4 + 3,
      pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? '#F47820' : '#4D78E8',
    }))

    // Packets
    const packets = []
    const addPacket = () => {
      const a = Math.floor(Math.random() * nodeCount)
      let b = Math.floor(Math.random() * nodeCount)
      while (b === a) b = Math.floor(Math.random() * nodeCount)
      packets.push({ from: a, to: b, t: 0, speed: 0.008 + Math.random() * 0.006, color: Math.random() > 0.5 ? '#F47820' : '#6B8EF5' })
    }
    for (let i = 0; i < 4; i++) addPacket()

    let frame = 0
    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Update nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.pulse += 0.04
        if (n.x < 0 || n.x > W) n.vx *= -1
        if (n.y < 0 || n.y > H) n.vy *= -1
      })

      // Draw connections
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.35
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            grad.addColorStop(0, `rgba(77,120,232,${alpha})`)
            grad.addColorStop(1, `rgba(244,120,32,${alpha * 0.6})`)
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = grad
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const pulse = (Math.sin(n.pulse) + 1) / 2
        // Outer glow ring
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + 6 + pulse * 4, 0, Math.PI * 2)
        ctx.fillStyle = n.color === '#F47820' ? `rgba(244,120,32,${0.05 + pulse * 0.08})` : `rgba(77,120,232,${0.05 + pulse * 0.08})`
        ctx.fill()
        // Core dot
        const g = ctx.createRadialGradient(n.x - 1, n.y - 1, 0, n.x, n.y, n.r)
        g.addColorStop(0, '#ffffff')
        g.addColorStop(1, n.color)
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.shadowColor = n.color
        ctx.shadowBlur = 10
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Draw + update packets
      packets.forEach((p, pi) => {
        p.t += p.speed
        if (p.t > 1) {
          p.t = 0
          p.from = p.to
          let b = Math.floor(Math.random() * nodeCount)
          while (b === p.from) b = Math.floor(Math.random() * nodeCount)
          p.to = b
        }
        const sx = nodes[p.from].x, sy = nodes[p.from].y
        const ex = nodes[p.to].x, ey = nodes[p.to].y
        const px = sx + (ex - sx) * p.t
        const py = sy + (ey - sy) * p.t
        ctx.beginPath()
        ctx.arc(px, py, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 12
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Spawn new packets occasionally
      frame++
      if (frame % 90 === 0 && packets.length < 8) addPacket()
      if (frame % 180 === 0 && packets.length > 4) packets.splice(0, 1)

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.9 }} />
}

/* ─── Wifi Ripple SVG ─── */
function WifiRipple() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1,2,3,4].map(i => (
        <div key={i} className="absolute rounded-full border border-orange-400/20"
          style={{
            width: `${i * 110}px`, height: `${i * 110}px`,
            animation: `wifiRing ${2 + i * 0.6}s ease-out ${i * 0.4}s infinite`,
          }}
        />
      ))}
      <div className="relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#F47820,#D4631A)', boxShadow: '0 0 50px rgba(244,120,32,0.6), 0 0 100px rgba(244,120,32,0.2)' }}>
        <Wifi size={36} color="white" strokeWidth={2} />
      </div>
    </div>
  )
}

/* ─── Main Auth Page ─────────────────────────────────── */
const TABS = ['login', 'register', 'voucher']

export default function AuthPage() {
  const [tab, setTab] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '', voucher: '' })
  const { login, showToast } = useApp()
  const navigate = useNavigate()

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login({
        name: form.name || 'Joy Letim',
        email: form.email || 'letimjoy7@gmail.com',
        phone: form.phone || '+254742142959',
        plan: 'Basic 10Mbps', dataUsed: 4.2, dataTotal: 10,
        expiry: '2024-07-15', provider: 'DirectCore ISP'
      })
      showToast(tab === 'voucher' ? 'Voucher activated! Enjoy browsing.' : 'Welcome to DirectCore!', 'success')
      navigate('/packages')
    }, 1800)
  }

  const STAT_ITEMS = [
    { icon: Zap, label: 'Ultra Fast', sub: 'Up to 1 Gbps' },
    { icon: Shield, label: 'Secured', sub: 'WPA3 Encrypted' },
    { icon: Globe, label: 'Always On', sub: '99.9% Uptime' },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg-deep)' }}>

      {/* ── LEFT PANEL: Animation ── */}
      <div className="relative lg:flex-1 h-64 lg:h-screen overflow-hidden auth-panel-bg">
        <NetworkAnimation />
        <WifiRipple />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 pointer-events-none">
          {/* Big label */}
          <div className="text-center mt-40 lg:mt-0">
            <p className="text-xs uppercase tracking-[0.3em] text-orange-300/60 font-medium mb-3">Powered by Onelynq App</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4" style={{ fontFamily: 'Syne,sans-serif' }}>
              Seamless<br /><span style={{ color: '#F47820' }}>Connectivity</span>
            </h2>
            <p className="text-sm text-blue-100/50 max-w-xs mx-auto">Intelligent WiFi infrastructure for homes, businesses & communities.</p>
          </div>

          {/* Stat chips */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {STAT_ITEMS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(13,31,79,0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(244,120,32,0.2)' }}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(244,120,32,0.2)' }}>
                  <Icon size={14} color="#F47820" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white leading-none">{label}</p>
                  <p className="text-xs text-blue-200/40 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative corner */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to top,rgba(6,16,42,0.6),transparent)' }} />
      </div>

      {/* ── RIGHT PANEL: Auth Form ── */}
      <div className="lg:w-[480px] xl:w-[520px] flex flex-col justify-center p-6 lg:p-12 relative overflow-y-auto"
        style={{ background: 'linear-gradient(180deg,#06102A 0%,#0A1845 100%)', borderLeft: '1px solid rgba(46,84,196,0.15)' }}>

        {/* Subtle bg decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle,#1B3A8F,transparent)', transform: 'translate(-40%,-40%)' }} />

        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img src={logo} alt="DirectCore" className="h-10 object-contain" style={{ filter: 'brightness(1.05)' }} />
          <div className="flex items-center gap-2 mt-3">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 status-pulse" />
            <p className="text-xs text-blue-200/50">WiFi Self-Service Portal</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-2xl p-1 mb-6 animate-fade-in" style={{ background: 'rgba(6,16,42,0.6)', border: '1px solid rgba(46,84,196,0.2)' }}>
          {[
            { id: 'login', icon: LogIn, label: 'Sign In' },
            { id: 'register', icon: UserPlus, label: 'Register' },
            { id: 'voucher', icon: Ticket, label: 'Voucher' },
          ].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={tab === id
                ? { background: 'linear-gradient(135deg,#F47820,#D4631A)', color: 'white', boxShadow: '0 4px 14px rgba(244,120,32,0.35)' }
                : { color: 'rgba(238,242,255,0.4)' }
              }>
              <Icon size={14} />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* ── LOGIN ── */}
        {tab === 'login' && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <h2 className="text-2xl font-black" style={{ fontFamily: 'Syne,sans-serif' }}>Welcome back 👋</h2>
              <p className="text-sm text-blue-200/45 mt-1">Sign in to manage your connection</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-orange-400/80 mb-1.5 block font-semibold uppercase tracking-wider">Email or Phone</label>
                <input className="portal-input" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-orange-400/80 mb-1.5 block font-semibold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input className="portal-input pr-12" type={showPass ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-orange-400 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-blue-500/40 flex items-center justify-center group-hover:border-orange-400 transition-colors">
                    <Check size={10} className="text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-xs text-blue-200/40">Remember me</span>
                </label>
                <button className="text-xs text-orange-400 hover:underline font-medium">Forgot password?</button>
              </div>
            </div>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</span>
                : <span className="flex items-center justify-center gap-2">Sign In <ArrowRight size={16} /></span>}
            </button>
            <p className="text-center text-xs text-blue-200/35">
              New here? <button onClick={() => setTab('register')} className="text-orange-400 font-semibold hover:underline">Create free account</button>
            </p>
          </div>
        )}

        {/* ── REGISTER ── */}
        {tab === 'register' && (
          <div className="space-y-4 animate-slide-up">
            <div>
              <h2 className="text-2xl font-black" style={{ fontFamily: 'Syne,sans-serif' }}>Create Account</h2>
              <p className="text-sm text-blue-200/45 mt-1">Join DirectCore in under a minute</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Joy Kirui', type: 'text' },
                { label: 'Email Address', key: 'email', placeholder: 'letimjoy7@gmail.com', type: 'email' },
                { label: 'Phone Number', key: 'phone', placeholder: '+254 7XX XXX XXX', type: 'tel' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs text-orange-400/80 mb-1.5 block font-semibold uppercase tracking-wider">{label}</label>
                  <input className="portal-input" type={type} placeholder={placeholder} value={form[key]} onChange={e => set(key, e.target.value)} />
                </div>
              ))}
              <div>
                <label className="text-xs text-orange-400/80 mb-1.5 block font-semibold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input className="portal-input pr-12" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300/40 hover:text-orange-400 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <label className="flex items-start gap-2.5 cursor-pointer group pt-1">
                <div className="w-4 h-4 mt-0.5 rounded border border-blue-500/40 flex items-center justify-center group-hover:border-orange-400 transition-colors flex-shrink-0">
                  <Check size={10} className="text-orange-400 opacity-0 group-hover:opacity-100" />
                </div>
                <span className="text-xs text-blue-200/40 leading-relaxed">
                  I agree to the <span className="text-orange-400 font-medium">Terms of Service</span> and <span className="text-orange-400 font-medium">Privacy Policy</span>
                </span>
              </label>
            </div>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</span>
                : <span className="flex items-center justify-center gap-2">Create Free Account <ArrowRight size={16} /></span>}
            </button>
            <p className="text-center text-xs text-blue-200/35">
              Have an account? <button onClick={() => setTab('login')} className="text-orange-400 font-semibold hover:underline">Sign in</button>
            </p>
          </div>
        )}

        {/* ── VOUCHER ── */}
        {tab === 'voucher' && (
          <div className="space-y-5 animate-slide-up">
            <div>
              <h2 className="text-2xl font-black" style={{ fontFamily: 'Syne,sans-serif' }}>Voucher Access</h2>
              <p className="text-sm text-blue-200/45 mt-1">Instant access with a prepaid code</p>
            </div>
            <div className="rounded-2xl p-5 text-center relative overflow-hidden"
              style={{ background: 'rgba(244,120,32,0.06)', border: '1px dashed rgba(244,120,32,0.3)' }}>
              <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg,#F47820 0,#F47820 1px,transparent 0,transparent 50%)', backgroundSize: '12px 12px' }} />
              <Ticket size={40} color="rgba(244,120,32,0.5)" className="mx-auto mb-2" />
              <p className="text-xs text-blue-200/45 relative">Vouchers available at DirectCore service points & authorized agents</p>
            </div>
            <div>
              <label className="text-xs text-orange-400/80 mb-1.5 block font-semibold uppercase tracking-wider">Voucher Code</label>
              <input
                className="portal-input text-center tracking-[0.35em] text-lg font-mono"
                placeholder="XXXX-XXXX-XXXX"
                value={form.voucher}
                onChange={e => set('voucher', e.target.value.toUpperCase())}
                maxLength={14}
              />
            </div>
            {/* Paste demo codes */}
            <div className="flex flex-wrap gap-2">
              <p className="text-xs text-blue-200/30 w-full">Try demo codes:</p>
              {['DC10-FREE-HOUR', 'DC20-DEMO-WIFI'].map(c => (
                <button key={c} onClick={() => set('voucher', c)}
                  className="text-xs px-3 py-1.5 rounded-lg font-mono transition-all hover:border-orange-400/50"
                  style={{ background: 'rgba(244,120,32,0.08)', border: '1px solid rgba(244,120,32,0.2)', color: '#F47820' }}>
                  {c}
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Activating...</span>
                : <span className="flex items-center justify-center gap-2"><Zap size={16} />Activate & Connect</span>}
            </button>
            <p className="text-center text-xs text-blue-200/35">
              Need account? <button onClick={() => setTab('register')} className="text-orange-400 font-semibold hover:underline">Register free</button>
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="mt-8 text-xs text-blue-200/20 text-center">
          © 2026 DirectCore · By connecting you accept our terms of use
        </p>
      </div>
    </div>
  )
}