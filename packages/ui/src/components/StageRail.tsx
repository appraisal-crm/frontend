import styles from './StageRail.module.css';

export interface Stage {
  key: string;
  label: string;
}

type StageState = 'done' | 'current' | 'todo';

function stateOf(index: number, current: number): StageState {
  if (index < current) return 'done';
  if (index === current) return 'current';
  return 'todo';
}

/**
 * The signature element: the strictly-linear request pipeline drawn as a
 * surveyor's measuring tape — mono-numbered ticks, a filled progress line, and
 * the current stage marked in surveyor orange.
 */
export function StageRail({
  stages,
  current,
  variant = 'full',
}: {
  stages: Stage[];
  current: number;
  variant?: 'full' | 'compact';
}) {
  return (
    <ol className={styles.rail} data-variant={variant} aria-label="Стадия заявки">
      {stages.map((stage, i) => {
        const state = stateOf(i, current);
        return (
          <li key={stage.key} className={styles.step} data-state={state} data-first={i === 0 || undefined} data-last={i === stages.length - 1 || undefined}>
            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.markerRow}>
              <span className={styles.marker} aria-current={state === 'current' ? 'step' : undefined} />
            </span>
            <span className={styles.name}>{stage.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
