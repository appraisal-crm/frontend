import { ApiError } from '@appraisal/api-client';
import { Callout, Spinner } from '@appraisal/ui';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { PageHead } from '../components/PageHead';
import { AppraisalDetail } from '../features/appraisals/AppraisalDetail';
import { useAppraisal } from '../features/appraisals/queries';
import styles from './page.module.css';

export function AppraisalPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const { data, isPending, isError, error } = useAppraisal(id);

  const notFound = error instanceof ApiError && error.status === 404;

  return (
    <div>
      <Link to="/appraisals" className={styles.back}>
        <ArrowLeft size={14} />
        {t('appraisals.backToList')}
      </Link>

      <PageHead
        eyebrow={t('appraisals.eyebrow')}
        title={data ? t('appraisals.reqNo', { id: data.request_id.slice(0, 8) }) : t('appraisals.title')}
      />

      <div className={styles.gap}>
        {isPending ? (
          <div className={styles.center}>
            <Spinner label={t('common.loading')} />
          </div>
        ) : isError ? (
          <Callout tone="danger">{notFound ? t('appraisals.notFound') : t('appraisals.errLoad')}</Callout>
        ) : (
          <AppraisalDetail appraisal={data} />
        )}
      </div>
    </div>
  );
}
