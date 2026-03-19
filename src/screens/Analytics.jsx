import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { COLORS, categoryColors } from "../utils/theme";
import { formatAmount } from "../utils/currency";
import { monthlyData } from "../data/seedData";
import CurrencySwitcher from "../components/CurrencySwitcher";

export default function Analytics({ finance }) {
  const { currency, setCurrency, categoryTotals } = finance;

  const totalSaved = monthlyData.reduce((a, m) => a + m.saved, 0);
  const totalSpent = monthlyData.reduce((a, m) => a + m.expenses, 0);
  const savingsRate = Math.round((totalSaved / (totalSaved + totalSpent)) * 100);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const fmtTooltip = (v) => {
    if (currency === "USD") return [`$${(v * 0.00775).toFixed(2)}`, ""];
    return [`KES ${Math.round(v).toLocaleString()}`, ""];
  };

  return (
    <div style={{ padding: "24px 20px 100px" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: COLORS.text, fontFamily: "'Sora', sans-serif" }}>
          Analytics
        </h2>
        <CurrencySwitcher currency={currency} setCurrency={setCurrency} />
      </div>

      {/* Savings Rate Card */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.teal} 0%, #066060 100%)`,
        borderRadius: 20, padding: "20px 24px", marginBottom: 16,
        boxShadow: `0 8px 30px ${COLORS.teal}44`,
      }}>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 12, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 1 }}>
          Savings Rate
        </p>
        <h1 style={{ color: "#fff", fontSize: 48, fontWeight: 900, margin: "0 0 8px", fontFamily: "'Sora', sans-serif" }}>
          {savingsRate}%
        </h1>
        <div style={{ height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 4 }}>
          <div style={{ height: "100%", width: `${savingsRate}%`, background: "#fff", borderRadius: 4 }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, margin: "8px 0 0" }}>
          Displaying in {currency} · Rate: 1 USD = 129 KES
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total Saved", amount: totalSaved, icon: "💰", color: COLORS.green, bg: "#F0FDF4" },
          { label: "Total Spent", amount: totalSpent, icon: "💸", color: COLORS.red,   bg: "#FFF5F5" },
        ].map(c => (
          <div key={c.label} style={{ background: c.bg, borderRadius: 16, padding: 16 }}>
            <span style={{ fontSize: 24 }}>{c.icon}</span>
            <p style={{ margin: "8px 0 2px", fontSize: 11, color: COLORS.muted, fontWeight: 500 }}>{c.label}</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: c.color }}>{formatAmount(c.amount, currency)}</p>
            {currency === "USD" && (
              <p style={{ margin: "2px 0 0", fontSize: 10, color: COLORS.muted }}>KES {c.amount.toLocaleString()}</p>
            )}
          </div>
        ))}
      </div>

      {/* Savings Trend Line Chart */}
      <div style={{ background: COLORS.card, borderRadius: 20, padding: "20px 16px", marginBottom: 16, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>
          Savings Trend ({currency})
        </h3>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: COLORS.muted, fontSize: 11 }} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: COLORS.text, border: "none", borderRadius: 10, color: "#fff", fontSize: 12 }}
              formatter={fmtTooltip}
            />
            <Line type="monotone" dataKey="saved"    stroke={COLORS.teal} strokeWidth={3} dot={{ fill: COLORS.teal, r: 5 }} />
            <Line type="monotone" dataKey="expenses" stroke={COLORS.red}  strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 20, marginTop: 8 }}>
          {[
            { color: COLORS.teal, label: "Saved" },
            { color: COLORS.red,  label: "Spent" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
              <span style={{ fontSize: 11, color: COLORS.muted }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div style={{ background: COLORS.card, borderRadius: 20, padding: "20px 16px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: COLORS.text }}>
          Spending by Category
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={categoryColors[entry.name] || COLORS.teal} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex: 1 }}>
            {pieData.slice(0, 5).map(d => (
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
      </div>

    </div>
  );
}
