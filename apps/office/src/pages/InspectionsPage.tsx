import { useAuth } from '@appraisal/auth';
import { Callout, EmptyState, Spinner } from '@appraisal/ui';
import { HardHat } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { PageHead } from '../components/PageHead';
import { useInspections } from '../features/inspections/queries';
import { InspectionsTable } from '../features/inspections/InspectionsTable';
import styles from './page.module.css';

export function InspectionsPage() {
  const { hasRole } = useAuth();
  const { t } = useTranslation();
  const isInspector = hasRole('inspector');
  const canAssign = hasRole('appraiser') || hasRole('admin');
  const { data, isPending, isError } = useInspections();

  return (
    <div>
      <PageHead
        eyebrow={isInspector && !canAssign ? t('inspections.eyebrowInspector') : t('inspections.eyebrow')}
        title={t('inspections.title')}
        count={data?.length}
      />

      {canAssign && <Callout tone="info">{t('inspections.assignHint')}</Callout>}

      <div className={styles.gap}>
        {isPending ? (
          <div className={styles.center}>
            <Spinner label={t('common.loading')} />
          </div>
        ) : isError ? (
          <Callout tone="danger">{t('inspections.errLoad')}</Callout>
        ) : data.length === 0 ? (
          <EmptyState icon={<HardHat size={20} />} title={t('inspections.empty')}>
            {isInspector ? t('inspections.emptyInspector') : t('inspections.emptyStaff')}
          </EmptyState>
        ) : (
          <InspectionsTable inspections={data} canAssign={canAssign} isInspector={isInspector} />
        )}
      </div>
    </div>
  );
}
