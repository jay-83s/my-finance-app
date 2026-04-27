import { useState, useEffect } from "react";
import { useFinance } from "./hooks/useFinance";
import { useTheme } from "./context/ThemeContext";
import { useWindowSize } from "./hooks/useWindowSize";
import { LIGHT, DARK } from "./utils/theme";
import BottomNav from "./components/BottomNav";
import Sidebar from "./components/Sidebar";
import Dashboard from "./screens/Dashboard";
import History from "./screens/History";
import Analytics from "./screens/Analytics";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Admin from "./screens/Admin";

export default function App() {
  const [user, setUser] = useState(null);
  const finance = useFinance(user?.savings_goal || 20);
  const { isDark } = useTheme();
  const { isDesktop } = useWindowSize();
  const COLORS = isDark ? DARK : LIGHT;

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    finance.setScreen("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  if (!user) return <Login onLogin={handleLogin} />;
  if (user.role === "admin") return <Admin onLogout={handleLogout} />;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Root — full page background image */}
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background image — fills entire app */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundImage: "url(/sean-pollock-PhYq704ffdA-unsplash.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />

        {/* Dark overlay — keeps everything readable */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: isDark
              ? "rgba(4, 10, 20, 0.82)"
              : "rgba(4, 10, 20, 0.68)",
            zIndex: 1,
          }}
        />

        {/* Teal brand glow — top right */}
        <div
          style={{
            position: "fixed",
            top: "-10%",
            right: "-5%",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(20,184,166,0.10) 0%, transparent 70%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Sidebar — desktop only */}
        {isDesktop && (
          <div style={{ position: "relative", zIndex: 10, flexShrink: 0 }}>
            <Sidebar
              screen={finance.screen}
              setScreen={finance.setScreen}
              onLogout={handleLogout}
              user={user}
            />
          </div>
        )}

        {/* Main content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: "100vh",
            position: "relative",
            zIndex: 5,
          }}
        >
          <div
            style={{
              maxWidth: isDesktop ? 900 : 430,
              margin: "0 auto",
              width: "100%",
            }}
          >
            {finance.screen === "dashboard" && (
              <Dashboard finance={finance} user={user} isDesktop={isDesktop} />
            )}
            {finance.screen === "history" && (
              <History finance={finance} isDesktop={isDesktop} />
            )}
            {finance.screen === "analytics" && (
              <Analytics finance={finance} isDesktop={isDesktop} />
            )}
            {finance.screen === "profile" && (
              <Profile
                user={user}
                onLogout={handleLogout}
                isDesktop={isDesktop}
              />
            )}

            {!isDesktop && (
              <BottomNav
                screen={finance.screen}
                setScreen={finance.setScreen}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
