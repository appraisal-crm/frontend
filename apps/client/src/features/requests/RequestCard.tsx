import {
  requestStatusIndex,
  requestStatusOrder,
  type AppraisalRequest,
  type RequestStatus,
} from '@appraisal/api-client';
import { Badge, StageRail, type BadgeTone } from '@appraisal/ui';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../lib/format';
import styles from './RequestCard.module.css';

const tones: Record<RequestStatus, BadgeTone> = {
  new: 'neutral',
  in_progress: 'active',
  inspection_scheduled: 'warn',
  inspection_completed: 'active',
  appraisal: 'active',
  report_sent: 'active',
  closed: 'go',
};

export function RequestCard({ request, index = 0 }: { request: AppraisalRequest; index?: number }) {
  const { t } = useTranslation();
  const stages = requestStatusOrder.map((key) => ({ key, label: t(`stage.${key}`) }));

  return (
    <article className={`${styles.card} u-enter`} style={{ animationDelay: `${index * 70}ms` }}>
      <div className={styles.head}>
        <div>
          <h3 className={styles.title}>{t(`object.${request.object_type ?? 'apartment'}`)}</h3>
          <p className={styles.addr}>{request.address || t('card.noAddress')}</p>
        </div>
        <Badge tone={tones[request.status]}>{t(`status.${request.status}`)}</Badge>
      </div>

      <p className={styles.meta}>
        № {request.id.slice(0, 8)} · {formatDate(request.created_at)}
      </p>

      <div className={styles.rail}>
        <StageRail stages={stages} current={requestStatusIndex(request.status)} />
      </div>
    </article>
  );
}
