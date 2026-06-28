# Theme Infrastructure & Application Shell — Implementation Plan

## Background

The design system (`acme_design_system.html`) defines a bespoke semantic token vocabulary
(`--surface-*`, `--text-*`, `--bg-*`, `--border-*`, `--focus-shadow`) that sits **on top of** the
shadcn/Nova neutral token layer already in `src/index.css`. The shadcn layer uses standard tokens
(`--background`, `--foreground`, `--primary`, `--card`, etc.). The goal is to:

1. Map the design system's semantic tokens to the appropriate shadcn tokens (where they overlap).
2. Add supplementary design system tokens as first-class CSS custom properties in `index.css`
   (bridging the gap without fighting the shadcn layer).
3. Expose all design tokens to Tailwind v4 via the `@theme inline` block so they can be used as
   utility classes (`bg-accent`, `text-muted`, etc.).
4. Build the application shell using the shadcn `Sidebar` component exactly as documented.

---

## User Review Required

> [!IMPORTANT]
> **Dark mode toggle:** The design system mockup explicitly shows a 🌙 dark-mode button in the top
> header. The shadcn `.dark` class block is already in `index.css`. I plan to implement a
> `useDarkMode` hook that persists the preference in `localStorage` and adds/removes the `.dark`
> class from `<html>`. **Confirm this is the desired UX,** or if you prefer a system-preference-
> only approach (no manual toggle).

> [!IMPORTANT]
> **Navigation items — discrepancy:** The design system's IA diagram shows 4 top-level items:
> Dashboard, Employees, Analytics, Settings. However the implementation plan has 5 routes:
> Dashboard, Employees, Departments, Roles, Analytics. The design system omits Departments and
> Roles (they may be considered sub-pages of a "Settings" item). **Please confirm the final
> sidebar nav items and their grouping.** Proposal:
>
> ```
> Main:    Dashboard · Employees · Analytics
> Config:  Departments · Roles  (grouped under a "Settings" section at the bottom)
> ```

> [!IMPORTANT]
> **Icon library:** The design system mockup uses **Tabler Icons** (`ti ti-*` class names via a
> CDN icon font). The shadcn project is configured with `iconLibrary: "lucide"`. Should we:
> - (A) Stay with **Lucide React** (already installed via `lucide-react`) and map equivalents, or
> - (B) Install **`@tabler/icons-react`** to match the design system exactly?
>
> Lucide has equivalents for every icon used. Tabler is richer but adds a dependency.
> **Recommend: Lucide** unless the design system is a strict spec.

> [!WARNING]
> **`--font-mono` — not yet defined:** The design system specifies that salary amounts and
> employee IDs must always render in `--font-mono`. The current `index.css` and `@theme inline`
> block define `--font-sans` and `--font-heading` but **no monospace font**. This plan adds
> `'Geist Mono'` (same family as Geist Variable, already imported). If a different mono font is
> preferred, confirm before implementation.

---

## Open Questions

1. **Sidebar width:** The design system mockup shows the sidebar at ~180px wide. The shadcn
   `Sidebar` defaults to `16rem` (256px) collapsed variant. Should it match the mockup at 180px,
   or use the shadcn default?
2. **Sidebar collapse mode:** Should the sidebar collapse to an icon-only rail on tablet
   (`≥768px`), or fully hide with a hamburger toggle? The design system says "Collapsed sidebar"
   at tablet but doesn't specify icon-rail vs. off-canvas.
3. **Top header height:** The design system mockup shows `52px`. Confirm or adjust?
4. **`Settings` route:** Is there a Settings page in scope for this project, or is it a
   placeholder nav item with no route?

---

## Gap Analysis: Design System Tokens vs. Current CSS

The current `index.css` (shadcn Nova neutral) provides the shadcn token layer. The design system
adds a **second vocabulary** of semantic aliases that must be layered on top.

### Token Mapping Table

| Design System Token | Maps to shadcn Token | Notes |
|---|---|---|
| `--surface-0` | `--background` | Page canvas |
| `--surface-1` | `--muted` | Subtle card / table row hover |
| `--surface-2` | `--card` | Card / panel background |
| `--surface-3` | `--popover` | Popover / dropdown |
| `--text-primary` | `--foreground` | Primary body text |
| `--text-secondary` | `--muted-foreground` at ~80% opacity | Secondary text |
| `--text-muted` | `--muted-foreground` | Muted / caption text |
| `--text-accent` | `--primary` (light) / `--primary` (dark) | Accent interactive text |
| `--border` | `--border` | Default border |
| `--border-strong` | `--input` | Stronger border (inputs) |
| `--border-accent` | `--ring` | Focus/accent border |
| `--border-danger` | `--destructive` | Error border |

The following tokens have **no shadcn equivalent** and will be defined as new custom properties:

| Design System Token | Semantic Role | Light value | Dark value |
|---|---|---|---|
| `--bg-accent` | Primary/accent bg (blue-tinted) | `oklch(0.95 0.04 250)` | `oklch(0.25 0.06 250)` |
| `--bg-success` | Active/success bg (green-tinted) | `oklch(0.94 0.06 148)` | `oklch(0.25 0.08 148)` |
| `--bg-warning` | Warning/contractor bg (amber-tinted) | `oklch(0.95 0.06 75)` | `oklch(0.25 0.08 75)` |
| `--bg-danger` | Danger/inactive bg (red-tinted) | `oklch(0.94 0.06 27)` | `oklch(0.28 0.08 27)` |
| `--bg-pro` | Pro/intern bg (purple-tinted) | `oklch(0.93 0.05 300)` | `oklch(0.25 0.07 300)` |
| `--bg-neutral` | Neutral bg (gray) | `oklch(0.94 0 0)` | `oklch(0.22 0 0)` |
| `--text-accent` | Blue accent text | `oklch(0.40 0.18 250)` | `oklch(0.75 0.18 250)` |
| `--text-success` | Green success text | `oklch(0.40 0.18 148)` | `oklch(0.75 0.15 148)` |
| `--text-warning` | Amber warning text | `oklch(0.42 0.16 75)` | `oklch(0.78 0.14 75)` |
| `--text-danger` | Red danger text | `oklch(0.50 0.20 27)` | `oklch(0.75 0.18 27)` |
| `--text-pro` | Purple pro text | `oklch(0.42 0.16 300)` | `oklch(0.78 0.14 300)` |
| `--focus-shadow` | Focus ring shadow | `0 0 0 3px var(--bg-accent)` | `0 0 0 3px var(--bg-accent)` |
| `--font-mono` | Monospace font (salary/IDs) | `'Geist Mono Variable', monospace` | same |

> [!NOTE]
> The exact OKLCH values above are proposed starting points derived from the design system's
> visual intent. They will be visually validated after implementation and may be tuned slightly.
> These are not locked values — they will be part of the implementation review.

---

## Proposed Changes

---

### Phase A — Design Token Extension (`src/index.css`)

#### [MODIFY] [index.css](file:///home/swapnil/Desktop/salary-management-app/frontend/src/index.css)

**Step A1 — Add monospace font import**

Add `@import "@fontsource-variable/geist-mono"` below the existing Geist Variable import.
This requires installing `@fontsource-variable/geist-mono` via npm.

**Step A2 — Extend `@theme inline` block**

Append the following design-system-specific Tailwind theme tokens inside the existing
`@theme inline { }` block so they become available as Tailwind utility classes:

```css
/* Design system semantic tokens — exposed to Tailwind */
--font-mono: 'Geist Mono Variable', monospace;

/* Semantic surface scale */
--color-surface-0: var(--surface-0);
--color-surface-1: var(--surface-1);
--color-surface-2: var(--surface-2);
--color-surface-3: var(--surface-3);

/* Semantic role backgrounds */
--color-bg-accent:   var(--bg-accent);
--color-bg-success:  var(--bg-success);
--color-bg-warning:  var(--bg-warning);
--color-bg-danger:   var(--bg-danger);
--color-bg-pro:      var(--bg-pro);
--color-bg-neutral:  var(--bg-neutral);

/* Semantic text colors */
--color-text-primary:   var(--text-primary);
--color-text-secondary: var(--text-secondary);
--color-text-muted:     var(--text-muted);
--color-text-accent:    var(--text-accent);
--color-text-success:   var(--text-success);
--color-text-warning:   var(--text-warning);
--color-text-danger:    var(--text-danger);
--color-text-pro:       var(--text-pro);

/* Semantic borders */
--color-border-strong: var(--border-strong);
--color-border-accent: var(--border-accent);
--color-border-danger: var(--border-danger);
```

**Step A3 — Add design system alias block to `:root`**

After the existing `:root { ... }` block, append a new `:root` extension (or extend inline) that
defines the surface/text/bg/border aliases pointing at shadcn tokens and new semantic values:

```css
/* Design system semantic aliases — light mode */
:root {
    /* Surface scale (alias shadcn tokens) */
    --surface-0: var(--background);
    --surface-1: var(--muted);
    --surface-2: var(--card);
    --surface-3: var(--popover);

    /* Text aliases */
    --text-primary:   var(--foreground);
    --text-secondary: oklch(from var(--foreground) l c h / 65%);
    --text-muted:     var(--muted-foreground);
    --border-strong:  var(--input);
    --border-accent:  var(--ring);
    --border-danger:  var(--destructive);

    /* Semantic role colors — new tokens */
    --bg-accent:    oklch(0.95 0.04 250);
    --bg-success:   oklch(0.94 0.06 148);
    --bg-warning:   oklch(0.95 0.06 75);
    --bg-danger:    oklch(0.94 0.06 27);
    --bg-pro:       oklch(0.93 0.05 300);
    --bg-neutral:   oklch(0.94 0 0);
    --text-accent:  oklch(0.40 0.18 250);
    --text-success: oklch(0.40 0.18 148);
    --text-warning: oklch(0.42 0.16 75);
    --text-danger:  oklch(0.50 0.20 27);
    --text-pro:     oklch(0.42 0.16 300);
    --focus-shadow: 0 0 0 3px var(--bg-accent);
}
```

**Step A4 — Mirror aliases in `.dark`**

Extend the `.dark { }` block with dark-mode overrides for all new semantic tokens:

```css
.dark {
    /* ... existing shadcn dark tokens ... */
    --bg-accent:    oklch(0.25 0.06 250);
    --bg-success:   oklch(0.25 0.08 148);
    --bg-warning:   oklch(0.25 0.08 75);
    --bg-danger:    oklch(0.28 0.08 27);
    --bg-pro:       oklch(0.25 0.07 300);
    --bg-neutral:   oklch(0.22 0 0);
    --text-accent:  oklch(0.75 0.18 250);
    --text-success: oklch(0.75 0.15 148);
    --text-warning: oklch(0.78 0.14 75);
    --text-danger:  oklch(0.75 0.18 27);
    --text-pro:     oklch(0.78 0.14 300);
}
```

**Step A5 — Update `--radius` to align with design system**

The design system uses `6px` for buttons/inputs as the primary radius. The current `--radius`
is `0.625rem` (10px). The design system says:

| DS value | Usage |
|---|---|
| 2px | Dividers |
| 4px | Badges / pills |
| 6px | Buttons, inputs |
| 8px | Cards, dropdowns |
| 12px | Dialogs, panels |
| 99px | Pills, avatars |

The shadcn radius scale is calculated from `--radius`:
- `--radius-sm = --radius * 0.6`
- `--radius-md = --radius * 0.8`
- `--radius-lg = --radius` (base)
- `--radius-xl = --radius * 1.4`

Setting `--radius: 0.5rem` (8px) gives:
- `--radius-sm` = 4.8px ≈ **badges** ✓
- `--radius-md` = 6.4px ≈ **buttons/inputs** ✓
- `--radius-lg` = 8px = **cards** ✓
- `--radius-xl` = 11.2px ≈ **dialogs** ✓

**Proposed: change `--radius` from `0.625rem` to `0.5rem`.**

**Step A6 — Chart colors**

Update `--chart-1` through `--chart-5` from the current neutral grayscale to meaningful
semantic colors aligned with the analytics palette:

```css
/* Light */
--chart-1: oklch(0.60 0.18 250);  /* accent blue */
--chart-2: oklch(0.60 0.18 148);  /* success green */
--chart-3: oklch(0.60 0.18 75);   /* warning amber */
--chart-4: oklch(0.60 0.18 300);  /* pro purple */
--chart-5: oklch(0.60 0.18 27);   /* danger red */

/* Dark: same hue, slightly lighter lightness */
--chart-1: oklch(0.72 0.18 250);
/* ... etc */
```

**Step A7 — `@layer base` typography additions**

Extend the existing `@layer base` block to add:

```css
@layer base {
    /* ... existing * / body / html rules ... */

    /* Monospace class for salary amounts and employee IDs */
    .font-data {
        font-family: var(--font-mono);
        font-variant-numeric: tabular-nums;
        font-size: 0.8125rem; /* 13px */
    }

    /* Table row height per design system */
    table tr {
        min-height: 52px;
    }

    /* Table header height */
    table thead tr {
        height: 40px;
    }
}
```

**Step A8 — Typography scale classes**

Add utility classes for the design system's type scale to `@layer utilities`:

```css
@layer utilities {
    .text-display     { font-size: 1.875rem; font-weight: 500; line-height: 1.2; }
    .text-heading-lg  { font-size: 1.375rem; font-weight: 500; line-height: 1.3; }
    .text-heading-md  { font-size: 1.125rem; font-weight: 500; line-height: 1.4; }
    .text-heading-sm  { font-size: 0.9375rem; font-weight: 500; line-height: 1.4; }
    .text-body        { font-size: 0.875rem; font-weight: 400; line-height: 1.6; }
    .text-body-sm     { font-size: 0.8125rem; font-weight: 400; line-height: 1.5; }
    .text-caption     { font-size: 0.75rem; font-weight: 400; line-height: 1.5; }
}
```

---

### Phase B — Dark Mode Hook (`src/hooks/useDarkMode.ts`)

#### [NEW] `src/hooks/useDarkMode.ts`

A hook that:
1. Reads `localStorage.getItem('theme')` as the initial value (applies `rerender-lazy-state-init`
   skill rule — passes initialiser function to `useState` to avoid re-reading storage on re-renders).
2. Falls back to `window.matchMedia('prefers-color-scheme: dark')` if no stored preference.
3. Applies/removes the `.dark` class on `<html>` via a `useEffect` (the one case where an
   effect is correct — syncing to the DOM).
4. Exposes `{ isDark, toggle }`.

Skill rules applied:
- `rerender-lazy-state-init` — expensive storage read runs once as the initialiser
- `advanced-init-once` — media query listener registered once at module level

---

### Phase C — Providers + Router Wiring (`src/providers/QueryProvider.tsx`, `src/App.tsx`)

#### [NEW] `src/providers/QueryProvider.tsx`

Wraps:
- `QueryClientProvider` (TanStack Query)
- `ReactQueryDevtools` (dev only, `process.env.NODE_ENV !== 'production'`)
- `TooltipProvider` (required by shadcn tooltip — shadcn skill mandates wrapping at root)
- `Toaster` from `sonner`

Skill rules applied:
- `bundle-conditional` — devtools wrapped in `NODE_ENV` check so they are tree-shaken in prod
- `advanced-init-once` — `QueryClient` instance created outside the component (module level)

#### [MODIFY] `src/App.tsx`

Replace the default Vite scaffold with:

```tsx
<QueryProvider>
  <RouterProvider router={router} />
</QueryProvider>
```

The `router` is imported from `src/router/index.tsx` (Phase D).

---

### Phase D — Router (`src/router/index.tsx`)

#### [NEW] `src/router/index.tsx`

Uses `createBrowserRouter` + `createRoutesFromElements`. All feature routes are wrapped in
`AppLayout`. The implementation applies `bundle-dynamic-imports` — each page component is loaded
via `React.lazy()`:

```
/               → redirect to /dashboard
/dashboard      → lazy(() => DashboardPage)
/employees      → lazy(() => EmployeesPage)
/employees/:id  → lazy(() => EmployeeDetailPage)
/departments    → lazy(() => DepartmentsPage)
/roles          → lazy(() => RolesPage)
/analytics      → lazy(() => AnalyticsPage)
```

Each lazy boundary is wrapped in `<Suspense fallback={<PageSkeleton />}>` inside the layout,
following `async-suspense-boundaries` skill rule for streaming and perceived performance.

---

### Phase E — Application Layout (`src/layouts/AppLayout.tsx`)

#### [NEW] `src/layouts/AppLayout.tsx`

Provides the full shell: sidebar + header + main content. Uses the shadcn `SidebarProvider` /
`Sidebar` / `SidebarContent` components. Structure:

```
<SidebarProvider>
  <AppSidebar />             ← sidebar component
  <SidebarInset>             ← main content wrapper (shadcn primitive)
    <TopHeader />            ← 52px fixed top bar
    <main>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />           ← react-router outlet
      </Suspense>
    </main>
  </SidebarInset>
</SidebarProvider>
```

The `SidebarInset` component from shadcn handles the `margin-left` offset automatically when
sidebar expands/collapses — no manual responsive CSS needed.

---

### Phase F — Sidebar (`src/components/shared/AppSidebar.tsx`)

#### [NEW] `src/components/shared/AppSidebar.tsx`

Built entirely from shadcn `Sidebar*` primitives per the skill's composition rule
("use existing components before custom markup"):

```
<Sidebar>
  <SidebarHeader>
    Logo mark + "ACME Payroll" wordmark
  </SidebarHeader>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem> Dashboard </SidebarMenuItem>
        <SidebarMenuItem> Employees </SidebarMenuItem>
        <SidebarMenuItem> Analytics </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
    <SidebarGroup>
      <SidebarGroupLabel>Configure</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem> Departments </SidebarMenuItem>
        <SidebarMenuItem> Roles      </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  </SidebarContent>
  <SidebarFooter>
    Settings item
  </SidebarFooter>
</Sidebar>
```

Active state: uses `isActive` on `SidebarMenuButton`, driven by comparing `useLocation().pathname`
with each item's `href`.

Skill rules applied:
- Icons from `lucide-react` (project's configured `iconLibrary`)
- No `space-y-*` — `flex flex-col gap-*`
- Semantic color tokens only (`bg-sidebar-accent`, `text-sidebar-accent-foreground`)
- `Dialog`/`Sheet` with required `Title` for a11y compliance

---

### Phase G — Top Header (`src/components/shared/TopHeader.tsx`)

#### [NEW] `src/components/shared/TopHeader.tsx`

52px fixed header containing:
- `SidebarTrigger` (shadcn) — hamburger toggle for sidebar
- `Separator` (vertical, `orientation="vertical"`)
- `Breadcrumb` / `BreadcrumbList` / `BreadcrumbItem` — built from current route (derived during
  render from `useLocation()` — no effect, no state, `rerender-derived-state-no-effect`)
- Spacer (`flex-1`)
- Dark mode toggle button (icon-only, `ghost` variant, calls `useDarkMode().toggle`)
- Avatar circle showing initials "HR"

---

### Phase H — Shared Components (`src/components/shared/`)

The following components are scaffolded in this phase, using the design system tokens defined in
Phase A. These are the building blocks for all feature modules:

| Component | Description |
|---|---|
| `PageHeader.tsx` | Page title + subtitle + optional action slot |
| `DataTable.tsx` | Generic typed table with pagination skeleton |
| `StatusBadge.tsx` | `ACTIVE` / `DEACTIVE` → shadcn `Badge` with semantic colors |
| `TypeBadge.tsx` | `FULL_TIME` / `PART_TIME` / `CONTRACTOR` / `INTERN` → `Badge` |
| `EmptyState.tsx` | Uses shadcn `Empty` if available, else composed Card+icon |
| `ErrorState.tsx` | Error card with retry button |
| `ConfirmDialog.tsx` | Wraps shadcn `AlertDialog` — always includes `AlertDialogTitle` (a11y) |
| `CurrencyDisplay.tsx` | Renders salary with `.font-data` class (monospace, tabular nums) |
| `PageSkeleton.tsx` | Full-page loading skeleton for Suspense boundaries |

**shadcn composition rules applied throughout:**
- `Badge` not custom spans for status pills
- `Skeleton` not `animate-pulse` divs
- `AlertDialog` always has `AlertDialogTitle`
- `cn()` for all conditional class merging
- No `space-x-*` / `space-y-*` — `gap-*` only
- Icons: no sizing classes, use `data-icon` attribute on icon elements

---

## Implementation Order

```
Step 1:  Install `@fontsource-variable/geist-mono` (npm dep)
Step 2:  Update `src/index.css` — all token additions (A1–A8)
Step 3:  src/hooks/useDarkMode.ts
Step 4:  src/providers/QueryProvider.tsx
Step 5:  src/router/index.tsx (page stubs, lazy imports)
Step 6:  src/App.tsx (providers + router)
Step 7:  src/layouts/AppLayout.tsx
Step 8:  src/components/shared/AppSidebar.tsx
Step 9:  src/components/shared/TopHeader.tsx
Step 10: src/components/shared/PageHeader.tsx
Step 11: src/components/shared/PageSkeleton.tsx
Step 12: src/components/shared/DataTable.tsx
Step 13: src/components/shared/StatusBadge.tsx + TypeBadge.tsx
Step 14: src/components/shared/EmptyState.tsx + ErrorState.tsx
Step 15: src/components/shared/ConfirmDialog.tsx + CurrencyDisplay.tsx
Step 16: Smoke test — open browser, verify layout renders, sidebar toggles, dark mode works
```

---

## Verification Plan

### Automated
- `tsc --noEmit` — passes zero errors
- `npm run dev` — Vite builds and serves without errors

### Visual / Manual
- [ ] Light mode: all pages show correct surface/text/border contrast per design system
- [ ] Dark mode: toggle button switches `.dark` class; all semantic tokens adapt correctly
- [ ] Sidebar: collapses to icon rail on tablet (`< 1024px`); fully hides on mobile (`< 768px`)
- [ ] Active nav item highlights with `bg-sidebar-accent` / `text-sidebar-accent-foreground`
- [ ] Salary values in `CurrencyDisplay` render in Geist Mono (tabular numerals)
- [ ] Breadcrumb updates correctly when navigating between routes
- [ ] `tsc` clean, no unused imports (per `noUnusedLocals` tsconfig rule)
- [ ] All shadcn `Dialog`/`Sheet`/`AlertDialog` have accessible titles (axe check)
- [ ] Focus ring visible on all interactive elements
