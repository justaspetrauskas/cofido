import { describe, expect, it } from "vitest";

import { BREW_METHODS, createRecipe, formatTimer, getMissingRequiredEquipment } from "@/lib/brewing";

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
    expect(recipe.focusVariables).toEqual([
      "Bloom time: 30-45s even saturation",
      "Pour flow: steady circles with gentle pulses",
      "Drawdown target: finish in 2:45-3:30",
    ]);
    expect(recipe.diagnostics).toEqual([
      "Drawdown too fast: grind finer or slow the pour.",
      "Drawdown too slow: grind coarser or reduce agitation.",
      "Uneven bed: reset to centered pours for the next pulse.",
    ]);
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
    expect(recipe.focusVariables).toEqual([
      "Steep time: 60-90s before pressing",
      "Press speed: 20-30s gentle pressure",
      "Bypass water: dilute after press to taste",
    ]);
    expect(recipe.diagnostics).toEqual([
      "Cup tastes sharp: steep longer or use hotter water.",
      "Cup tastes bitter: shorten steep or press sooner.",
      "Press stalls: coarsen grind slightly and avoid overpacking.",
    ]);
  });

  it("adapts grind and heat guidance when grinder and kettle are not available", () => {
    const recipe = createRecipe({
      method: "pour-over",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: ["filters"],
    });

    expect(recipe.steps.find((step) => step.title === "Heat water")?.instruction).toBe(
      "Use hot water from a dispenser or pre-boiled source to stay on pace.",
    );
    expect(recipe.steps.find((step) => step.title === "Grind beans")?.instruction).toBe(
      "Use pre-ground coffee and keep the dose consistent for your next cup.",
    );
  });

  it("adapts grind guidance for espresso when no grinder is available", () => {
    const recipe = createRecipe({
      method: "espresso",
      cups: 1,
      skillLevel: "beginner",
      strength: 55,
      equipment: [],
    });

    expect(recipe.steps.find((step) => step.title === "Grind beans")?.instruction).toBe(
      "Use pre-ground coffee and keep the dose consistent for your next cup.",
    );
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

describe("getMissingRequiredEquipment", () => {
  it("returns the missing required items for the selected method", () => {
    expect(getMissingRequiredEquipment("pour-over", [])).toEqual(["kettle", "filters"]);
    expect(getMissingRequiredEquipment("pour-over", ["kettle"])).toEqual(["filters"]);
    expect(getMissingRequiredEquipment("aeropress", ["kettle"])).toEqual([]);
  });

  it("returns an empty list for methods that do not require tracked equipment", () => {
    expect(getMissingRequiredEquipment("cold-brew", [])).toEqual([]);
  });

  it("covers every configured brew method and returns stable defaults", () => {
    const allMethods = BREW_METHODS.map((method) => method.id);

    expect(allMethods).toEqual(["pour-over", "french-press", "aeropress", "espresso", "cold-brew"]);
    expect(allMethods.map((method) => getMissingRequiredEquipment(method, []))).toEqual([
      ["kettle", "filters"],
      ["kettle"],
      ["kettle"],
      ["grinder"],
      [],
    ]);
  });
});
