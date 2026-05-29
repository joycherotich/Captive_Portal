/**
 * UserCard
 * Shows the logged-in user's avatar, name, active status,
 * and a data-usage progress bar.
 */
export default function UserCard({ user }) {
    if (!user) return null
  
    const used  = user.dataUsed  ?? 0
    const total = user.dataTotal ?? 10
    const pct   = Math.min((used / total) * 100, 100).toFixed(0)
    const initial = user.name.charAt(0).toUpperCase()
  
    return (
      <div style={{
        margin: '12px 12px 0',
        padding: '13px',
        borderRadius: 14,
        background: 'rgba(244,120,32,0.10)',
        border: '1px solid rgba(244,120,32,0.20)',
      }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#F47820',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initial}
          </div>
  
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2, margin: 0 }}>
              {user.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#4ade80',
              }} />
              <span style={{ fontSize: 11, color: 'rgba(253,186,116,0.80)' }}>Active</span>
            </div>
          </div>
        </div>
  
        {/* Data usage bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, marginBottom: 5,
        }}>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>{user.plan}</span>
          <span style={{ color: 'rgba(253,186,116,0.85)', fontWeight: 600 }}>
            {used} / {total} GB
          </span>
        </div>
  
        <div style={{
          height: 4, borderRadius: 2,
          background: 'rgba(255,255,255,0.10)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 2,
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #1B3A8F, #F47820)',
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>
    )
  }