import { ApiError } from '@appraisal/api-client';
import { Callout, Spinner } from '@appraisal/ui';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { PageHead } from '../components/PageHead';
import { InspectionDetail } from '../features/inspections/InspectionDetail';
import { useInspection } from '../features/inspections/queries';
import styles from './page.module.css';

export function InspectionPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const { data, isPending, isError, error } = useInspection(id);

  const notFound = error instanceof ApiError && error.status === 404;

  return (
    <div>
      <Link to="/inspections" className={styles.back}>
        <ArrowLeft size={14} />
        {t('inspections.backToList')}
      </Link>

      <PageHead
        eyebrow={t('inspections.eyebrow')}
        title={data ? t('inspections.reqNo', { id: data.request_id.slice(0, 8) }) : t('inspections.title')}
      />

      <div className={styles.gap}>
        {isPending ? (
          <div className={styles.center}>
            <Spinner label={t('common.loading')} />
          </div>
        ) : isError ? (
          <Callout tone="danger">{notFound ? t('inspections.notFound') : t('inspections.errLoad')}</Callout>
        ) : (
          <InspectionDetail inspection={data} />
        )}
      </div>
    </div>
  );
}
