import { LayoutGrid, ArrowUpDown, PieChart, User, DollarSign } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { LIGHT, DARK } from '../utils/theme'

const tabs = [
  { id: 'dashboard', icon: LayoutGrid,  label: 'Home'      },
  { id: 'history',   icon: ArrowUpDown, label: 'History'   },
  { id: 'analytics', icon: PieChart,    label: 'Analytics' },
  { id: 'profile',   icon: User,        label: 'Profile'   },
]

export default function Sidebar({ screen, setScreen }) {
  const { isDark } = useTheme()
  const COLORS = isDark ? DARK : LIGHT

  return (
    <div style={{
      width: 240, minHeight: '100vh', flexShrink: 0,
      background: COLORS.card,
      borderRight: `1px solid ${COLORS.border}`,
      display: 'flex', flexDirection: 'column',
      padding: '32px 16px',
      position: 'sticky', top: 0, height: '100vh',
      transition: 'background 0.3s',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40, paddingLeft: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 14,
          background: COLORS.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DollarSign size={22} color='#fff' strokeWidth={2.5} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
            FinanceApp
          </p>
          <p style={{ margin: 0, fontSize: 11, color: COLORS.muted }}>
            Personal Finance
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = screen === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setScreen(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px', borderRadius: 14, border: 'none',
                background: active ? COLORS.tealLight : 'transparent',
                color: active ? COLORS.teal : COLORS.muted,
                cursor: 'pointer', textAlign: 'left',
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: active ? 700 : 500, fontSize: 14,
                transition: 'all 0.2s',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              {tab.label}
              {active && (
                <div style={{
                  marginLeft: 'auto', width: 6, height: 6,
                  borderRadius: '50%', background: COLORS.teal,
                }} />
              )}
            </button>
          )
        })}
      </div>

    </div>
  )
}
