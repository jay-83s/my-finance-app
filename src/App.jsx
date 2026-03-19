import { useFinance } from "./hooks/useFinance"
import BottomNav from "./components/BottomNav"
import Dashboard from "./screens/Dashboard"
import History from "./screens/History"
import Analytics from "./screens/Analytics"
import Transfer from "./screens/Transfer"

export default function App() {
  const finance = useFinance()

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div style={{
        maxWidth: 430,
        margin: "0 auto",
        minHeight: "100vh",
        background: "#F5F8FA",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
      }}>
        {finance.screen === "dashboard" && <Dashboard finance={finance} />}
        {finance.screen === "history" && <History finance={finance} />}
        {finance.screen === "analytics" && <Analytics finance={finance} />}
        {finance.screen === "transfer" && <Transfer finance={finance} />}

        <BottomNav screen={finance.screen} setScreen={finance.setScreen} />
      </div>
    </>
  )
}