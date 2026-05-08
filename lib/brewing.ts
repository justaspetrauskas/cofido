export type BrewMethod =
  | "pour-over"
  | "french-press"
  | "aeropress"
  | "espresso"
  | "cold-brew";

export type SkillLevel = "beginner" | "intermediate" | "advanced";
export type Equipment = "grinder" | "kettle" | "scale" | "filters";
export type CupSize = 1 | 2 | 4;
export type StepVisual = "beans" | "grinder" | "kettle" | "cup" | "steam";

export type RecipeConfig = {
  method: BrewMethod;
  cups: CupSize;
  skillLevel: SkillLevel;
  strength: number;
  equipment: Equipment[];
};

export type BrewStep = {
  title: string;
  instruction: string;
  visual: StepVisual;
  timerSeconds?: number;
};

export type Recipe = RecipeConfig & {
  methodLabel: string;
  coffeeGrams: number;
  waterMl: number;
  ratio: number;
  ratioLabel: string;
  grindSize: string;
  waterTemperatureC: number;
  totalTimeSeconds: number;
  steps: BrewStep[];
  focusVariables: string[];
  diagnostics: string[];
};

export const BREW_METHODS: Array<{
  id: BrewMethod;
  label: string;
  description: string;
}> = [
  {
    id: "pour-over",
    label: "Pour-over",
    description: "Bright, clear, and gentle for slow mornings.",
  },
  {
    id: "french-press",
    label: "French Press",
    description: "Full-bodied and forgiving with a soft ritual pace.",
  },
  {
    id: "aeropress",
    label: "AeroPress",
    description: "Balanced and quick with room to experiment.",
  },
  {
    id: "espresso",
    label: "Espresso",
    description: "Focused, short, and bold.",
  },
  {
    id: "cold-brew",
    label: "Cold Brew",
    description: "Smooth and mellow for patient planning.",
  },
];

export const SKILL_LEVELS: SkillLevel[] = ["beginner", "intermediate", "advanced"];
export const EQUIPMENT_OPTIONS: Equipment[] = ["grinder", "kettle", "scale", "filters"];
export const CUP_SIZES: CupSize[] = [1, 2, 4];

const WATER_PER_CUP_ML = 240;
const METHOD_REQUIRED_EQUIPMENT: Record<BrewMethod, Equipment[]> = {
  "pour-over": ["kettle", "filters"],
  "french-press": ["kettle"],
  aeropress: ["kettle"],
  espresso: ["grinder"],
  "cold-brew": [],
};

function clampStrength(strength: number) {
  return Math.max(0, Math.min(100, Math.round(strength)));
}

function getRatioFromStrength(strength: number) {
  if (strength >= 75) {
    return 15;
  }

  if (strength <= 35) {
    return 17;
  }

  return 16;
}

function getMethodDefinition(method: BrewMethod): {
  label: string;
  waterTemperatureC: number;
  grindSize: string;
  steps: BrewStep[];
  focusVariables: string[];
  diagnostics: string[];
} {
  switch (method) {
    case "pour-over":
      return {
        label: "Pour-over",
        waterTemperatureC: 95,
        grindSize: "Medium-fine",
        focusVariables: [
          "Bloom time: 30-45s even saturation",
          "Pour flow: steady circles with gentle pulses",
          "Drawdown target: finish in 2:45-3:30",
        ],
        diagnostics: [
          "Drawdown too fast: grind finer or slow the pour.",
          "Drawdown too slow: grind coarser or reduce agitation.",
          "Uneven bed: reset to centered pours for the next pulse.",
        ],
        steps: [
          { title: "Heat water", instruction: "Warm fresh water to a gentle boil.", visual: "steam" },
          { title: "Grind beans", instruction: "Grind the coffee just finer than sand.", visual: "grinder" },
          { title: "Rinse filter", instruction: "Rinse the filter and warm the brewer.", visual: "kettle" },
          { title: "Add coffee", instruction: "Add the grounds and level the bed.", visual: "beans" },
          { title: "Bloom", instruction: "Wet every ground and let it breathe.", visual: "steam", timerSeconds: 45 },
          { title: "Pour in circles", instruction: "Pour slowly in calm, even circles.", visual: "kettle", timerSeconds: 120 },
          { title: "Let it draw down", instruction: "Allow the final drips to settle.", visual: "cup", timerSeconds: 45 },
          { title: "Serve", instruction: "Swirl, pour, and take the first sip slowly.", visual: "cup" },
        ],
      };
    case "french-press":
      return {
        label: "French Press",
        waterTemperatureC: 94,
        grindSize: "Coarse",
        focusVariables: [
          "Steep time: 4:00 baseline with full immersion",
          "Crust break: stir gently after steeping",
          "Plunge pace: 15-20s with light pressure",
        ],
        diagnostics: [
          "Cup feels thin: extend steep by 30s.",
          "Cup tastes bitter: steep shorter or grind coarser.",
          "Too much sediment: decant immediately after press.",
        ],
        steps: [
          { title: "Heat water", instruction: "Bring water just off the boil.", visual: "steam" },
          { title: "Grind beans", instruction: "Use a coarse grind for a clean press.", visual: "grinder" },
          { title: "Add coffee", instruction: "Place the grounds in the press.", visual: "beans" },
          { title: "Pour water", instruction: "Saturate all the grounds with care.", visual: "kettle", timerSeconds: 20 },
          { title: "Steep", instruction: "Let the coffee rest before pressing.", visual: "steam", timerSeconds: 240 },
          { title: "Press slowly", instruction: "Lower the plunger with steady pressure.", visual: "cup", timerSeconds: 20 },
          { title: "Serve", instruction: "Pour right away to keep the cup balanced.", visual: "cup" },
        ],
      };
    case "aeropress":
      return {
        label: "AeroPress",
        waterTemperatureC: 92,
        grindSize: "Medium",
        focusVariables: [
          "Steep time: 60-90s before pressing",
          "Press speed: 20-30s gentle pressure",
          "Bypass water: dilute after press to taste",
        ],
        diagnostics: [
          "Cup tastes sharp: steep longer or use hotter water.",
          "Cup tastes bitter: shorten steep or press sooner.",
          "Press stalls: coarsen grind slightly and avoid overpacking.",
        ],
        steps: [
          { title: "Heat water", instruction: "Warm water to a soft simmer.", visual: "steam" },
          { title: "Grind beans", instruction: "Grind slightly finer than drip coffee.", visual: "grinder" },
          { title: "Add coffee", instruction: "Add coffee to the AeroPress chamber.", visual: "beans" },
          { title: "Bloom", instruction: "Add a splash of water and stir once.", visual: "steam", timerSeconds: 30 },
          { title: "Steep", instruction: "Top up, cap, and let the brew rest briefly.", visual: "steam", timerSeconds: 60 },
          { title: "Press", instruction: "Press smoothly until you hear the hiss.", visual: "cup", timerSeconds: 30 },
          { title: "Serve", instruction: "Dilute to taste and enjoy the clarity.", visual: "cup" },
        ],
      };
    case "espresso":
      return {
        label: "Espresso",
        waterTemperatureC: 93,
        grindSize: "Fine",
        focusVariables: [
          "Dose and yield: keep ratio near 1:2",
          "Shot time target: 25-30s",
          "Puck prep: even distribution and level tamp",
        ],
        diagnostics: [
          "Shot runs fast: grind finer or increase dose.",
          "Shot runs slow: grind coarser or reduce dose.",
          "Sour then bitter swings: improve puck prep consistency.",
        ],
        steps: [
          { title: "Warm the cup", instruction: "Preheat the cup for a softer landing.", visual: "cup" },
          { title: "Grind beans", instruction: "Grind finely for a slow, even extraction.", visual: "grinder" },
          { title: "Tamp evenly", instruction: "Tamp flat and keep the puck level.", visual: "beans" },
          { title: "Pull the shot", instruction: "Extract until the stream turns pale.", visual: "steam", timerSeconds: 30 },
          { title: "Serve", instruction: "Sip while the crema is still alive.", visual: "cup" },
        ],
      };
    case "cold-brew":
      return {
        label: "Cold Brew",
        waterTemperatureC: 20,
        grindSize: "Coarse",
        focusVariables: [
          "Steep window: 12-16 hours refrigerated",
          "Brew style: concentrate then dilute to taste",
          "Grind size: coarse for cleaner filtering",
        ],
        diagnostics: [
          "Cup tastes weak: steep longer or use less dilution.",
          "Cup tastes harsh: shorten steep or dilute more.",
          "Cloudy finish: strain through a finer filter once more.",
        ],
        steps: [
          { title: "Grind beans", instruction: "Use a coarse grind for a smooth finish.", visual: "grinder" },
          { title: "Add coffee", instruction: "Add grounds to a jar or brewer.", visual: "beans" },
          { title: "Add water", instruction: "Cover fully and stir until saturated.", visual: "kettle" },
          { title: "Rest cold", instruction: "Leave it in the fridge overnight.", visual: "steam", timerSeconds: 43_200 },
          { title: "Strain", instruction: "Filter slowly for a clear concentrate.", visual: "cup" },
          { title: "Serve", instruction: "Dilute, pour over ice, and enjoy.", visual: "cup" },
        ],
      };
  }
}

export function formatDuration(totalSeconds: number) {
  if (totalSeconds >= 3600) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.round((totalSeconds % 3600) / 60);
    return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds}s`;
}

export function formatTimer(totalSeconds: number) {
  const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
  const hours = Math.floor(safeSeconds / 3600);
  const minutesWithHours = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours.toString().padStart(2, "0")}:${minutesWithHours}:${seconds}`;
  }

  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

export function getMissingRequiredEquipment(method: BrewMethod, equipment: Equipment[]) {
  return METHOD_REQUIRED_EQUIPMENT[method].filter((requiredEquipment) => !equipment.includes(requiredEquipment));
}

function adaptStepsForEquipment(steps: BrewStep[], equipment: Equipment[]) {
  const hasGrinder = equipment.includes("grinder");
  const hasKettle = equipment.includes("kettle");

  return steps.map((step) => {
    if (step.title === "Grind beans" && !hasGrinder) {
      return {
        ...step,
        instruction: "Use pre-ground coffee and keep the dose consistent for your next cup.",
      };
    }

    if (step.title === "Heat water" && !hasKettle) {
      return {
        ...step,
        instruction: "Use hot water from a dispenser or pre-boiled source to stay on pace.",
      };
    }

    return step;
  });
}

export function createRecipe(config: RecipeConfig): Recipe {
  const strength = clampStrength(config.strength);
  const ratio = getRatioFromStrength(strength);
  const waterMl = config.cups * WATER_PER_CUP_ML;
  const coffeeGrams = Math.round(waterMl / ratio);
  const methodDefinition = getMethodDefinition(config.method);
  const steps = adaptStepsForEquipment(methodDefinition.steps, config.equipment);
  const totalTimeSeconds = methodDefinition.steps.reduce(
    (sum, step) => sum + (step.timerSeconds ?? 0),
    0,
  );

  return {
    ...config,
    strength,
    methodLabel: methodDefinition.label,
    coffeeGrams,
    waterMl,
    ratio,
    ratioLabel: `1:${ratio}`,
    grindSize: methodDefinition.grindSize,
    waterTemperatureC: methodDefinition.waterTemperatureC,
    totalTimeSeconds,
    steps,
    focusVariables: methodDefinition.focusVariables,
    diagnostics: methodDefinition.diagnostics,
  };
}
