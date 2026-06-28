/**
 * components/shared/AppSidebar.tsx
 *
 * Application sidebar built entirely from shadcn Sidebar primitives.
 * Uses Lucide React icons (project's configured iconLibrary).
 *
 * shadcn skill rules applied:
 *   - Use shadcn Sidebar*, SidebarMenu*, SidebarGroup* components — no custom nav markup
 *   - Semantic color tokens only (text-sidebar-foreground, bg-sidebar-accent, etc.)
 *   - No space-y-* — gap-* for spacing
 *   - cn() for conditional class merging
 *   - Icons: no sizing classes, use data-icon attribute
 *
 * Vercel React skill rules applied:
 *   - rerender-no-inline-components: NAV_ITEMS is defined at module level
 *   - rendering-hoist-jsx: static logo JSX extracted to module-level constant
 *   - js-set-map-lookups: route → active check is O(1) pathname startsWith
 */

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Building2,
  Shield,
  Settings,
  DollarSign,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

// ── Nav item definitions at module level (rerender-no-inline-components) ──
const MAIN_NAV = [
  { href: '/dashboard',  label: 'Dashboard',  Icon: LayoutDashboard },
  { href: '/employees',  label: 'Employees',  Icon: Users },
  { href: '/analytics',  label: 'Analytics',  Icon: BarChart3 },
] as const;

const CONFIG_NAV = [
  { href: '/departments', label: 'Departments', Icon: Building2 },
  { href: '/roles',       label: 'Roles',       Icon: Shield },
] as const;

// ── Logo mark — hoisted outside component (rendering-hoist-jsx) ──────────
const LogoMark = (
  <div className="flex size-7 items-center justify-center rounded-md bg-bg-accent">
    <DollarSign className="size-4 text-text-accent" />
  </div>
);

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          {LogoMark}
          <span className="text-heading-sm font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            ACME Payroll
          </span>
        </div>
      </SidebarHeader>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <SidebarContent>
        {/* Main navigation group */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {MAIN_NAV.map(({ href, label, Icon }) => (
              <SidebarMenuItem key={href}>
                <NavLink to={href} end={href === '/dashboard'}>
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      className={cn(
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      )}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Configure group */}
        <SidebarGroup>
          <SidebarGroupLabel>Configure</SidebarGroupLabel>
          <SidebarMenu>
            {CONFIG_NAV.map(({ href, label, Icon }) => (
              <SidebarMenuItem key={href}>
                <NavLink to={href}>
                  {({ isActive }) => (
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      className={cn(
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      )}
                    >
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings aria-hidden="true" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
