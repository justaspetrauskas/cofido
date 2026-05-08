
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Recipe } from "@/lib/brewing";

export type BrewFeedback = "too-weak" | "perfect" | "too-strong";

export type ActiveBrew = {
  id: string;
  recipe: Recipe;
  startedAt: number;
  currentStepIndex: number;
  status: "brewing" | "paused";
  timerStartedAt: number | null;
  remainingTimerSeconds: number | null;
};

export type SavedRecipe = {
  id: string;
  name: string;
  createdAt: number;
  feedback: BrewFeedback | null;
  notes: string | null;
  recipe: Recipe;
};

export type CompletionSummary = {
  recipe: Recipe;
  startedAt: number;
  completedAt: number;
  feedback: BrewFeedback | null;
  notes: string | null;
};

type CoffeeState = {
  savedRecipes: SavedRecipe[];
  activeBrew: ActiveBrew | null;
  completionSummary: CompletionSummary | null;
};

type CoffeeActions = {
  startNewBrew: (recipe: Recipe, now?: number) => void;
  goToNextStep: (now?: number) => void;
  pauseBrew: (now?: number) => void;
  resumeBrew: (now?: number) => void;
  skipTimer: () => void;
  setCompletionFeedback: (feedback: BrewFeedback) => void;
  setCompletionNotes: (notes: string) => void;
  saveCompletedRecipe: (name?: string, now?: number) => void;
  dismissCompletion: () => void;
  clearActiveBrew: () => void;
  brewSavedRecipe: (savedRecipeId: string, now?: number) => void;
};

export type CoffeeStore = CoffeeState & CoffeeActions;

function getNow(now?: number) {
  return now ?? Date.now();
}

function createId(prefix: string, now?: number) {
  return `${prefix}-${getNow(now)}`;
}

export function getRemainingTimerSeconds(activeBrew: ActiveBrew | null, now = Date.now()) {
  if (!activeBrew) {
    return null;
  }

  if (activeBrew.remainingTimerSeconds === null) {
    return null;
  }

  if (!Number.isFinite(activeBrew.remainingTimerSeconds)) {
    return null;
  }

  if (activeBrew.status === "paused" || activeBrew.timerStartedAt === null) {
    return activeBrew.remainingTimerSeconds;
  }

  if (!Number.isFinite(activeBrew.timerStartedAt) || !Number.isFinite(now)) {
    return null;
  }

  const elapsed = Math.floor((now - activeBrew.timerStartedAt) / 1000);
  return Math.max(0, activeBrew.remainingTimerSeconds - elapsed);
}

function getStepTimerSeconds(recipe: Recipe, stepIndex: number) {
  return recipe.steps[stepIndex]?.timerSeconds ?? null;
}

function createActiveBrew(recipe: Recipe, now?: number): ActiveBrew {
  const timestamp = getNow(now);
  const firstStepTimerSeconds = getStepTimerSeconds(recipe, 0);

  return {
    id: createId("brew", timestamp),
    recipe,
    startedAt: timestamp,
    currentStepIndex: 0,
    status: "brewing",
    timerStartedAt: firstStepTimerSeconds ? timestamp : null,
    remainingTimerSeconds: firstStepTimerSeconds,
  };
}

function getSavedRecipeName(recipe: Recipe) {
  return `${recipe.methodLabel} for ${recipe.cups}`;
}

export function getDefaultCoffeeState(): CoffeeStore {
  return {
    savedRecipes: [],
    activeBrew: null,
    completionSummary: null,
    startNewBrew(recipe, now) {
      useCoffeeStore.setState({
        activeBrew: createActiveBrew(recipe, now),
        completionSummary: null,
      });
    },
    goToNextStep(now) {
      useCoffeeStore.setState((state) => {
        if (!state.activeBrew) {
          return state;
        }

        const nextStepIndex = state.activeBrew.currentStepIndex + 1;

        if (nextStepIndex >= state.activeBrew.recipe.steps.length) {
          return {
            ...state,
            activeBrew: null,
            completionSummary: {
              recipe: state.activeBrew.recipe,
              startedAt: state.activeBrew.startedAt,
              completedAt: getNow(now),
              feedback: null,
              notes: null,
            },
          };
        }

        const timestamp = getNow(now);
        const nextStepTimerSeconds = getStepTimerSeconds(state.activeBrew.recipe, nextStepIndex);

        return {
          ...state,
          activeBrew: {
            ...state.activeBrew,
            currentStepIndex: nextStepIndex,
            status: "brewing",
            timerStartedAt: nextStepTimerSeconds ? timestamp : null,
            remainingTimerSeconds: nextStepTimerSeconds,
          },
        };
      });
    },
    pauseBrew(now) {
      useCoffeeStore.setState((state) => {
        if (!state.activeBrew || state.activeBrew.status === "paused") {
          return state;
        }

        return {
          ...state,
          activeBrew: {
            ...state.activeBrew,
            status: "paused",
            timerStartedAt: null,
            remainingTimerSeconds: getRemainingTimerSeconds(state.activeBrew, getNow(now)),
          },
        };
      });
    },
    resumeBrew(now) {
      useCoffeeStore.setState((state) => {
        if (!state.activeBrew || state.activeBrew.status === "brewing") {
          return state;
        }

        const timestamp = getNow(now);
        const remainingTimerSeconds = getRemainingTimerSeconds(state.activeBrew, timestamp);

        return {
          ...state,
          activeBrew: {
            ...state.activeBrew,
            status: "brewing",
            timerStartedAt: remainingTimerSeconds ? timestamp : null,
            remainingTimerSeconds,
          },
        };
      });
    },
    skipTimer() {
      useCoffeeStore.setState((state) => {
        if (!state.activeBrew) {
          return state;
        }

        return {
          ...state,
          activeBrew: {
            ...state.activeBrew,
            timerStartedAt: null,
            remainingTimerSeconds: 0,
          },
        };
      });
    },
    setCompletionFeedback(feedback) {
      useCoffeeStore.setState((state) => {
        if (!state.completionSummary) {
          return state;
        }

        return {
          ...state,
          completionSummary: {
            ...state.completionSummary,
            feedback,
          },
        };
      });
    },
    setCompletionNotes(notes) {
      useCoffeeStore.setState((state) => {
        if (!state.completionSummary) {
          return state;
        }

        return {
          ...state,
          completionSummary: {
            ...state.completionSummary,
            notes,
          },
        };
      });
    },
    saveCompletedRecipe(name, now) {
      useCoffeeStore.setState((state) => {
        if (!state.completionSummary) {
          return state;
        }

        const savedRecipe: SavedRecipe = {
          id: createId("saved", now),
          name: name ?? getSavedRecipeName(state.completionSummary.recipe),
          createdAt: getNow(now),
          feedback: state.completionSummary.feedback,
          notes: state.completionSummary.notes,
          recipe: state.completionSummary.recipe,
        };

        return {
          ...state,
          savedRecipes: [savedRecipe, ...state.savedRecipes],
          completionSummary: null,
        };
      });
    },
    dismissCompletion() {
      useCoffeeStore.setState({ completionSummary: null });
    },
    clearActiveBrew() {
      useCoffeeStore.setState({ activeBrew: null });
    },
    brewSavedRecipe(savedRecipeId, now) {
      useCoffeeStore.setState((state) => {
        const savedRecipe = state.savedRecipes.find((recipe) => recipe.id === savedRecipeId);

        if (!savedRecipe) {
          return state;
        }

        return {
          ...state,
          activeBrew: createActiveBrew(savedRecipe.recipe, now),
          completionSummary: null,
        };
      });
    },
  };
}

export const useCoffeeStore = create<CoffeeStore>()(
  persist(
    () => getDefaultCoffeeState(),
    {
      name: "cofido-coffee-store",
      partialize: (state) => ({
        savedRecipes: state.savedRecipes,
        activeBrew: state.activeBrew,
        completionSummary: state.completionSummary,
      }),
    },
  ),
);
