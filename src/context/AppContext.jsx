import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const DEMO_MODE = 'onnet'

const ONNET_TENANT = {
  id:           'directcore',
  name:         'DirectCore',
  logo:         null,
  primaryColor: '#0F766E',
}

const ONNET_USER = {
  name:      'Joy Letim',
  email:     'letimjoy7@gmail.com',
  phone:     '+254742142959',
  plan:      'Weekly 20Mbps',
  dataUsed:  4.2,
  dataTotal: 10,
  expiry:    '2026-07-15',
  provider:  'DirectCore ISP',
  mode:      'onnet',
}

const ONNET_PROVIDER = {
  id:       1,
  name:     'DirectCore ISP',
  location: 'Westlands, Nairobi',
}

const OFFNET_USER = {
  name:      'Jane Wanjiku',
  email:     'jane.wanjiku@gmail.com',
  phone:     '+254700123456',
  plan:      null,
  dataUsed:  0,
  dataTotal: 0,
  expiry:    null,
  provider:  null,
  mode:      'offnet',
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('olUser')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [toast,          setToast]          = useState(null)
  const [sidebarOpen,    setSidebarOpen]    = useState(false)
  const [activePlan,     setActivePlan]     = useState(null)
  const [activeProvider, setActiveProvider] = useState(
    DEMO_MODE === 'onnet' ? ONNET_PROVIDER : null
  )

  const isOnNet      = DEMO_MODE === 'onnet'
  const tenantConfig = isOnNet ? ONNET_TENANT : null
  const demoUser     = isOnNet ? ONNET_USER : OFFNET_USER

  const login = (userData) => {
    const merged = { ...demoUser, ...userData }
    sessionStorage.setItem('olUser', JSON.stringify(merged))
    setUser(merged)
  }

  const logout = () => {
    sessionStorage.removeItem('olUser')
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
      activePlan, setActivePlan,
      activeProvider, setActiveProvider,
      isOnNet, tenantConfig,
      demoUser,
    }}>
      {children}
    </AppContext.Provider>
  )
}