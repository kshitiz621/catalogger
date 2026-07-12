"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { resolvePostAuthRedirect, ensureFreshOAuthSession, syncAuthEmailChange } from "@/components/auth/auth-utils";
import Link from "next/link";
import { Loader2, AlertCircle, Mail, Lock, Store, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginMode = "email" | "phone";

async function finishLogin(setError: (msg: string) => void) {
  const { data: session } = await authClient.getSession();
  syncAuthEmailChange(session?.user?.email);
  window.location.href = await resolvePostAuthRedirect();
  return true;
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

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await ensureFreshOAuthSession();

      const { error: socialError } = await authClient.signIn.social({
        provider: "google",
        callbackURL: `${window.location.origin}/auth/complete`,
      });

      if (socialError) {
        setError(socialError.message || "Google sign-in failed. Enable Google OAuth in Neon Console.");
        setLoading(false);
      }
    } catch {
      setError("Could not start Google sign-in.");
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const { error: otpError } = await authClient.phoneNumber.sendOtp({ phoneNumber });

      if (otpError) {
        setError(
          otpError.message ||
            "Phone sign-in is not configured. Enable the Phone Number plugin and SMS webhook in Neon Console."
        );
        return;
      }

      setOtpSent(true);
    } catch {
      setError("Could not send verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");

    try {
      const { error: verifyError } = await authClient.phoneNumber.verify({
        phoneNumber,
        code: otp,
      });

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code.");
        return;
      }

      await finishLogin(setError);
    } catch {
      setError("Could not verify code.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      let { error: signInError } = await authClient.signIn.email({
        email,
        password,
      });

      if (signInError) {
        const legacyRes = await fetch("/api/auth/legacy-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (legacyRes.ok) {
          ({ error: signInError } = await authClient.signIn.email({
            email,
            password,
          }));
        }
      }

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please try again.");
        return;
      }

      await finishLogin(setError);
    } catch {
      setError("Could not reach the auth server. Check Neon Auth env vars and restart the dev server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/[0.03] blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Sign in to your Catalogger account
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 rounded-lg border border-destructive/25 bg-destructive/8 px-3.5 py-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
              <p className="text-[12.5px] font-medium text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loading}
            onClick={handleGoogleSignIn}
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

          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("email");
                setError("");
                setOtpSent(false);
              }}
              className={`rounded-md px-3 py-2 text-[12px] font-medium transition-colors ${
                mode === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("phone");
                setError("");
              }}
              className={`rounded-md px-3 py-2 text-[12px] font-medium transition-colors ${
                mode === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              Phone
            </button>
          </div>

          {mode === "email" ? (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email-address" className="text-[13px] font-medium text-foreground">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email-address"
                    name="email"
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

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[13px] font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                  />
                </div>
              </div>

              <Button type="button" disabled={loading} className="w-full" onClick={handleEmailSubmit}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in with email"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone-number" className="text-[13px] font-medium text-foreground">
                  Phone number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone-number"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+919876543210"
                    className="pl-9"
                    disabled={otpSent}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">Use international format (E.164), e.g. +91…</p>
              </div>

              {otpSent && (
                <div className="space-y-1.5">
                  <Label htmlFor="otp" className="text-[13px] font-medium text-foreground">
                    Verification code
                  </Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                  />
                </div>
              )}

              <Button
                type="button"
                disabled={loading}
                className="w-full"
                onClick={otpSent ? handleVerifyOtp : handleSendOtp}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {otpSent ? "Verifying…" : "Sending code…"}
                  </>
                ) : otpSent ? (
                  "Verify and sign in"
                ) : (
                  "Send verification code"
                )}
              </Button>

              {otpSent && (
                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="w-full text-center text-[12px] font-medium text-primary hover:underline"
                >
                  Use a different phone number
                </button>
              )}
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[12.5px] text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
