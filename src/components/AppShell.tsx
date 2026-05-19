// feat: app shell UI - Sprint 1
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  History,
  Briefcase,
  Building2,
  ShieldCheck,
  Trash2,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  LayoutDashboard,
} from "lucide-react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/job-history", label: "Job History", icon: History },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/departments", label: "Departments", icon: Building2 },
  { to: "/admin", label: "Admin", icon: ShieldCheck },
  { to: "/deleted", label: "Deleted Items", icon: Trash2 },
] as const;

export function AppShell({ children, title }: { children: React.ReactNode; title: string }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const user = { name: "Alex Morgan", email: "alex@hope.inc", initials: "AM" };

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold">
          H
        </div>
        <div>
          <div className="font-display text-sm font-semibold leading-none">Hope, Inc.</div>
          <div className="text-[11px] text-sidebar-foreground/60">HR System</div>
        </div>
      </div>
      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {NAV.map((item) => {
          const active = path === item.to || path.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-elegant"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {item.to === "/deleted" && (
                <span className="ml-auto rounded bg-sidebar-accent px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-sidebar-foreground/70">
                  Sprint 2
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-sidebar-accent text-sm font-semibold">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{user.name}</div>
            <div className="truncate text-xs text-sidebar-foreground/60">{user.email}</div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">{Sidebar}</div>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0">{Sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur md:px-6">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-md border border-border lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <h1 className="font-display text-lg font-semibold">{title}</h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm md:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search…"
                className="w-48 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button className="grid h-9 w-9 place-items-center rounded-md border border-border hover:bg-secondary">
              <Bell className="h-4 w-4" />
            </button>

            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-2 py-1 sm:flex">
              <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-primary text-xs font-semibold text-primary-foreground">
                {user.initials}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>

            <button
              onClick={() => navigate({ to: "/login" })}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
