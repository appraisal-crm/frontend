import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'appraisal-theme';

function readTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Reads/sets the app theme, mirrors it to <html data-theme> and localStorage. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    const apply = () => {
      document.documentElement.dataset.theme = next;
      setThemeState(next);
    };
    // Cross-fade the whole page as one snapshot so every surface switches in sync.
    if (
      typeof document.startViewTransition !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      apply();
      return;
    }
    document.startViewTransition(apply);
  }, []);

  const toggle = useCallback(
    () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'),
    [setTheme],
  );

  return { theme, toggle, setTheme };
}
