import { useState } from 'react'
import {
  User, Bell, Shield, Smartphone,
  Moon, Globe, ChevronRight,
  Check, AlertCircle, Eye, EyeOff,
  Fingerprint, Key, Trash2,
  Activity, Save, Camera,
  Download, Languages, Clock
} from 'lucide-react'
import { useApp } from '../context/AppContext'

/* ── Toggle ─────────────────────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, flexShrink: 0,
        background: value ? 'linear-gradient(90deg,#d97706,#f59e0b)' : '#E2E8F0',
        border: 'none', cursor: 'pointer', position: 'relative',
        transition: 'background 0.2s',
        boxShadow: value ? '0 0 0 3px rgba(245,158,11,0.18)' : 'none',
      }}>
      <div style={{
        position: 'absolute',
        top: 3, left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: '50%',
        background: 'white',
        transition: 'left 0.2s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
      }} />
    </button>
  )
}

/* ── Section card ────────────────────────────────────── */
function Section({ title, description, icon: Icon, children, accent = '#f59e0b' }) {
  return (
    <div style={{
      background: 'white', border: '1px solid var(--border)',
      borderRadius: 18, overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10, flexShrink: 0,
          background: 'rgba(245,158,11,0.10)',
          border: '1px solid rgba(245,158,11,0.20)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={16} style={{ color: '#d97706' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
            {title}
          </h2>
          {description && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{description}</p>
          )}
        </div>
      </div>
      <div style={{ padding: '4px 0' }}>{children}</div>
    </div>
  )
}

/* ── Row base ────────────────────────────────────────── */
function Row({ children, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '13px 20px',
      borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.04)',
      gap: 12,
    }}>
      {children}
    </div>
  )
}

function RowLabel({ label, sub }) {
  return (
    <div style={{ minWidth: 0 }}>
      <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-main)', margin: 0 }}>{label}</p>
      {sub && <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>{sub}</p>}
    </div>
  )
}

/* ── Toggle row ──────────────────────────────────────── */
function ToggleRow({ label, sub, value, onChange, last }) {
  return (
    <Row last={last}>
      <RowLabel label={label} sub={sub} />
      <Toggle value={value} onChange={onChange} />
    </Row>
  )
}

/* ── Select row ──────────────────────────────────────── */
function SelectRow({ label, sub, value, options, onChange, last }) {
  return (
    <Row last={last}>
      <RowLabel label={label} sub={sub} />
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        background: 'var(--bg)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '6px 10px', fontSize: 12.5,
        fontWeight: 500, color: 'var(--text-main)', outline: 'none',
        cursor: 'pointer', flexShrink: 0, maxWidth: 180,
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Row>
  )
}

/* ── Nav row ─────────────────────────────────────────── */
function NavRow({ label, sub, icon: Icon, danger, onClick, last }) {
  const [hov, setHov] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '13px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
        background: hov ? (danger ? 'rgba(239,68,68,0.04)' : 'rgba(245,158,11,0.04)') : 'transparent',
        borderBottom: last ? 'none' : '1px solid rgba(0,0,0,0.04)',
        transition: 'background 0.15s', gap: 12,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {Icon && (
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: danger ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
            border: `1px solid ${danger ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={13} style={{ color: danger ? '#EF4444' : '#d97706' }} />
          </div>
        )}
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 500, color: danger ? '#EF4444' : 'var(--text-main)', margin: 0 }}>{label}</p>
          {sub && <p style={{ fontSize: 11.5, color: 'var(--text-muted)', margin: '2px 0 0' }}>{sub}</p>}
        </div>
      </div>
      <ChevronRight size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
    </button>
  )
}

/* ── Avatar ──────────────────────────────────────────── */
function AvatarSection({ name }) {
  const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? '?'
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 20px 16px',
      borderBottom: '1px solid rgba(0,0,0,0.04)',
    }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'linear-gradient(135deg,#f59e0b,#d97706)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#0a0a0a',
          fontFamily: 'var(--font-display)',
        }}>
          {initials}
        </div>
        <button style={{
          position: 'absolute', bottom: -4, right: -4,
          width: 22, height: 22, borderRadius: '50%', border: '2px solid white',
          background: '#f59e0b', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(245,158,11,0.35)',
        }}>
          <Camera size={10} color="#0a0a0a" />
        </button>
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
          {name}
        </p>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>
          Click the camera icon to update your photo
        </p>
      </div>
    </div>
  )
}

/* ── Text input ──────────────────────────────────────── */
function FieldInput({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="portal-input"
        style={{ fontSize: 13.5 }}
      />
    </div>
  )
}

/* ── Password field ──────────────────────────────────── */
function PasswordInput({ label, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ padding: '10px 20px', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.09em', display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="••••••••"
          className="portal-input"
          style={{ paddingRight: 40, fontSize: 13.5 }}
        />
        <button type="button" onClick={() => setShow(s => !s)} style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
          display: 'flex', alignItems: 'center',
        }}>
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  )
}

/* ── Save button ─────────────────────────────────────── */
function SaveBtn({ onClick, label = 'Save Changes', icon: Icon = Save }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ padding: '12px 20px' }}>
      <button onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: hov ? '#d97706' : 'linear-gradient(135deg,#f59e0b,#d97706)',
          color: '#0a0a0a', border: 'none', borderRadius: 10,
          padding: '9px 18px', fontSize: 13, fontWeight: 700,
          cursor: 'pointer', transition: 'all 0.15s',
          boxShadow: '0 2px 8px rgba(245,158,11,0.28)',
          fontFamily: 'var(--font-display)',
        }}>
        <Icon size={13} />
        {label}
      </button>
    </div>
  )
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════ */
export default function Preferences() {
  const { showToast } = useApp()

  /* profile */
  const [name,  setName]  = useState('Joy Letim')
  const [email, setEmail] = useState('letimjoy7@gmail.com')
  const [phone, setPhone] = useState('+254 742 142 959')

  /* password */
  const [currentPw, setCurrentPw] = useState('')
  const [newPw,     setNewPw]     = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwError,   setPwError]   = useState('')

  /* notifications */
  const [emailNotifs,   setEmailNotifs]   = useState(true)
  const [smsNotifs,     setSmsNotifs]     = useState(false)
  const [usageAlerts,   setUsageAlerts]   = useState(true)
  const [billingAlerts, setBillingAlerts] = useState(true)
  const [newsAlerts,    setNewsAlerts]    = useState(false)

  /* appearance */
  const [theme,    setTheme]    = useState('light')
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('africa-nairobi')

  /* privacy */
  const [analytics,     setAnalytics]     = useState(true)
  const [locationShare, setLocationShare] = useState(false)

  const handleSaveProfile = () => showToast('Profile updated successfully', 'success')

  const handleSavePassword = () => {
    if (!currentPw)          return setPwError('Enter your current password')
    if (!newPw)              return setPwError('Enter a new password')
    if (newPw.length < 8)    return setPwError('Password must be at least 8 characters')
    if (newPw !== confirmPw) return setPwError('Passwords do not match')
    setPwError('')
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    showToast('Password changed successfully', 'success')
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: 720, width: '100%' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-main)', margin: 0, fontFamily: 'var(--font-display)' }}>
          Preferences
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0' }}>
          Manage your account settings, notifications, and appearance
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* ── Profile ── */}
        <Section title="Profile" description="Update your personal information" icon={User}>
          <AvatarSection name={name} />
          <FieldInput label="Full Name"     value={name}  onChange={setName}  />
          <FieldInput label="Email Address" value={email} onChange={setEmail} type="email" />
          <FieldInput label="Phone Number"  value={phone} onChange={setPhone} type="tel" />
          <SaveBtn onClick={handleSaveProfile} />
        </Section>

        {/* ── Security ── */}
        <Section title="Security" description="Manage your password and authentication" icon={Shield}>
          <PasswordInput label="Current Password" value={currentPw} onChange={setCurrentPw} />
          <PasswordInput label="New Password"     value={newPw}     onChange={setNewPw}     />
          <PasswordInput label="Confirm Password" value={confirmPw} onChange={setConfirmPw} />
          {pwError && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              margin: '0 20px 4px',
              padding: '9px 12px', borderRadius: 10,
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
            }}>
              <AlertCircle size={13} style={{ color: '#EF4444', flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: '#EF4444' }}>{pwError}</span>
            </div>
          )}
          <SaveBtn onClick={handleSavePassword} label="Update Password" icon={Key} />
          <NavRow label="Two-Factor Authentication" sub="Add an extra layer of security" icon={Fingerprint} onClick={() => {}} />
          <NavRow label="Active Sessions"           sub="Manage logged-in devices"        icon={Smartphone}  onClick={() => {}} last />
        </Section>

        {/* ── Notifications ── */}
        <Section title="Notifications" description="Choose what you want to be notified about" icon={Bell}>
          <ToggleRow label="Email Notifications" sub="Receive updates via email"         value={emailNotifs}   onChange={setEmailNotifs}   />
          <ToggleRow label="SMS Alerts"          sub="Get alerts via text message"       value={smsNotifs}     onChange={setSmsNotifs}     />
          <ToggleRow label="Data Usage Alerts"   sub="Notify when nearing plan limit"    value={usageAlerts}   onChange={setUsageAlerts}   />
          <ToggleRow label="Billing Reminders"   sub="Payment due and invoice alerts"    value={billingAlerts} onChange={setBillingAlerts} />
          <ToggleRow label="News & Updates"      sub="Product updates and announcements" value={newsAlerts}    onChange={setNewsAlerts}    last />
        </Section>

        {/* ── Appearance ── */}
        <Section title="Appearance & Locale" description="Customise your experience" icon={Moon}>
          <SelectRow
            label="Theme" sub="Choose your colour mode"
            value={theme} onChange={setTheme}
            options={[
              { value: 'light',  label: '☀️  Light'  },
              { value: 'dark',   label: '🌙  Dark'   },
              { value: 'system', label: '⚙️  System' },
            ]}
          />
          <SelectRow
            label="Language" sub="App display language"
            value={language} onChange={setLanguage}
            options={[
              { value: 'en', label: 'English' },
              { value: 'sw', label: 'Swahili' },
              { value: 'fr', label: 'French'  },
            ]}
          />
          <SelectRow
            label="Timezone" sub="Used for scheduling and billing"
            value={timezone} onChange={setTimezone}
            options={[
              { value: 'africa-nairobi', label: 'Africa/Nairobi (EAT)' },
              { value: 'africa-lagos',   label: 'Africa/Lagos (WAT)'   },
              { value: 'europe-london',  label: 'Europe/London (GMT)'  },
              { value: 'us-eastern',     label: 'US/Eastern (EST)'     },
            ]}
            last
          />
        </Section>

        {/* ── Privacy ── */}
        <Section title="Privacy & Data" description="Control how your data is used" icon={Activity}>
          <ToggleRow label="Usage Analytics"  sub="Help improve the app with anonymous data" value={analytics}     onChange={setAnalytics}     />
          <ToggleRow label="Location Sharing" sub="Share location for coverage insights"     value={locationShare} onChange={setLocationShare} />
          <NavRow label="Download My Data" sub="Export all your account data"        icon={Download} onClick={() => {}} />
          <NavRow label="Delete Account"   sub="Permanently remove your account"     icon={Trash2}   onClick={() => {}} danger last />
        </Section>

      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}