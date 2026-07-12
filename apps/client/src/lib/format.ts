import { i18n, localeOf } from './i18n';

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat(localeOf(i18n.language), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}
