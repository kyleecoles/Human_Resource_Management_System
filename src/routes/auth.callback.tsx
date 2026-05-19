// feat: auth callback page UI - Sprint 1

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Signing you in… — Hope, Inc. HR" }],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">Establishing your session…</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We're securely signing you in to the Hope, Inc. HR workspace. This will only take a moment.
        </p>
      </div>
    </div>
  );
}
