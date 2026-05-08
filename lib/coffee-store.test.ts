import { beforeEach, describe, expect, it } from "vitest";

import { createRecipe } from "@/lib/brewing";
import { getDefaultCoffeeState, getRemainingTimerSeconds, useCoffeeStore } from "@/lib/coffee-store";

describe("coffee store", () => {
  beforeEach(() => {
    localStorage.clear();
    useCoffeeStore.setState(getDefaultCoffeeState(), true);
  });

  it("preserves the remaining timer when a brew is paused and resumed", () => {
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 60,
      equipment: ["kettle"],
    });

    const store = useCoffeeStore.getState();

    store.startNewBrew(recipe, 1_000);
    store.goToNextStep(1_000);
    store.goToNextStep(1_000);
    store.goToNextStep(1_000);
    store.goToNextStep(1_000);

    expect(useCoffeeStore.getState().activeBrew?.currentStepIndex).toBe(4);
    expect(useCoffeeStore.getState().activeBrew?.remainingTimerSeconds).toBe(45);

    store.pauseBrew(11_000);

    expect(useCoffeeStore.getState().activeBrew?.remainingTimerSeconds).toBe(35);
    expect(useCoffeeStore.getState().activeBrew?.status).toBe("paused");

    store.resumeBrew(21_000);

    expect(useCoffeeStore.getState().activeBrew?.timerStartedAt).toBe(21_000);
    expect(useCoffeeStore.getState().activeBrew?.remainingTimerSeconds).toBe(35);
    expect(useCoffeeStore.getState().activeBrew?.status).toBe("brewing");
  });

  it("stores notes on the completion summary via setCompletionNotes", () => {
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      completionSummary: {
        recipe,
        startedAt: 1_000,
        completedAt: 2_000,
        feedback: null,
        notes: null,
      },
    });

    useCoffeeStore.getState().setCompletionNotes("Ethiopian beans, slightly finer grind.");

    expect(useCoffeeStore.getState().completionSummary?.notes).toBe(
      "Ethiopian beans, slightly finer grind.",
    );
  });

  it("saves notes with the recipe when saveCompletedRecipe is called", () => {
    const recipe = createRecipe({
      method: "aeropress",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: ["kettle"],
    });

    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      completionSummary: {
        recipe,
        startedAt: 1_000,
        completedAt: 2_000,
        feedback: "perfect",
        notes: "Washed beans, 30s extra steep.",
      },
    });

    useCoffeeStore.getState().saveCompletedRecipe();

    const saved = useCoffeeStore.getState().savedRecipes[0];
    expect(saved?.notes).toBe("Washed beans, 30s extra steep.");
  });

  it("saves a recipe with null notes when no notes were entered", () => {
    const recipe = createRecipe({
      method: "french-press",
      cups: 2,
      skillLevel: "beginner",
      strength: 55,
      equipment: ["kettle"],
    });

    useCoffeeStore.setState({
      ...getDefaultCoffeeState(),
      completionSummary: {
        recipe,
        startedAt: 1_000,
        completedAt: 2_000,
        feedback: null,
        notes: null,
      },
    });

    useCoffeeStore.getState().saveCompletedRecipe();

    const saved = useCoffeeStore.getState().savedRecipes[0];
    expect(saved?.notes).toBeNull();
  });

  it("treats invalid persisted timer values as no active timer", () => {
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 60,
      equipment: ["kettle"],
    });

    expect(
      getRemainingTimerSeconds({
        id: "brew-1",
        recipe,
        startedAt: 1_000,
        currentStepIndex: 4,
        status: "brewing",
        timerStartedAt: Number.NaN,
        remainingTimerSeconds: Number.NaN,
      }),
    ).toBeNull();
  });
});
