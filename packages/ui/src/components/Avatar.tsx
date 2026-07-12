import styles from './Avatar.module.css';

function initials(name: string): string {
  const parts = name.trim().split(/[\s._-]+/).filter(Boolean);
  const chars = parts.length >= 2 ? [parts[0]![0], parts[1]![0]] : [name[0] ?? '?'];
  return chars.join('').toUpperCase();
}

export function Avatar({ name }: { name: string }) {
  return (
    <span className={styles.avatar} aria-hidden title={name}>
      {initials(name)}
    </span>
  );
}
