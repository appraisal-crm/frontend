import { useTranslation } from 'react-i18next';
import styles from './Brand.module.css';

export function Brand({ sub }: { sub?: string }) {
  const { t } = useTranslation();
  return (
    <div className={styles.brand}>
      <span className={styles.mark} aria-hidden>
        <span className={styles.tick} />
      </span>
      <span className={styles.word}>
        {t('brand.name')}
        {sub && <span className={styles.sub}>{sub}</span>}
      </span>
    </div>
  );
}
