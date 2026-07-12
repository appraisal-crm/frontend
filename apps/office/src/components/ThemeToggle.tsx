import { useTheme } from '@appraisal/ui';
import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const dark = theme === 'dark';
  const label = dark ? t('theme.light') : t('theme.dark');
  return (
    <button type="button" className={styles.toggle} onClick={toggle} aria-label={label} title={label}>
      {dark ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
    </button>
  );
}
