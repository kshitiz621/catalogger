"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type StrengthResult = { label: string; color: string; textColor: string; width: string };

function getPasswordStrength(pw: string): StrengthResult {
  if (pw.length === 0) return { label: "", color: "bg-border", textColor: "", width: "0%" };
  if (pw.length < 6) return { label: "Too short", color: "bg-destructive", textColor: "text-destructive", width: "15%" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", color: "bg-destructive", textColor: "text-destructive", width: "30%" };
  if (score === 2) return { label: "Fair", color: "bg-warning", textColor: "text-warning", width: "50%" };
  if (score === 3) return { label: "Good", color: "bg-success", textColor: "text-success", width: "70%" };
  return { label: "Strong", color: "bg-success", textColor: "text-success", width: "100%" };
}

export default function PasswordChangeForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(newPassword);
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
      if (!res.ok) throw new Error(data.message || "Something went wrong");
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
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm" id="password-change-form">
      {/* Current Password */}
      <div className="space-y-1.5">
        <Label htmlFor="current-password" className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-primary" />
          Current Password
        </Label>
        <div className="relative">
          <Input
            type={showCurrent ? "text" : "password"}
            id="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showCurrent ? "Hide password" : "Show password"}
          >
            {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <Label htmlFor="new-password" className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          New Password
        </Label>
        <div className="relative">
          <Input
            type={showNew ? "text" : "password"}
            id="new-password"
            required
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="pr-9"
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            aria-label={showNew ? "Hide password" : "Show password"}
          >
            {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Strength indicator */}
        {newPassword.length > 0 && (
          <div className="space-y-1 pt-0.5">
            <div className="h-1 w-full rounded-full bg-border overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            <p className={`text-[11px] font-medium ${strength.textColor}`}>
              {strength.label}
            </p>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground">
          Use 8+ characters with uppercase, numbers, and symbols.
        </p>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        id="update-password-btn"
        disabled={!canSubmit}
        size="sm"
      >
        {loading ? (
          <><Loader2 className="h-4 w-4 animate-spin" />Updating…</>
        ) : (
          <><ShieldCheck className="h-4 w-4" />Update Password</>
        )}
      </Button>
    </form>
  );
}
