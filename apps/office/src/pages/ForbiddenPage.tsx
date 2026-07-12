import { EmptyState } from '@appraisal/ui';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ForbiddenPage() {
  const { t } = useTranslation();
  return (
    <EmptyState icon={<ShieldAlert size={20} />} title={t('forbidden.title')}>
      {t('forbidden.body')}
    </EmptyState>
  );
}
