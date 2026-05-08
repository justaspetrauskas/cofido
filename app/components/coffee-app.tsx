"use client";

import { AnimatePresence, LayoutGroup } from "framer-motion";

import styles from "./coffee-app.module.css";
import {
  BrewingScreen,
  ComposerScreen,
  CompletionScreen,
  DashboardScreen,
  LandingScreen,
  MethodSelectionScreen,
} from "./coffee-app/screens";
import { PersistentMotionField } from "./coffee-app/visuals";
import { useCoffeeAppState } from "./coffee-app/use-coffee-app-state";

export function CoffeeApp() {
  const {
    activeBrew,
    activeBrewProgress,
    adaptiveRecommendation,
    activeMethod,
    activeMethodIndex,
    brewSavedRecipe,
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
    nextStepTitle,
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
    visibleScreen,
  } = useCoffeeAppState();

  return (
    <main className={styles.shell}>
      <div className={styles.frame} data-motion-system="shared" data-testid="motion-system-root">
        <PersistentMotionField />
        <LayoutGroup id="coffee-flow">
          <AnimatePresence mode="wait" initial={false}>
          {visibleScreen === "landing" ? (
            <LandingScreen
              key="landing"
              onQuickSetupChange={setQuickSetup}
              onQuickTasteChange={setQuickTaste}
              onQuickTimeChange={setQuickTime}
              onRecommend={handleQuickStartRecommend}
              onStart={() => navigateTo("method")}
              quickSetup={quickSetup}
              quickTaste={quickTaste}
              quickTime={quickTime}
            />
          ) : null}

          {visibleScreen === "method" ? (
            <MethodSelectionScreen
              key="method"
              activeMethod={activeMethod}
              activeMethodIndex={activeMethodIndex}
              onMethodDragEnd={handleMethodDragEnd}
              onNextMethod={goToNextMethod}
              onPreviousMethod={goToPreviousMethod}
              onSelectMethod={handleSelectMethod}
              onSetMethodSlide={setMethodSlide}
            />
          ) : null}

          {visibleScreen === "compose" && previewRecipe ? (
            <ComposerScreen
              key="compose"
              config={config}
              onChangeMethod={() => navigateTo("method", { method: selectedMethod })}
              onStartBrew={handleStartBrew}
              onToggleEquipment={handleToggleEquipment}
              missingRequiredEquipment={missingRequiredEquipment}
              previewRecipe={previewRecipe}
              recommendation={guidedRecommendation}
              setConfig={setConfig}
              setShowAdvancedOptions={setShowAdvancedOptions}
              showAdvancedOptions={showAdvancedOptions}
            />
          ) : null}

          {visibleScreen === "brewing" && activeBrew && currentBrewStep ? (
            <BrewingScreen
              key="brewing"
              activeBrew={activeBrew}
              activeBrewProgress={activeBrewProgress}
              currentBrewStep={currentBrewStep}
              needsTimerToFinish={Boolean(needsTimerToFinish)}
              nextStepTitle={nextStepTitle}
              onNextStep={() => goToNextStep()}
              onPause={() => pauseBrew()}
              onResume={() => resumeBrew()}
              onSkipTimer={skipTimer}
              recoveryMessage={recoveryMessage}
              remainingGuidedTimeLabel={remainingGuidedTimeLabel}
              remainingTimerSeconds={remainingTimerSeconds}
            />
          ) : null}

          {visibleScreen === "completion" && completionSummary ? (
            <CompletionScreen
              key="completion"
              completionSummary={completionSummary}
              onBrewAgain={startFreshFlow}
              onSaveRecipe={handleSaveRecipe}
              onSetCompletionFeedback={setCompletionFeedback}
              onSetCompletionNotes={setCompletionNotes}
            />
          ) : null}

          {visibleScreen === "dashboard" ? (
            <DashboardScreen
              key="dashboard"
              activeBrew={activeBrew}
              adaptiveRecommendation={adaptiveRecommendation}
              onBrewSavedRecipe={(recipeId) => {
                brewSavedRecipe(recipeId);
                navigateTo("brewing");
              }}
              onContinueBrew={() => navigateTo("brewing")}
              onNewBrew={startFreshFlow}
              onUseRecommendation={handleUseAdaptiveRecommendation}
              recentWin={recentWin}
              remainingTimerSeconds={remainingTimerSeconds}
              savedRecipes={savedRecipes}
            />
          ) : null}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </main>
  );
}
