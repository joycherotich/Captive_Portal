/**
 * Toast
 * Floats in the bottom-right corner. Reads `toast` from AppContext.
 * toast shape: { message: string, type: 'success' | 'error' | 'info' }
 */
import { useApp } from '../context/AppContext'

const STYLES = {
  success: {
    border: 'rgba(244,120,32,0.28)',
    dot:    '#F47820',
    bg:     'rgba(244,120,32,0.07)',
  },
  error: {
    border: 'rgba(239,68,68,0.28)',
    dot:    '#ef4444',
    bg:     'rgba(239,68,68,0.07)',
  },
  info: {
    border: 'rgba(27,58,143,0.28)',
    dot:    '#2E54C4',
    bg:     'rgba(27,58,143,0.07)',
  },
}

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  const s = STYLES[toast.type] ?? STYLES.success

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 16px',
        borderRadius: 12,
        maxWidth: 320,
        background: s.bg,
        border: `1px solid ${s.border}`,
        boxShadow: '0 8px 28px rgba(27,58,143,0.12)',
        animation: 'toastIn 0.22s ease',
      }}
    >
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: s.dot, flexShrink: 0,
      }} />
      <p style={{
        margin: 0, fontSize: 13, fontWeight: 500,
        color: 'var(--text-main, #111)',
        lineHeight: 1.4,
      }}>
        {toast.message}
      </p>

      <style>{`@keyframes toastIn { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  )
}