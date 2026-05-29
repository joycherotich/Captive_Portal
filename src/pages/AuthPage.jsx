import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Shield, Globe, Wifi, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import logo from '../assets/logo_white.png'

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
    const resize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H }
    window.addEventListener('resize', resize)
    const nodeCount = 18
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 4 + 3, pulse: Math.random() * Math.PI * 2,
      color: Math.random() > 0.5 ? '#F47820' : '#4D78E8',
    }))
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
      nodes.forEach(n => { n.x += n.vx; n.y += n.vy; n.pulse += 0.04; if (n.x < 0 || n.x > W) n.vx *= -1; if (n.y < 0 || n.y > H) n.vy *= -1 })
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.35
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y)
            grad.addColorStop(0, `rgba(77,120,232,${alpha})`); grad.addColorStop(1, `rgba(244,120,32,${alpha * 0.6})`)
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.strokeStyle = grad; ctx.lineWidth = 1; ctx.stroke()
          }
        }
      }
      nodes.forEach(n => {
        const pulse = (Math.sin(n.pulse) + 1) / 2
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 6 + pulse * 4, 0, Math.PI * 2)
        ctx.fillStyle = n.color === '#F47820' ? `rgba(244,120,32,${0.05 + pulse * 0.08})` : `rgba(77,120,232,${0.05 + pulse * 0.08})`; ctx.fill()
        const g = ctx.createRadialGradient(n.x - 1, n.y - 1, 0, n.x, n.y, n.r)
        g.addColorStop(0, '#ffffff'); g.addColorStop(1, n.color)
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.shadowColor = n.color; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0
      })
      packets.forEach(p => {
        p.t += p.speed
        if (p.t > 1) { p.t = 0; p.from = p.to; let b = Math.floor(Math.random() * nodeCount); while (b === p.from) b = Math.floor(Math.random() * nodeCount); p.to = b }
        const px = nodes[p.from].x + (nodes[p.to].x - nodes[p.from].x) * p.t
        const py = nodes[p.from].y + (nodes[p.to].y - nodes[p.from].y) * p.t
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = p.color; ctx.shadowColor = p.color; ctx.shadowBlur = 12; ctx.fill(); ctx.shadowBlur = 0
      })
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

function WifiRipple() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[1,2,3,4].map(i => (
        <div key={i} className="absolute rounded-full border border-orange-400/20"
          style={{ width: `${i * 110}px`, height: `${i * 110}px`, animation: `wifiRing ${2 + i * 0.6}s ease-out ${i * 0.4}s infinite` }} />
      ))}
      <div className="relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#F47820,#D4631A)', boxShadow: '0 0 50px rgba(244,120,32,0.6), 0 0 100px rgba(244,120,32,0.2)' }}>
        <Wifi size={36} color="white" strokeWidth={2} />
      </div>
    </div>
  )
}

/* ─── Detect input type ─────────────────────────────── */
function detectType(val) {
  const v = val.trim()
  if (!v) return null
  if (/^[A-Z0-9]{2,}-[A-Z0-9]/.test(v.toUpperCase())) return 'voucher'
  if (/^\+?[\d\s\-]{7,}$/.test(v)) return 'phone'
  if (v.includes('@')) return 'email'
  return null
}

const TYPE_HINTS = {
  email:   { label: 'Email detected',          color: '#3B82F6' },
  phone:   { label: 'Phone number detected',   color: '#16A34A' },
  voucher: { label: 'Voucher code detected',   color: '#F47820' },
}

/* ─── Main Auth Page ─────────────────────────────────── */
export default function AuthPage() {
  const [value, setValue]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login, showToast } = useApp()
  const navigate = useNavigate()

  const type = detectType(value)

  const handleAccess = () => {
    if (!value.trim()) return
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      login({
        name: 'Joy Letim',
        email: type === 'email' ? value.trim() : 'letimjoy7@gmail.com',
        phone: type === 'phone' ? value.trim() : '+254742142959',
        plan: 'Basic 10Mbps', dataUsed: 4.2, dataTotal: 10,
        expiry: '2026-07-15', provider: 'DirectCore ISP'
      })
      const msg = type === 'voucher' ? 'Voucher activated! Enjoy browsing.' : 'Welcome to DirectCore!'
      showToast(msg, 'success')
      navigate('/packages')
    }, 1800)
  }

  const STAT_ITEMS = [
    { icon: Zap,    label: 'Ultra Fast', sub: 'Up to 1 Gbps'   },
    { icon: Shield, label: 'Secured',    sub: 'WPA3 Encrypted' },
    { icon: Globe,  label: 'Always On',  sub: '99.9% Uptime'   },
  ]

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: 'var(--bg-deep)' }}>

      {/* ── LEFT PANEL ── */}
      <div className="relative lg:flex-1 h-64 lg:h-screen overflow-hidden auth-panel-bg">
        <NetworkAnimation />
        {/* <WifiRipple /> */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-8 pointer-events-none">
          <div className="text-center mt-40 lg:mt-0">
            <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight mb-4" style={{ fontFamily: 'serif' }}>
              Seamless<br /><span style={{ color: '#F47820' }}>Connectivity</span>
            </h2>
            <p className="text-sm text-blue-100/50 max-w-xs mx-auto">
              Intelligent WiFi infrastructure for homes, businesses & communities.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {STAT_ITEMS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(13,31,79,0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(244,120,32,0.2)' }}>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(244,120,32,0.2)' }}>
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
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{ background: 'linear-gradient(to top,rgba(6,16,42,0.6),transparent)' }} />
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        className="lg:w-[480px] xl:w-[520px] flex flex-col justify-between p-6 lg:p-12 relative overflow-y-auto"
        style={{ background: 'linear-gradient(180deg,#06102A 0%,#0A1845 100%)', borderLeft: '1px solid rgba(46,84,196,0.15)' }}
      >
        {/* Subtle bg blob */}
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-20"
          style={{ background: 'radial-gradient(circle,#1B3A8F,transparent)', transform: 'translate(-40%,-40%)' }} />

        {/* ── Main content ── */}
        <div className="flex flex-col justify-center flex-1">

          {/* Logo */}
          <div className="mb-10 animate-fade-in">
            <img src={logo} alt="DirectCore" className="h-10 object-contain" style={{ filter: 'brightness(1.05)' }} />
            <div className="flex items-center gap-2 mt-3">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 status-pulse" />
              <p className="text-xs text-blue-200/50">WiFi Self-Service Portal</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 animate-fade-in">
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'serif' }}>
              Get Connected
            </h2>
            <p className="text-sm text-blue-200/45 mt-2">
              Enter your phone, email, or voucher code to access your account.
            </p>
          </div>

          {/* Input */}
          <div className="animate-fade-in" style={{ marginBottom: 12 }}>
            <label className="text-xs text-orange-400/80 mb-2 block font-semibold uppercase tracking-wider">
              Phone · Email · Voucher
            </label>
            <input
              className="portal-input"
              placeholder="e.g. +254712... or you@mail.com or DC10-XXXX"
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAccess()}
              autoFocus
              style={{ letterSpacing: value && detectType(value) === 'voucher' ? '0.12em' : 'normal' }}
            />
            {/* Type hint */}
            <div style={{ height: 22, marginTop: 8 }}>
              {type && (
                <div className="flex items-center gap-1.5 animate-fade-in">
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: TYPE_HINTS[type].color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: TYPE_HINTS[type].color, fontWeight: 600 }}>
                    {TYPE_HINTS[type].label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Access button */}
          <button
            className="btn-primary animate-fade-in"
            onClick={handleAccess}
            disabled={loading || !value.trim()}
            style={{ marginTop: 4 }}
          >
            {loading
              ? <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </span>
              : <span className="flex items-center justify-center gap-2">
                  {type === 'voucher' ? <Zap size={16} /> : <ArrowRight size={16} />}
                  {type === 'voucher' ? 'Activate & Connect' : 'Access Account'}
                </span>
            }
          </button>
        </div>

        {/* ── Footer ── */}
        <div className="mt-10 text-center space-y-1.5">
          <p className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: 'rgba(253,186,116,0.45)' }}>
            Powered by Onelynq App
          </p>
          <p className="text-xs" style={{ color: 'rgba(147,166,220,0.2)' }}>
            © 2026 DirectCore · By connecting you accept our{' '}
            <span className="underline underline-offset-2 cursor-pointer" style={{ color: 'rgba(147,166,220,0.35)' }}>
              terms of use
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}