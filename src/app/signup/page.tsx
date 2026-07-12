"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import {
  Loader2,
  AlertCircle,
  Store,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  Link2,
  CheckCircle2,
  XCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ensureAppSession,
  ensureFreshOAuthSession,
  getDashboardPath,
  signOutCompletely,
  syncAuthEmailChange,
} from "@/components/auth/auth-utils";

type AuthMode = "loading" | "full" | "oauth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignupPage() {
  const [authMode, setAuthMode] = useState<AuthMode>("loading");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [slugMessage, setSlugMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: session } = await authClient.getSession();

      if (!session?.user?.email) {
        setAuthMode("full");
        return;
      }

      syncAuthEmailChange(session.user.email);

      const { ok, role } = await ensureAppSession();
      if (ok) {
        window.location.href = getDashboardPath(role);
        return;
      }

      setAuthMode("oauth");
      setName(session.user.name || "");
      setEmail(session.user.email);
    }

    init();
  }, []);

  const handleBusinessNameChange = (value: string) => {
    setBusinessName(value);
    if (!slugTouched) {
      const generated = slugify(value);
      setStoreSlug(generated);
      if (generated.length >= 3) {
        checkSlugAvailability(generated);
      } else {
        setSlugStatus("idle");
        setSlugMessage("");
      }
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    const normalized = slugify(value);
    setStoreSlug(normalized);
    if (normalized.length >= 3) {
      checkSlugAvailability(normalized);
    } else {
      setSlugStatus("invalid");
      setSlugMessage("Slug must be at least 3 characters");
    }
  };

  const checkSlugAvailability = async (slug: string) => {
    setSlugStatus("checking");
    setSlugMessage("");

    try {
      const res = await fetch(`/api/store/check-slug?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();

      if (!res.ok) {
        setSlugStatus("invalid");
        setSlugMessage(data.message || "Invalid slug");
        return;
      }

      if (data.available) {
        setSlugStatus("available");
        setSlugMessage("This store URL is available");
      } else {
        setSlugStatus("taken");
        setSlugMessage(data.message || "This store URL is already taken");
      }
    } catch {
      setSlugStatus("idle");
      setSlugMessage("");
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      await ensureFreshOAuthSession();

      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/complete`,
      });

      if (socialError) {
        setError(socialError.message || "Google sign-up failed. Enable Google OAuth in Neon Console.");
        setLoading(false);
      }
    } catch {
      setError("Could not start Google sign-up.");
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setError("");

    try {
      await signOutCompletely("/signup");
    } catch {
      setError("Could not sign out. Please try again.");
      setSigningOut(false);
    }
  };

  const submitStoreSetup = async (ownerName: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ownerName,
        businessName,
        whatsappNumber,
        storeSlug,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create store");
    }

    window.location.href = "/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (slugStatus === "taken" || slugStatus === "invalid") {
      setError(slugMessage || "Please choose a valid, available store URL");
      setLoading(false);
      return;
    }

    try {
      if (authMode === "oauth") {
        const { data: session } = await authClient.getSession();
        if (!session?.user?.email) {
          throw new Error("Your session expired. Please sign in again.");
        }
        await submitStoreSetup(name);
        return;
      }

      const { data: existingSession } = await authClient.getSession();
      if (
        existingSession?.user?.email &&
        existingSession.user.email.toLowerCase() !== email.toLowerCase()
      ) {
        await ensureFreshOAuthSession();
      }

      const { error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (signUpError) {
        throw new Error(signUpError.message || "Failed to create auth account");
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          businessName,
          whatsappNumber,
          storeSlug,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create store");
      }

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (authMode === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const isOAuth = authMode === "oauth";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            {isOAuth ? "Set up your store" : "Start your free store"}
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {isOAuth ? (
              <>
                Signed in as <span className="font-medium text-foreground">{email}</span>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
                  Sign in
                </Link>
              </>
            )}
          </p>
          {isOAuth && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-3 text-muted-foreground"
              disabled={loading || signingOut}
              onClick={handleSignOut}
            >
              {signingOut ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing out…
                </>
              ) : (
                <>
                  <LogOut className="h-4 w-4" />
                  Sign out and use a different account
                </>
              )}
            </Button>
          )}
        </div>

        <form
          className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="flex items-center gap-2.5 rounded-lg border border-destructive/25 bg-destructive/8 px-3.5 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              <p className="text-[12.5px] font-medium text-destructive">{error}</p>
            </div>
          )}

          {!isOAuth && (
            <>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={loading}
                onClick={handleGoogleSignup}
              >
                <GoogleIcon />
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-[11px] uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
            </>
          )}

          {!isOAuth && (
            <div className="space-y-4">
              <h2 className="text-[13px] font-semibold text-foreground border-b border-border pb-2">
                Account
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Owner Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          )}

          {isOAuth && (
            <div className="space-y-1.5">
              <Label htmlFor="oauth-name">Owner Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="oauth-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="pl-9"
                />
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-[13px] font-semibold text-foreground border-b border-border pb-2">
              Store
            </h2>

            <div className="space-y-1.5">
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="businessName"
                  required
                  value={businessName}
                  onChange={(e) => handleBusinessNameChange(e.target.value)}
                  placeholder="My Awesome Store"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="storeSlug">Store Slug</Label>
              <div className="flex rounded-lg shadow-sm">
                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-input bg-muted px-3 text-[11px] text-muted-foreground">
                  /store/
                </span>
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="storeSlug"
                    required
                    value={storeSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    placeholder="my-awesome-store"
                    className="rounded-l-none pl-9 font-mono text-[13px]"
                  />
                </div>
              </div>
              {slugStatus !== "idle" && (
                <p
                  className={`flex items-center gap-1.5 text-[11px] ${
                    slugStatus === "available"
                      ? "text-emerald-600"
                      : slugStatus === "checking"
                        ? "text-muted-foreground"
                        : "text-destructive"
                  }`}
                >
                  {slugStatus === "checking" && <Loader2 className="h-3 w-3 animate-spin" />}
                  {slugStatus === "available" && <CheckCircle2 className="h-3 w-3" />}
                  {(slugStatus === "taken" || slugStatus === "invalid") && (
                    <XCircle className="h-3 w-3" />
                  )}
                  {slugStatus === "checking" ? "Checking availability…" : slugMessage}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="whatsapp"
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  placeholder="919876543210"
                  className="pl-9"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Include country code, digits only (e.g. 919876543210)
              </p>
            </div>
          </div>

          <Button type="submit" disabled={loading || slugStatus === "taken"} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isOAuth ? "Creating your store…" : "Creating account & store…"}
              </>
            ) : isOAuth ? (
              "Create my store"
            ) : (
              "Create account & store"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
