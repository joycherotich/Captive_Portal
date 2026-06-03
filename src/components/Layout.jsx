import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'
import { useApp } from '../context/AppContext'

function Toast() {
  const { toast } = useApp()
  if (!toast) return null
  const cfg = {
    success: { border:'rgba(15,118,110,0.3)',  dot:'var(--teal)',  bg:'rgba(15,118,110,0.07)'  },
    error:   { border:'rgba(239,68,68,0.3)',    dot:'#EF4444',     bg:'rgba(239,68,68,0.07)'   },
    info:    { border:'rgba(59,130,246,0.3)',   dot:'#3B82F6',     bg:'rgba(59,130,246,0.07)'  },
  }
  const s = cfg[toast.type] || cfg.success
  return (
    <div className="toast bg-white rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ border:`1px solid ${s.border}`, background:s.bg, boxShadow:'0 8px 32px rgba(15,118,110,0.12)', maxWidth:320 }}>
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:s.dot }} />
      <p className="text-sm font-medium" style={{ color:'var(--text-main)' }}>{toast.message}</p>
    </div>
  )
}

export default function Layout() {
  const { user, sidebarOpen, setSidebarOpen } = useApp()
  const navigate = useNavigate()
  useEffect(() => { if (!user) navigate('/') }, [user])

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 flex-shrink-0 h-screen sticky top-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <>
          <div className="sidebar-overlay md:hidden" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full z-50 md:hidden" style={{ width: 272 }}>
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto page-container">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  )
}