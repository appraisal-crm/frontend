import { useAuth } from '@appraisal/auth';
import { Avatar, Button } from '@appraisal/ui';
import { LogOut } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Brand } from './Brand';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import styles from './Layout.module.css';

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const name = user?.profile.preferred_username ?? user?.profile.name ?? t('layout.userFallback');

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Brand sub={t('brand.sub')} />
          <div className={styles.user}>
            <LanguageToggle />
            <ThemeToggle />
            <Avatar name={name} />
            <span className={styles.name}>{name}</span>
            <Button variant="ghost" size="sm" onClick={() => void logout()} aria-label={t('common.signOut')}>
              <LogOut size={15} strokeWidth={2} />
              {t('common.signOut')}
            </Button>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>{t('layout.footer')}</span>
      </footer>
    </div>
  );
}
