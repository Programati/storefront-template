export function formatCurrency(
  amount: number,
  currency: string,
  locale = 'es-AR',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}
