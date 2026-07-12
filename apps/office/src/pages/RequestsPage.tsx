import { Callout, EmptyState, Spinner } from '@appraisal/ui';
import { Inbox } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHead } from '../components/PageHead';
import { useRequests } from '../features/requests/queries';
import { RequestsTable } from '../features/requests/RequestsTable';
import styles from './page.module.css';

export function RequestsPage() {
  const { t } = useTranslation();
  const { data, isPending, isError } = useRequests();

  return (
    <div>
      <PageHead eyebrow={t('requests.eyebrow')} title={t('requests.title')} count={data?.length} />

      {isPending ? (
        <div className={styles.center}>
          <Spinner label={t('common.loading')} />
        </div>
      ) : isError ? (
        <Callout tone="danger">{t('requests.errLoad')}</Callout>
      ) : data.length === 0 ? (
        <EmptyState icon={<Inbox size={20} />} title={t('requests.empty')}>
          {t('requests.emptyBody')}
        </EmptyState>
      ) : (
        <RequestsTable requests={data} />
      )}
    </div>
  );
}
