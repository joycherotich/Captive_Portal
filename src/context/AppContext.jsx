import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function useApp() {
  return useContext(AppContext)
}

/* ── helpers ───────────────────────────────────────────── */
function readSession(key, fallback = null) {
  try {
    const raw = sessionStorage.getItem(key)
    if (!raw) return fallback
    try { return JSON.parse(raw) } catch { return raw }
  } catch { return fallback }
}

function buildTenantConfig() {
  const tenant = readSession('onelynq_tenant') // { companyName, tenantId, logoUrl }
  const name   = tenant?.companyName || readSession('onelynq_companyName') || null
  const logo   = tenant?.logoUrl     || readSession('onelynq_logoUrl')     || null
  const id     = tenant?.tenantId    || readSession('onelynq_tenantId')    || null
  return name ? { id, name, logo } : null
}

function buildUser() {
  const saved = readSession('olUser')
  if (saved) return saved

  const raw    = readSession('onelynq_user')
  const tenant = buildTenantConfig()
  if (!raw) return null

  return {
    name:        raw.fullName    || '',
    email:       raw.email       || '',
    phone:       raw.phone       || '',
    partyId:     raw.partyId     || '',
    partyRoleId: raw.partyRoleId || '',
    userId:      raw.userId      || '',
    plan:        null,
    dataUsed:    0,
    dataTotal:   0,
    expiry:      null,
    provider:    tenant?.name    || null,
    mode:        'onnet',
    companyName: tenant?.name    || '',
    tenantId:    tenant?.id      || '',
  }
}

function detectMode() {
  const saved  = readSession('olUser')
  if (saved?.mode) return saved.mode
  const tenant = readSession('onelynq_tenant')
  return tenant ? 'onnet' : 'offnet'
}

/* ── Provider ──────────────────────────────────────────── */
export function AppProvider({ children }) {
  const [user,           setUser]           = useState(() => buildUser())
  const [toast,          setToast]          = useState(null)
  const [sidebarOpen,    setSidebarOpen]    = useState(false)
  const [activePlan,     setActivePlan]     = useState(null)
  const [activeProvider, setActiveProvider] = useState(null)

  const mode         = detectMode()
  const isOnNet      = mode === 'onnet'
  const tenantConfig = isOnNet ? buildTenantConfig() : null

  const login = (userData) => {
    const tenant  = buildTenantConfig()
    const rawUser = readSession('onelynq_user') ?? {}

    const merged = {
      name:        rawUser.fullName    || '',
      email:       rawUser.email       || '',
      phone:       userData.phone      || rawUser.phone || '',
      partyId:     rawUser.partyId     || '',
      partyRoleId: rawUser.partyRoleId || '',
      userId:      rawUser.userId      || '',
      plan:        null,
      dataUsed:    0,
      dataTotal:   0,
      expiry:      null,
      provider:    tenant?.name        || null,
      companyName: tenant?.name        || '',
      tenantId:    tenant?.id          || '',
      mode:        isOnNet ? 'onnet' : 'offnet',
      ...userData,
    }

    sessionStorage.setItem('olUser', JSON.stringify(merged))
    setUser(merged)
  }

  const logout = () => {
    Object.keys(sessionStorage)
      .filter(k => k.startsWith('onelynq_') || k === 'olUser')
      .forEach(k => sessionStorage.removeItem(k))
    setUser(null)
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3800)
  }

  return (
    <AppContext.Provider value={{
      user, login, logout,
      toast, showToast,
      sidebarOpen, setSidebarOpen,
      activePlan,     setActivePlan,
      activeProvider, setActiveProvider,
      isOnNet,
      tenantConfig,
    }}>
      {children}
    </AppContext.Provider>
  )
}