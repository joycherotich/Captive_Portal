import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Check, Shield, Lock, Wifi,
  Smartphone, CheckCircle2, User, FileText, ChevronDown, RefreshCw, AlertCircle
} from 'lucide-react'
import { useApp } from '../context/AppContext'

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const NAS_IP = '102.218.210.12'
const API    = import.meta.env.VITE_API_BASE_URL

/* ─────────────────────────────────────────────────────────
   AUTH HEADERS
───────────────────────────────────────────────────────── */
function authHeaders(extra = {}) {
  const token    = sessionStorage.getItem('onelynq_accessToken') || ''
  const tenantId = sessionStorage.getItem('onelynq_tenantId')    || ''
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${token}`,
    'X-Tenant-Id':   tenantId,
    ...extra,
  }
}

/* ─────────────────────────────────────────────────────────
   GET STORED USER — reads oluser from sessionStorage
───────────────────────────────────────────────────────── */
function getStoredUser() {
  try {
    // Try oluser first (the rich object you showed)
    const oluser = sessionStorage.getItem('oluser')
    if (oluser) return JSON.parse(oluser)
    // Fallback to onelynq_user
    const u = sessionStorage.getItem('onelynq_user')
    if (u) return JSON.parse(u)
    return {}
  } catch { return {} }
}

/* ─────────────────────────────────────────────────────────
   ID TYPES FALLBACK
───────────────────────────────────────────────────────── */
const ID_TYPE_FALLBACK = [
  { id: '019c9a78-747f-719b-bfda-f94d1a030ce9', name: 'National ID'         },
  { id: '019c9a78-7488-776b-bb69-ba5430487235', name: 'Passport'            },
  { id: '019c9a78-7488-77b1-9c6f-ab2b9242f7fc', name: 'Business Reg Number' },
  { id: '019c9a78-7489-713b-96de-1438bc8cddd6', name: 'Tax ID'              },
  { id: '019c9a78-7489-7622-a83b-5a92f1cf9f32', name: 'Military ID'         },
  { id: '019c9a78-748a-70b7-aad2-455ea7aba955', name: "Driver's Licence"    },
]

/* ─────────────────────────────────────────────────────────
   FETCH HELPERS
───────────────────────────────────────────────────────── */
async function fetchPartyTypeId() {
  try {
    const res  = await fetch(`${API}/api/party/party-types`, { headers: authHeaders() })
    const json = await res.json()
    return json.data?.data?.find(t => t.name === 'INDIVIDUALL')?.id ?? null
  } catch { return null }
}

async function fetchPartyRoleTypeId() {
  try {
    const res  = await fetch(`${API}/api/party/role-types`, { headers: authHeaders() })
    const json = await res.json()
    return json.data?.data?.find(r => r.name === 'Customer')?.id ?? null
  } catch { return null }
}

async function fetchIdTypes() {
  try {
    const res  = await fetch(`${API}/api/party/id-types`, { headers: authHeaders() })
    const json = await res.json()
    if (json.success && json.data?.data?.length) {
      return json.data.data.map(t => ({
        id:   t.id,
        name: t.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      }))
    }
    return null
  } catch { return null }
}

async function fetchPaymentMethods() {
  try {
    const res  = await fetch(`${API}/api/payments/method-types?page=0&size=10`, { headers: authHeaders() })
    const json = await res.json()
    if (json.success && json.data?.methodTypes?.length) {
      return json.data.methodTypes.filter(m => m.isActive)
    }
    return null
  } catch { return null }
}

/* ─────────────────────────────────────────────────────────
   SPINNER
───────────────────────────────────────────────────────── */
function Spin({ size = 16, color = 'white' }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: `2px solid ${color}40`, borderTopColor: color,
      borderRadius: '50%', animation: 'spin .7s linear infinite', flexShrink: 0,
    }} />
  )
}

/* ─────────────────────────────────────────────────────────
   METHOD ICON
───────────────────────────────────────────────────────── */
function MethodIcon({ method, size = 28 }) {
  if (method.iconUrl) {
    return (
      <img
        src={method.iconUrl}
        alt={method.name}
        style={{ width: size, height: size, objectFit: 'contain', borderRadius: 4 }}
        onError={e => { e.currentTarget.style.display = 'none' }}
      />
    )
  }
  const emoji = method.code === 'MPESA' ? '📱' : '💳'
  return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{emoji}</span>
}

/* ─────────────────────────────────────────────────────────
   METHOD COLOR
───────────────────────────────────────────────────────── */
function methodColor(method) {
  if (method.code === 'MPESA')             return '#00A651'
  if (method.code?.includes('PESATEL'))   return '#6366F1'
  if (method.category === 'MOBILE_MONEY') return '#0891B2'
  if (method.category === 'CARD')         return '#1B3A8F'
  return '#6366F1'
}

/* ─────────────────────────────────────────────────────────
   MOBILE MONEY FORM
───────────────────────────────────────────────────────── */
function MobileMoneyForm({ method, plan, onSubmit, submitting, stkPushed, countdown }) {
  const [phone, setPhone] = useState(() => {
    try {
      const stored     = getStoredUser()
      const inputType  = sessionStorage.getItem('onelynq_inputType') || ''
      const displayId  = sessionStorage.getItem('onelynq_displayId') || ''

      // 1. from stored user profile
      const fromProfile = stored.primaryPhone || stored.phone || ''

      // 2. from displayId if they logged in via phone
      const fromDisplay = inputType === 'phone' && displayId
        ? displayId.replace(/\s/g, '')
        : ''

      return fromProfile || fromDisplay || ''
    } catch { return '' }
  })

  const color   = methodColor(method)
  const isMpesa = method.code === 'MPESA'

  if (stkPushed) {
    return (
      <div style={{ textAlign: 'center', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MethodIcon method={method} size={32} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>
            {isMpesa ? 'STK Push Sent!' : 'Payment Request Sent!'}
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>
            {isMpesa
              ? <>Enter your M-Pesa PIN on <strong>{phone}</strong> to pay <strong style={{ color }}> KES {plan.price?.toLocaleString()}</strong></>
              : <>Approve the payment prompt on <strong>{phone}</strong> for <strong style={{ color }}>KES {plan.price?.toLocaleString()}</strong></>
            }
          </p>
        </div>
        {submitting && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Spin size={14} color="var(--text-muted)" />
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Waiting for confirmation… {countdown}s</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ background: `${color}0D`, border: `1px solid ${color}30`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <MethodIcon method={method} size={28} />
        <div>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>{method.name}</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>
            {isMpesa ? 'A payment prompt will be sent to your phone' : 'Enter your phone number to receive a payment request'}
          </p>
        </div>
        {method.processingFeePct === 0 && method.processingFeeFlat === 0 && (
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, color, background: `${color}15`, padding: '3px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>No Fees</span>
        )}
      </div>

      <div>
        <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 5 }}>
          Phone Number
        </label>
        <input
          style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 10, padding: '10px 13px', fontSize: 14, color: 'var(--text-main)', outline: 'none', fontFamily: 'var(--font-body)' }}
          placeholder="+254 7XX XXX XXX"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          {isMpesa ? 'Must be a registered Safaricom M-Pesa number' : `Registered ${method.name} number`}
        </p>
      </div>

      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total to pay</span>
        <span style={{ fontSize: 16, fontWeight: 800, color, fontFamily: 'var(--font-display)' }}>KES {plan.price?.toLocaleString()}</span>
      </div>

      <button
        onClick={() => onSubmit(phone)}
        disabled={submitting || !phone.trim()}
        style={{
          width: '100%', padding: '12px 0', borderRadius: 11, border: 'none',
          background: `linear-gradient(135deg,${color},${color}CC)`,
          color: 'white', fontSize: 13, fontWeight: 700,
          cursor: submitting ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
          opacity: submitting ? 0.7 : 1, fontFamily: 'var(--font-display)',
          boxShadow: `0 4px 14px ${color}35`,
        }}
      >
        {submitting
          ? <><Spin />Processing…</>
          : <><Smartphone size={15} />{isMpesa ? 'Send STK Push' : `Pay via ${method.name}`}</>
        }
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 1 — Personal details form (only shown when no partyId)
───────────────────────────────────────────────────────── */
function DetailsForm({ user, idTypes, onNext }) {
  const storedUser = getStoredUser()

  const prefill = {
    fullName: storedUser.fullName || storedUser.name || user?.name  || '',
    email:    storedUser.email                       || user?.email || '',
    phone:    storedUser.primaryPhone || storedUser.phone || user?.phone || '',
  }

  const [form, setForm] = useState({
    fullName: prefill.fullName,
    email:    prefill.email,
    phone:    prefill.phone,
    idTypeId: idTypes[0]?.id || '',
    idNumber: '',
    idExpiry: '',
  })
  const [errors, setErrors] = useState({})
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const locked = {
    fullName: !!prefill.fullName,
    email:    !!prefill.email,
    phone:    !!prefill.phone,
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Valid email required'
    if (!form.phone.trim())    e.phone    = 'Phone number is required'
    if (!form.idTypeId)        e.idTypeId = 'Please select an ID type'
    if (!form.idNumber.trim()) e.idNumber = 'ID number is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const inputStyle = (key, isLocked = false) => ({
    width: '100%',
    background: isLocked ? 'rgba(255,255,255,0.03)' : 'var(--bg)',
    border: `1.5px solid ${errors[key] ? '#EF4444' : 'var(--border)'}`,
    borderRadius: 10,
    padding: '10px 13px',
    paddingRight: isLocked ? 36 : 13,
    fontSize: 13,
    color: isLocked ? 'var(--text-sub)' : 'var(--text-main)',
    outline: 'none',
    fontFamily: 'var(--font-body)',
    transition: 'border-color .15s',
    cursor: isLocked ? 'not-allowed' : 'text',
    opacity: isLocked ? 0.8 : 1,
  })

  const labelStyle = {
    fontSize: 11, fontWeight: 700, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '.06em',
    display: 'block', marginBottom: 5,
  }
  const errStyle = { fontSize: 11, color: '#EF4444', marginTop: 3 }

  const LockedField = ({ fieldKey, type = 'text', placeholder, label }) => (
    <div>
      <label style={labelStyle}>
        {label}
        <span style={{ marginLeft: 6, fontSize: 9, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '.04em', textTransform: 'none', opacity: .7 }}>
          (from your account)
        </span>
      </label>
      <div style={{ position: 'relative' }}>
        <input style={inputStyle(fieldKey, true)} type={type} placeholder={placeholder} value={form[fieldKey]} readOnly tabIndex={-1} />
        <Lock size={12} color="var(--text-muted)"
          style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', opacity: .45, pointerEvents: 'none' }} />
      </div>
      {errors[fieldKey] && <p style={errStyle}>{errors[fieldKey]}</p>}
    </div>
  )

  const EditableField = ({ fieldKey, type = 'text', placeholder, label }) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input style={inputStyle(fieldKey, false)} type={type} placeholder={placeholder} value={form[fieldKey]} onChange={e => set(fieldKey, e.target.value)} />
      {errors[fieldKey] && <p style={errStyle}>{errors[fieldKey]}</p>}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#1D6FD8,#1452A8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={16} color="white" />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>Your Details</h2>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Used to create your account on the network</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {locked.fullName
          ? <LockedField fieldKey="fullName" placeholder="John Doe" label="Full Name *" />
          : <EditableField fieldKey="fullName" placeholder="John Doe" label="Full Name *" />
        }
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {locked.email
            ? <LockedField fieldKey="email" type="email" placeholder="you@email.com" label="Email *" />
            : <EditableField fieldKey="email" type="email" placeholder="you@email.com" label="Email *" />
          }
          {locked.phone
            ? <LockedField fieldKey="phone" type="tel" placeholder="+254 7XX XXX XXX" label="Phone *" />
            : <EditableField fieldKey="phone" type="tel" placeholder="+254 7XX XXX XXX" label="Phone *" />
          }
        </div>

        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <FileText size={13} color="var(--blue)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-sub)' }}>Identification</span>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>ID Type *</label>
            <div style={{ position: 'relative' }}>
              <select value={form.idTypeId} onChange={e => set('idTypeId', e.target.value)}
                style={{ ...inputStyle('idTypeId'), appearance: 'none', paddingRight: 32, cursor: 'pointer' }}>
                {idTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <ChevronDown size={13} color="var(--text-muted)"
                style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
            {errors.idTypeId && <p style={errStyle}>{errors.idTypeId}</p>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={labelStyle}>ID Number *</label>
              <input style={inputStyle('idNumber')} placeholder="12345678" value={form.idNumber} onChange={e => set('idNumber', e.target.value)} />
              {errors.idNumber && <p style={errStyle}>{errors.idNumber}</p>}
            </div>
            <div>
              <label style={labelStyle}>Expiry Date</label>
              <input style={inputStyle('idExpiry')} type="date" value={form.idExpiry} onChange={e => set('idExpiry', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => { if (validate()) onNext(form) }}
        style={{
          width: '100%', marginTop: 18, padding: '12px 0', borderRadius: 11, border: 'none',
          background: 'linear-gradient(135deg,#1D6FD8,#1452A8)', color: 'white',
          fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', gap: 6,
          fontFamily: 'var(--font-display)', boxShadow: '0 4px 14px rgba(29,111,216,0.35)',
        }}>
        Continue to Payment →
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STEP 2 — Payment form
───────────────────────────────────────────────────────── */
function PaymentForm({ plan, details, partyTypeId, partyRoleTypeId, existingPartyId, onSuccess }) {
  const [paymentMethods,   setPaymentMethods]   = useState([])
  const [loadingMethods,   setLoadingMethods]   = useState(true)
  const [methodsError,     setMethodsError]     = useState('')
  const [selectedMethodId, setSelectedMethodId] = useState(null)
  const [submitting,       setSubmitting]       = useState(false)
  const [stkPushed,        setStkPushed]        = useState(false)
  const [countdown,        setCountdown]        = useState(60)
  const [apiError,         setApiError]         = useState('')

  const verificationId = sessionStorage.getItem('onelynq_verificationId') || ''

  const loadMethods = () => {
    setLoadingMethods(true)
    setMethodsError('')
    fetchPaymentMethods()
      .then(methods => {
        if (methods?.length) {
          setPaymentMethods(methods)
          setSelectedMethodId(methods[0].id)
        } else {
          setMethodsError('No payment methods available for this network.')
        }
      })
      .finally(() => setLoadingMethods(false))
  }

  useEffect(() => { loadMethods() }, [])

  const selectedMethod = paymentMethods.find(m => m.id === selectedMethodId)

  const buildPayload = (phone) => {
    // If we already have a partyId, pass it directly — no need to create party
    if (existingPartyId) {
      return {
        partyId:                existingPartyId,
        paymentMsisdn:          phone.replace(/\s/g, ''),
        paymentMethodCode:      selectedMethod?.code || '',
        currency:               selectedMethod?.currency || plan.currency || 'KES',
        productOfferingPriceId: plan.id,
        siteId:                 null,
        nasIp:                  NAS_IP,
        createPartyRequest:     null,
      }
    }

    // No partyId — include full party creation payload from details form
    return {
      partyId:                null,
      paymentMsisdn:          phone.replace(/\s/g, ''),
      paymentMethodCode:      selectedMethod?.code || '',
      currency:               selectedMethod?.currency || plan.currency || 'KES',
      productOfferingPriceId: plan.id,
      siteId:                 null,
      nasIp:                  NAS_IP,
      createPartyRequest: {
        partyTypeId,
        partyRoleTypeId,
        appCode:          'CAPPRT',
        customAttributes: [],
        contacts: [{
          id:                null,
          name:              details.fullName,
          email:             details.email,
          primaryPhone:      details.phone.replace(/\s/g, ''),
          secondaryPhone:    '',
          preferredLanguage: 'English',
          preferredChannel:  'SMS',
          notificationPref:  {},
          isPrimaryContact:  true,
          contactType:       'GENERAL',
        }],
        addresses:       [],
        identifications: details.idNumber ? [{
          id:                 null,
          idType:             details.idTypeId,
          idNumber:           details.idNumber,
          expiryDate:         details.idExpiry || null,
          issuingCountryCode: 'KE',
        }] : [],
      },
    }
  }

  const handleSubmit = async (phone) => {
    setSubmitting(true)
    setApiError('')
    setStkPushed(true)

    let c = 60
    const timer = setInterval(() => { c--; setCountdown(c); if (c <= 0) clearInterval(timer) }, 1000)

    try {
      const res    = await fetch(`${API}/api/captive-portal/purchase`, {
        method:  'POST',
        headers: authHeaders({ 'X-Verification-Id': verificationId }),
        body:    JSON.stringify(buildPayload(phone)),
      })
      const result = await res.json()
      clearInterval(timer)
      if (result.success) {
        onSuccess()
      } else {
        setStkPushed(false)
        setApiError(result.message || result.responseMessage || 'Purchase failed. Please try again.')
      }
    } catch (err) {
      clearInterval(timer)
      setStkPushed(false)
      console.error('Purchase error:', err)
      setApiError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingMethods) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
        <Spin size={16} color="var(--text-muted)" /> Loading payment methods…
      </div>
    )
  }

  if (methodsError) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <AlertCircle size={32} color="#F59E0B" style={{ margin: '0 auto 10px', display: 'block' }} />
        <p style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 14 }}>{methodsError}</p>
        <button onClick={loadMethods}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer' }}>
          <RefreshCw size={13} /> Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Plan summary */}
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 14px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>{plan.name} · {plan.period}</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{plan.speed} · {plan.data}</p>
        </div>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--orange)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
          KES {plan.price?.toLocaleString()}
        </p>
      </div>

      {/* API error */}
      {apiError && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 13px', marginBottom: 14, fontSize: 12, color: '#EF4444', display: 'flex', alignItems: 'center', gap: 7 }}>
          ⚠️ {apiError}
          <button onClick={() => { setApiError(''); setStkPushed(false) }}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: 11, fontWeight: 600 }}>
            Try again
          </button>
        </div>
      )}

      {/* Method tabs */}
      {!stkPushed && paymentMethods.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(paymentMethods.length, 3)}, 1fr)`, gap: 8, marginBottom: 18 }}>
          {paymentMethods.map(m => {
            const color    = methodColor(m)
            const isActive = m.id === selectedMethodId
            return (
              <button key={m.id} onClick={() => { setSelectedMethodId(m.id); setApiError('') }}
                style={{
                  padding: '10px 8px', borderRadius: 10,
                  border: `2px solid ${isActive ? color : 'var(--border)'}`,
                  background: isActive ? `${color}08` : 'var(--bg-card)',
                  cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
                  boxShadow: isActive ? `0 3px 12px ${color}25` : 'none',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                }}>
                <MethodIcon method={m} size={26} />
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: isActive ? color : 'var(--text-muted)', fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>
                  {m.name}
                </p>
                {m.processingFeePct === 0 && m.processingFeeFlat === 0 && (
                  <span style={{ fontSize: 9, color, fontWeight: 600 }}>No fees</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {!stkPushed && paymentMethods.length === 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <MethodIcon method={paymentMethods[0]} size={20} />
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-sub)' }}>{paymentMethods[0].name}</span>
        </div>
      )}

      {selectedMethod && (
        <MobileMoneyForm
          method={selectedMethod}
          plan={plan}
          onSubmit={handleSubmit}
          submitting={submitting}
          stkPushed={stkPushed}
          countdown={countdown}
        />
      )}

      {stkPushed && !submitting && (
        <button onClick={() => { setStkPushed(false); setApiError(''); setCountdown(60) }}
          style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', fontSize: 12, fontWeight: 600, color: 'var(--orange)', cursor: 'pointer' }}>
          ← Try again
        </button>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 20, flexWrap: 'wrap' }}>
        {[{ I: Shield, l: 'Secure Payment' }, { I: Lock, l: 'Encrypted' }, { I: Check, l: 'Instant Activation' }].map(({ I, l }) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
            <I size={12} color="#F47820" />{l}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   SUCCESS SCREEN
───────────────────────────────────────────────────────── */
function SuccessScreen({ plan, countdown }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 0', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#F47820,#D4631A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 36px rgba(244,120,32,0.35)' }}>
        <CheckCircle2 size={36} color="white" />
      </div>
      <div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>Payment Confirmed!</h2>
        <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Your <strong style={{ color: 'var(--text-main)' }}>{plan?.name}</strong> plan is now active.</p>
      </div>
      <div style={{ width: '100%', background: 'rgba(244,120,32,0.06)', border: '1.5px solid rgba(244,120,32,0.2)', borderRadius: 12, padding: '14px 18px' }}>
        {[
          { l: 'Plan',        v: `${plan?.name} (${plan?.period})`     },
          { l: 'Speed',       v: plan?.speed                            },
          { l: 'Data',        v: plan?.data                             },
          { l: 'Amount Paid', v: `KES ${plan?.price?.toLocaleString()}` },
        ].map(({ l, v }) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(244,120,32,0.1)' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
        <Wifi size={14} color="#F47820" />
        <span>Redirecting to Dashboard in <strong style={{ color: 'var(--orange)' }}>{countdown}s</strong>…</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────── */
export default function PaymentPage() {
  const { activePlan, showToast, user, login } = useApp()
  const navigate = useNavigate()

  // ── Read partyId from oluser / onelynq_user ────────────────
  const storedUser   = getStoredUser()
  const existingPartyId = storedUser.partyId || user?.partyId || ''
  const hasPartyId      = !!existingPartyId && existingPartyId !== ''

  // ── Step logic: skip 'details' if partyId already exists ──
  const [step,            setStep]            = useState(() => hasPartyId ? 'payment' : 'details')
  const [details,         setDetails]         = useState(null)
  const [idTypes,         setIdTypes]         = useState(ID_TYPE_FALLBACK)
  const [partyTypeId,     setPartyTypeId]     = useState(null)
  const [partyRoleTypeId, setPartyRoleTypeId] = useState(null)
  const [countdown,       setCountdown]       = useState(5)
  const [loadingIds,      setLoadingIds]      = useState(!hasPartyId) // skip loading if going straight to payment

  useEffect(() => { if (!activePlan) navigate('/packages') }, [activePlan])

  useEffect(() => {
    // Only fetch party/id lookup data if we need the details form
    if (hasPartyId) { setLoadingIds(false); return }
    Promise.all([
      fetchPartyTypeId(),
      fetchPartyRoleTypeId(),
      fetchIdTypes(),
    ]).then(([ptId, prtId, idTypeList]) => {
      if (ptId)       setPartyTypeId(ptId)
      if (prtId)      setPartyRoleTypeId(prtId)
      if (idTypeList) setIdTypes(idTypeList)
    }).finally(() => setLoadingIds(false))
  }, [])

  useEffect(() => {
    if (step !== 'success') return
    const t = setInterval(() => setCountdown(c => {
      if (c <= 1) { clearInterval(t); navigate('/dashboard') }
      return c - 1
    }), 1000)
    return () => clearInterval(t)
  }, [step])

  const handlePaymentSuccess = () => {
    login({
      ...user,
      plan:      `${activePlan?.name} ${activePlan?.speed}`,
      dataUsed:  0,
      dataTotal: activePlan?.data === 'Unlimited' ? 999 : parseInt(activePlan?.data) || 10,
    })
    showToast(`Payment confirmed! ${activePlan?.name} plan activated 🎉`, 'success')
    setStep('success')
  }

  if (!activePlan) return null

  // Steps shown in breadcrumb — hide 'Details' step if already has partyId
  const steps   = hasPartyId ? ['Payment', 'Done'] : ['Details', 'Payment', 'Done']
  const stepIdx = hasPartyId
    ? (step === 'payment' ? 0 : 1)
    : (step === 'details' ? 0 : step === 'payment' ? 1 : 2)

  return (
    <div className="animate-fade-in" style={{ maxWidth: 540, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Back + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        {step !== 'success' && (
          <button
            onClick={() => {
              if (step === 'payment' && !hasPartyId) setStep('details')
              else navigate('/packages')
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9, border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <ArrowLeft size={13} /> Back
          </button>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700,
                background: i <= stepIdx ? 'linear-gradient(135deg,#1D6FD8,#1452A8)' : 'var(--bg)',
                border: `1.5px solid ${i <= stepIdx ? 'transparent' : 'var(--border)'}`,
                color: i <= stepIdx ? 'white' : 'var(--text-muted)',
              }}>
                {i < stepIdx ? <Check size={11} /> : i + 1}
              </div>
              <span style={{ fontSize: 11, fontWeight: i === stepIdx ? 700 : 500, color: i === stepIdx ? 'var(--blue)' : 'var(--text-muted)' }}>{s}</span>
              {i < steps.length - 1 && <div style={{ width: 18, height: 1, background: 'var(--border)', margin: '0 2px' }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: '22px 20px' }}>
        {loadingIds && step === 'details' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0 16px', color: 'var(--text-muted)', fontSize: 12 }}>
            <Spin size={14} color="var(--text-muted)" /> Loading form…
          </div>
        )}

        {!loadingIds && step === 'details' && (
          <DetailsForm
            user={user}
            idTypes={idTypes}
            onNext={d => { setDetails(d); setStep('payment') }}
          />
        )}

        {step === 'payment' && (
          <PaymentForm
            plan={activePlan}
            details={details}
            partyTypeId={partyTypeId}
            partyRoleTypeId={partyRoleTypeId}
            existingPartyId={existingPartyId}  // ← pass partyId directly
            onSuccess={handlePaymentSuccess}
            onBack={() => hasPartyId ? navigate('/packages') : setStep('details')}
          />
        )}

        {step === 'success' && (
          <SuccessScreen plan={activePlan} countdown={countdown} />
        )}
      </div>
    </div>
  )
}