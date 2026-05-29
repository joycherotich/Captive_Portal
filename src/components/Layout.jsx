
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Toast from './Toast'
import { useApp } from '../context/AppContext'

export default function Layout() {
  const { user, sidebarOpen, setSidebarOpen } = useApp()
  const navigate = useNavigate()

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!user) navigate('/')
  }, [user, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'var(--bg-page, #f8f9fc)',
    }}>

      {/* ── Desktop sidebar (sticky left column) ── */}
      <div
        className="hidden md:flex"
        style={{
          width: 248,
          flexShrink: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
        }}
      >
        <Sidebar />
      </div>

      {/* ── Mobile sidebar (overlay) ── */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(14,21,37,0.55)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              animation: 'fadeIn 0.2s ease',
            }}
          />
          {/* Drawer */}
          <div
            className="md:hidden"
            style={{
              position: 'fixed', left: 0, top: 0,
              height: '100%', zIndex: 50,
              width: 280,
              animation: 'slideInLeft 0.22s ease',
            }}
          >
            <Sidebar mobile />
          </div>
        </>
      )}

      {/* ── Main column ── */}
      <div style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        <Topbar />

        <main style={{
          flex: 1,
          padding: '24px',
          overflow: 'auto',
        }}>
          <Outlet />
        </main>
      </div>

      {/* ── Toast (global) ── */}
      <Toast />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeIn     { from { opacity: 0; }             to { opacity: 1; }             }
        @keyframes slideInLeft{ from { transform: translateX(-100%); } to { transform: translateX(0); } }
      `}</style>
    </div>
  )
}