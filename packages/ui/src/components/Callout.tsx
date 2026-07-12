import type { ReactNode } from 'react';
import styles from './Callout.module.css';

export function Callout({ tone = 'danger', children }: { tone?: 'danger' | 'go' | 'info'; children: ReactNode }) {
  return (
    <p role={tone === 'danger' ? 'alert' : 'status'} className={[styles.callout, styles[tone]].join(' ')}>
      {children}
    </p>
  );
}
