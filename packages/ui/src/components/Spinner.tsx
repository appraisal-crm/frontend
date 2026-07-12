import styles from './Spinner.module.css';

export function Spinner({ label = 'Загрузка' }: { label?: string }) {
  return (
    <span className={styles.wrap} role="status">
      <span className={styles.ring} aria-hidden />
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}
