/**
 * hooks/useDebounce.ts
 *
 * Delays updating a value until the user stops typing for `delay` ms.
 * Used for search inputs to avoid firing a query on every keystroke.
 *
 * Skill rule applied:
 *   - rerender-use-ref-transient-values: the timeout ID is stored in a ref
 *     so updating it does not cause a re-render.
 */

import { useState, useEffect, useRef } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // Store the timeout ID in a ref — changes to it don't trigger re-renders
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
