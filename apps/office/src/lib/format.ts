import { i18n, localeOf } from './i18n';

/** Formats a NUMERIC-as-string market value as ₽; null/garbage → dash. */
export function formatMoney(value: string | null): string {
  if (!value) return '—';
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return new Intl.NumberFormat(localeOf(i18n.language), {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(localeOf(i18n.language), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
