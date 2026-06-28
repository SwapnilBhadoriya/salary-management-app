/**
 * components/shared/CurrencyDisplay.tsx
 *
 * Renders a Prisma Decimal (serialised as string) salary value formatted
 * as USD currency using the `.font-data` utility class (Geist Mono,
 * tabular numerals) — as required by the design system.
 *
 * Design system rule: "Salary amounts and employee IDs always render in
 * --font-mono for alignment and scannability."
 *
 * Vercel skill: rerender-derived-state-no-effect — formatting is computed
 * during render, not stored in state.
 */

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

interface CurrencyDisplayProps {
  /** Prisma Decimal serialised as string, or a plain number */
  value: string | number | null | undefined;
  className?: string;
}

export function CurrencyDisplay({ value, className }: CurrencyDisplayProps) {
  return (
    <span className={cn('font-data text-foreground', className)}>
      {formatCurrency(value)}
    </span>
  );
}
