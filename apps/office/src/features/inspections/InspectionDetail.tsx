import { ApiError, type Inspection, type Photo } from '@appraisal/api-client';
import { useAuth } from '@appraisal/auth';
import { Badge, Button, Callout, Card, CardHeader, Field, Input, Textarea } from '@appraisal/ui';
import { Camera, Check, Plus, X } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../lib/format';
import { useAddPhoto, useCompleteInspection, useUpdateInspection } from './queries';
import styles from './InspectionDetail.module.css';

interface PropRow {
  key: string;
  value: string;
}

function toRows(data: Record<string, unknown> | null): PropRow[] {
  if (!data) return [];
  return Object.entries(data).map(([key, v]) => ({
    key,
    value: typeof v === 'string' ? v : JSON.stringify(v),
  }));
}

function toPropertyData(rows: PropRow[]): Record<string, unknown> {
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

interface SessionPhoto {
  photo: Photo;
  uploaded: boolean;
}

export function InspectionDetail({ inspection }: { inspection: Inspection }) {
  const { t } = useTranslation();
  const { hasRole } = useAuth();

  const update = useUpdateInspection(inspection.id);
  const complete = useCompleteInspection();
  const addPhoto = useAddPhoto(inspection.id);

  const [notes, setNotes] = useState(inspection.notes ?? '');
  const [rows, setRows] = useState<PropRow[]>(() => toRows(inspection.property_data));
  const [saved, setSaved] = useState(false);
  const [photos, setPhotos] = useState<SessionPhoto[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const done = inspection.status === 'completed';
  const isInspector = hasRole('inspector');
  const canEdit = !done;

  function setRow(i: number, patch: Partial<PropRow>) {
    setRows((rs) => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  }

  function save() {
    setSaved(false);
    update.mutate(
      { notes, property_data: toPropertyData(rows) },
      { onSuccess: () => setSaved(true) },
    );
  }

  function onFilePicked(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    addPhoto.mutate(file, {
      onSuccess: (res) => setPhotos((ps) => [...ps, { photo: res.photo, uploaded: res.uploaded }]),
    });
  }

  const saveError =
    update.error instanceof ApiError && update.error.status === 409
      ? t('inspections.saveConflict')
      : update.isError
        ? t('inspections.saveErr')
        : undefined;

  return (
    <div className={styles.detail}>
      <div className={styles.meta}>
        <Badge tone={done ? 'go' : 'warn'}>{t(`inspStatus.${inspection.status}`)}</Badge>
        <span>{t('inspections.assignedOn', { date: formatDate(inspection.created_at) })}</span>
        <span>
          {t('inspections.colInspector')}:{' '}
          {inspection.inspector_id ? (
            <code className={styles.mono}>{inspection.inspector_id.slice(0, 8)}…</code>
          ) : (
            t('inspections.unassigned')
          )}
        </span>
        {isInspector && !done && (
          <Button
            size="sm"
            loading={complete.isPending}
            onClick={() => complete.mutate(inspection.id)}
            className={styles.completeBtn}
          >
            <Check size={14} strokeWidth={2.5} />
            {t('inspections.complete')}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader title={t('inspections.dataTitle')} />
        <div className={styles.form}>
          <Field label={t('inspections.notes')} htmlFor="insp-notes">
            <Textarea
              id="insp-notes"
              rows={4}
              value={notes}
              disabled={!canEdit}
              placeholder={t('inspections.notesPlaceholder')}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>

          <div>
            <p className={styles.propLabel}>{t('inspections.propData')}</p>
            {rows.length === 0 && <p className={styles.propEmpty}>{t('inspections.propEmpty')}</p>}
            {rows.map((row, i) => (
              <div key={i} className={styles.propRow}>
                <Input
                  value={row.key}
                  disabled={!canEdit}
                  placeholder={t('inspections.propKey')}
                  aria-label={t('inspections.propKey')}
                  onChange={(e) => setRow(i, { key: e.target.value })}
                />
                <Input
                  value={row.value}
                  disabled={!canEdit}
                  placeholder={t('inspections.propValue')}
                  aria-label={t('inspections.propValue')}
                  onChange={(e) => setRow(i, { value: e.target.value })}
                />
                {canEdit && (
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={t('common.cancel')}
                    onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}
                  >
                    <X size={14} />
                  </Button>
                )}
              </div>
            ))}
            {canEdit && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setRows((rs) => [...rs, { key: '', value: '' }])}
              >
                <Plus size={14} />
                {t('inspections.addParam')}
              </Button>
            )}
          </div>

          {canEdit && (
            <div className={styles.saveRow}>
              <Button loading={update.isPending} onClick={save}>
                {t('inspections.save')}
              </Button>
              {saved && !update.isPending && <span className={styles.savedNote}>{t('inspections.saveOk')}</span>}
            </div>
          )}
          {saveError && <Callout tone="danger">{saveError}</Callout>}
        </div>
      </Card>

      {isInspector && (
        <Card>
          <CardHeader title={t('inspections.photos')} />
          <div className={styles.form}>
            <Callout tone="info">{t('inspections.photosNote')}</Callout>
            {photos.length > 0 && (
              <ul className={styles.photoList}>
                {photos.map(({ photo, uploaded }) => (
                  <li key={photo.id}>
                    <Camera size={14} />
                    <code className={styles.mono}>{photo.object_key.split('/').pop()}</code>
                    <span className={uploaded ? styles.photoOk : styles.photoStub}>
                      {uploaded ? t('inspections.photoUploaded') : t('inspections.photoStub')}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {!done && (
              <div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFilePicked} />
                <Button
                  size="sm"
                  variant="secondary"
                  loading={addPhoto.isPending}
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera size={14} />
                  {t('inspections.addPhoto')}
                </Button>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
