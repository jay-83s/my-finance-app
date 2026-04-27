import { LayoutGrid, ArrowUpDown, PieChart, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const tabs = [
  { id: 'dashboard', icon: LayoutGrid,  label: 'Home'      },
  { id: 'history',   icon: ArrowUpDown, label: 'History'   },
  { id: 'analytics', icon: PieChart,    label: 'Analytics' },
  { id: 'profile',   icon: User,        label: 'Profile'   },
]

export default function BottomNav({ screen, setScreen }) {
  const { isDark } = useTheme()

  const panelBg     = isDark ? 'rgba(5,14,28,0.88)'    : 'rgba(10,25,50,0.80)'
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)'
  const mutedColor  = isDark ? 'rgba(180,210,240,0.38)' : 'rgba(200,225,255,0.5)'

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%',
      transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430,
      background: panelBg,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: `1px solid ${borderColor}`,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0 20px',
      zIndex: 100,
      boxShadow: '0 -4px 32px rgba(0,0,0,0.3)',
      transition: 'background 0.4s ease',
    }}>
      {tabs.map(tab => {
        const Icon   = tab.icon
        const active = screen === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: active ? '#0BBFBF' : mutedColor,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: active ? 700 : 500,
              transition: 'color 0.2s',
              position: 'relative',
            }}
          >
            {/* Active indicator dot above icon */}
            {active && (
              <div style={{
                position: 'absolute', top: -8,
                width: 4, height: 4, borderRadius: '50%',
                background: '#0BBFBF',
                boxShadow: '0 0 6px rgba(11,191,191,0.9)',
              }} />
            )}
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}