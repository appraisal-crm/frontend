import type { Appraisal } from '@appraisal/api-client';
import { useAuth } from '@appraisal/auth';
import { Badge, Button } from '@appraisal/ui';
import { Hand } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatDate, formatMoney } from '../../lib/format';
import { useTakeAppraisal } from './queries';
import styles from './AppraisalsTable.module.css';

export function AppraisalRow({ appraisal }: { appraisal: Appraisal }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const take = useTakeAppraisal();

  const done = appraisal.status === 'completed';
  const myId = user?.profile.sub;
  const mine = myId != null && appraisal.appraiser_id === myId;

  return (
    <div className={styles.row}>
      <div className={styles.req}>
        <Link to={`/appraisals/${appraisal.id}`} className={styles.reqLink}>
          <span className={styles.reqId}>{t('appraisals.reqNo', { id: appraisal.request_id.slice(0, 8) })}</span>
        </Link>
        <span className={styles.date}>{t('appraisals.createdOn', { date: formatDate(appraisal.created_at) })}</span>
      </div>

      <div className={styles.appraiser}>
        {appraisal.appraiser_id ? (
          <span className={styles.mono}>
            {mine ? t('appraisals.me') : `${appraisal.appraiser_id.slice(0, 8)}…`}
          </span>
        ) : (
          <span className={styles.unassigned}>{t('appraisals.unassigned')}</span>
        )}
      </div>

      <div className={styles.value}>
        <span className={appraisal.market_value ? undefined : styles.noValue}>
          {formatMoney(appraisal.market_value)}
        </span>
      </div>

      <div>
        <Badge tone={done ? 'go' : 'warn'}>{t(`apprStatus.${appraisal.status}`)}</Badge>
      </div>

      <div className={styles.action}>
        {!done && !appraisal.appraiser_id && myId && (
          <Button
            size="sm"
            variant="secondary"
            loading={take.isPending}
            onClick={() => take.mutate({ id: appraisal.id, appraiserId: myId })}
          >
            <Hand size={14} strokeWidth={2} />
            {t('appraisals.take')}
          </Button>
        )}
      </div>
    </div>
  );
}
