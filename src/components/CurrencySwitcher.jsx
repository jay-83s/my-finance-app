import { useState } from "react";
import { CURRENCIES } from "../utils/currency";
import { COLORS } from "../utils/theme";

export default function CurrencySwitcher({ currency, setCurrency, compact = false }) {
  const [open, setOpen] = useState(false);
  const cur = CURRENCIES[currency];

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: compact ? "rgba(255,255,255,0.18)" : COLORS.tealLight,
          border: compact
            ? "1.5px solid rgba(255,255,255,0.35)"
            : `1.5px solid ${COLORS.teal}44`,
          borderRadius: 20,
          padding: compact ? "6px 12px" : "7px 14px",
          cursor: "pointer",
          color: compact ? "#fff" : COLORS.teal,
          fontWeight: 700, fontSize: 13,
          backdropFilter: "blur(4px)",
        }}
      >
        <span>{cur.flag}</span>
        <span>{currency}</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>▼</span>
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 150 }}
          />
          {/* dropdown */}
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", right: 0,
            background: COLORS.card, borderRadius: 14,
            boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
            overflow: "hidden", zIndex: 200, minWidth: 180,
            border: "1px solid #E8EEF4",
          }}>
            {Object.entries(CURRENCIES).map(([code, info]) => (
              <button
                key={code}
                onClick={() => { setCurrency(code); setOpen(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px",
                  background: currency === code ? COLORS.tealLight : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                }}
              >
                <span style={{ fontSize: 20 }}>{info.flag}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: currency === code ? COLORS.teal : COLORS.text, fontSize: 13 }}>{code}</p>
                  <p style={{ margin: 0, color: COLORS.muted, fontSize: 11 }}>{info.label}</p>
                </div>
                {currency === code && (
                  <span style={{ marginLeft: "auto", color: COLORS.teal }}>✓</span>
                )}
              </button>
            ))}
            <div style={{ padding: "8px 16px 10px", borderTop: "1px solid #F0F4F8" }}>
              <p style={{ margin: 0, color: COLORS.muted, fontSize: 10 }}>Rate: 1 USD = 129 KES</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
