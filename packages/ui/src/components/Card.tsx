import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'article' | 'section';
  pad?: boolean;
}

export function Card({ as: Tag = 'div', pad = true, className, children, ...rest }: CardProps) {
  return (
    <Tag className={[styles.card, pad ? styles.pad : '', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ eyebrow, title, action }: { eyebrow?: string; title: ReactNode; action?: ReactNode }) {
  return (
    <div className={styles.header}>
      <div>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <h2 className={styles.title}>{title}</h2>
      </div>
      {action}
    </div>
  );
}
