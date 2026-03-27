import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useTheme } from "../context/ThemeContext"
import { LIGHT, DARK, categoryColors } from "../utils/theme"
import { formatAmount } from "../utils/currency"
import CurrencySwitcher from "../components/CurrencySwitcher"

export default function Analytics({ finance, isDesktop }) {
  const { currency, setCurrency, categoryTotals, totalIncome, totalExpenses, totalSavings, transactions } = finance
  const { isDark } = useTheme()
  const COLORS = isDark ? DARK : LIGHT

  const savingsRate = totalIncome > 0
    ? Math.min(Math.round((totalSavings / totalIncome) * 100), 100)
    : 0

  const monthlyMap = transactions.reduce((acc, t) => {
    const date  = new Date(t.date)
    const month = date.toLocaleString('default', { month: 'short' })
    if (!acc[month]) acc[month] = { month, income: 0, expenses: 0, saved: 0 }
    if (t.type === 'income')  acc[month].income   += parseFloat(t.amount)
    if (t.type === 'expense') acc[month].expenses += parseFloat(t.amount)
    if (t.type === 'savings') acc[month].saved    += parseFloat(t.amount)
    return acc
  }, {})

  const chartData = Object.values(monthlyMap)
  const pieData   = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }))

  const fmtTooltip = (v) => {
    if (currency === "USD") return [`$${(v * 0.00775).toFixed(2)}`, ""]
    return [`KES ${Math.round(v).toLocaleString()}`, ""]
  }

  return (
    <div style={{ padding: isDesktop ? "32px 40px 40px" : "24px 20px 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
          Analytics
        </h2>
        <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
      </div>

      {/* Top section — savings rate + summary cards */}
      <div style={{
        display: isDesktop ? "grid" : "block",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "none",
        gap: 16, marginBottom: 16,
      }}>

        {/* Savings Rate Card */}
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.teal} 0%, #066060 100%)`,
          borderRadius: 20, padding: "20px 24px",
          marginBottom: isDesktop ? 0 : 16,
          boxShadow: `0 8px 30px ${COLORS.teal}44`,
        }}>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>
            Savings Rate
          </p>
          <h1 style={{ color: "#fff", fontSize: isDesktop ? 56 : 48, fontWeight: 900, margin: "0 0 8px", fontFamily: "'Sora', sans-serif" }}>
            {savingsRate}%
          </h1>
          <div style={{ height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${savingsRate}%`, background: "#fff", borderRadius: 4, transition: "width 0.5s" }} />
          </div>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "8px 0 0" }}>
            {savingsRate >= 20
              ? "Great job! You are saving well 🎉"
              : savingsRate > 0
              ? "Try to save at least 20% of your income"
              : "Add your income and savings to see your rate"}
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Income", amount: totalIncome,   Icon: TrendingUp,   color: COLORS.green, bg: isDark ? "#0D2B1A" : "#F0FDF4", iconBg: "#22C55E" },
            { label: "Saved",  amount: totalSavings,  Icon: PiggyBank,    color: "#6366F1",    bg: isDark ? "#1A1A3A" : "#EEF2FF", iconBg: "#6366F1" },
            { label: "Spent",  amount: totalExpenses, Icon: TrendingDown, color: COLORS.red,   bg: isDark ? "#2B0D0D" : "#FFF5F5", iconBg: "#EF4444" },
          ].map(c => (
            <div key={c.label} style={{
              background: c.bg, borderRadius: 16, padding: "16px 14px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: c.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <c.Icon size={20} color="#fff" strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: COLORS.muted, fontWeight: 500 }}>
                  {c.label}
                </p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: c.color }}>
                  {formatAmount(c.amount, currency)}
                </p>
                {currency === "USD" && (
                  <p style={{ margin: "2px 0 0", fontSize: 9, color: COLORS.muted }}>
                    KES {Math.round(c.amount).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Charts section — desktop shows side by side */}
      <div style={{
        display: isDesktop ? "grid" : "block",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "none",
        gap: 16, marginBottom: 16,
      }}>

        {/* Monthly Bar Chart */}
        {chartData.length > 0 ? (
          <div style={{
            background: COLORS.card, borderRadius: 20, padding: "20px 16px",
            marginBottom: isDesktop ? 0 : 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            border: `1px solid ${COLORS.border}`,
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>
              Monthly Overview ({currency})
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: COLORS.text, border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }}
                  formatter={fmtTooltip}
                />
                <Bar dataKey="income"   fill={`${COLORS.green}60`} radius={[6, 6, 0, 0]} />
                <Bar dataKey="saved"    fill="#6366F1"              radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" fill={`${COLORS.red}60`}   radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {[
                { color: `${COLORS.green}60`, label: "Income"   },
                { color: "#6366F1",           label: "Savings"  },
                { color: `${COLORS.red}60`,   label: "Expenses" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: 11, color: COLORS.muted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: COLORS.card, borderRadius: 20, padding: 32,
            marginBottom: isDesktop ? 0 : 16, textAlign: "center",
            border: `1px solid ${COLORS.border}`,
          }}>
            <p style={{ color: COLORS.muted, fontSize: 14 }}>Add transactions to see your monthly chart</p>
          </div>
        )}

        {/* Savings vs Expenses Line Chart */}
        {chartData.length > 1 ? (
          <div style={{
            background: COLORS.card, borderRadius: 20, padding: "20px 16px",
            marginBottom: isDesktop ? 0 : 16,
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
            border: `1px solid ${COLORS.border}`,
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>
              Savings vs Expenses Trend
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ background: COLORS.text, border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }}
                  formatter={fmtTooltip}
                />
                <Line type="monotone" dataKey="saved"    stroke="#6366F1"   strokeWidth={3} dot={{ fill: "#6366F1", r: 5 }} />
                <Line type="monotone" dataKey="expenses" stroke={COLORS.red} strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {[
                { color: "#6366F1",  label: "Savings"  },
                { color: COLORS.red, label: "Expenses" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: 11, color: COLORS.muted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{
            background: COLORS.card, borderRadius: 20, padding: 32,
            textAlign: "center", border: `1px solid ${COLORS.border}`,
          }}>
            <p style={{ color: COLORS.muted, fontSize: 14 }}>Add more transactions to see the trend</p>
          </div>
        )}

      </div>

      {/* Category Breakdown */}
      <div style={{
        background: COLORS.card, borderRadius: 20, padding: "20px 16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        border: `1px solid ${COLORS.border}`,
      }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>
          Spending by Category
        </h3>
        {pieData.length === 0 ? (
          <p style={{ color: COLORS.muted, fontSize: 13, textAlign: "center", padding: "16px 0" }}>
            No expense data yet
          </p>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width={isDesktop ? 160 : 120} height={isDesktop ? 160 : 120}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={isDesktop ? 50 : 35} outerRadius={isDesktop ? 70 : 55} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={categoryColors[entry.name] || COLORS.teal} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.slice(0, isDesktop ? 8 : 5).map(d => (
                <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: categoryColors[d.name] || COLORS.teal, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: COLORS.muted }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.text }}>
                    {formatAmount(d.value, currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  )
}