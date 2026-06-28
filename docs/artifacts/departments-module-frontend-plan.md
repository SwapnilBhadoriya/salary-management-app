# Department Module Frontend — Implementation Plan

## Background & Goal
Implement the Department module frontend using a component-driven architecture. Since this is the first feature module, we must also implement the shared API layer (Phase 4) defined in the architecture plan. We will use `react-hook-form` with `zod`, TanStack Query for state, and shadcn/ui components per the project guidelines.

---

## User Review Required

> [!IMPORTANT]
> **API Client — Axios vs Fetch:** Phase 4 of the task tracker specifies an "Axios instance". However, `axios` is not currently in `package.json`. 
> **Decision:** I will install `axios` via `npm install axios` to fulfill this requirement. Please confirm if this is correct or if we should use native `fetch`.

> [!IMPORTANT]
> **Form Components:** The shadcn v4 rules dictate using `<FieldGroup>` and `<Field>` for forms. These components (`form` or `field`) are not yet installed in `src/components/ui`. 
> **Decision:** I will run `npx shadcn@latest add form` to install them before building the department form.

> [!IMPORTANT]
> **Delete Conflict Handling:** The backend returns a `409 Conflict` ("Cannot delete department with active employees") when attempting to delete a department in use. 
> **Decision:** We will catch this error in the React Query `onError` callback and display a `sonner` toast with the exact error message from the backend. The user will be allowed to click "Delete" and see the confirmation dialog regardless of employee count, relying on the backend to enforce the constraint.

---

## Proposed Changes

### 1. API Layer Foundation (Phase 4)
- **Install Axios:** `npm install axios`
- **Install Form Components:** `npx shadcn@latest add form`
- **`src/api/client.ts` [NEW]:**
  - Create a standard Axios instance configured with `VITE_API_BASE_URL`.
  - Add a response interceptor to extract `response.data` for successful requests and to normalize error payloads (extracting the `message` from NestJS's `ApiError` shape) so components can safely read `error.message`.
- **`src/api/departments.ts` [NEW]:**
  - Implement strongly typed API functions: `getDepartments()`, `getDepartment(id)`, `createDepartment(payload)`, `updateDepartment(id, payload)`, `deleteDepartment(id)`.

### 2. State Management Hooks (`src/features/departments/hooks/`)
- **`useDepartments.ts` [NEW]:**
  - `useDepartments()`: Wraps `getDepartments` using `useQuery` with `departmentKeys.list()`.
  - `useCreateDepartment()`: Wraps `createDepartment` using `useMutation`. In `onSuccess`, invalidates `departmentKeys.list()`. In `onError`, triggers a `toast.error`.
  - `useUpdateDepartment()`: Wraps `updateDepartment` using `useMutation`, invalidating `departmentKeys.all`.
  - `useDeleteDepartment()`: Wraps `deleteDepartment` using `useMutation`, invalidating `departmentKeys.list()`.

### 3. UI Components (`src/features/departments/components/`)
- **`DepartmentFormSheet.tsx` [NEW]:**
  - A slide-out `Sheet` containing the React Hook Form using `departmentSchema`.
  - Handles both "Create" and "Edit" modes.
  - Follows shadcn composition rules: `SheetHeader`, `SheetTitle`, `FieldGroup`, `Field`, `Input`.
  - Includes a `Loader2` spinner on the submit button when `isPending` is true.
- **`DepartmentList.tsx` [NEW]:**
  - Renders the data using the shared `DataTable` component.
  - Columns: Department Name, Created Date, Actions (Edit, Delete).
  - Integrates the `ConfirmDialog` for deletions.
  - Renders `PageSkeleton` when loading, `ErrorState` on query failure, and `EmptyState` if no departments exist.

### 4. Page Integration (`src/features/departments/pages/`)
- **`DepartmentsPage.tsx` [MODIFY]:**
  - Replaces the current stub.
  - Composes `PageHeader` (Title: "Departments", Action: "Add Department" button) and `DepartmentList`.
  - Manages the visibility state for the `DepartmentFormSheet` (open/closed and `selectedDepartment` for editing).

---

## UI Scenarios & Test Cases

### 1. Happy Path
- **View List:** Navigate to `/departments` → Loading skeleton displays → Table renders with departments sorted alphabetically.
- **Create:** Click "Add Department" → Sheet opens → Fill in "Engineering" → Click "Save" → Sheet closes → List automatically refreshes.
- **Edit:** Click "Edit" action on "Engineering" → Sheet opens with "Engineering" pre-filled → Change to "Engineering & Tech" → Click "Save" → Sheet closes → List reflects change.
- **Delete:** Click "Delete" action → `ConfirmDialog` opens → Click "Confirm" → Row is removed from the table.

### 2. Validation & Edge Cases
- **Empty Submission:** Open "Add Department", leave name blank, click Save → Inline validation error ("Department name is required") appears below the input. Form does not submit.
- **Duplicate Name (409 Conflict):** Create a department named "HR". Try to create another named "hr" (case-insensitive backend check) → Form submits → Backend rejects with 409 → `sonner` toast appears: "Department with name 'hr' already exists".
- **Delete Constraint (409 Conflict):** Attempt to delete a department that currently has employees assigned → Backend rejects with 409 → `sonner` toast appears: "Cannot delete department with active employees".
- **Whitespace Trim:** Enter "  Marketing  " → Form submits → Zod transforms via `.trim()` → API receives "Marketing".

### 3. Loading & Error States
- **List Fetch Error:** If `GET /departments` fails (e.g., server down), `ErrorState` component renders with a "Try again" button.
- **Form Pending:** While waiting for the API to save, the Save button is disabled and shows a loading spinner.
- **Delete Pending:** While waiting for the API to delete, the "Confirm" button inside the `ConfirmDialog` is disabled and shows a loading spinner.

---

## Verification Plan

### Automated
- `npx tsc --noEmit` completes with zero errors.
- `npm run dev` builds successfully.

### Manual Verification
1. Open the UI, click "Departments" in the sidebar.
2. Create, edit, and delete a department.
3. Attempt to create a duplicate department and verify the toast error.
4. Attempt to save an empty form and verify inline validation.
