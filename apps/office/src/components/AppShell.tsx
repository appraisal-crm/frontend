import { useAuth } from '@appraisal/auth';
import { Avatar, Button } from '@appraisal/ui';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { visibleNav } from '../lib/nav';
import { Brand } from './Brand';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';
import styles from './AppShell.module.css';

const KNOWN_ROLES = ['appraiser', 'inspector', 'admin', 'client'];

export function AppShell() {
  const { user, roles, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const name = user?.profile.preferred_username ?? user?.profile.name ?? 'Staff';
  const nav = visibleNav(roles);
  const shownRoles = roles.filter((r) => KNOWN_ROLES.includes(r)).map((r) => t(`role.${r}`));

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Brand sub={t('brand.sub')} />
        </div>
        <nav className={styles.nav}>
          {nav.map(({ to, labelKey, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}>
              <Icon size={17} strokeWidth={2} />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>
        <div className={styles.roles}>
          <span className={styles.roleList}>{shownRoles.join(' · ') || '—'}</span>
        </div>
      </aside>

      <div className={styles.body}>
        <header className={styles.topbar}>
          <div className={styles.user}>
            <Avatar name={name} />
            <span className={styles.name}>{name}</span>
          </div>
          <div className={styles.controls}>
            <LanguageToggle />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => void logout()}>
              <LogOut size={15} strokeWidth={2} />
              {t('common.signOut')}
            </Button>
          </div>
        </header>

        <main className={`${styles.content} u-enter`} key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
