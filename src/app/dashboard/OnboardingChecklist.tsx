"use client";

import { useState } from "react";
import { CheckCircle2, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateOnboardingProgress } from "@/lib/actions/seller.actions";
import type { OnboardingState } from "@/types/onboarding";

interface OnboardingChecklistProps {
  onboarding?: OnboardingState;
}

export default function OnboardingChecklist({ onboarding }: OnboardingChecklistProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissing, setIsDismissing] = useState(false);

  if (!onboarding?.steps?.length) {
    return null;
  }

  const { steps, completedCount, progressPercent, allCompleted } = onboarding;

  const handleDismiss = async () => {
    if (isDismissing) return;
    setIsDismissing(true);

    try {
      if (allCompleted) {
        await updateOnboardingProgress(steps.length, true);
      }
      setIsVisible(false);
    } catch (error) {
      console.error("Failed to dismiss onboarding", error);
    } finally {
      setIsDismissing(false);
    }
  };

  if (!isVisible || onboarding.onboardingCompleted) {
    return null;
  }

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/10">
        <div
          className="h-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        disabled={isDismissing}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss onboarding"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="mb-5">
        <h2 className="text-[15px] font-semibold text-foreground tracking-tight">
          Getting started with Catalogger
        </h2>
        <p className="text-[12px] text-muted-foreground mt-1">
          Complete these steps to launch your store ({completedCount}/{steps.length} done)
        </p>
      </div>

      <div className="space-y-2">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => !step.completed && router.push(step.href)}
            disabled={step.completed}
            className={`w-full flex items-center justify-between rounded-lg border p-4 text-left transition-all ${
              step.completed
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-border bg-card hover:border-primary/30 hover:shadow-sm cursor-pointer"
            }`}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                className={`h-5 w-5 mt-0.5 shrink-0 ${
                  step.completed ? "text-emerald-600" : "text-muted-foreground/40"
                }`}
              />
              <div>
                <h3
                  className={`text-[13px] font-semibold ${
                    step.completed ? "text-emerald-800" : "text-foreground"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-[11px] mt-0.5 ${
                    step.completed ? "text-emerald-700" : "text-muted-foreground"
                  }`}
                >
                  {step.description}
                </p>
              </div>
            </div>
            {!step.completed && (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
