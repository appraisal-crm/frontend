import { ApiError, type Appraisal } from '@appraisal/api-client';
import { Badge, Button, Callout, Card, CardHeader, Field, Input, Textarea } from '@appraisal/ui';
import { Check, FileText, Plus, X } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../lib/format';
import {
  useAddComparable,
  useCompleteAppraisal,
  useDeleteComparable,
  useUpdateAppraisal,
  useUploadReport,
} from './queries';
import styles from './AppraisalDetail.module.css';

interface PropRow {
  key: string;
  value: string;
}

// Comparable data is free-form JSONB (the field set is not formalized yet), so
// the form is key-value pairs, same as inspection property_data.
function toComparableData(rows: PropRow[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const { key, value } of rows) {
    const k = key.trim();
    if (!k) continue;
    try {
      out[k] = JSON.parse(value) as unknown;
    } catch {
      out[k] = value;
    }
  }
  return out;
}

export function AppraisalDetail({ appraisal }: { appraisal: Appraisal }) {
  const { t } = useTranslation();

  const update = useUpdateAppraisal(appraisal.id);
  const complete = useCompleteAppraisal();
  const addComparable = useAddComparable(appraisal.id);
  const deleteComparable = useDeleteComparable(appraisal.id);
  const uploadReport = useUploadReport(appraisal.id);

  const [notes, setNotes] = useState(appraisal.notes ?? '');
  const [marketValue, setMarketValue] = useState(appraisal.market_value ?? '');
  const [saved, setSaved] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newRows, setNewRows] = useState<PropRow[]>([{ key: '', value: '' }]);
  const [reportUploaded, setReportUploaded] = useState<boolean | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const done = appraisal.status === 'completed';
  const comparables = appraisal.comparables ?? [];

  function save() {
    setSaved(false);
    update.mutate(
      { notes, ...(marketValue.trim() ? { market_value: marketValue.trim() } : {}) },
      { onSuccess: () => setSaved(true) },
    );
  }

  function setNewRow(i: number, patch: Partial<PropRow>) {
    setNewRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  function submitComparable() {
    const data = toComparableData(newRows);
    if (Object.keys(data).length === 0) return;
    addComparable.mutate(data, {
      onSuccess: () => {
        setAdding(false);
        setNewRows([{ key: '', value: '' }]);
      },
    });
  }

  function onReportPicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setReportUploaded(null);
    uploadReport.mutate(file, { onSuccess: (res) => setReportUploaded(res.uploaded) });
  }

  const frozen = (err: unknown) => err instanceof ApiError && err.status === 422;
  const conflict = (err: unknown) => err instanceof ApiError && err.status === 409;
  const mutationError = (err: unknown, isError: boolean) =>
    frozen(err)
      ? t('appraisals.frozen')
      : conflict(err)
        ? t('appraisals.saveConflict')
        : isError
          ? t('appraisals.saveErr')
          : undefined;

  const saveError = mutationError(update.error, update.isError);
  const completeError = mutationError(complete.error, complete.isError);

  return (
    <div className={styles.detail}>
      <div className={styles.meta}>
        <Badge tone={done ? 'go' : 'warn'}>{t(`apprStatus.${appraisal.status}`)}</Badge>
        <span>{t('appraisals.createdOn', { date: formatDate(appraisal.created_at) })}</span>
        <span>
          {t('appraisals.colAppraiser')}:{' '}
          {appraisal.appraiser_id ? (
            <code className={styles.mono}>{appraisal.appraiser_id.slice(0, 8)}…</code>
          ) : (
            t('appraisals.unassigned')
          )}
        </span>
        {!done && (
          <Button
            size="sm"
            loading={complete.isPending}
            onClick={() => complete.mutate(appraisal.id)}
            className={styles.completeBtn}
          >
            <Check size={14} strokeWidth={2.5} />
            {t('appraisals.complete')}
          </Button>
        )}
      </div>
      {completeError && <Callout tone="danger">{completeError}</Callout>}

      <Card>
        <CardHeader title={t('appraisals.dataTitle')} />
        <div className={styles.form}>
          <Field label={t('appraisals.notes')} htmlFor="appr-notes">
            <Textarea
              id="appr-notes"
              rows={4}
              value={notes}
              disabled={done}
              placeholder={t('appraisals.notesPlaceholder')}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>

          <Field label={t('appraisals.marketValue')} htmlFor="appr-value">
            <Input
              id="appr-value"
              className={styles.valueInput}
              value={marketValue}
              disabled={done}
              inputMode="decimal"
              placeholder={t('appraisals.marketValuePlaceholder')}
              onChange={(e) => setMarketValue(e.target.value)}
            />
          </Field>

          {!done && (
            <div className={styles.saveRow}>
              <Button loading={update.isPending} onClick={save}>
                {t('appraisals.save')}
              </Button>
              {saved && !update.isPending && <span className={styles.savedNote}>{t('appraisals.saveOk')}</span>}
            </div>
          )}
          {saveError && <Callout tone="danger">{saveError}</Callout>}
        </div>
      </Card>

      <Card>
        <CardHeader title={t('appraisals.comparables')} />
        <div className={styles.form}>
          {comparables.length === 0 && <p className={styles.compEmpty}>{t('appraisals.compEmpty')}</p>}
          {comparables.length > 0 && (
            <ul className={styles.compList}>
              {comparables.map((comp) => (
                <li key={comp.id} className={styles.compItem}>
                  <div className={styles.compData}>
                    {Object.entries(comp.data).map(([k, v]) => (
                      <span key={k} className={styles.compPair}>
                        <span className={styles.compKey}>{k}</span>
                        {typeof v === 'string' ? v : JSON.stringify(v)}
                      </span>
                    ))}
                  </div>
                  {!done && (
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-label={t('appraisals.compDelete')}
                      loading={deleteComparable.isPending && deleteComparable.variables === comp.id}
                      onClick={() => deleteComparable.mutate(comp.id)}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}

          {!done && !adding && (
            <div>
              <Button size="sm" variant="secondary" onClick={() => setAdding(true)}>
                <Plus size={14} />
                {t('appraisals.compAdd')}
              </Button>
            </div>
          )}
          {!done && adding && (
            <div>
              {newRows.map((row, i) => (
                <div key={i} className={styles.propRow}>
                  <Input
                    value={row.key}
                    placeholder={t('appraisals.compKey')}
                    aria-label={t('appraisals.compKey')}
                    onChange={(e) => setNewRow(i, { key: e.target.value })}
                  />
                  <Input
                    value={row.value}
                    placeholder={t('appraisals.compValue')}
                    aria-label={t('appraisals.compValue')}
                    onChange={(e) => setNewRow(i, { value: e.target.value })}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={t('common.cancel')}
                    onClick={() => setNewRows((rs) => rs.filter((_, j) => j !== i))}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
              <div className={styles.addActions}>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setNewRows((rs) => [...rs, { key: '', value: '' }])}
                >
                  <Plus size={14} />
                  {t('appraisals.addParam')}
                </Button>
                <Button size="sm" loading={addComparable.isPending} onClick={submitComparable}>
                  {t('common.ok')}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          )}
          {addComparable.isError && (
            <Callout tone="danger">
              {frozen(addComparable.error) ? t('appraisals.frozen') : t('appraisals.saveErr')}
            </Callout>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title={t('appraisals.report')} />
        <div className={styles.form}>
          <Callout tone="info">{t('appraisals.reportNote')}</Callout>
          {appraisal.report_s3_key && (
            <div className={styles.reportRow}>
              <FileText size={14} />
              <code className={styles.mono}>{appraisal.report_s3_key.split('/').pop()}</code>
              {reportUploaded != null && (
                <span className={reportUploaded ? styles.reportOk : styles.reportStub}>
                  {reportUploaded ? t('appraisals.reportUploaded') : t('appraisals.reportStub')}
                </span>
              )}
            </div>
          )}
          {!done && (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                hidden
                onChange={onReportPicked}
              />
              <Button
                size="sm"
                variant="secondary"
                loading={uploadReport.isPending}
                onClick={() => fileRef.current?.click()}
              >
                <FileText size={14} />
                {appraisal.report_s3_key ? t('appraisals.reportReplace') : t('appraisals.reportUpload')}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
