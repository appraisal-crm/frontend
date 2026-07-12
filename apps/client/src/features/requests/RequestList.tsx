import { Callout, EmptyState, Spinner } from '@appraisal/ui';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RequestCard } from './RequestCard';
import { useMyRequests } from './queries';
import styles from './RequestList.module.css';

export function RequestList() {
  const { t } = useTranslation();
  const { data, isPending, isError } = useMyRequests();

  if (isPending) {
    return (
      <div className={styles.center}>
        <Spinner label={t('common.loading')} />
      </div>
    );
  }

  if (isError) {
    return <Callout tone="danger">{t('list.errLoad')}</Callout>;
  }

  const requests = data ?? [];
  if (requests.length === 0) {
    return (
      <EmptyState icon={<FileText size={20} />} title={t('list.emptyTitle')}>
        {t('list.emptyBody')}
      </EmptyState>
    );
  }

  return (
    <div className={styles.list}>
      {requests.map((r, i) => (
        <RequestCard key={r.id} request={r} index={i} />
      ))}
    </div>
  );
}
