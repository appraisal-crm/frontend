import type { ReactNode } from 'react';
import styles from './PageHead.module.css';

export function PageHead({ eyebrow, title, count, children }: { eyebrow: string; title: string; count?: number; children?: ReactNode }) {
  return (
    <header className={styles.head}>
      <div>
        <p className="u-eyebrow">{eyebrow}</p>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{title}</h1>
          {count !== undefined && <span className={styles.count}>{count}</span>}
        </div>
      </div>
      {children}
    </header>
  );
}
