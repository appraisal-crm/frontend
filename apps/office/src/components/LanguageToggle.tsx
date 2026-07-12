import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.css';

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => void i18n.changeLanguage(isEn ? 'ru' : 'en')}
      aria-label={t('lang.switch')}
      title={t('lang.switch')}
    >
      {isEn ? 'EN' : 'RU'}
    </button>
  );
}
