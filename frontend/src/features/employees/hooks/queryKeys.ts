/**
 * features/employees/hooks/queryKeys.ts
 *
 * Query key factory for TanStack Query.
 * Using a factory pattern ensures cache invalidation is precise and
 * avoids string typos across hook files.
 *
 * Skill: bundle-barrel-imports — import this file directly, not via an index.
 */

import { type EmployeeListParams } from '@/types/api';

export const employeeKeys = {
  /** Matches all employee queries — use for broad invalidation */
  all: ['employees'] as const,
  /** Matches all list queries regardless of params */
  lists: () => ['employees', 'list'] as const,
  /** Matches a specific list query by params */
  list: (params: EmployeeListParams) => ['employees', 'list', params] as const,
  /** Matches a specific employee detail */
  detail: (id: string) => ['employees', 'detail', id] as const,
  /** Matches the salary history for an employee */
  salaries: (id: string) => ['employees', 'salaries', id] as const,
} as const;
