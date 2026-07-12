import { Callout, EmptyState, Spinner } from '@appraisal/ui';
import { Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHead } from '../components/PageHead';
import { AppraisalsTable } from '../features/appraisals/AppraisalsTable';
import { useAppraisals } from '../features/appraisals/queries';
import styles from './page.module.css';

export function AppraisalsPage() {
  const { t } = useTranslation();
  const { data, isPending, isError } = useAppraisals();

  return (
    <div>
      <PageHead eyebrow={t('appraisals.eyebrow')} title={t('appraisals.title')} count={data?.length} />

      <div className={styles.gap}>
        {isPending ? (
          <div className={styles.center}>
            <Spinner label={t('common.loading')} />
          </div>
        ) : isError ? (
          <Callout tone="danger">{t('appraisals.errLoad')}</Callout>
        ) : data.length === 0 ? (
          <EmptyState icon={<Scale size={20} />} title={t('appraisals.empty')}>
            {t('appraisals.emptyHint')}
          </EmptyState>
        ) : (
          <AppraisalsTable appraisals={data} />
        )}
      </div>
    </div>
  );
}
