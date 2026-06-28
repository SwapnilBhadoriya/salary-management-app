/**
 * features/roles/schemas/role.schema.ts
 *
 * Zod schemas for Role create/update DTOs.
 */

import { z } from 'zod';

export const roleSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(100, 'Name must be 100 characters or fewer')
    .transform((val) => val.trim()),
});

export type RoleValues = z.infer<typeof roleSchema>;
