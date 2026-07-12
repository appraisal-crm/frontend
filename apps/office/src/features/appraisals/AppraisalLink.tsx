import { Scale } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAppraisalOfRequest } from './queries';
import styles from './AppraisalLink.module.css';

/** A small "open the appraisal" link for a request; renders nothing until the
 * appraisal exists. `enabled` gates the lookup so pre-appraisal rows don't query. */
export function AppraisalLink({ requestId, enabled = true }: { requestId: string; enabled?: boolean }) {
  const { t } = useTranslation();
  const { data } = useAppraisalOfRequest(requestId, enabled);

  if (!data) return null;
  return (
    <Link to={`/appraisals/${data.id}`} className={styles.link}>
      <Scale size={12} />
      {t('appraisals.appraisalLink')}
    </Link>
  );
}
