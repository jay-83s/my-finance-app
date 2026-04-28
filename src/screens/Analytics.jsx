import { TrendingUp, TrendingDown, PiggyBank } from "lucide-react"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { useTheme } from "../context/ThemeContext"
import { LIGHT, DARK, categoryColors } from "../utils/theme"
import { formatAmount } from "../utils/currency"
import CurrencySwitcher from "../components/CurrencySwitcher"

// Shared glass helper
const glass = (isDark, accent = false) => ({
  background: accent
    ? 'linear-gradient(135deg, rgba(11,191,191,0.2) 0%, rgba(8,148,148,0.12) 100%)'
    : isDark ? 'rgba(5,15,30,0.55)' : 'rgba(8,20,45,0.45)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: `1px solid ${accent ? 'rgba(11,191,191,0.3)' : 'rgba(255,255,255,0.09)'}`,
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
})

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

  const tooltipStyle = {
    background: 'rgba(4,12,24,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#fff', fontSize: 12,
  }

  const axisColor = 'rgba(180,220,240,0.38)'
  const textColor = '#F0F7FF'
  const mutedColor = 'rgba(180,220,240,0.5)'

  return (
    <div style={{ padding: isDesktop ? "32px 40px 60px" : "24px 20px 100px" }}>

      {/* ── HEADER BANNER — aerial city night ── */}
      <div style={{
        position: 'relative', borderRadius: 24, overflow: 'hidden',
        marginBottom: 20, minHeight: 140,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '24px',
      }}>
        {/* Unsplash stock market chart on dark screen — matches analytics function */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1600&q=80)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          zIndex: 0,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: isDark
            ? 'linear-gradient(135deg, rgba(4,12,24,0.82) 0%, rgba(4,12,24,0.6) 100%)'
            : 'linear-gradient(135deg, rgba(4,12,24,0.72) 0%, rgba(4,12,24,0.45) 100%)',
          zIndex: 1,
        }} />
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: '0 0 4px', fontSize: 12, color: 'rgba(180,220,240,0.55)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Your finances
            </p>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#F0F7FF', fontFamily: "'Sora', sans-serif" }}>
              Analytics
            </h2>
          </div>
          <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
        </div>
      </div>

      {/* ── TOP SECTION — savings rate + summary ── */}
      <div style={{
        display: isDesktop ? "grid" : "block",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "none",
        gap: 16, marginBottom: 16,
      }}>

        {/* Savings Rate Card */}
        <div style={{
          ...glass(isDark, true),
          borderRadius: 20, padding: "22px 24px",
          marginBottom: isDesktop ? 0 : 16,
        }}>
          <p style={{ color: mutedColor, fontSize: 11, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1.2 }}>
            Savings Rate
          </p>
          <h1 style={{
            color: "#0BBFBF", fontSize: isDesktop ? 56 : 48,
            fontWeight: 900, margin: "0 0 10px",
            fontFamily: "'Sora', sans-serif",
          }}>
            {savingsRate}%
          </h1>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
            <div style={{
              height: '100%', width: `${savingsRate}%`,
              background: 'linear-gradient(90deg, #0BBFBF, #34D399)',
              borderRadius: 4, transition: 'width 0.6s ease',
              boxShadow: '0 0 10px rgba(11,191,191,0.5)',
            }} />
          </div>
          <p style={{ color: mutedColor, fontSize: 12, margin: "10px 0 0" }}>
            {savingsRate >= 20
              ? "Great job! You are saving well 🎉"
              : savingsRate > 0
              ? "Try to save at least 20% of your income"
              : "Add income and savings to see your rate"}
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Income", amount: totalIncome,   Icon: TrendingUp,   color: '#22C55E', iconColor: '#22C55E' },
            { label: "Saved",  amount: totalSavings,  Icon: PiggyBank,    color: '#818CF8', iconColor: '#6366F1' },
            { label: "Spent",  amount: totalExpenses, Icon: TrendingDown, color: '#F87171', iconColor: '#EF4444' },
          ].map(c => (
            <div key={c.label} style={{
              ...glass(isDark),
              borderRadius: 16, padding: "16px 12px",
              display: "flex", flexDirection: "column", gap: 10,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${c.iconColor}22`,
                border: `1px solid ${c.iconColor}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <c.Icon size={18} color={c.iconColor} strokeWidth={2.5} />
              </div>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 11, color: mutedColor }}>{c.label}</p>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: c.color }}>
                  {formatAmount(c.amount, currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div style={{
        display: isDesktop ? "grid" : "block",
        gridTemplateColumns: isDesktop ? "1fr 1fr" : "none",
        gap: 16, marginBottom: 16,
      }}>

        {/* Monthly Bar Chart */}
        {chartData.length > 0 ? (
          <div style={{
            ...glass(isDark),
            borderRadius: 20, padding: "20px 16px",
            marginBottom: isDesktop ? 0 : 16,
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: textColor }}>
              Monthly Overview
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barCategoryGap="30%">
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={fmtTooltip} />
                <Bar dataKey="income"   fill="rgba(34,197,94,0.55)"  radius={[6,6,0,0]} />
                <Bar dataKey="saved"    fill="rgba(99,102,241,0.8)"  radius={[6,6,0,0]} />
                <Bar dataKey="expenses" fill="rgba(239,68,68,0.5)"   radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              {[
                { color: 'rgba(34,197,94,0.7)',  label: 'Income'   },
                { color: 'rgba(99,102,241,0.9)', label: 'Savings'  },
                { color: 'rgba(239,68,68,0.65)', label: 'Expenses' },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: 11, color: mutedColor }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ ...glass(isDark), borderRadius: 20, padding: 32, marginBottom: isDesktop ? 0 : 16, textAlign: "center" }}>
            <p style={{ color: mutedColor, fontSize: 14 }}>Add transactions to see your monthly chart</p>
          </div>
        )}

        {/* Line Chart */}
        {chartData.length > 1 ? (
          <div style={{ ...glass(isDark), borderRadius: 20, padding: "20px 16px", marginBottom: isDesktop ? 0 : 16 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: textColor }}>
              Savings vs Expenses Trend
            </h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: axisColor, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip contentStyle={tooltipStyle} formatter={fmtTooltip} />
                <Line type="monotone" dataKey="saved"    stroke="#6366F1" strokeWidth={3} dot={{ fill: "#6366F1", r: 5 }} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
              {[
                { color: '#6366F1', label: 'Savings'  },
                { color: '#EF4444', label: 'Expenses' },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                  <span style={{ fontSize: 11, color: mutedColor }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ ...glass(isDark), borderRadius: 20, padding: 32, textAlign: "center" }}>
            <p style={{ color: mutedColor, fontSize: 14 }}>Add more transactions to see the trend</p>
          </div>
        )}
      </div>

      {/* ── CATEGORY BREAKDOWN ── */}
      <div style={{ ...glass(isDark), borderRadius: 20, padding: "20px 16px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: textColor }}>
          Spending by Category
        </h3>
        {pieData.length === 0 ? (
          <p style={{ color: mutedColor, fontSize: 13, textAlign: "center", padding: "16px 0" }}>
            No expense data yet
          </p>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ResponsiveContainer width={isDesktop ? 160 : 120} height={isDesktop ? 160 : 120}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%"
                  innerRadius={isDesktop ? 50 : 35}
                  outerRadius={isDesktop ? 70 : 55}
                  dataKey="value" paddingAngle={3}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={categoryColors[entry.name] || '#0BBFBF'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.slice(0, isDesktop ? 8 : 5).map(d => (
                <div key={d.name} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: 2,
                      background: categoryColors[d.name] || '#0BBFBF', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 11, color: mutedColor }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: textColor }}>
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