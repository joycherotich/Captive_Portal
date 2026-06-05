import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Download, Upload, Activity, Clock, AlertCircle, ArrowUpRight,
  Package, ChevronRight, Wifi, Radio, Droplets, Zap, MapPin,
  Bell, X, ArrowRight, CheckCircle2, AlertTriangle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState, useEffect } from 'react'

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

const API = import.meta.env.VITE_API_BASE_URL

/* ─────────────────────────────────────────────────────────
   BYTES → HUMAN READABLE
───────────────────────────────────────────────────────── */
function bytesToGB(bytes) {
  if (!bytes || bytes === 0) return 0
  return parseFloat((bytes / (1024 ** 3)).toFixed(2))
}

function bytesToMB(bytes) {
  if (!bytes || bytes === 0) return 0
  return parseFloat((bytes / (1024 ** 2)).toFixed(2))
}

/* ─────────────────────────────────────────────────────────
   CHART TOOLTIP
───────────────────────────────────────────────────────── */
const CT = ({ active, payload, label }) =>
  active && payload?.length ? (
    <div className="bg-white rounded-xl p-3 text-xs" style={{ border: '1px solid var(--border)', boxShadow: '0 4px 16px rgba(27,58,143,0.1)' }}>
      <p className="font-bold mb-2" style={{ color: 'var(--text-sub)' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'var(--text-muted)' }}>{p.name}: </span>
          <span className="font-bold" style={{ color: 'var(--text-main)' }}>{p.value} GB</span>
        </p>
      ))}
    </div>
  ) : null

/* ─────────────────────────────────────────────────────────
   DATA RING
───────────────────────────────────────────────────────── */
function DataRing({ used, total }) {
  const pct    = total > 0 ? Math.min((used / total) * 100, 100) : 0
  const circ   = 2 * Math.PI * 45
  const offset = circ - (pct / 100) * circ
  const danger = pct >= 80
  return (
    <div className="relative w-28 h-28">
      <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#EEF2FF" strokeWidth="9" />
        <circle cx="50" cy="50" r="45" fill="none" stroke="url(#rg)" strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 6px ${danger ? 'rgba(239,68,68,0.5)' : 'rgba(244,120,32,0.5)'})` }} />
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor={danger ? '#EF4444' : '#1B3A8F'} />
            <stop offset="100%" stopColor={danger ? '#F97316' : '#F47820'} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black" style={{ fontFamily: 'serif', color: danger ? '#EF4444' : 'var(--text-main)' }}>
          {pct.toFixed(0)}%
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Used</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   ALERTS
───────────────────────────────────────────────────────── */
function buildAlerts(user, hasParty, activePackage) {
  const alerts = []

  if (hasParty && activePackage) {
    const used  = activePackage.dataUsedGB  ?? 0
    const total = activePackage.dataTotalGB ?? 0
    const pct   = total > 0 ? (used / total) * 100 : 0

    if (pct >= 80 && pct < 100) alerts.push({
      id: 'data-low', icon: Wifi,
      title: `${(total - used).toFixed(1)} GB remaining on your plan`,
      sub: `You've used ${pct.toFixed(0)}% of your data. Top up before it runs out.`,
      action: 'Top Up Now', to: '/packages',
      color: '#F47820', bg: 'rgba(244,120,32,0.07)', border: 'rgba(244,120,32,0.22)',
    })

    if (pct >= 100) alerts.push({
      id: 'data-out', icon: AlertTriangle,
      title: 'Your data has run out',
      sub: 'You have no remaining data. Purchase a new package to stay connected.',
      action: 'Buy Package', to: '/packages',
      color: '#EF4444', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.22)',
    })

    if (activePackage.expiryDate) {
      const daysLeft = Math.ceil((new Date(activePackage.expiryDate) - new Date()) / 86400000)
      if (daysLeft <= 5 && daysLeft > 0) alerts.push({
        id: 'expiry-soon', icon: Clock,
        title: `Your plan expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`,
        sub: `Renew before ${activePackage.expiryDate} to avoid interruption.`,
        action: 'Renew Now', to: '/packages',
        color: '#F59E0B', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.22)',
      })
    }
  }

  alerts.push({
    id: 'water-bill', icon: Droplets,
    title: 'Water bill due in 3 days',
    sub: 'Your KIWASCO bill of KES 1,200 is almost due. Pay via Utilities.',
    action: 'Pay Now', to: '/services',
    color: '#0891B2', bg: 'rgba(8,145,178,0.07)', border: 'rgba(8,145,178,0.22)',
  })
  alerts.push({
    id: 'hotspot-nearby', icon: Radio,
    title: 'Roaming WiFi hotspot nearby',
    sub: '3 DirectCore access points within 500m. Tap to view coverage map.',
    action: 'View Map', to: '/coverage',
    color: '#7C3AED', bg: 'rgba(124,58,237,0.07)', border: 'rgba(124,58,237,0.22)',
  })
  alerts.push({
    id: 'electricity', icon: Zap,
    title: 'Low electricity tokens',
    sub: 'Your prepaid meter has ~3 days of units left. Top up via Utilities.',
    action: 'Top Up', to: '/services',
    color: '#10B981', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.22)',
  })

  return alerts
}

/* ─────────────────────────────────────────────────────────
   ALERT CARD
───────────────────────────────────────────────────────── */
function AlertCard({ alert, onDismiss }) {
  const navigate = useNavigate()
  const Icon = alert.icon
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-2xl"
      style={{ background: alert.bg, border: `1px solid ${alert.border}` }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: alert.bg, border: `1px solid ${alert.border}` }}>
        <Icon size={15} style={{ color: alert.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-snug" style={{ color: 'var(--text-main)' }}>{alert.title}</p>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{alert.sub}</p>
        <button onClick={() => navigate(alert.to)}
          className="inline-flex items-center gap-1 mt-2 text-xs font-bold"
          style={{ color: alert.color }}>
          {alert.action} <ArrowRight size={11} />
        </button>
      </div>
      <button onClick={() => onDismiss(alert.id)}
        className="p-1 rounded-lg flex-shrink-0"
        style={{ color: 'var(--text-muted)', opacity: 0.45 }}
        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}>
        <X size={13} />
      </button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   CURRENT PACKAGE CARD
───────────────────────────────────────────────────────── */
function CurrentPackageCard({ activePackage, hasPlan, navigate }) {
  return (
    <div className="card-elevated rounded-3xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>
          My Package
        </h3>
        {hasPlan && (
          <button onClick={() => navigate('/packages')}
            className="flex items-center gap-1 text-xs font-bold transition-all"
            style={{ color: 'var(--orange)' }}>
            View <ChevronRight size={12} />
          </button>
        )}
      </div>

      {hasPlan ? (
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: 'rgba(27,58,143,0.05)', border: '1px solid rgba(27,58,143,0.12)' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#1B3A8F,#F47820)' }}>
              <Wifi size={18} color="white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black truncate" style={{ color: 'var(--text-main)' }}>
                {activePackage?.packageName ?? '—'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {activePackage?.speed ?? ''} · Active plan
              </p>
            </div>
            <span className="ml-auto text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
              style={{ background: 'rgba(0,166,81,0.1)', color: '#00A651' }}>
              Active
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Data used</span>
              <span className="font-bold" style={{ color: 'var(--orange)' }}>
                {activePackage?.dataUsedGB ?? 0} / {activePackage?.dataTotalGB ?? 0} GB
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EEF2FF' }}>
              <div className="h-full rounded-full transition-all"
                style={{
                  width: `${(activePackage?.dataTotalGB ?? 0) > 0
                    ? Math.min(((activePackage?.dataUsedGB ?? 0) / (activePackage?.dataTotalGB ?? 0)) * 100, 100)
                    : 0}%`,
                  background: 'linear-gradient(90deg,#1B3A8F,#F47820)',
                }} />
            </div>
          </div>

          {[
            { label: 'Expires',   value: activePackage?.expiryDate ?? '—' },
            { label: 'Remaining', value: `${((activePackage?.dataTotalGB ?? 0) - (activePackage?.dataUsedGB ?? 0)).toFixed(1)} GB` },
            { label: 'Price',     value: activePackage?.price ? `KES ${activePackage.price.toLocaleString()}` : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-xs py-1.5 border-b last:border-0"
              style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
              <span className="font-semibold" style={{ color: 'var(--text-main)' }}>{value}</span>
            </div>
          ))}

          <button onClick={() => navigate('/packages')}
            className="mt-auto w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(244,120,32,0.08)', color: '#F47820', border: '1px solid rgba(244,120,32,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,120,32,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,120,32,0.08)'}>
            <Package size={13} /> View / Change Package
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(244,120,32,0.08)' }}>
            <Package size={22} color="#F47820" />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>No Active Plan</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Purchase a package to get connected
            </p>
          </div>
          <button onClick={() => navigate('/packages')} className="btn-primary text-xs px-4 py-2 rounded-xl">
            Browse Packages
          </button>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN DASHBOARD
───────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useApp()
  const navigate  = useNavigate()

  // ── Get partyId — from user context OR sessionStorage ──────
  const storedUser = (() => {
    try { return JSON.parse(sessionStorage.getItem('onelynq_user') || '{}') } catch { return {} }
  })()
  const partyId  = user?.partyId || storedUser?.partyId || ''
  const hasParty = partyId !== '' && partyId != null

  // ── State ──────────────────────────────────────────────────
  const [metrics,        setMetrics]        = useState(null)
  const [activePackage,  setActivePackage]  = useState(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [packageLoading, setPackageLoading] = useState(false)

  // ── Fetch metrics ──────────────────────────────────────────
  useEffect(() => {
    if (!hasParty) { setMetrics(null); return }
    let cancelled = false
    setMetricsLoading(true)
    fetch(`${API}/api/captive-portal/metrics/party/${partyId}`, {
      headers: authHeaders(),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled) return
        if (data?.success && data?.data?.metrics) {
          setMetrics(data.data.metrics)
        } else {
          setMetrics(null)
        }
        setMetricsLoading(false)
      })
      .catch(() => { if (!cancelled) { setMetrics(null); setMetricsLoading(false) } })
    return () => { cancelled = true }
  }, [partyId, hasParty])

  // ── Fetch active package ───────────────────────────────────
  useEffect(() => {
    if (!hasParty) { setActivePackage(null); return }
    let cancelled = false
    setPackageLoading(true)
    fetch(`${API}/api/captive-portal/get-active-package`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify({ partyId }),
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled) return
        if (data?.success && data?.data) {
          // Normalise the package data — map whatever shape API returns
          const pkg = data.data
          setActivePackage({
            packageName:  pkg.packageName  || pkg.name        || pkg.planName  || null,
            speed:        pkg.speed        || pkg.dataSpeed   || null,
            dataTotalGB:  pkg.dataTotalGB  ?? bytesToGB(pkg.dataTotalBytes)  ?? pkg.dataTotal  ?? 0,
            dataUsedGB:   pkg.dataUsedGB   ?? bytesToGB(pkg.dataUsedBytes)   ?? pkg.dataUsed   ?? 0,
            expiryDate:   pkg.expiryDate   || pkg.expiry      || null,
            price:        pkg.price        || pkg.amount      || null,
            status:       pkg.status       || null,
            // keep raw in case we need it
            raw: pkg,
          })
        } else {
          setActivePackage(null)
        }
        setPackageLoading(false)
      })
      .catch(() => { if (!cancelled) { setActivePackage(null); setPackageLoading(false) } })
    return () => { cancelled = true }
  }, [partyId, hasParty])

  // ── Derived metrics values from API response ───────────────
  // metrics shape: { totalDownloadBytes, totalUploadBytes, totalDataUsedBytes,
  //                  totalSessionTimeSeconds, formattedTotalData, formattedSessionTime }
  const totalDownloadGB  = hasParty ? bytesToGB(metrics?.totalDownloadBytes  ?? 0) : 0
  const totalUploadGB    = hasParty ? bytesToGB(metrics?.totalUploadBytes    ?? 0) : 0
  const totalDataUsedGB  = hasParty ? bytesToGB(metrics?.totalDataUsedBytes  ?? 0) : 0
  const sessionTime      = hasParty ? (metrics?.formattedSessionTime ?? '—') : '—'
  const formattedData    = hasParty ? (metrics?.formattedTotalData   ?? '0 B') : '0 B'

  // ── Active package values ──────────────────────────────────
  const dataUsed  = activePackage?.dataUsedGB  ?? 0
  const dataTotal = activePackage?.dataTotalGB ?? 0
  const planName  = activePackage?.packageName ?? null
  const expiry    = activePackage?.expiryDate  ?? null
  const hasPlan   = hasParty && activePackage !== null && planName !== null

  // ── Weekly usage chart — use real data if available ────────
  const usageData = hasParty && metrics?.weeklyUsage?.length
    ? metrics.weeklyUsage
    : [
        { time: 'Mon',   download: 0, upload: 0 },
        { time: 'Tue',   download: 0, upload: 0 },
        { time: 'Wed',   download: 0, upload: 0 },
        { time: 'Thu',   download: 0, upload: 0 },
        { time: 'Fri',   download: 0, upload: 0 },
        { time: 'Sat',   download: 0, upload: 0 },
        { time: 'Today', download: totalDownloadGB, upload: totalUploadGB },
      ]

  // ── Session info ───────────────────────────────────────────
  const ipAddress  = hasParty ? (metrics?.ipAddress      ?? '—') : '—'
  const macAddress = hasParty ? (metrics?.macAddress     ?? '—') : '—'
  const gateway    = hasParty ? (metrics?.gateway        ?? '—') : '—'
  const connSince  = hasParty ? (metrics?.connectedSince ?? '—') : '—'

  // ── Alerts ─────────────────────────────────────────────────
  const allAlerts     = buildAlerts(user, hasParty, activePackage)
  const [dismissed, setDismissed] = useState([])
  const visibleAlerts = allAlerts.filter(a => !dismissed.includes(a.id))
  const dismiss       = (id) => setDismissed(d => [...d, id])

  // ── Stats cards ────────────────────────────────────────────
  const stats = [
    {
      label: 'Downloaded', value: totalDownloadGB > 0 ? totalDownloadGB.toFixed(2) : '0',
      unit: 'GB', icon: Download, color: '#F47820', bg: 'rgba(244,120,32,0.08)',
    },
    {
      label: 'Uploaded', value: totalUploadGB > 0 ? totalUploadGB.toFixed(2) : '0',
      unit: 'GB', icon: Upload, color: '#1B3A8F', bg: 'rgba(27,58,143,0.08)',
    },
    {
      label: 'Total Used', value: formattedData,
      unit: '', icon: Activity, color: '#7C3AED', bg: 'rgba(124,58,237,0.08)',
    },
    {
      label: 'Session', value: sessionTime,
      unit: '', icon: Clock, color: '#0891B2', bg: 'rgba(8,145,178,0.08)',
    },
    {
      label: 'Package',
      value: packageLoading ? '…' : hasPlan ? (planName?.split(' ')[0] ?? 'Active') : 'None',
      unit: '', icon: Package, color: '#F47820', bg: 'rgba(244,120,32,0.08)',
      change: hasPlan ? 'Active' : null, link: '/packages',
    },
  ]

  return (
    <div className="animate-fade-in space-y-5">

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Real-time network usage & alerts</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white"
          style={{ border: `1.5px solid ${hasParty ? 'rgba(0,166,81,0.25)' : 'rgba(180,180,180,0.3)'}` }}>
          <div className={`w-2 h-2 rounded-full ${hasParty ? 'bg-green-500 status-pulse' : 'bg-gray-400'}`} />
          <span className="font-semibold" style={{ color: hasParty ? '#00A651' : 'var(--text-muted)' }}>
            {hasParty ? 'Connected' : 'Not Linked'}
          </span>
        </div>
      </div>

      {/* ── No partyId banner ──────────────────────── */}
      {!hasParty && (
        <div className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(244,120,32,0.07)', border: '1px solid rgba(244,120,32,0.22)' }}>
          <AlertCircle size={18} color="#F47820" className="flex-shrink-0" />
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Account not linked to a service</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Your account is not activated. Contact support or purchase a package to activate your service.
            </p>
          </div>
          <button onClick={() => navigate('/packages')}
            className="ml-auto flex-shrink-0 text-xs font-bold flex items-center gap-1"
            style={{ color: '#F47820' }}>
            Get Started <ArrowRight size={11} />
          </button>
        </div>
      )}

      {/* ── Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {stats.map(({ label, value, unit, icon: Icon, color, change, bg, link }) => (
          <div key={label} className="card-elevated p-4 relative overflow-hidden rounded-2xl">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-60" style={{ background: bg }} />
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon size={17} style={{ color }} />
              </div>
              {change && (
                <span className="text-xs font-bold flex items-center gap-0.5"
                  style={{ color: '#00A651' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-0.5 inline-block" />
                  {change}
                </span>
              )}
            </div>
            <p className="text-xl font-black truncate" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>
              {value}
              {unit && <span className="text-sm font-normal ml-1" style={{ color: 'var(--text-muted)' }}>{unit}</span>}
            </p>
            <div className="flex items-center justify-between mt-0.5">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              {link && (
                <button onClick={() => navigate(link)}
                  className="flex items-center gap-0.5 text-xs font-bold"
                  style={{ color: '#F47820' }}>
                  View <ChevronRight size={11} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + Data ring ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 card-elevated rounded-3xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Weekly Usage</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Download & Upload (GB)</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#F47820' }} />Download
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#1B3A8F' }} />Upload
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={usageData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="dlG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#F47820" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#F47820" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ulG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1B3A8F" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1B3A8F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CT />} />
              <Area type="monotone" dataKey="download" name="Download" stroke="#F47820" strokeWidth={2.5} fill="url(#dlG)" />
              <Area type="monotone" dataKey="upload"   name="Upload"   stroke="#1B3A8F" strokeWidth={2.5} fill="url(#ulG)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Data ring */}
        {hasPlan ? (
          <div className="card-elevated rounded-3xl p-5 flex flex-col">
            <h3 className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Data Usage</h3>
            <p className="text-xs mt-0.5 mb-4" style={{ color: 'var(--text-muted)' }}>{planName}</p>
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <DataRing used={dataUsed} total={dataTotal} />
              <div className="w-full space-y-2">
                {[
                  { l: 'Used',      v: `${dataUsed} GB`,                         c: 'var(--text-main)' },
                  { l: 'Remaining', v: `${(dataTotal - dataUsed).toFixed(1)} GB`, c: 'var(--orange)'   },
                ].map(({ l, v, c }) => (
                  <div key={l} className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                    <span className="font-bold" style={{ color: c }}>{v}</span>
                  </div>
                ))}
                <div className="w-full h-2 rounded-full" style={{ background: '#EEF2FF' }}>
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${dataTotal > 0 ? (dataUsed / dataTotal) * 100 : 0}%`,
                    background: 'linear-gradient(90deg,#1B3A8F,#F47820)',
                  }} />
                </div>
              </div>
            </div>
            {expiry && (
              <div className="mt-4 rounded-xl p-3 text-xs flex items-center gap-2"
                style={{ background: 'rgba(244,120,32,0.07)', border: '1px solid rgba(244,120,32,0.2)' }}>
                <AlertCircle size={13} color="#F47820" />
                <span style={{ color: 'var(--orange)' }}>Expires {expiry}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="card-elevated rounded-3xl p-5 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(244,120,32,0.08)' }}>
              <Package size={26} color="#F47820" />
            </div>
            <div>
              <p className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>
                {packageLoading ? 'Loading…' : 'No Active Plan'}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {packageLoading
                  ? 'Fetching your package details'
                  : hasParty
                    ? 'Purchase a package to see your data usage here.'
                    : 'Link your account to see data usage.'}
              </p>
            </div>
            {!packageLoading && (
              <button onClick={() => navigate('/packages')} className="btn-primary text-sm px-4 py-2.5 rounded-xl">
                Browse Packages
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Active Session + My Package ────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Active Session */}
        <div className="card-elevated rounded-3xl p-5">
          <h3 className="font-black mb-4" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Active Session</h3>
          {metricsLoading ? (
            <div className="flex items-center gap-2 py-6 justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: 'var(--text-muted)', borderTopColor: 'transparent' }} />
              Loading session data…
            </div>
          ) : (
            [
              { label: 'IP Address',      value: ipAddress  },
              { label: 'MAC Address',     value: macAddress },
              { label: 'Gateway',         value: gateway    },
              { label: 'Connected Since', value: connSince  },
              { label: 'Total Data Used', value: formattedData },
              { label: 'Session Time',    value: sessionTime   },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b last:border-0"
                style={{ borderColor: 'var(--border)' }}>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span className="text-xs font-mono font-semibold"
                  style={{ color: value === '—' ? 'var(--text-muted)' : 'var(--blue)' }}>
                  {value}
                </span>
              </div>
            ))
          )}
        </div>

        {/* My Package */}
        <CurrentPackageCard
          activePackage={activePackage}
          hasPlan={hasPlan}
          navigate={navigate}
        />
      </div>

      {/* ── Quick Actions ──────────────────────────── */}
      <div className="card-elevated rounded-3xl p-5">
        <h3 className="font-black mb-4" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { label: 'View Coverage Map',   icon: MapPin,       to: '/coverage',      color: '#7C3AED' },
            { label: 'Pay Utility Bills',   icon: Zap,          to: '/services',      color: '#10B981' },
            { label: 'Check Subscriptions', icon: CheckCircle2, to: '/subscriptions', color: '#0891B2' },
          ].map(({ label, icon: Icon, to, color }) => (
            <button key={label} onClick={() => navigate(to)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium"
              style={{ color: 'var(--text-sub)', border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.background = `${color}0d`}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}18` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <span className="flex-1 text-left">{label}</span>
              <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Smart Overview ─────────────────────────── */}
      {visibleAlerts.length > 0 && (
        <div className="card-elevated rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(244,120,32,0.1)' }}>
                <Bell size={14} color="#F47820" />
              </div>
              <h3 className="font-black" style={{ fontFamily: 'serif', color: 'var(--text-main)' }}>Overview</h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(244,120,32,0.1)', color: '#F47820' }}>
                {visibleAlerts.length}
              </span>
            </div>
            {dismissed.length > 0 && (
              <button onClick={() => setDismissed([])} className="text-xs font-semibold"
                style={{ color: 'var(--text-muted)' }}>
                Restore all
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {visibleAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onDismiss={dismiss} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}