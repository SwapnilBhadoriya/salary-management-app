/**
 * router/index.tsx
 *
 * Application route definitions using React Router v7.
 * Uses createBrowserRouter + createRoutesFromElements.
 *
 * Skill rules applied:
 *   - bundle-dynamic-imports: every page is React.lazy() so each route
 *     is a separate JS chunk — pages are only downloaded when first visited.
 *   - async-suspense-boundaries: Suspense is set in AppLayout so each
 *     lazy page boundary streams independently.
 *   - bundle-barrel-imports: each page imported directly from its source
 *     file path, never from an index barrel.
 */

import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';

// Lazy-loaded page components — each becomes its own JS chunk
const DashboardPage      = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const EmployeesPage      = lazy(() => import('@/features/employees/pages/EmployeesPage'));
const EmployeeDetailPage = lazy(() => import('@/features/employees/pages/EmployeeDetailPage'));
const DepartmentsPage    = lazy(() => import('@/features/departments/pages/DepartmentsPage'));
const RolesPage          = lazy(() => import('@/features/roles/pages/RolesPage'));
const AnalyticsPage      = lazy(() => import('@/features/analytics/pages/AnalyticsPage'));

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<AppLayout />}>
      {/* Default redirect */}
      <Route index element={<Navigate to="/dashboard" replace />} />

      {/* Main navigation */}
      <Route path="/dashboard"     element={<DashboardPage />} />
      <Route path="/employees"     element={<EmployeesPage />} />
      <Route path="/employees/:id" element={<EmployeeDetailPage />} />
      <Route path="/analytics"     element={<AnalyticsPage />} />

      {/* Configure section */}
      <Route path="/departments" element={<DepartmentsPage />} />
      <Route path="/roles"       element={<RolesPage />} />
    </Route>
  )
);
