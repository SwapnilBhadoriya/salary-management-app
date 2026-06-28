/**
 * App.tsx
 *
 * Root component. Mounts providers and the router.
 * No UI logic lives here — this is purely a composition root.
 */

import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/providers/QueryProvider';
import { router } from '@/router/index';
import './index.css';

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
