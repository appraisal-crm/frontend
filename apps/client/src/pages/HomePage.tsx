import { Card, CardHeader } from '@appraisal/ui';
import { useTranslation } from 'react-i18next';
import { NewRequestForm } from '../features/requests/NewRequestForm';
import { RequestList } from '../features/requests/RequestList';
import styles from './HomePage.module.css';

export function HomePage() {
  const { t } = useTranslation();
  return (
    <div className={`${styles.page} u-enter`}>
      <header className={styles.intro}>
        <h1 className={styles.h1}>{t('home.title')}</h1>
        <p className={styles.sub}>{t('home.sub')}</p>
      </header>

      <div className={styles.grid}>
        <aside className={styles.aside}>
          <Card>
            <CardHeader title={t('home.newRequest')} />
            <NewRequestForm />
          </Card>
        </aside>

        <section className={styles.main}>
          <RequestList />
        </section>
      </div>
    </div>
  );
}
