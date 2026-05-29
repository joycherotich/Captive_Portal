import { createContext, useContext, useState } from 'react'
const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePlan, setActivePlan] = useState(null) // plan chosen before payment

  const login = (userData) => setUser(userData)
  const logout = () => { setUser(null); setActivePlan(null) }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3800)
  }

  return (
    <AppContext.Provider value={{ user, login, logout, toast, showToast, sidebarOpen, setSidebarOpen, activePlan, setActivePlan }}>
      {children}
    </AppContext.Provider>
  )
}