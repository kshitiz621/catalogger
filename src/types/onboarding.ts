import type { StoreRecord } from "@/lib/prisma-compat";

export type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  href: string;
  completed: boolean;
};

export type OnboardingState = {
  steps: OnboardingStep[];
  completedCount: number;
  progressPercent: number;
  allCompleted: boolean;
  onboardingCompleted: boolean;
  store: StoreRecord;
};

export const DEFAULT_STORE_THEME = {
  themeColor: "#E11D48",
  fontFamily: "Inter",
  fontSize: "medium",
  fontWeight: "semibold",
  cardRadius: "lg",
  productsPerRow: 4,
  showCategoryImages: false,
  categoryImageStyle: "square",
} as const;

export const DEFAULT_CATEGORY_NAME = "General";
