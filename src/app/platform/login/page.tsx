"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, Mail, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PlatformLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const sessionRes = await fetch("/api/auth/app-session");
      const sessionData = sessionRes.ok ? await sessionRes.json() : null;

      if (!sessionData?.user || sessionData.user.role !== "SUPER_ADMIN") {
        await authClient.signOut();
        setError("This account does not have platform admin access.");
        return;
      }

      router.push("/platform/dashboard");
      router.refresh();
    } catch {
      setError("Could not reach the auth server. Check Neon Auth env vars and restart the dev server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12">
      <div className="relative w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 shadow-sm">
            <ShieldCheck className="h-5 w-5 text-zinc-100" />
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-zinc-100">
            Platform Admin
          </h1>
          <p className="mt-1 text-[13px] text-zinc-400">
            Sign in to access super admin controls
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Error alert */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-900/50 bg-red-900/20 px-3.5 py-3">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                <p className="text-[12.5px] font-medium text-red-500">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email-address" className="text-[13px] font-medium text-zinc-200">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@catalogger.com"
                  className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[13px] font-medium text-zinc-200">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-700"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="mt-1 w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
              size="default"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Authenticating…
                </>
              ) : (
                "Authenticate"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
