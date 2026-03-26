"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length === 0) return { label: "", color: "bg-border", width: "0%" };
  if (pw.length < 6) return { label: "Too short", color: "bg-red-500", width: "15%" };

  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", width: "30%" };
  if (score === 2) return { label: "Fair", color: "bg-amber-500", width: "50%" };
  if (score === 3) return { label: "Good", color: "bg-emerald-400", width: "70%" };
  return { label: "Strong", color: "bg-emerald-500", width: "100%" };
}

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const canSubmit = currentPassword.length > 0 && newPassword.length >= 6 && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);

    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl" id="password-change-form">
      {/* Current Password */}
      <div className="group">
        <label htmlFor="current-password" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
          <Lock className="w-4 h-4 text-primary" />
          Current Password
        </label>
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            id="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="block w-full rounded-xl border border-border bg-secondary/40 shadow-sm
              focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white
              text-sm px-4 py-2.5 pr-11 text-foreground placeholder:text-muted-foreground/60
              transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="group">
        <label htmlFor="new-password" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" />
          New Password
        </label>
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            id="new-password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="block w-full rounded-xl border border-border bg-secondary/40 shadow-sm
              focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-white
              text-sm px-4 py-2.5 pr-11 text-foreground placeholder:text-muted-foreground/60
              transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength Bar */}
        {newPassword.length > 0 && (
          <div className="mt-2.5 space-y-1">
            <div className="h-1.5 w-full rounded-full bg-border overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <p className={`text-xs font-medium ${
              strength.label === "Too short" || strength.label === "Weak"
                ? "text-red-600"
                : strength.label === "Fair"
                  ? "text-amber-600"
                  : "text-emerald-600"
            }`}>
              {strength.label}
            </p>
          </div>
        )}
        <p className="mt-1.5 text-xs text-muted-foreground">
          Use 8+ characters with uppercase, numbers, and symbols for a strong password.
        </p>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          id="update-password-btn"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-xl
            bg-primary text-primary-foreground
            px-5 py-2.5 text-sm font-semibold shadow-md
            hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02]
            focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2
            disabled:opacity-50 disabled:pointer-events-none
            transition-all duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating…
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              Update Password
            </>
          )}
        </button>
      </div>
    </form>
  );
}
