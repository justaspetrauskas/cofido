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
} {
  switch (method) {
    case "pour-over":
      return {
        label: "Pour-over",
        waterTemperatureC: 95,
        grindSize: "Medium-fine",
        steps: [
          { title: "Heat water", instruction: "Warm fresh water to a gentle boil.", visual: "steam" },
          { title: "Grind beans", instruction: "Grind the coffee just finer than sand.", visual: "grinder" },
          { title: "Rinse filter", instruction: "Rinse the filter and warm the brewer.", visual: "kettle" },
          { title: "Add coffee", instruction: "Add the grounds and level the bed.", visual: "beans" },
          { title: "Bloom", instruction: "Wet every ground and let it breathe.", visual: "steam", timerSeconds: 30 },
          { title: "Pour in circles", instruction: "Pour slowly in calm, even circles.", visual: "kettle", timerSeconds: 90 },
          { title: "Let it draw down", instruction: "Allow the final drips to settle.", visual: "cup", timerSeconds: 60 },
          { title: "Serve", instruction: "Swirl, pour, and take the first sip slowly.", visual: "cup" },
        ],
      };
    case "french-press":
      return {
        label: "French Press",
        waterTemperatureC: 94,
        grindSize: "Coarse",
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
        steps: [
          { title: "Heat water", instruction: "Warm water to a soft simmer.", visual: "steam" },
          { title: "Grind beans", instruction: "Grind slightly finer than drip coffee.", visual: "grinder" },
          { title: "Add coffee", instruction: "Add coffee to the AeroPress chamber.", visual: "beans" },
          { title: "Bloom", instruction: "Add a splash of water and stir once.", visual: "steam", timerSeconds: 15 },
          { title: "Press", instruction: "Press smoothly until you hear the hiss.", visual: "cup", timerSeconds: 30 },
          { title: "Serve", instruction: "Dilute to taste and enjoy the clarity.", visual: "cup" },
        ],
      };
    case "espresso":
      return {
        label: "Espresso",
        waterTemperatureC: 93,
        grindSize: "Fine",
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

export function createRecipe(config: RecipeConfig): Recipe {
  const strength = clampStrength(config.strength);
  const ratio = getRatioFromStrength(strength);
  const waterMl = config.cups * WATER_PER_CUP_ML;
  const coffeeGrams = Math.round(waterMl / ratio);
  const methodDefinition = getMethodDefinition(config.method);
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
    steps: methodDefinition.steps,
  };
}
