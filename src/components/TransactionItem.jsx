import { COLORS } from "../utils/theme";
import { formatAmount } from "../utils/currency";

export default function TransactionItem({ tx, currency, showKESHint = false, borderBottom = true }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 16px",
      borderBottom: borderBottom ? "1px solid #F0F4F8" : "none",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: tx.type === "credit" ? "#F0FDF4" : "#FFF5F5",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 20,
      }}>
        {tx.icon}
      </div>

      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COLORS.text }}>{tx.label}</p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: COLORS.muted }}>{tx.category} · {tx.date}</p>
      </div>

      <div style={{ textAlign: "right" }}>
        <p style={{
          margin: 0, fontSize: 14, fontWeight: 700,
          color: tx.type === "credit" ? COLORS.green : COLORS.red,
        }}>
          {tx.type === "credit" ? "+" : "-"}{formatAmount(tx.amount, currency)}
        </p>
        {showKESHint && currency === "USD" && (
          <p style={{ margin: "2px 0 0", fontSize: 10, color: COLORS.muted }}>
            KES {Math.round(Math.abs(tx.amount)).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
