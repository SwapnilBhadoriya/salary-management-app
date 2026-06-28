/**
 * lib/formatters.ts
 *
 * Pure utility functions for display formatting.
 * All functions are stateless — safe to call from any render path.
 *
 * Skill rules applied:
 *   - js-set-map-lookups: STATUS_LABELS / TYPE_LABELS use plain objects
 *     for O(1) lookups (no Array.find).
 *   - rerender-derived-state-no-effect: formatting is derived during render,
 *     never stored in state via useEffect.
 */

import { type EmploymentStatus, type EmploymentType } from '@/types/api';

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a Prisma Decimal (serialised as string) or plain number to "$12,500.00".
 * Returns "—" for null/undefined values.
 */
export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '—';
  return usdFormatter.format(num);
}

// ---------------------------------------------------------------------------
// Date
// ---------------------------------------------------------------------------

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

/**
 * Format an ISO date string to "Jun 28, 2026".
 * Returns "—" for null/undefined.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '—';
  return dateFormatter.format(date);
}

/**
 * Format an ISO date string to "YYYY-MM-DD" for use in date inputs.
 */
export function toInputDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

// ---------------------------------------------------------------------------
// Employment Status labels (O(1) object lookup — js-set-map-lookups)
// ---------------------------------------------------------------------------

const STATUS_LABELS: Record<EmploymentStatus, string> = {
  ACTIVE: 'Active',
  DEACTIVE: 'Inactive',
};

export function formatStatus(status: EmploymentStatus): string {
  return STATUS_LABELS[status] ?? status;
}

// ---------------------------------------------------------------------------
// Employment Type labels (O(1) object lookup — js-set-map-lookups)
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACTOR: 'Contractor',
  INTERN: 'Intern',
};

export function formatType(type: EmploymentType): string {
  return TYPE_LABELS[type] ?? type;
}

// ---------------------------------------------------------------------------
// Initials (for avatar fallback)
// ---------------------------------------------------------------------------

/**
 * Returns up to 2 initials from a display name. E.g. "John Doe" → "JD".
 */
export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}
