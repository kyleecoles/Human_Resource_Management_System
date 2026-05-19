// feat: OAuth callback — exchanges code for session, runs login guard

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ title: "Signing you in… — Hope, Inc. HR" }],
  }),
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const exchange = async () => {
      // Exchange the OAuth code in the URL for a session
      const { data, error: sessionError } =
        await supabase.auth.exchangeCodeForSession(window.location.href);

      if (sessionError || !data.session) {
        setError("Sign-in failed. Please try again.");
        setTimeout(() => navigate({ to: "/login" }), 2500);
        return;
      }

      // Login guard — check record_status in app_user table
      const userId = data.session.user.id;
      const { data: appUser } = await supabase
        .from("app_user")
        .select("record_status")
        .eq("auth_id", userId)
        .single();

      if (appUser?.record_status !== "ACTIVE") {
        await supabase.auth.signOut();
        navigate({
          to: "/login",
          search: { error: "Your account is inactive. Contact your HR admin." },
        });
        return;
      }

      navigate({ to: "/employees" });
    };

    exchange();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <p className="text-sm text-destructive">{error}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Redirecting to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero bg-background px-6">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-semibold">
          Establishing your session…
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We're securely signing you in to the Hope, Inc. HR workspace. This
          will only take a moment.
        </p>
      </div>
    </div>
  );
}