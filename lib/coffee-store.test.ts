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
