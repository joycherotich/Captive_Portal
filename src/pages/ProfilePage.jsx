import { useState } from 'react'
import { User, Mail, Phone, MapPin, Camera, Shield, Bell, Lock, ChevronRight, Check, Edit3, Zap, Globe, Star, Activity } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ProfilePage() {
  const { user, showToast } = useApp()
  const [editing, setEditing] = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john@example.com',
    phone: user?.phone || '+254712345678',
    location: 'Nairobi, Kenya',
    idNumber: 'KE1234567',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const save = () => { setEditing(false); showToast('Profile updated!', 'success') }
  const initials = form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const fields = [
    { label: 'Full Name', key: 'name', icon: User, type: 'text' },
    { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
    { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
    { label: 'Location', key: 'location', icon: MapPin, type: 'text' },
    { label: 'ID Number', key: 'idNumber', icon: Shield, type: 'text' },
  ]

  const settings = [
    { icon: Lock, label: 'Change Password', sub: 'Last changed 30 days ago', badge: null, badgeType: null },
    { icon: Bell, label: 'Notifications', sub: 'Email & SMS alerts enabled', badge: '3', badgeType: 'blue' },
    { icon: Shield, label: 'Two-Factor Auth', sub: 'Add extra security to your account', badge: 'Off', badgeType: 'orange' },
  ]

  return (
    <div className="animate-fade-in" style={{ maxWidth: 740 }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--orange)', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 4 }}>Account</p>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-main)', fontFamily: 'var(--font-display)', margin: 0 }}>My Profile</h1>
        </div>
        <button
          onClick={() => editing ? save() : setEditing(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', borderRadius: 12, border: 'none',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-display)', letterSpacing: '-0.01em',
            transition: 'all 0.2s',
            ...(editing
              ? { background: 'linear-gradient(135deg,#F47820,#D4631A)', color: 'white', boxShadow: '0 4px 16px rgba(244,120,32,0.35)' }
              : { background: 'var(--bg-card)', color: 'var(--text-sub)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow)' })
          }}
        >
          {editing ? <><Check size={14} strokeWidth={3} /> Save Changes</> : <><Edit3 size={14} /> Edit Profile</>}
        </button>
      </div>

      {/* ── Profile Hero Card ── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow-md)', marginBottom: 16, overflow: 'hidden' }}>

        {/* Banner */}
        <div style={{ height: 110, position: 'relative', background: 'linear-gradient(120deg, #06102A 0%, #1B3A8F 55%, #c75e10 100%)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(244,120,32,0.25) 0%, transparent 55%), radial-gradient(circle at 20% 80%, rgba(46,84,196,0.3) 0%, transparent 50%)' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>

        {/* Profile info row — avatar pulled up over banner */}
        <div style={{ padding: '0 28px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, marginTop: -36, marginBottom: 20 }}>

            {/* Avatar */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 20,
                background: 'linear-gradient(135deg, #F47820, #D4631A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 800, color: 'white',
                fontFamily: 'var(--font-display)', letterSpacing: '-0.02em',
                boxShadow: '0 0 0 4px var(--bg-card), 0 8px 32px rgba(244,120,32,0.45)',
              }}>{initials}</div>
              <button style={{
                position: 'absolute', bottom: -6, right: -6,
                width: 26, height: 26, borderRadius: 8, border: '2.5px solid var(--bg-card)',
                background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              ><Camera size={11} color="white" /></button>
            </div>

            {/* Name + meta */}
            <div style={{ flex: 1, paddingBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>{form.name}</h2>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(244,120,32,0.1)', color: 'var(--orange)', border: '1px solid rgba(244,120,32,0.25)', fontFamily: 'var(--font-display)' }}>
                  <Shield size={9} strokeWidth={3} /> Verified
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{form.email}</p>
            </div>

            {/* Active badge — right aligned, stays in content area */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: 4 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', display: 'inline-block', boxShadow: '0 0 0 2px rgba(34,197,94,0.3)', animation: 'sPulse 2s infinite' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#22C55E', fontFamily: 'var(--font-display)' }}>Active</span>
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { icon: Zap, label: 'Current Plan', value: user?.plan || 'Basic 10Mbps', color: '#F47820', bg: 'rgba(244,120,32,0.1)' },
              { icon: Activity, label: 'Data Used', value: `${user?.dataUsed || 4.2} / ${user?.dataTotal || 10} GB`, color: '#2E54C4', bg: 'rgba(46,84,196,0.1)' },
              { icon: Star, label: 'Member Since', value: 'Jan 2024', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={15} color={color} strokeWidth={2} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>{label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow)', marginBottom: 16, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>Personal Information</h3>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Your account details and contact info</p>
          </div>
          {editing && (
            <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: 'rgba(244,120,32,0.1)', color: 'var(--orange)', border: '1px solid rgba(244,120,32,0.2)', fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>EDITING</span>
          )}
        </div>

        <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {fields.map(({ label, key, icon: Icon, type }) => (
            <div key={key} style={key === 'idNumber' ? { gridColumn: '1 / -1' } : {}}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>{label}</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <Icon size={14} color={activeField === key && editing ? 'var(--orange)' : 'var(--text-muted)'} strokeWidth={2} />
                </div>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  onFocus={() => setActiveField(key)}
                  onBlur={() => setActiveField(null)}
                  disabled={!editing}
                  className="portal-input"
                  style={{
                    paddingLeft: 38,
                    background: editing ? (activeField === key ? '#fff' : 'var(--bg)') : 'var(--bg)',
                    opacity: editing ? 1 : 0.8,
                    cursor: editing ? 'text' : 'default',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Account Settings ── */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 16px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>Account Settings</h3>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Security and notification preferences</p>
        </div>

        <div style={{ padding: '8px 12px' }}>
          {settings.map(({ icon: Icon, label, sub, badge, badgeType }) => (
            <button key={label}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 14, border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} color="var(--blue-light)" strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text-main)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{sub}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {badge && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                    fontFamily: 'var(--font-display)',
                    ...(badgeType === 'orange'
                      ? { background: 'rgba(244,120,32,0.1)', color: 'var(--orange)', border: '1px solid rgba(244,120,32,0.2)' }
                      : { background: 'rgba(46,84,196,0.1)', color: 'var(--blue-light)', border: '1px solid rgba(46,84,196,0.2)' })
                  }}>{badge}</span>
                )}
                <ChevronRight size={15} color="var(--text-muted)" strokeWidth={2} />
              </div>
            </button>
          ))}
        </div>

        {/* Danger zone */}
        <div style={{ margin: '4px 20px 20px', padding: '14px 18px', borderRadius: 14, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#EF4444', fontFamily: 'var(--font-display)' }}>Delete Account</p>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Permanently remove your account and all data</p>
          </div>
          <button
            style={{ fontSize: 12, fontWeight: 700, padding: '7px 14px', borderRadius: 10, background: 'transparent', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontFamily: 'var(--font-display)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = 'white' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#EF4444' }}
          >Delete</button>
        </div>
      </div>
    </div>
  )
}