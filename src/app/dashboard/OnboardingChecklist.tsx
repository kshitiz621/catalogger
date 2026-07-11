"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateOnboardingProgress } from "@/lib/actions/seller.actions";
import { Store } from "@prisma/client";

interface OnboardingChecklistProps {
  store: Store;
}

export default function OnboardingChecklist({ store }: OnboardingChecklistProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Define steps dynamically based on store state, but we also use onboardingStep
  const steps = [
    {
      id: 1,
      title: "Add your first product",
      description: "Start building your catalog to share with customers.",
      href: "/dashboard/products",
      completed: store.onboardingStep >= 1, // If they have manually completed it
    },
    {
      id: 2,
      title: "Customize your store",
      description: "Upload a logo and pick your brand colors.",
      href: "/dashboard/settings",
      completed: store.onboardingStep >= 2,
    },
    {
      id: 3,
      title: "Set up WhatsApp",
      description: "Ensure customers can contact you easily.",
      href: "/dashboard/settings",
      completed: !!store.whatsappNumber,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);
  const allCompleted = completedCount === steps.length;

  const handleCompleteStep = async (stepId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUpdating) return;
    setIsUpdating(true);

    try {
      const isLastStep = stepId === steps.length;
      await updateOnboardingProgress(stepId, isLastStep);
      
      if (isLastStep) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Failed to update onboarding progress", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isVisible || store.onboardingCompleted) {
    return null;
  }

  return (
    <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50/50 p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-blue-100">
        <div 
          className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors"
      >
        <X size={20} />
      </button>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">Getting Started with Catalogger</h2>
        <p className="text-sm text-gray-600 mt-1">
          Complete these steps to get the most out of your store. ({completedCount}/{steps.length} completed)
        </p>
      </div>

      <div className="space-y-3">
        {steps.map((step) => (
          <div 
            key={step.id}
            onClick={() => !step.completed && router.push(step.href)}
            className={`group flex items-center justify-between rounded-lg border p-4 transition-all ${
              step.completed 
                ? "border-green-200 bg-green-50" 
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm cursor-pointer"
            }`}
          >
            <div className="flex items-start gap-4">
              <button 
                onClick={(e) => !step.completed && handleCompleteStep(step.id, e)}
                disabled={step.completed || isUpdating}
                className="mt-0.5 flex-shrink-0 focus:outline-none"
              >
                {step.completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300 group-hover:text-blue-400 transition-colors" />
                )}
              </button>
              <div>
                <h3 className={`text-sm font-semibold ${step.completed ? "text-green-800" : "text-gray-900"}`}>
                  {step.title}
                </h3>
                <p className={`text-xs mt-1 ${step.completed ? "text-green-700" : "text-gray-500"}`}>
                  {step.description}
                </p>
              </div>
            </div>
            {!step.completed && (
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-transform group-hover:translate-x-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
