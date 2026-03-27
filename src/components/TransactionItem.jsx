import { TrendingUp, PiggyBank, TrendingDown } from "lucide-react"
import { COLORS } from "../utils/theme"
import { formatAmount } from "../utils/currency"

const TYPE_STYLES = {
  income:  { color: COLORS.green, bg: "#F0FDF4", sign: "+", label: "Income",  Icon: TrendingUp   },
  savings: { color: "#6366F1",    bg: "#EEF2FF", sign: "→", label: "Savings", Icon: PiggyBank    },
  expense: { color: COLORS.red,   bg: "#FFF5F5", sign: "-", label: "Expense", Icon: TrendingDown },
}

export default function TransactionItem({ tx, currency, showKESHint = false, borderBottom = true }) {
  const style = TYPE_STYLES[tx.type] || TYPE_STYLES.expense
  const { Icon } = style

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      borderBottom: borderBottom ? "1px solid #F0F4F8" : "none",
    }}>

      {/* Icon */}
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: style.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon size={20} color={style.color} strokeWidth={2} />
      </div>

      {/* Label and meta */}
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>
          {tx.label}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "2px 8px",
            borderRadius: 20, background: style.bg, color: style.color,
          }}>
            {style.label}
          </span>
          <span style={{ fontSize: 11, color: COLORS.muted }}>
            {tx.category} · {tx.date}
          </span>
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: "right" }}>
        <p style={{
          margin: 0, fontSize: 14, fontWeight: 700,
          color: style.color,
        }}>
          {style.sign}{formatAmount(tx.amount, currency)}
        </p>
        {showKESHint && currency === "USD" && (
          <p style={{ margin: "2px 0 0", fontSize: 10, color: COLORS.muted }}>
            KES {Math.round(Math.abs(tx.amount)).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  )
}