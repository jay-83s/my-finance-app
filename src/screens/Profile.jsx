import { COLORS } from '../utils/theme'

export default function Profile({ user, onLogout }) {
  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <div style={{ padding: '24px 20px 100px' }}>
      <h2 style={{
        margin: '0 0 24px', fontSize: 22, fontWeight: 800,
        color: COLORS.text, fontFamily: "'Sora', sans-serif",
      }}>
        Profile
      </h2>

      {/* Avatar */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: COLORS.teal, margin: '0 auto 12px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: '#fff',
          fontSize: 28, fontWeight: 800,
          fontFamily: "'Sora', sans-serif",
        }}>
          {initials}
        </div>
        <h3 style={{
          margin: 0, fontSize: 20, fontWeight: 700,
          color: COLORS.text, fontFamily: "'Sora', sans-serif",
        }}>
          {user?.name}
        </h3>
        <p style={{ color: COLORS.muted, fontSize: 13, margin: '4px 0 0' }}>
          {user?.email}
        </p>
        <span style={{
          display: 'inline-block', marginTop: 8,
          background: user?.role === 'admin' ? '#FEF3C7' : COLORS.tealLight,
          color: user?.role === 'admin' ? '#D97706' : COLORS.teal,
          padding: '4px 12px', borderRadius: 20,
          fontSize: 12, fontWeight: 700,
        }}>
          {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
        </span>
      </div>

      {/* Info Cards */}
      <div style={{
        background: COLORS.card, borderRadius: 20,
        overflow: 'hidden', marginBottom: 16,
        boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
      }}>
        {[
          { label: 'Full Name',  value: user?.name,  icon: '👤' },
          { label: 'Email',      value: user?.email, icon: '📧' },
          { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Standard User', icon: '🔑' },
        ].map((item, i, arr) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '16px', 
            borderBottom: i < arr.length - 1 ? '1px solid #F0F4F8' : 'none',
          }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>{item.label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: COLORS.text }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          width: '100%', padding: '16px', borderRadius: 14,
          border: 'none', background: '#FFF5F5',
          color: COLORS.red, fontSize: 15, fontWeight: 700,
          cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
          border: '1.5px solid #FCA5A5',
        }}
      >
        🚪 Logout
      </button>
    </div>
  )
}