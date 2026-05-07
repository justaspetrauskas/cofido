import { describe, expect, it } from "vitest";

import { createRecipe, formatTimer } from "@/lib/brewing";

describe("createRecipe", () => {
  it("builds a stronger two-cup pour-over recipe with a longer V60-style bloom", () => {
    const recipe = createRecipe({
      method: "pour-over",
      cups: 2,
      skillLevel: "beginner",
      strength: 80,
      equipment: ["grinder", "kettle", "scale"],
    });

    expect(recipe.methodLabel).toBe("Pour-over");
    expect(recipe.coffeeGrams).toBe(32);
    expect(recipe.waterMl).toBe(480);
    expect(recipe.ratioLabel).toBe("1:15");
    expect(recipe.waterTemperatureC).toBe(95);
    expect(recipe.grindSize).toBe("Medium-fine");
    expect(recipe.steps.map((step) => step.title)).toEqual([
      "Heat water",
      "Grind beans",
      "Rinse filter",
      "Add coffee",
      "Bloom",
      "Pour in circles",
      "Let it draw down",
      "Serve",
    ]);
    expect(recipe.steps.find((step) => step.title === "Bloom")?.timerSeconds).toBe(45);
    expect(recipe.totalTimeSeconds).toBe(210);
  });

  it("uses a fuller AeroPress steep-and-press timing flow", () => {
    const recipe = createRecipe({
      method: "aeropress",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: ["kettle"],
    });

    expect(recipe.steps.map((step) => step.title)).toEqual([
      "Heat water",
      "Grind beans",
      "Add coffee",
      "Bloom",
      "Steep",
      "Press",
      "Serve",
    ]);
    expect(recipe.steps.find((step) => step.title === "Bloom")?.timerSeconds).toBe(30);
    expect(recipe.steps.find((step) => step.title === "Steep")?.timerSeconds).toBe(60);
    expect(recipe.steps.find((step) => step.title === "Press")?.timerSeconds).toBe(30);
    expect(recipe.totalTimeSeconds).toBe(120);
  });
});

describe("formatTimer", () => {
  it("renders long brew timers with hours instead of overflowing minutes", () => {
    expect(formatTimer(43_200)).toBe("12:00:00");
    expect(formatTimer(3_661)).toBe("01:01:01");
  });

  it("falls back cleanly when a timer value is invalid", () => {
    expect(formatTimer(Number.NaN)).toBe("00:00");
  });
});
