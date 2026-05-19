// feat: register page UI - Sprint 1
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, User, AtSign, Mail, Lock } from "lucide-react";
import { GoogleButton } from "@/components/GoogleButton";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — Hope, Inc. HR" },
      { name: "description", content: "Register for the Hope, Inc. HR system." },
    ],
  }),
  component: RegisterPage,
});

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "Required";
    if (!form.lastName.trim()) next.lastName = "Required";
    if (!form.username.trim()) next.username = "Required";
    else if (form.username.length < 3) next.username = "At least 3 characters";
    if (!form.email) next.email = "Required";
    else if (!emailRe.test(form.email)) next.email = "Invalid email";
    if (!form.password) next.password = "Required";
    else if (form.password.length < 8) next.password = "At least 8 characters";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-primary text-primary-foreground font-bold">
              H
            </div>
            <span className="font-display font-semibold">Hope, Inc.</span>
          </Link>

          <h1 className="font-display text-3xl font-bold">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already a member?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>

          <div className="mt-8">
            <GoogleButton label="Register with Google" />
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              OR REGISTER WITH EMAIL
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" icon={<User className="h-4 w-4" />} value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
              <Field label="Last name" icon={<User className="h-4 w-4" />} value={form.lastName} onChange={set("lastName")} error={errors.lastName} />
            </div>
            <Field label="Username" icon={<AtSign className="h-4 w-4" />} value={form.username} onChange={set("username")} error={errors.username} />
            <Field label="Email" type="email" icon={<Mail className="h-4 w-4" />} value={form.email} onChange={set("email")} error={errors.email} />
            <Field label="Password" type="password" icon={<Lock className="h-4 w-4" />} value={form.password} onChange={set("password")} error={errors.password} />

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant transition hover:opacity-95 disabled:opacity-70"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>

      <div className="relative hidden bg-gradient-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-end">
        <div>
          <h2 className="font-display text-4xl font-bold leading-tight">
            Join the team behind Hope, Inc.
          </h2>
          <p className="mt-4 max-w-md text-primary-foreground/80">
            One workspace for employees, jobs, departments and everything in between.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
  error,
  icon,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  icon?: React.ReactNode;
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
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
