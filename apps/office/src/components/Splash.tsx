import { Spinner } from '@appraisal/ui';
import { useTranslation } from 'react-i18next';
import styles from './Splash.module.css';

export function Splash() {
  const { t } = useTranslation();
  return (
    <div className={styles.splash}>
      <Spinner label={t('common.loading')} />
    </div>
  );
}
