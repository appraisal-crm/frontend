import type { Appraisal } from '@appraisal/api-client';
import { useTranslation } from 'react-i18next';
import { AppraisalRow } from './AppraisalRow';
import styles from './AppraisalsTable.module.css';

export function AppraisalsTable({ appraisals }: { appraisals: Appraisal[] }) {
  const { t } = useTranslation();
  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <span>{t('appraisals.colAppraisal')}</span>
        <span>{t('appraisals.colAppraiser')}</span>
        <span>{t('appraisals.colValue')}</span>
        <span>{t('appraisals.colStatus')}</span>
        <span />
      </div>
      {appraisals.map((a) => (
        <AppraisalRow key={a.id} appraisal={a} />
      ))}
    </div>
  );
}
