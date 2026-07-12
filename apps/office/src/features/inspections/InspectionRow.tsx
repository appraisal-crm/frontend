import type { Inspection } from '@appraisal/api-client';
import { Badge, Button, Input } from '@appraisal/ui';
import { Check, UserPlus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatDate } from '../../lib/format';
import { useAssignInspector, useCompleteInspection } from './queries';
import styles from './InspectionsTable.module.css';

export function InspectionRow({
  inspection,
  canAssign,
  isInspector,
}: {
  inspection: Inspection;
  canAssign: boolean;
  isInspector: boolean;
}) {
  const { t } = useTranslation();
  const complete = useCompleteInspection();
  const assign = useAssignInspector();
  const [assigning, setAssigning] = useState(false);
  const [inspectorId, setInspectorId] = useState('');

  const done = inspection.status === 'completed';

  function submitAssign(e: FormEvent) {
    e.preventDefault();
    if (!inspectorId.trim()) return;
    assign.mutate(
      { id: inspection.id, inspectorId: inspectorId.trim() },
      { onSuccess: () => setAssigning(false) },
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.req}>
        <Link to={`/inspections/${inspection.id}`} className={styles.reqLink}>
          <span className={styles.reqId}>{t('inspections.reqNo', { id: inspection.request_id.slice(0, 8) })}</span>
        </Link>
        <span className={styles.date}>{t('inspections.assignedOn', { date: formatDate(inspection.created_at) })}</span>
      </div>

      <div className={styles.assignee}>
        {inspection.inspector_id ? (
          <span className={styles.mono}>{inspection.inspector_id.slice(0, 8)}…</span>
        ) : (
          <span className={styles.unassigned}>{t('inspections.unassigned')}</span>
        )}
      </div>

      <div>
        <Badge tone={done ? 'go' : 'warn'}>{t(`inspStatus.${inspection.status}`)}</Badge>
      </div>

      <div className={styles.action}>
        {isInspector && !done && (
          <Button size="sm" loading={complete.isPending} onClick={() => complete.mutate(inspection.id)}>
            <Check size={14} strokeWidth={2.5} />
            {t('inspections.complete')}
          </Button>
        )}
        {canAssign && !inspection.inspector_id && !done && !assigning && (
          <Button size="sm" variant="secondary" onClick={() => setAssigning(true)}>
            <UserPlus size={14} strokeWidth={2} />
            {t('inspections.assign')}
          </Button>
        )}
        {canAssign && assigning && (
          <form className={styles.assignForm} onSubmit={submitAssign}>
            <Input
              autoFocus
              value={inspectorId}
              onChange={(e) => setInspectorId(e.target.value)}
              placeholder={t('inspections.assignPlaceholder')}
              aria-label={t('inspections.assignPlaceholder')}
            />
            <Button size="sm" type="submit" loading={assign.isPending}>
              {t('common.ok')}
            </Button>
            <Button size="sm" variant="ghost" type="button" onClick={() => setAssigning(false)}>
              {t('common.cancel')}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
