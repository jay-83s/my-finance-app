import { LayoutGrid, ArrowUpDown, PieChart, User, DollarSign, LogOut } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const tabs = [
  { id: 'dashboard', icon: LayoutGrid,  label: 'Home'      },
  { id: 'history',   icon: ArrowUpDown, label: 'History'   },
  { id: 'analytics', icon: PieChart,    label: 'Analytics' },
  { id: 'profile',   icon: User,        label: 'Profile'   },
]

export default function Sidebar({ screen, setScreen, onLogout, user }) {
  const { isDark } = useTheme()

  // Glass values shift slightly between dark/light
  const panelBg     = isDark ? 'rgba(5,14,28,0.75)'  : 'rgba(10,25,50,0.65)'
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.15)'
  const mutedColor  = isDark ? 'rgba(180,210,240,0.4)' : 'rgba(200,225,255,0.55)'
  const textColor   = isDark ? '#E8F4FF' : '#F0F7FF'

  return (
    <>
      <style>{`
        .sb-btn:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #fff !important;
        }
        .sb-logout:hover {
          background: rgba(248,113,113,0.12) !important;
          color: #FCA5A5 !important;
        }
      `}</style>

      <div style={{
        width: 240,
        minHeight: '100vh',
        flexShrink: 0,
        background: panelBg,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderRight: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'background 0.4s ease',
      }}>

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 40, paddingLeft: 12,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(11,191,191,0.4)',
          }}>
            <DollarSign size={22} color='#fff' strokeWidth={2.5} />
          </div>
          <div>
            <p style={{
              margin: 0, fontSize: 16, fontWeight: 800,
              color: textColor, fontFamily: "'Sora', sans-serif",
              letterSpacing: '-0.3px',
            }}>FinanceApp</p>
            <p style={{ margin: 0, fontSize: 11, color: mutedColor }}>
              Personal Finance
            </p>
          </div>
        </div>

        {/* Section label */}
        <p style={{
          margin: '0 0 8px 12px',
          fontSize: 10, fontWeight: 700,
          color: isDark ? 'rgba(180,210,240,0.28)' : 'rgba(200,225,255,0.38)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}>
          Menu
        </p>

        {/* Nav items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {tabs.map(tab => {
            const Icon   = tab.icon
            const active = screen === tab.id
            return (
              <button
                key={tab.id}
                className="sb-btn"
                onClick={() => setScreen(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 14, border: 'none',
                  background: active
                    ? 'linear-gradient(135deg, rgba(11,191,191,0.28) 0%, rgba(8,148,148,0.18) 100%)'
                    : 'transparent',
                  color: active ? '#0BBFBF' : mutedColor,
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: active ? 700 : 500, fontSize: 14,
                  boxShadow: active ? 'inset 0 0 0 1px rgba(11,191,191,0.28)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {tab.label}
                {active && (
                  <div style={{
                    marginLeft: 'auto',
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#0BBFBF',
                    boxShadow: '0 0 8px rgba(11,191,191,0.9)',
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: borderColor, margin: '20px 0' }} />

        {/* User chip */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', marginBottom: 8,
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${borderColor}`,
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0BBFBF 0%, #089494 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: 13,
              fontFamily: "'Sora', sans-serif", flexShrink: 0,
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{
                margin: 0, fontSize: 13, fontWeight: 700, color: textColor,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user?.name}</p>
              <p style={{
                margin: 0, fontSize: 10, color: mutedColor,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{user?.email}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          className="sb-logout"
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 16px', borderRadius: 12, border: 'none',
            background: 'transparent', color: mutedColor,
            cursor: 'pointer', width: '100%', textAlign: 'left',
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600, fontSize: 13,
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={17} strokeWidth={2} />
          Log out
        </button>

      </div>
    </>
  )
}