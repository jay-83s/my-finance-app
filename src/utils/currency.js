export const KES_TO_USD = 0.00775;

export const CURRENCIES = {
  KES: { symbol: "KES", flag: "🇰🇪", rate: 1,           label: "Kenyan Shilling" },
  USD: { symbol: "$",   flag: "🇺🇸", rate: KES_TO_USD,  label: "US Dollar"       },
};

/**
 * Format a KES amount into the selected display currency.
 * @param {number} kesAmount  - raw value stored in KES
 * @param {string} currency   - "KES" | "USD"
 */
export function formatAmount(kesAmount, currency) {
  const cur = CURRENCIES[currency];
  const val = Math.abs(kesAmount) * cur.rate;
  if (currency === "USD") return `$${val.toFixed(2)}`;
  return `KES ${Math.round(val).toLocaleString()}`;
}

/**
 * Convert an amount entered in the current currency back to KES for storage.
 */
export function toKES(amount, currency) {
  return currency === "USD" ? amount / KES_TO_USD : amount;
}
