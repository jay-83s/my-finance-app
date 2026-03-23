import { COLORS } from "../utils/theme";

const tabs = [
  { id: 'dashboard', icon: '⊞', label: 'Home'      },
  { id: 'history',   icon: '↕', label: 'History'   },
  { id: 'analytics', icon: '◎', label: 'Analytics' },
  { id: 'profile',   icon: '👤', label: 'Profile'  },
]
export default function BottomNav({ screen, setScreen }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430, background: COLORS.card,
      borderTop: "1px solid #E8EEF4", display: "flex",
      justifyContent: "space-around", padding: "12px 0 20px", zIndex: 100,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setScreen(tab.id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            color: screen === tab.id ? COLORS.teal : COLORS.muted,
            fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500,
            transition: "color 0.2s",
          }}
        >
          <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
