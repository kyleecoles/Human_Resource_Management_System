// feat: login page UI - Sprint 1

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, Mail, Lock } from "lucide-react";
import { GoogleButton } from "@/components/GoogleButton";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Hope, Inc. HR" },
      { name: "description", content: "Sign in to the Hope, Inc. HR system." },
    ],
  }),
  component: LoginPage,
});

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!email) next.email = "Email is required";
    else if (!emailRe.test(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    else if (password.length < 6) next.password = "Password must be at least 6 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden bg-gradient-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 font-bold backdrop-blur">
            H
          </div>
          <span className="font-display text-lg font-semibold">Hope, Inc.</span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Welcome back to your people operations workspace.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            Sign in to manage employees, jobs and departments — all in one place.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">
          © {new Date().getFullYear()} Hope, Inc.
        </p>
      </div>

      {/* Right form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground font-bold">
              H
            </div>
            <span className="font-display font-semibold">Hope, Inc.</span>
          </Link>

          <h1 className="font-display text-3xl font-bold">Sign in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-8">
            <GoogleButton label="Sign in with Google" />
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              OR CONTINUE WITH EMAIL
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <Field
              label="Email"
              icon={<Mail className="h-4 w-4" />}
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              placeholder="you@hope.inc"
              autoComplete="email"
            />
            <Field
              label="Password"
              icon={<Lock className="h-4 w-4" />}
              type="password"
              value={password}
              onChange={setPassword}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {errors.form && (
              <p className="text-center text-sm text-destructive">{errors.form}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  error,
  icon,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <div
        className={`flex items-center gap-2 rounded-md border bg-card px-3 py-2 transition focus-within:ring-2 focus-within:ring-ring ${
          error ? "border-destructive" : "border-input"
        }`}
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
