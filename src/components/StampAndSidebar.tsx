// feat/rights-stamp-sidebar — Sprint 2
// (A) StampCell — hides stamp column for USER
// (B) Sidebar link gating — hides Deleted Items and Admin links for USER
// (C) ProtectedAdminRoute — blocks /deleted-items for USER at the route level

import { type ReactNode } from "react";
import { Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

// ─── (A) Stamp column ─────────────────────────────────────────────────────────
// Usage in table <th>/<td>:
//   <StampHeader />
//   <StampCell value={row.stamp} />

export function StampHeader() {
  const { currentUser } = useAuth();
  if (currentUser?.user_type === "USER") return null;
  return <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">Stamp</th>;
}

interface StampCellProps {
  value: string | null;
}

export function StampCell({ value }: StampCellProps) {
  const { currentUser } = useAuth();
  if (currentUser?.user_type === "USER") return null;
  return (
    <td className="whitespace-nowrap px-4 py-2 text-sm text-muted-foreground">
      {value ?? "—"}
    </td>
  );
}

// ─── (B) Sidebar link gating ──────────────────────────────────────────────────
// Drop these into your sidebar component in place of the raw <Link> elements.

interface SidebarLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

function NavLink({ to, children, className }: SidebarLinkProps) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

/** Sidebar link for Deleted Items — hidden for USER */
export function DeletedItemsLink() {
  const { currentUser } = useAuth();
  if (currentUser?.user_type === "USER") return null;
  return (
    <NavLink
      to="/deleted-items"
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
    >
      Deleted Items
    </NavLink>
  );
}

/** Sidebar link for Admin — hidden for USER */
export function AdminLink() {
  const { currentUser } = useAuth();
  if (currentUser?.user_type === "USER") return null;
  return (
    <NavLink
      to="/admin"
      className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
    >
      Admin
    </NavLink>
  );
}

// ─── (C) Route guard for /deleted-items ───────────────────────────────────────
// Wrap the /deleted-items route element with this component in your router setup.
//
// Example in router config:
//   { path: '/deleted-items', element: <ProtectedAdminRoute><DeletedItemsPage /></ProtectedAdminRoute> }

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { currentUser, loading } = useAuth();

  // Wait for auth to resolve before deciding
  if (loading) return null;

  if (!currentUser || currentUser.user_type === "USER") {
    return <Navigate to="/employees" />;
  }

  return <>{children}</>;
}