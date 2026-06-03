import { useState } from 'react'
import { User, Mail, Phone, MapPin, Camera, Shield, Bell, Lock, ChevronRight, Check, Edit3, Zap, Star, Activity } from 'lucide-react'
import { useApp } from '../context/AppContext'

const css = `
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.3)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

  /* ── Wrapper: fills the parent, no artificial cap ── */
  .pf-wrap {
    animation: fadeUp .4s ease both;
    width: 100%;
    box-sizing: border-box;
  }

  /* hero card */
  .pf-hero { border-radius: 22px; overflow: hidden; margin-bottom: 16px;
    background: var(--bg-card); border: 1px solid var(--border); box-shadow: var(--shadow-md); }

  .pf-body { padding: 24px; }

  .pf-avatar-row {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 18px; flex-wrap: wrap;
  }

  .pf-avatar {
    width: 88px; height: 88px; border-radius: 22px; flex-shrink: 0;
    background: linear-gradient(145deg, #F47820 0%, #B8490E 100%);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px; font-weight: 800; color: white;
    font-family: var(--font-display); letter-spacing: -0.02em;
    box-shadow: 0 0 0 4px var(--bg-card), 0 12px 40px rgba(244,120,32,0.4);
    position: relative;
  }
  .pf-cam-btn {
    position: absolute; bottom: -7px; right: -7px;
    width: 28px; height: 28px; border-radius: 9px;
    border: 3px solid var(--bg-card); background: #2563EB;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: transform .15s;
  }
  .pf-cam-btn:hover { transform: scale(1.12); }

  .pf-meta { flex: 1; min-width: 0; }
  .pf-name-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 3px; }
  .pf-name { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -0.03em;
    color: var(--text-main); font-family: var(--font-display); word-break: break-word; }
  .pf-verified { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700;
    padding: 3px 9px; border-radius: 20px; background: rgba(244,120,32,0.1); color: #F47820;
    border: 1px solid rgba(244,120,32,0.22); font-family: var(--font-display); flex-shrink: 0; }
  .pf-email { margin: 0; font-size: 13px; color: var(--text-muted); word-break: break-all; }

  .pf-status {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 13px; border-radius: 20px;
    background: rgba(22,163,74,0.08); border: 1px solid rgba(22,163,74,0.2);
    flex-shrink: 0; align-self: flex-start;
  }
  .pf-dot { width: 7px; height: 7px; border-radius: 50%; background: #16A34A;
    box-shadow: 0 0 0 2.5px rgba(22,163,74,0.25); animation: pulse-dot 2.2s infinite; }
  .pf-status-label { font-size: 12px; font-weight: 700; color: #16A34A; font-family: var(--font-display); }

  .pf-divider { height: 1px; background: var(--border); margin: 0 0 18px; }

  /* stats — fluid columns that wrap naturally */
  .pf-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 10px;
  }
  .pf-stat {
    background: var(--bg); border: 1px solid var(--border); border-radius: 14px;
    padding: 13px 14px; display: flex; align-items: center; gap: 12px;
  }
  .pf-stat-icon { width: 38px; height: 38px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .pf-stat-label { margin: 0; font-size: 11px; color: var(--text-muted); }
  .pf-stat-value { margin: 2px 0 0; font-size: 13px; font-weight: 700; color: var(--text-main);
    font-family: var(--font-display); letter-spacing: -0.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* section card */
  .pf-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px;
    box-shadow: var(--shadow); margin-bottom: 16px; overflow: hidden; }
  .pf-card-head { padding: 17px 22px 15px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .pf-card-title { margin: 0; font-size: 14px; font-weight: 700; color: var(--text-main);
    font-family: var(--font-display); letter-spacing: -0.01em; }
  .pf-card-sub { margin: 2px 0 0; font-size: 12px; color: var(--text-muted); }
  .pf-editing-badge { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 8px;
    background: rgba(244,120,32,0.1); color: #F47820; border: 1px solid rgba(244,120,32,0.2);
    font-family: var(--font-display); flex-shrink: 0; }

  /* form — fluid two-column that collapses to one */
  .pf-form {
    padding: 22px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 15px;
  }
  .pf-field-label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
    font-family: var(--font-display); }
  .pf-input-wrap { position: relative; }
  .pf-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); pointer-events: none; }

  /* settings */
  .pf-settings-list { padding: 8px 10px; }
  .pf-setting-btn {
    width: 100%; display: flex; align-items: center; gap: 14px;
    padding: 11px 13px; border-radius: 13px; border: none;
    background: transparent; cursor: pointer; text-align: left; transition: background .15s;
  }
  .pf-setting-btn:hover { background: var(--bg); }
  .pf-setting-icon { width: 40px; min-width: 40px; height: 40px; border-radius: 11px;
    background: var(--bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; }
  .pf-setting-label { margin: 0; font-size: 13px; font-weight: 600; color: var(--text-main);
    font-family: var(--font-display); }
  .pf-setting-sub { margin: 2px 0 0; font-size: 12px; color: var(--text-muted);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* danger */
  .pf-danger { margin: 4px 18px 18px; padding: 14px 18px; border-radius: 14px;
    background: rgba(239,68,68,0.04); border: 1px solid rgba(239,68,68,0.12);
    display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .pf-danger-title { margin: 0; font-size: 13px; font-weight: 700; color: #EF4444;
    font-family: var(--font-display); }
  .pf-danger-sub { margin: 2px 0 0; font-size: 12px; color: var(--text-muted); }
  .pf-danger-btn {
    font-size: 12px; font-weight: 700; padding: 7px 16px; border-radius: 10px;
    background: transparent; color: #EF4444; border: 1px solid rgba(239,68,68,0.3);
    cursor: pointer; font-family: var(--font-display); transition: all .2s; flex-shrink: 0;
  }
  .pf-danger-btn:hover { background: #EF4444; color: white; }

  /* header */
  .pf-header { display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
  .pf-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: #F47820;
    text-transform: uppercase; font-family: var(--font-display); margin-bottom: 3px; }
  .pf-h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; color: var(--text-main);
    font-family: var(--font-display); margin: 0; }
  .pf-edit-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 20px; border-radius: 12px; border: none;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: var(--font-display); transition: all .2s; white-space: nowrap; flex-shrink: 0;
  }
  .pf-edit-btn.saving {
    background: linear-gradient(135deg,#F47820,#C75C10); color: white;
    box-shadow: 0 4px 18px rgba(244,120,32,0.38);
  }
  .pf-edit-btn.idle {
    background: var(--bg-card); color: var(--text-sub);
    border: 1.5px solid var(--border); box-shadow: var(--shadow);
  }

  /* ── Responsive overrides ── */
  @media (max-width: 480px) {
    .pf-header { flex-direction: column; align-items: flex-start; }
    .pf-edit-btn { width: 100%; }
    .pf-avatar { width: 68px !important; height: 68px !important;
      font-size: 22px !important; border-radius: 17px !important; }
    .pf-body { padding: 16px !important; }
    .pf-form { padding: 16px !important; }
    .pf-card-head { padding: 14px 16px 12px !important; }
    .pf-settings-list { padding: 6px 8px !important; }
    .pf-danger { flex-direction: column; align-items: flex-start;
      margin: 4px 12px 16px !important; }
    .pf-danger-btn { width: 100%; text-align: center; }
  }
`

export default function ProfilePage() {
  const { user, showToast } = useApp()
  const [editing, setEditing]     = useState(false)
  const [activeField, setActiveField] = useState(null)
  const [form, setForm] = useState({
    name:     user?.name     || 'Joy Letim',
    email:    user?.email    || 'joy@example.com',
    phone:    user?.phone    || '+254742142959',
    location: 'Nairobi, Kenya',
    idNumber: 'KE1234567',
  })

  const set   = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const save  = ()     => { setEditing(false); showToast('Profile updated!', 'success') }
  const initials = form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const fields = [
    { label: 'Full Name',     key: 'name',     icon: User,   type: 'text'  },
    { label: 'Email Address', key: 'email',    icon: Mail,   type: 'email' },
    { label: 'Phone Number',  key: 'phone',    icon: Phone,  type: 'tel'   },
    { label: 'Location',      key: 'location', icon: MapPin, type: 'text'  },
    { label: 'ID Number',     key: 'idNumber', icon: Shield, type: 'text',
      fullWidth: true },
  ]

  const stats = [
    { icon: Zap,      label: 'Current Plan', value: user?.plan || 'Basic 10Mbps',
      color: '#F47820', bg: 'rgba(244,120,32,0.12)' },
    { icon: Activity, label: 'Data Used',
      value: `${user?.dataUsed || 4.2} / ${user?.dataTotal || 10} GB`,
      color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
    { icon: Star,     label: 'Member Since', value: 'Jan 2026',
      color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  ]

  const settings = [
    // { icon: Lock,   label: 'Change Password', sub: 'Last changed 30 days ago',          badge: null, badgeType: null },
    { icon: Bell,   label: 'Notifications',   sub: 'Email & SMS alerts enabled',         badge: '3',  badgeType: 'blue' },
    { icon: Shield, label: 'Two-Factor Auth', sub: 'Add extra security to your account', badge: 'Off',badgeType: 'orange' },
  ]

  return (
    <>
      <style>{css}</style>
      <div className="pf-wrap animate-fade-in">

        {/* ── Page Header ── */}
        <div className="pf-header">
          <div>
            <p className="pf-eyebrow">Account</p>
            <h1 className="pf-h1">My Profile</h1>
          </div>
          <button
            className={`pf-edit-btn ${editing ? 'saving' : 'idle'}`}
            onClick={() => editing ? save() : setEditing(true)}
          >
            {editing
              ? <><Check size={14} strokeWidth={3}/> Save Changes</>
              : <><Edit3 size={14}/> Edit Profile</>}
          </button>
        </div>

        {/* ── Hero Card ── */}
        <div className="pf-hero">
          <div className="pf-body">

            <div className="pf-avatar-row">
              <div className="pf-avatar">
                {initials}
                <button className="pf-cam-btn" aria-label="Change photo">
                  <Camera size={11} color="white" strokeWidth={2.5}/>
                </button>
              </div>

              <div className="pf-meta">
                <div className="pf-name-row">
                  <h2 className="pf-name">{form.name}</h2>
                  <span className="pf-verified">
                    <Shield size={9} strokeWidth={3}/> Verified
                  </span>
                </div>
                <p className="pf-email">{form.email}</p>
              </div>

              <div className="pf-status">
                <span className="pf-dot"/>
                <span className="pf-status-label">Active</span>
              </div>
            </div>

            <div className="pf-divider"/>

            <div className="pf-stats">
              {stats.map(({ icon: Icon, label, value, color, bg }) => (
                <div key={label} className="pf-stat">
                  <div className="pf-stat-icon" style={{ background: bg }}>
                    <Icon size={16} color={color} strokeWidth={2}/>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p className="pf-stat-label">{label}</p>
                    <p className="pf-stat-value">{value}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Personal Information ── */}
        <div className="pf-card">
          <div className="pf-card-head">
            <div>
              <h3 className="pf-card-title">Personal Information</h3>
              <p className="pf-card-sub">Your account details and contact info</p>
            </div>
            {editing && <span className="pf-editing-badge">EDITING</span>}
          </div>

          <div className="pf-form">
            {fields.map(({ label, key, icon: Icon, type, fullWidth }) => (
              <div key={key} style={fullWidth ? { gridColumn: '1 / -1' } : {}}>
                <label className="pf-field-label">{label}</label>
                <div className="pf-input-wrap">
                  <div className="pf-input-icon">
                    <Icon
                      size={14}
                      color={activeField === key && editing ? '#F47820' : 'var(--text-muted)'}
                      strokeWidth={2}
                    />
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
                      width: '100%',
                      boxSizing: 'border-box',
                      background: editing
                        ? (activeField === key ? '#fff' : 'var(--bg)')
                        : 'var(--bg)',
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
        <div className="pf-card" style={{ marginBottom: 0 }}>
          <div className="pf-card-head">
            <div>
              <h3 className="pf-card-title">Account Settings</h3>
              <p className="pf-card-sub">Security and notification preferences</p>
            </div>
          </div>

          <div className="pf-settings-list">
            {settings.map(({ icon: Icon, label, sub, badge, badgeType }) => (
              <button key={label} className="pf-setting-btn">
                <div className="pf-setting-icon">
                  <Icon size={16} color="var(--blue-light)" strokeWidth={1.8}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="pf-setting-label">{label}</p>
                  <p className="pf-setting-sub">{sub}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                  {badge && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
                      fontFamily: 'var(--font-display)',
                      ...(badgeType === 'orange'
                        ? { background:'rgba(244,120,32,0.1)', color:'#F47820', border:'1px solid rgba(244,120,32,0.2)' }
                        : { background:'rgba(59,130,246,0.1)', color:'var(--blue-light)', border:'1px solid rgba(59,130,246,0.2)' })
                    }}>{badge}</span>
                  )}
                  <ChevronRight size={15} color="var(--text-muted)" strokeWidth={2}/>
                </div>
              </button>
            ))}
          </div>

          <div className="pf-danger">
            <div>
              <p className="pf-danger-title">Delete Account</p>
              <p className="pf-danger-sub">Permanently remove your account and all data</p>
            </div>
            <button className="pf-danger-btn">Delete</button>
          </div>
        </div>

      </div>
    </>
  )
}