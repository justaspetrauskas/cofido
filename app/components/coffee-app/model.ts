import {
  BREW_METHODS,
  formatDuration,
  type BrewMethod,
  type Equipment,
  type Recipe,
  type RecipeConfig,
  type StepVisual,
} from "@/lib/brewing";
import type { BrewFeedback, CompletionSummary, SavedRecipe } from "@/lib/coffee-store";

export type Screen = "landing" | "method" | "compose" | "brewing" | "completion" | "dashboard";
export type AmbientSceneVariant = "landing" | "composer" | "brewing" | "completion";
export type QuickTaste = "bright" | "balanced" | "bold";
export type QuickTime = "3-min" | "10-min" | "overnight";
export type QuickSetup = "no-scale" | "have-kettle" | "full-kit";

export type BrewRecommendation = {
  badge: string;
  config: Omit<RecipeConfig, "method">;
  method: BrewMethod;
  note: string;
  summary: string;
  title: string;
};

export const DEFAULT_CONFIG: Omit<RecipeConfig, "method"> = {
  cups: 1,
  skillLevel: "beginner",
  strength: 55,
  equipment: [],
};

export const FEEDBACK_OPTIONS: Array<{ value: BrewFeedback; label: string }> = [
  { value: "too-weak", label: "Too weak" },
  { value: "perfect", label: "Perfect" },
  { value: "too-strong", label: "Too strong" },
];

export const VISUAL_LABELS: Record<StepVisual, string> = {
  beans: "Bean sphere",
  grinder: "Grinder cube",
  kettle: "Kettle cylinder",
  cup: "Cup form",
  steam: "Steam lines",
};

export const BREW_RATIO_PRESETS = [
  {
    description: "Brighter cup with a lighter body.",
    label: "Bright",
    ratioLabel: "1:17",
    strength: 20,
  },
  {
    description: "Balanced sweetness and clarity.",
    label: "Balanced",
    ratioLabel: "1:16",
    strength: 55,
  },
  {
    description: "Bolder body with a tighter ratio.",
    label: "Bold",
    ratioLabel: "1:15",
    strength: 80,
  },
] as const;

export const QUICK_TASTE_OPTIONS: Array<{ value: QuickTaste; label: string }> = [
  { value: "bright", label: "Bright" },
  { value: "balanced", label: "Balanced" },
  { value: "bold", label: "Bold" },
];

export const QUICK_TIME_OPTIONS: Array<{ value: QuickTime; label: string }> = [
  { value: "3-min", label: "3 min" },
  { value: "10-min", label: "10 min" },
  { value: "overnight", label: "Overnight" },
];

export const QUICK_SETUP_OPTIONS: Array<{ value: QuickSetup; label: string }> = [
  { value: "no-scale", label: "No scale" },
  { value: "have-kettle", label: "Have kettle" },
  { value: "full-kit", label: "Full kit" },
];

const QUICK_START_EQUIPMENT: Record<QuickSetup, Equipment[]> = {
  "no-scale": [],
  "have-kettle": ["kettle"],
  "full-kit": ["grinder", "kettle", "scale", "filters"],
};

const METHOD_DECISION_DETAILS: Record<
  BrewMethod,
  { gear: string; profile: string; time: string }
> = {
  "pour-over": {
    gear: "Kettle + filter",
    profile: "Clarity first",
    time: "10 min ritual",
  },
  "french-press": {
    gear: "Press + kettle",
    profile: "Body forward",
    time: "8 min ritual",
  },
  aeropress: {
    gear: "Kettle + AeroPress",
    profile: "Flexible balance",
    time: "3 min ritual",
  },
  espresso: {
    gear: "Machine ready",
    profile: "Bold and focused",
    time: "3 min ritual",
  },
  "cold-brew": {
    gear: "Jar + time",
    profile: "Smooth and mellow",
    time: "Overnight",
  },
};

export function getInitialScreen(hasHistory: boolean): Screen {
  return hasHistory ? "dashboard" : "landing";
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getCurrentStep(recipe: Recipe | null, stepIndex: number) {
  if (!recipe) {
    return null;
  }

  return recipe.steps[stepIndex] ?? null;
}

export function getBrewRatioPreset(strength: number) {
  if (strength >= 75) {
    return BREW_RATIO_PRESETS[2];
  }

  if (strength <= 35) {
    return BREW_RATIO_PRESETS[0];
  }

  return BREW_RATIO_PRESETS[1];
}

function getStrengthForTaste(taste: QuickTaste) {
  if (taste === "bright") {
    return 20;
  }

  if (taste === "bold") {
    return 80;
  }

  return 55;
}

function getMethodForQuickStart({
  setup,
  taste,
  time,
}: {
  setup: QuickSetup;
  taste: QuickTaste;
  time: QuickTime;
}): BrewMethod {
  if (time === "overnight") {
    return "cold-brew";
  }

  if (time === "3-min") {
    if (taste === "bold" && setup === "full-kit") {
      return "espresso";
    }

    return "aeropress";
  }

  if (taste === "bright" && setup !== "no-scale") {
    return "pour-over";
  }

  if (taste === "bold") {
    return "french-press";
  }

  return setup === "no-scale" ? "french-press" : "pour-over";
}

function getQuickStartSetupPhrase(setup: QuickSetup) {
  if (setup === "full-kit") {
    return "with your full kit";
  }

  if (setup === "have-kettle") {
    return "with a kettle";
  }

  return "without a scale";
}

function getQuickStartTastePhrase(taste: QuickTaste) {
  if (taste === "bold") {
    return "bold";
  }

  if (taste === "bright") {
    return "bright";
  }

  return "balanced";
}

function getQuickStartTimeLabel(time: QuickTime) {
  return QUICK_TIME_OPTIONS.find((option) => option.value === time)?.label ?? "10 min";
}

export function getQuickStartRecommendation({
  setup,
  taste,
  time,
}: {
  setup: QuickSetup;
  taste: QuickTaste;
  time: QuickTime;
}): BrewRecommendation {
  const method = getMethodForQuickStart({ setup, taste, time });
  const strength = getStrengthForTaste(taste);

  return {
    badge: "Quick pick",
    config: {
      cups: 1,
      equipment: QUICK_START_EQUIPMENT[setup],
      skillLevel: "beginner",
      strength,
    },
    method,
    note: `Recommended for ${getQuickStartTastePhrase(taste)} coffee in ${getQuickStartTimeLabel(time)} ${getQuickStartSetupPhrase(setup)}.`,
    summary: `${getQuickStartTimeLabel(time)} · ${capitalize(getQuickStartTastePhrase(taste))}`,
    title: "Quick start recommendation",
  };
}

function getAdjustedStrength(strength: number, feedback: BrewFeedback) {
  if (feedback === "too-weak") {
    return Math.min(100, strength + 25);
  }

  if (feedback === "too-strong") {
    return Math.max(0, strength - 25);
  }

  return strength;
}

export function getAdaptiveRecommendation(
  savedRecipes: SavedRecipe[],
  completionSummary?: CompletionSummary | null,
): BrewRecommendation | null {
  const latestFeedbackSource =
    completionSummary?.feedback !== null && completionSummary?.feedback !== undefined
      ? {
          createdAt: completionSummary.completedAt,
          feedback: completionSummary.feedback,
          name: `${completionSummary.recipe.methodLabel} for ${completionSummary.recipe.cups}`,
          recipe: completionSummary.recipe,
        }
      : savedRecipes.find((recipe) => recipe.feedback && recipe.feedback !== "perfect");

  if (!latestFeedbackSource || !latestFeedbackSource.feedback || latestFeedbackSource.feedback === "perfect") {
    return null;
  }

  const strength = getAdjustedStrength(latestFeedbackSource.recipe.strength, latestFeedbackSource.feedback);
  const ratioLabel = getBrewRatioPreset(strength).ratioLabel;
  const feedbackNote =
    latestFeedbackSource.feedback === "too-weak"
      ? "Adjusted after your last cup felt too weak."
      : "Adjusted after your last cup felt too strong.";

  return {
    badge: "Next brew",
    config: {
      cups: latestFeedbackSource.recipe.cups,
      equipment: latestFeedbackSource.recipe.equipment,
      skillLevel: latestFeedbackSource.recipe.skillLevel,
      strength,
    },
    method: latestFeedbackSource.recipe.method,
    note: feedbackNote,
    summary: `Try ${latestFeedbackSource.name} at ${ratioLabel} next.`,
    title: "Recommended next brew",
  };
}

export function getRecentWin(savedRecipes: SavedRecipe[]) {
  return savedRecipes.find((recipe) => recipe.feedback === "perfect") ?? null;
}

export function getMethodDecisionDetails(method: BrewMethod) {
  return METHOD_DECISION_DETAILS[method];
}

export function getRemainingGuidedTime(
  recipe: Recipe,
  currentStepIndex: number,
  remainingTimerSeconds: number | null,
) {
  return recipe.steps.reduce((total, step, index) => {
    if (index < currentStepIndex) {
      return total;
    }

    if (index === currentStepIndex) {
      return total + (remainingTimerSeconds ?? step.timerSeconds ?? 0);
    }

    return total + (step.timerSeconds ?? 0);
  }, 0);
}

export function getRemainingGuidedTimeLabel(
  recipe: Recipe,
  currentStepIndex: number,
  remainingTimerSeconds: number | null,
) {
  return formatDuration(getRemainingGuidedTime(recipe, currentStepIndex, remainingTimerSeconds));
}

export function getNextStepTitle(recipe: Recipe, currentStepIndex: number) {
  return recipe.steps[currentStepIndex + 1]?.title ?? null;
}

export function getRecoveryMessage(recipe: Recipe, currentStepIndex: number) {
  const currentStep = recipe.steps[currentStepIndex];
  const nextStepTitle = getNextStepTitle(recipe, currentStepIndex);

  if (!currentStep) {
    return null;
  }

  if (!nextStepTitle) {
    return `You are on the final step. Cue: ${currentStep.instruction}`;
  }

  return `Finish ${currentStep.title.toLowerCase()}, then move to ${nextStepTitle}. Cue: ${currentStep.instruction}`;
}

export function isBrewMethod(value: string | null): value is BrewMethod {
  if (!value) {
    return false;
  }

  return BREW_METHODS.some((method) => method.id === value);
}

export function isScreen(value: string | null): value is Screen {
  return value === "landing" ||
    value === "method" ||
    value === "compose" ||
    value === "brewing" ||
    value === "completion" ||
    value === "dashboard";
}

export function getMethodIndex(method: BrewMethod | null) {
  if (!method) {
    return 0;
  }

  const index = BREW_METHODS.findIndex((item) => item.id === method);
  return index === -1 ? 0 : index;
}
