export function formatMoney(amount: number, currency: "IDR" = "IDR") {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency, maximumFractionDigits: 0 }).format(
    amount
  );
}

