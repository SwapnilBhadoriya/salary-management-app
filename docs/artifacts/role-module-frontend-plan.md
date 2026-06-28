# Role Module Frontend — Implementation Plan

## Background & Goal
Implement the Role module frontend using a component-driven architecture, following the exact same patterns established in the Department module. The Role module will allow HR administrators to view, create, edit, and delete employee roles. We will use `react-hook-form` with `zod`, TanStack Query for data fetching/mutations, and shadcn/ui components (`Sheet`, `DataTable`, `FieldGroup`, `Field`) to ensure a consistent user experience aligned with the design system.

---

## User Review Required

> [!IMPORTANT]
> **API Client & Shared Components:** The Axios API client (`apiClient`) and the necessary shadcn components (`form`, `DataTable`, `ConfirmDialog`, `PageHeader`, `EmptyState`, `ErrorState`) were fully implemented during the Department module build. The Role module will reuse all of these without modification. Please confirm this maximizes component reuse as requested.

> [!IMPORTANT]
> **Delete Conflict Handling:** Similar to Departments, the backend returns a `409 Conflict` ("Cannot delete role with ID '[id]' because it has associated employees") when attempting to delete a role currently assigned to employees. 
> **Decision:** We will catch this error in the React Query `onError` callback and display a `sonner` toast with the exact error message from the backend. The user will be able to initiate the delete action regardless of employee count, relying strictly on the backend to enforce the constraint.

---

## Proposed Changes

### 1. API Layer (`src/api/roles.ts`)
- **`src/api/roles.ts` [NEW]:**
  - Implement strongly typed API functions utilizing the existing `apiClient`: 
    - `getRoles(): Promise<Role[]>`
    - `getRole(id: string): Promise<Role>`
    - `createRole(payload: CreateRolePayload): Promise<Role>`
    - `updateRole(id: string, payload: UpdateRolePayload): Promise<Role>`
    - `deleteRole(id: string): Promise<void>`

### 2. State Management Hooks (`src/features/roles/hooks/useRoles.ts`)
- **`src/features/roles/hooks/useRoles.ts` [NEW]:**
  - `useRoles()`: Wraps `getRoles` using `useQuery` with `roleKeys.list()`.
  - `useCreateRole()`: Wraps `createRole` using `useMutation`. In `onSuccess`, invalidates `roleKeys.list()`.
  - `useUpdateRole()`: Wraps `updateRole` using `useMutation`, invalidating `roleKeys.all`.
  - `useDeleteRole()`: Wraps `deleteRole` using `useMutation`, invalidating `roleKeys.list()`.
  - Errors will be automatically parsed by the `apiClient` interceptor, and `toast.error(error.message)` will be used in mutation `onError` callbacks.

### 3. UI Components (`src/features/roles/components/`)
- **`RoleFormSheet.tsx` [NEW]:**
  - A slide-out `Sheet` containing the React Hook Form using the existing `roleSchema` (`src/features/roles/schemas/role.schema.ts`).
  - Handles both "Create Role" and "Edit Role" modes.
  - Composes shadcn form elements: `SheetHeader`, `SheetTitle`, `FieldGroup`, `Field`, `Input`.
  - Displays a `Loader2` spinner on the submit button while `isPending` is true.
- **`RoleList.tsx` [NEW]:**
  - Fetches data via `useRoles()`.
  - Renders the data using the shared `DataTable` component.
  - Columns: Role Name, Created Date, Actions (Edit, Delete).
  - Integrates `ConfirmDialog` for deletions.
  - Renders `PageSkeleton` when loading, `ErrorState` on query failure, and `EmptyState` if no roles exist.

### 4. Page Integration (`src/features/roles/pages/RolesPage.tsx`)
- **`RolesPage.tsx` [MODIFY]:**
  - Replaces the current placeholder stub.
  - Composes `PageHeader` (Title: "Roles", Action: "Add Role" button) and `RoleList`.
  - Manages the visibility state for the `RoleFormSheet` (open/closed and `selectedRole` for editing).

---

## UI Scenarios & Test Cases

### 1. Happy Path
- **View List:** Navigate to `/roles` → Loading skeleton displays → Table renders with roles sorted alphabetically.
- **Create:** Click "Add Role" → Sheet opens → Fill in "Software Engineer" → Click "Save" → Sheet closes → List automatically refreshes.
- **Edit:** Click "Edit" action on "Software Engineer" → Sheet opens with "Software Engineer" pre-filled → Change to "Senior Software Engineer" → Click "Save" → Sheet closes → List reflects change.
- **Delete:** Click "Delete" action → `ConfirmDialog` opens → Click "Confirm" → Row is removed from the table.

### 2. Validation & Edge Cases
- **Empty Submission:** Open "Add Role", leave name blank, click Save → Inline validation error ("Role name is required") appears below the input. Form does not submit.
- **Duplicate Name (409 Conflict):** Create a role named "Manager". Try to create another named "manager" (case-insensitive check) → Form submits → Backend rejects with 409 → `sonner` toast appears: "Role with name 'manager' already exists".
- **Delete Constraint (409 Conflict):** Attempt to delete a role that currently has employees assigned → Backend rejects with 409 → `sonner` toast appears: "Cannot delete role with ID '[id]' because it has associated employees".
- **Whitespace Trim:** Enter "  Developer  " → Form submits → Zod transforms via `.trim()` → API receives "Developer".

### 3. Loading & Error States
- **List Fetch Error:** If `GET /roles` fails, `ErrorState` component renders with a "Try again" button.
- **Form Pending:** While waiting for the API to save, the Save button is disabled and shows a loading spinner.
- **Delete Pending:** While waiting for the API to delete, the "Confirm" button inside the `ConfirmDialog` is disabled and shows a loading spinner.

---

## Verification Plan

### Automated
- `npx tsc --noEmit` completes with zero errors.
- `npm run dev` builds successfully.

### Manual Verification
1. Open the UI, navigate to `/roles` via the sidebar.
2. Verify the list renders correctly.
3. Create, edit, and delete a role.
4. Attempt to create a duplicate role and verify the toast error.
5. Attempt to save an empty form and verify inline validation.
