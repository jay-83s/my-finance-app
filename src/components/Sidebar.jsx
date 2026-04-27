import { LayoutGrid, ArrowUpDown, PieChart, User, DollarSign, LogOut } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const tabs = [
  { id: 'dashboard', icon: LayoutGrid,  label: 'Home'      },
  { id: 'history',   icon: ArrowUpDown, label: 'History'   },
  { id: 'analytics', icon: PieChart,    label: 'Analytics' },
  { id: 'profile',   icon: User,        label: 'Profile'   },
]

export default function Sidebar({ screen, setScreen, onLogout, user }) {
  const { isDark, toggleDark } = useTheme()

  return (
    <>
      <style>{`
        .sidebar-nav-btn {
          transition: all 0.2s ease !important;
        }
        .sidebar-nav-btn:hover {
          background: rgba(255,255,255,0.07) !important;
          color: #fff !important;
        }
        .sidebar-logout:hover {
          background: rgba(248,113,113,0.12) !important;
          color: #F87171 !important;
        }
      `}</style>

      <div style={{
        width: 240,
        minHeight: '100vh',
        flexShrink: 0,
        background: 'rgba(6, 14, 28, 0.72)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 16px',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>

        {/* Logo */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 40, paddingLeft: 12,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14,
            background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(20,184,166,0.4)',
          }}>
            <DollarSign size={22} color='#fff' strokeWidth={2.5} />
          </div>
          <div>
            <p style={{
              margin: 0, fontSize: 16, fontWeight: 800,
              color: '#F0F7FF',
              fontFamily: "'Sora', sans-serif",
              letterSpacing: '-0.3px',
            }}>
              FinanceApp
            </p>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(180,210,240,0.45)' }}>
              Personal Finance
            </p>
          </div>
        </div>

        {/* Section label */}
        <p style={{
          margin: '0 0 10px 12px',
          fontSize: 10, fontWeight: 700,
          color: 'rgba(180,210,240,0.3)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
        }}>
          Navigation
        </p>

        {/* Nav Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {tabs.map(tab => {
            const Icon = tab.icon
            const active = screen === tab.id
            return (
              <button
                key={tab.id}
                className="sidebar-nav-btn"
                onClick={() => setScreen(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 14, border: 'none',
                  background: active
                    ? 'linear-gradient(135deg, rgba(20,184,166,0.25) 0%, rgba(16,185,129,0.15) 100%)'
                    : 'transparent',
                  color: active ? '#2DD4BF' : 'rgba(180,210,240,0.5)',
                  cursor: 'pointer', textAlign: 'left',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  boxShadow: active ? 'inset 0 0 0 1px rgba(20,184,166,0.3)' : 'none',
                  position: 'relative',
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                {tab.label}
                {active && (
                  <div style={{
                    marginLeft: 'auto',
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: '#14B8A6',
                    boxShadow: '0 0 8px rgba(20,184,166,0.8)',
                  }} />
                )}
              </button>
            )
          })}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.06)',
          margin: '20px 0',
        }} />

        {/* User info + logout */}
        <div style={{ paddingLeft: 4 }}>
          {user && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', marginBottom: 8,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #14B8A6 0%, #10B981 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 13,
                fontFamily: "'Sora', sans-serif",
                flexShrink: 0,
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{
                  margin: 0, fontSize: 13, fontWeight: 700,
                  color: '#E0F0FF',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.name}
                </p>
                <p style={{
                  margin: 0, fontSize: 10,
                  color: 'rgba(180,210,240,0.4)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.email}
                </p>
              </div>
            </div>
          )}

          <button
            className="sidebar-logout"
            onClick={onLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px', borderRadius: 12, border: 'none',
              background: 'transparent',
              color: 'rgba(180,210,240,0.4)',
              cursor: 'pointer', width: '100%', textAlign: 'left',
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 13,
            }}
          >
            <LogOut size={17} strokeWidth={2} />
            Log out
          </button>
        </div>

      </div>
    </>
  )
}