import { useAuth } from '@appraisal/auth';
import { Button, useTheme } from '@appraisal/ui';
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
          <h1 className={styles.title}>{t('signin.title')}</h1>
          <p className={styles.lead}>{t('signin.lead')}</p>
        </div>
        <Button onClick={() => void login({ locale: i18n.language, theme })}>
          {t('common.signIn')}
          <ArrowRight size={16} strokeWidth={2.25} />
        </Button>
      </div>
    </div>
  );
}
