import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { type PanInfo } from "framer-motion";

import {
  BREW_METHODS,
  createRecipe,
  getMissingRequiredEquipment,
  type BrewMethod,
  type Equipment,
} from "@/lib/brewing";
import { getRemainingTimerSeconds, useCoffeeStore } from "@/lib/coffee-store";

import {
  DEFAULT_CONFIG,
  getAdaptiveRecommendation,
  getCurrentStep,
  getInitialScreen,
  getMethodIndex,
  getRecentWin,
  getRecoveryMessage,
  getRemainingGuidedTimeLabel,
  getQuickStartRecommendation,
  isBrewMethod,
  isScreen,
  type BrewRecommendation,
  type QuickSetup,
  type QuickTaste,
  type QuickTime,
  type Screen,
} from "./model";

export function useCoffeeAppState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const savedRecipes = useCoffeeStore((state) => state.savedRecipes);
  const activeBrew = useCoffeeStore((state) => state.activeBrew);
  const completionSummary = useCoffeeStore((state) => state.completionSummary);
  const startNewBrew = useCoffeeStore((state) => state.startNewBrew);
  const goToNextStep = useCoffeeStore((state) => state.goToNextStep);
  const pauseBrew = useCoffeeStore((state) => state.pauseBrew);
  const resumeBrew = useCoffeeStore((state) => state.resumeBrew);
  const skipTimer = useCoffeeStore((state) => state.skipTimer);
  const setCompletionFeedback = useCoffeeStore((state) => state.setCompletionFeedback);
  const setCompletionNotes = useCoffeeStore((state) => state.setCompletionNotes);
  const saveCompletedRecipe = useCoffeeStore((state) => state.saveCompletedRecipe);
  const dismissCompletion = useCoffeeStore((state) => state.dismissCompletion);
  const clearActiveBrew = useCoffeeStore((state) => state.clearActiveBrew);
  const brewSavedRecipe = useCoffeeStore((state) => state.brewSavedRecipe);

  const hasHistory = savedRecipes.length > 0 || Boolean(activeBrew);
  const [selectedMethodState, setSelectedMethodState] = useState<BrewMethod | null>(null);
  const [methodIndex, setMethodIndex] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [guidedRecommendation, setGuidedRecommendation] = useState<BrewRecommendation | null>(null);
  const [quickTaste, setQuickTaste] = useState<QuickTaste>("balanced");
  const [quickTime, setQuickTime] = useState<QuickTime>("10-min");
  const [quickSetup, setQuickSetup] = useState<QuickSetup>("have-kettle");
  const [clockNow, setClockNow] = useState(() => Date.now());
  const routeScreen = searchParams.get("view");
  const routeMethod = searchParams.get("method");

  useEffect(() => {
    if (!activeBrew || activeBrew.status !== "brewing") {
      return;
    }

    const intervalId = window.setInterval(() => {
      setClockNow(Date.now());
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, [activeBrew]);

  useEffect(() => {
    if (!completionSummary || routeScreen === "completion") {
      return;
    }

    const params = new URLSearchParams(searchParamsString);
    params.set("view", "completion");
    params.delete("method");

    const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(href, { scroll: false });
  }, [completionSummary, pathname, routeScreen, router, searchParamsString]);

  const selectedMethod = isBrewMethod(routeMethod) ? routeMethod : selectedMethodState;
  const activeMethodIndex = isBrewMethod(routeMethod) ? getMethodIndex(routeMethod) : methodIndex;

  const previewRecipe = useMemo(() => {
    if (!selectedMethod) {
      return null;
    }

    return createRecipe({
      method: selectedMethod,
      ...config,
    });
  }, [config, selectedMethod]);

  const remainingTimerSeconds = getRemainingTimerSeconds(activeBrew, clockNow);
  const currentBrewStep = activeBrew
    ? getCurrentStep(activeBrew.recipe, activeBrew.currentStepIndex)
    : null;
  const adaptiveRecommendation = useMemo(
    () => getAdaptiveRecommendation(savedRecipes, completionSummary),
    [completionSummary, savedRecipes],
  );
  const recentWin = useMemo(() => getRecentWin(savedRecipes), [savedRecipes]);
  const fallbackScreen = getInitialScreen(hasHistory);

  const visibleScreen: Screen = completionSummary
    ? "completion"
    : routeScreen === "compose"
      ? selectedMethod
        ? "compose"
        : "method"
      : routeScreen === "brewing"
        ? activeBrew
          ? "brewing"
          : fallbackScreen
        : routeScreen === "dashboard"
          ? hasHistory
            ? "dashboard"
            : fallbackScreen
          : isScreen(routeScreen)
            ? routeScreen
            : fallbackScreen;

  const needsTimerToFinish =
    activeBrew &&
    currentBrewStep?.timerSeconds !== undefined &&
    (remainingTimerSeconds ?? 0) > 0;

  const activeBrewProgress = activeBrew
    ? ((activeBrew.currentStepIndex + 1) / activeBrew.recipe.steps.length) * 100
    : 0;
  const remainingGuidedTimeLabel =
    activeBrew && currentBrewStep
      ? getRemainingGuidedTimeLabel(activeBrew.recipe, activeBrew.currentStepIndex, remainingTimerSeconds)
      : null;
  const nextStepTitle =
    activeBrew && currentBrewStep ? activeBrew.recipe.steps[activeBrew.currentStepIndex + 1]?.title ?? null : null;
  const recoveryMessage =
    activeBrew && currentBrewStep ? getRecoveryMessage(activeBrew.recipe, activeBrew.currentStepIndex) : null;

  const activeMethod = BREW_METHODS[activeMethodIndex] ?? BREW_METHODS[0];
  const missingRequiredEquipment = useMemo(
    () => (selectedMethod ? getMissingRequiredEquipment(selectedMethod, config.equipment) : []),
    [config.equipment, selectedMethod],
  );

  const navigateTo = (
    nextScreen: Screen,
    options?: {
      method?: BrewMethod | null;
      replace?: boolean;
    },
  ) => {
    const params = new URLSearchParams(searchParamsString);
    const nextMethod = options?.method ?? selectedMethod ?? null;

    params.set("view", nextScreen);

    if ((nextScreen === "method" || nextScreen === "compose") && nextMethod) {
      params.set("method", nextMethod);
    } else {
      params.delete("method");
    }

    const href = params.toString() ? `${pathname}?${params.toString()}` : pathname;

    if (options?.replace) {
      router.replace(href, { scroll: false });
      return;
    }

    router.push(href, { scroll: false });
  };

  const resetComposer = () => {
    setSelectedMethodState(null);
    setMethodIndex(0);
    setConfig(DEFAULT_CONFIG);
    setShowAdvancedOptions(false);
    setGuidedRecommendation(null);
  };

  const startFreshFlow = () => {
    clearActiveBrew();
    dismissCompletion();
    resetComposer();
    navigateTo("method");
  };

  const handleToggleEquipment = (equipment: Equipment) => {
    setConfig((current) => ({
      ...current,
      equipment: current.equipment.includes(equipment)
        ? current.equipment.filter((item) => item !== equipment)
        : [...current.equipment, equipment],
    }));
  };

  const handleSelectMethod = (method: BrewMethod) => {
    setSelectedMethodState(method);
    setMethodIndex(getMethodIndex(method));
    setGuidedRecommendation(null);
    navigateTo("compose", { method });
  };

  const applyRecommendation = (recommendation: BrewRecommendation) => {
    setSelectedMethodState(recommendation.method);
    setMethodIndex(getMethodIndex(recommendation.method));
    setConfig(recommendation.config);
    setShowAdvancedOptions(false);
    setGuidedRecommendation(recommendation);
    navigateTo("compose", { method: recommendation.method });
  };

  const handleQuickStartRecommend = () => {
    applyRecommendation(
      getQuickStartRecommendation({
        setup: quickSetup,
        taste: quickTaste,
        time: quickTime,
      }),
    );
  };

  const handleUseAdaptiveRecommendation = () => {
    if (!adaptiveRecommendation) {
      return;
    }

    applyRecommendation(adaptiveRecommendation);
  };

  const setMethodSlide = (nextIndex: number) => {
    const nextMethod = BREW_METHODS[nextIndex]?.id;

    setMethodIndex(nextIndex);

    if (routeScreen === "method" && nextMethod && isBrewMethod(routeMethod)) {
      navigateTo("method", { method: nextMethod, replace: true });
    }
  };

  const goToPreviousMethod = () => {
    const previousIndex = activeMethodIndex === 0 ? BREW_METHODS.length - 1 : activeMethodIndex - 1;
    setMethodSlide(previousIndex);
  };

  const goToNextMethod = () => {
    const nextIndex = activeMethodIndex === BREW_METHODS.length - 1 ? 0 : activeMethodIndex + 1;
    setMethodSlide(nextIndex);
  };

  const handleMethodDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x <= -64) {
      goToNextMethod();
      return;
    }

    if (info.offset.x >= 64) {
      goToPreviousMethod();
    }
  };

  const handleStartBrew = () => {
    if (!previewRecipe) {
      return;
    }

    startNewBrew(previewRecipe);
    navigateTo("brewing");
  };

  const handleSaveRecipe = () => {
    saveCompletedRecipe();
    navigateTo("dashboard");
  };

  return {
    activeBrew,
    activeBrewProgress,
    adaptiveRecommendation,
    activeMethod,
    activeMethodIndex,
    brewSavedRecipe,
    clockNow,
    completionSummary,
    config,
    currentBrewStep,
    goToNextMethod,
    goToNextStep,
    goToPreviousMethod,
    handleMethodDragEnd,
    handleQuickStartRecommend,
    handleSaveRecipe,
    handleSelectMethod,
    handleStartBrew,
    handleToggleEquipment,
    handleUseAdaptiveRecommendation,
    guidedRecommendation,
    navigateTo,
    needsTimerToFinish,
    missingRequiredEquipment,
    pauseBrew,
    previewRecipe,
    quickSetup,
    quickTaste,
    quickTime,
    recentWin,
    recoveryMessage,
    remainingGuidedTimeLabel,
    remainingTimerSeconds,
    resumeBrew,
    savedRecipes,
    selectedMethod,
    setCompletionFeedback,
    setCompletionNotes,
    setConfig,
    setQuickSetup,
    setQuickTaste,
    setQuickTime,
    setMethodSlide,
    setShowAdvancedOptions,
    showAdvancedOptions,
    skipTimer,
    startFreshFlow,
    nextStepTitle,
    visibleScreen,
  };
}

export type CoffeeAppState = ReturnType<typeof useCoffeeAppState>;
