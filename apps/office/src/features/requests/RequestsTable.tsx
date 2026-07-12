import {
  nextRequestStatus,
  requestStatusIndex,
  requestStatusOrder,
  type AppraisalRequest,
  type RequestStatus,
} from '@appraisal/api-client';
import { Badge, Button, StageRail, type BadgeTone } from '@appraisal/ui';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../lib/format';
import { AppraisalLink } from '../appraisals/AppraisalLink';
import { useAdvanceStatus } from './queries';
import styles from './RequestsTable.module.css';

const tones: Record<RequestStatus, BadgeTone> = {
  new: 'neutral',
  in_progress: 'active',
  inspection_scheduled: 'warn',
  inspection_completed: 'active',
  appraisal: 'active',
  report_sent: 'active',
  closed: 'go',
};

export function RequestsTable({ requests }: { requests: AppraisalRequest[] }) {
  const { t } = useTranslation();
  const advance = useAdvanceStatus();
  const stages = requestStatusOrder.map((key) => ({ key, label: t(`stage.${key}`) }));

  return (
    <div className={styles.table}>
      <div className={styles.head}>
        <span>{t('requests.colObject')}</span>
        <span>{t('requests.colPipeline')}</span>
        <span>{t('requests.colStatus')}</span>
        <span />
      </div>

      {requests.map((r) => {
        const next = nextRequestStatus(r.status);
        const pending = advance.isPending && advance.variables?.id === r.id;
        return (
          <div key={r.id} className={styles.row}>
            <div className={styles.object}>
              <span className={styles.type}>{t(`object.${r.object_type ?? 'apartment'}`)}</span>
              <span className={styles.addr}>{r.address || t('requests.noAddress')}</span>
              <span className={styles.id}>
                № {r.id.slice(0, 8)} · {formatDate(r.created_at)}
              </span>
              <AppraisalLink
                requestId={r.id}
                enabled={requestStatusIndex(r.status) >= requestStatusIndex('appraisal')}
              />
            </div>

            <div className={styles.rail}>
              <StageRail stages={stages} current={requestStatusIndex(r.status)} variant="compact" />
            </div>

            <div>
              <Badge tone={tones[r.status]}>{t(`status.${r.status}`)}</Badge>
            </div>

            <div className={styles.action}>
              {next ? (
                <Button size="sm" variant="secondary" loading={pending} onClick={() => advance.mutate(r)}>
                  {t(`status.${next}`)}
                  <ArrowRight size={14} strokeWidth={2.25} />
                </Button>
              ) : (
                <span className={styles.done}>{t('requests.done')}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
