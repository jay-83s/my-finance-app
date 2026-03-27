import { LayoutGrid, ArrowUpDown, PieChart, User } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { LIGHT, DARK } from '../utils/theme'

const tabs = [
  { id: 'dashboard', icon: LayoutGrid,  label: 'Home'      },
  { id: 'history',   icon: ArrowUpDown, label: 'History'   },
  { id: 'analytics', icon: PieChart,    label: 'Analytics' },
  { id: 'profile',   icon: User,        label: 'Profile'   },
]

export default function BottomNav({ screen, setScreen }) {
  const { isDark } = useTheme()
  const COLORS = isDark ? DARK : LIGHT

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 430, background: COLORS.card,
      borderTop: `1px solid ${COLORS.border}`, display: 'flex',
      justifyContent: 'space-around', padding: '12px 0 20px', zIndex: 100,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
      transition: 'background 0.3s',
    }}>
      {tabs.map(tab => {
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              color: screen === tab.id ? COLORS.teal : COLORS.muted,
              fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
              transition: 'color 0.2s',
            }}
          >
            <Icon size={22} strokeWidth={screen === tab.id ? 2.5 : 1.8} />
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}