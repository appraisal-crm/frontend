import { useAuth } from '@appraisal/auth';
import { Button } from '@appraisal/ui';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Brand } from './Brand';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import styles from './SignInScreen.module.css';

export function SignInScreen() {
  const { login } = useAuth();
  const { t } = useTranslation();

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <Brand sub={t('brand.sub')} />
          <div className={styles.controls}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
        <div className={styles.body}>
          <p className="u-eyebrow">{t('signin.eyebrow')}</p>
          <h1 className={styles.title}>{t('signin.title')}</h1>
          <p className={styles.lead}>{t('signin.lead')}</p>
        </div>
        <Button onClick={() => void login()}>
          {t('common.signIn')}
          <ArrowRight size={16} strokeWidth={2.25} />
        </Button>
      </div>
      <p className={styles.foot}>{t('signin.foot')}</p>
    </div>
  );
}
