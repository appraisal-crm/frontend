import type { Inspection } from '@appraisal/api-client';
import { useTranslation } from 'react-i18next';
import { InspectionRow } from './InspectionRow';
import styles from './InspectionsTable.module.css';

export function InspectionsTable({
  inspections,
  canAssign,
  isInspector,
}: {
  inspections: Inspection[];
  canAssign: boolean;
  isInspector: boolean;
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <span>{t('inspections.colInspection')}</span>
        <span>{t('inspections.colInspector')}</span>
        <span>{t('inspections.colStatus')}</span>
        <span />
      </div>
      {inspections.map((insp) => (
        <InspectionRow key={insp.id} inspection={insp} canAssign={canAssign} isInspector={isInspector} />
      ))}
    </div>
  );
}
