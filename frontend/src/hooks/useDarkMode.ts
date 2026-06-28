/**
 * hooks/useDarkMode.ts
 *
 * Manages the application's light/dark theme by toggling the `.dark`
 * class on <html> and persisting the preference in localStorage.
 *
 * Skill rules applied:
 *   - rerender-lazy-state-init: localStorage.getItem is passed as
 *     an initialiser function to useState — runs once, never on re-render.
 *   - advanced-init-once: the media query object is created at module
 *     level, not inside the component, so it is shared across all callers.
 *   - rerender-functional-setState: toggle uses the functional form
 *     of setState to avoid stale closure issues.
 */

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'acme-theme';

// Created once at module level — not recreated per render
const prefersDark =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

function getInitialDark(): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark') return true;
  if (stored === 'light') return false;
  // Fall back to system preference
  return prefersDark?.matches ?? false;
}

export function useDarkMode() {
  // Lazy initialiser — getInitialDark runs only on first render
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  // Sync .dark class on <html> when isDark changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  }, [isDark]);

  // Functional setState — stable, no stale closure
  const toggle = () => setIsDark((prev) => !prev);

  return { isDark, toggle } as const;
}
