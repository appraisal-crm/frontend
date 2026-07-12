import { requestStatusOrder } from '@appraisal/api-client';
import { useAuth } from '@appraisal/auth';
import { Button, StageRail, useTheme } from '@appraisal/ui';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Brand } from './Brand';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import styles from './SignInScreen.module.css';

export function SignInScreen() {
  const { login } = useAuth();
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const stages = requestStatusOrder.map((key) => ({ key, label: t(`stage.${key}`) }));

  return (
    <div className={styles.screen}>
      <header className={styles.top}>
        <Brand sub={t('brand.sub')} />
        <div className={styles.controls}>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </header>

      <main className={`${styles.hero} u-enter`}>
        <p className="u-eyebrow">{t('signin.eyebrow')}</p>
        <h1 className={styles.title}>
          {t('signin.titleLead')}
          <span className={styles.accent}>{t('signin.titleAccent')}</span>.
        </h1>
        <p className={styles.lead}>{t('signin.lead')}</p>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span className="u-eyebrow">{t('signin.panelStage')}</span>
            <span className={styles.panelId}>№ 000-000</span>
          </div>
          <StageRail stages={stages} current={2} />
        </div>

        <Button size="md" onClick={() => void login({ locale: i18n.language, theme })}>
          {t('signin.cta')}
          <ArrowRight size={16} strokeWidth={2.25} />
        </Button>
      </main>

      <footer className={styles.foot}>
        <span>{t('signin.footBrand')}</span>
      </footer>
    </div>
  );
}
