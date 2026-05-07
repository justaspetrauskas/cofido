import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

import {
  BREW_METHODS,
  CUP_SIZES,
  EQUIPMENT_OPTIONS,
  formatDuration,
  formatTimer,
  type BrewMethod,
  type Equipment,
  type Recipe,
  type RecipeConfig,
} from "@/lib/brewing";
import type {
  ActiveBrew,
  BrewFeedback,
  CompletionSummary,
  SavedRecipe,
} from "@/lib/coffee-store";

import {
  BREW_RATIO_PRESETS,
  FEEDBACK_OPTIONS,
  QUICK_SETUP_OPTIONS,
  QUICK_TASTE_OPTIONS,
  QUICK_TIME_OPTIONS,
  VISUAL_LABELS,
  type BrewRecommendation,
  type QuickSetup,
  type QuickTaste,
  type QuickTime,
  capitalize,
  getBrewRatioPreset,
  getMethodDecisionDetails,
} from "./model";
import {
  AbstractMotionScene,
  MethodIllustration,
  MotionButton,
  ScreenShell,
  TimerRing,
} from "./visuals";
import styles from "../coffee-app.module.css";

type ComposerConfig = Omit<RecipeConfig, "method">;
type BrewMethodOption = (typeof BREW_METHODS)[number];

export function LandingScreen({
  onQuickSetupChange,
  onQuickTasteChange,
  onQuickTimeChange,
  onRecommend,
  onStart,
  quickSetup,
  quickTaste,
  quickTime,
}: {
  onQuickSetupChange: (value: QuickSetup) => void;
  onQuickTasteChange: (value: QuickTaste) => void;
  onQuickTimeChange: (value: QuickTime) => void;
  onRecommend: () => void;
  onStart: () => void;
  quickSetup: QuickSetup;
  quickTaste: QuickTaste;
  quickTime: QuickTime;
}) {
  return (
    <ScreenShell
      eyebrow="Cofido"
      title="A calm guide for better coffee."
      description="Move from setup to your first pour without wading through extra steps."
    >
      <div className={styles.heroPanel}>
        <AbstractMotionScene testId="ambient-scene-landing" variant="landing" />
        <div className={styles.heroGlow} />
        <div className={styles.heroIntro}>
          <p>Minimal flow</p>
          <strong>Pick a method, tweak your brew, and start in under a minute.</strong>
        </div>
      </div>
      <div className={styles.ctaStack}>
        <MotionButton className={styles.primaryButton} onClick={onStart} type="button">
          Start Brewing
        </MotionButton>
      </div>
      <section className={styles.quickStartPanel}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.panelLabel}>Quick start</p>
            <strong>Start from taste, time, and setup</strong>
          </div>
        </div>
        <div className={styles.controlGroup}>
          <span className={styles.fieldLabel}>Taste</span>
          <div className={styles.segmentedControl}>
            {QUICK_TASTE_OPTIONS.map((option) => (
              <MotionButton
                key={option.value}
                className={styles.segmentButton}
                data-selected={quickTaste === option.value}
                onClick={() => onQuickTasteChange(option.value)}
                type="button"
              >
                {option.label}
              </MotionButton>
            ))}
          </div>
        </div>
        <div className={styles.controlGroup}>
          <span className={styles.fieldLabel}>Time</span>
          <div className={styles.segmentedControl}>
            {QUICK_TIME_OPTIONS.map((option) => (
              <MotionButton
                key={option.value}
                className={styles.segmentButton}
                data-selected={quickTime === option.value}
                onClick={() => onQuickTimeChange(option.value)}
                type="button"
              >
                {option.label}
              </MotionButton>
            ))}
          </div>
        </div>
        <div className={styles.controlGroup}>
          <span className={styles.fieldLabel}>Setup</span>
          <div className={styles.segmentedControl}>
            {QUICK_SETUP_OPTIONS.map((option) => (
              <MotionButton
                key={option.value}
                className={styles.segmentButton}
                data-selected={quickSetup === option.value}
                onClick={() => onQuickSetupChange(option.value)}
                type="button"
              >
                {option.label}
              </MotionButton>
            ))}
          </div>
        </div>
        <MotionButton className={styles.secondaryButton} onClick={onRecommend} type="button">
          Recommend my brew
        </MotionButton>
      </section>
    </ScreenShell>
  );
}

type MethodSelectionScreenProps = {
  activeMethod: BrewMethodOption;
  activeMethodIndex: number;
  onMethodDragEnd: (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onPreviousMethod: () => void;
  onNextMethod: () => void;
  onSelectMethod: (method: BrewMethod) => void;
  onSetMethodSlide: (index: number) => void;
};

export function MethodSelectionScreen({
  activeMethod,
  activeMethodIndex,
  onMethodDragEnd,
  onNextMethod,
  onPreviousMethod,
  onSelectMethod,
  onSetMethodSlide,
}: MethodSelectionScreenProps) {
  const methodDetails = getMethodDecisionDetails(activeMethod.id);

  return (
    <ScreenShell
      eyebrow="Method"
      title="Choose a brew method"
      description="Slide through the brew cards to find the ritual that matches today."
    >
      <div className={styles.methodSlider}>
        <div className={styles.methodSliderHeader}>
          <div>
            <span className={styles.inlineValue}>
              {String(activeMethodIndex + 1).padStart(2, "0")} /{" "}
              {String(BREW_METHODS.length).padStart(2, "0")}
            </span>
            <p className={styles.sliderHint}>Swipe, drag, or use arrow keys to move between methods.</p>
          </div>
        </div>
        <div
          className={styles.methodViewport}
          aria-label="Brew method slider"
          data-controls-visible="true"
          data-testid="method-slider-stage"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              event.preventDefault();
              onNextMethod();
            }

            if (event.key === "ArrowLeft") {
              event.preventDefault();
              onPreviousMethod();
            }
          }}
          tabIndex={0}
        >
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={styles.methodControlRail}
            transition={{ type: "spring", stiffness: 190, damping: 22 }}
          >
            <MotionButton
              aria-label="Previous method"
              className={styles.iconButton}
              onClick={onPreviousMethod}
              type="button"
            >
              ←
            </MotionButton>
          </motion.div>
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className={styles.methodControlRailEnd}
            transition={{ type: "spring", stiffness: 190, damping: 22 }}
          >
            <MotionButton
              aria-label="Next method"
              className={styles.iconButton}
              onClick={onNextMethod}
              type="button"
            >
              →
            </MotionButton>
          </motion.div>
          <div className={styles.methodOrbit} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={activeMethod.id}
              className={styles.methodSlide}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              initial={{ opacity: 0, x: 36, rotateY: 10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -36, rotateY: -10 }}
              onDragEnd={onMethodDragEnd}
              transition={{ type: "spring", stiffness: 160, damping: 20, mass: 0.9 }}
            >
              <div
                className={styles.methodCardVisual}
                data-alignment="centered"
                data-art-style="matisse"
                data-background="transparent"
                data-testid="method-illustration-stage"
              >
                <MethodIllustration method={activeMethod.id} />
              </div>
              <div className={styles.methodCardContent}>
                <span className={styles.methodBadge}>{activeMethod.label}</span>
                <strong>{activeMethod.label}</strong>
                <p className={styles.methodCopy}>{activeMethod.description}</p>
                <div className={styles.methodMetaList}>
                  <span>{methodDetails.time}</span>
                  <span>{methodDetails.profile}</span>
                  <span>{methodDetails.gear}</span>
                </div>
                <small>Live recipe composer opens next.</small>
              </div>
              <MotionButton
                aria-label={`Choose ${activeMethod.label}`}
                className={styles.primaryButton}
                onClick={() => onSelectMethod(activeMethod.id)}
                type="button"
              >
                Choose {activeMethod.label}
              </MotionButton>
            </motion.section>
          </AnimatePresence>
        </div>
        <div className={styles.sliderDots}>
          {BREW_METHODS.map((method, index) => (
            <button
              key={method.id}
              aria-label={`Go to ${method.label}`}
              className={styles.sliderDot}
              data-selected={index === activeMethodIndex}
              onClick={() => onSetMethodSlide(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </ScreenShell>
  );
}

type ComposerScreenProps = {
  config: ComposerConfig;
  onChangeMethod: () => void;
  onStartBrew: () => void;
  onToggleEquipment: (equipment: Equipment) => void;
  previewRecipe: Recipe;
  recommendation: BrewRecommendation | null;
  setConfig: Dispatch<SetStateAction<ComposerConfig>>;
  setShowAdvancedOptions: Dispatch<SetStateAction<boolean>>;
  showAdvancedOptions: boolean;
};

export function ComposerScreen({
  config,
  onChangeMethod,
  onStartBrew,
  onToggleEquipment,
  previewRecipe,
  recommendation,
  setConfig,
  setShowAdvancedOptions,
  showAdvancedOptions,
}: ComposerScreenProps) {
  const activeRatioPreset = getBrewRatioPreset(config.strength);

  return (
    <ScreenShell
      eyebrow="Composer"
      title="Build your brew"
      description="Adjust the cup in one place, with the recipe updating instantly as you go."
    >
      <div className={styles.stack}>
        <section className={styles.summaryHero}>
          <AbstractMotionScene testId="ambient-scene-composer" variant="composer" />
          <div className={styles.summaryHeader}>
            <div>
              <span className={styles.methodPill}>{previewRecipe.methodLabel}</span>
              <p className={styles.summaryNote}>Skill: {capitalize(config.skillLevel)}</p>
            </div>
            <MotionButton className={styles.ghostButton} onClick={onChangeMethod} type="button">
              Change method
            </MotionButton>
          </div>
          {recommendation ? (
            <div className={styles.recommendationBanner}>
              <span className={styles.methodBadge}>{recommendation.badge}</span>
              <strong>{recommendation.title}</strong>
              <p>{recommendation.note}</p>
            </div>
          ) : null}
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span>Ratio</span>
              <strong>{previewRecipe.ratioLabel}</strong>
            </div>
            <div className={styles.metricCard}>
              <span>Coffee</span>
              <strong>{previewRecipe.coffeeGrams} g</strong>
            </div>
            <div className={styles.metricCard}>
              <span>Water</span>
              <strong>{previewRecipe.waterMl} ml</strong>
            </div>
            <div className={styles.metricCard}>
              <span>Total time</span>
              <strong>{formatDuration(previewRecipe.totalTimeSeconds)}</strong>
            </div>
          </div>
          <p className={styles.summaryCopy}>
            {previewRecipe.grindSize} grind, {previewRecipe.waterTemperatureC} C water,{" "}
            {previewRecipe.steps.length} guided steps.
          </p>
        </section>

        <section className={styles.controlPanel}>
          <div className={styles.controlGroup}>
            <span className={styles.fieldLabel}>Cup size</span>
            <div className={styles.segmentedControl}>
              {CUP_SIZES.map((cupSize) => (
                <MotionButton
                  key={cupSize}
                  aria-label={`${cupSize} cup${cupSize > 1 ? "s" : ""}`}
                  className={styles.segmentButton}
                  data-selected={config.cups === cupSize}
                  onClick={() => setConfig((current) => ({ ...current, cups: cupSize }))}
                  type="button"
                >
                  {cupSize}
                </MotionButton>
              ))}
            </div>
          </div>

          <div className={styles.controlGroup}>
            <div className={styles.controlHeader}>
              <span className={styles.fieldLabel}>Brew ratio</span>
              <span className={styles.inlineValue}>{activeRatioPreset.ratioLabel}</span>
            </div>
            <div className={styles.segmentedControl}>
              {BREW_RATIO_PRESETS.map((preset) => (
                <MotionButton
                  key={preset.ratioLabel}
                  aria-label={`${preset.label} · ${preset.ratioLabel}`}
                  className={styles.segmentButton}
                  data-selected={activeRatioPreset.ratioLabel === preset.ratioLabel}
                  onClick={() =>
                    setConfig((current) => ({
                      ...current,
                      strength: preset.strength,
                    }))
                  }
                  type="button"
                >
                  {preset.label} · {preset.ratioLabel}
                </MotionButton>
              ))}
            </div>
            <p className={styles.controlHint}>{activeRatioPreset.description}</p>
          </div>

          <MotionButton
            className={styles.secondaryButton}
            onClick={() => setShowAdvancedOptions((current) => !current)}
            type="button"
          >
            {showAdvancedOptions ? "Hide advanced options" : "Advanced options"}
          </MotionButton>

          {showAdvancedOptions ? (
            <div className={styles.advancedGrid}>
              <div className={styles.controlGroup}>
                <span className={styles.fieldLabel}>Skill level</span>
                <div className={styles.chipRow}>
                  {["beginner", "intermediate", "advanced"].map((skill) => (
                    <MotionButton
                      key={skill}
                      className={styles.chipButton}
                      data-selected={config.skillLevel === skill}
                      onClick={() =>
                        setConfig((current) => ({
                          ...current,
                          skillLevel: skill as RecipeConfig["skillLevel"],
                        }))
                      }
                      type="button"
                    >
                      {capitalize(skill)}
                    </MotionButton>
                  ))}
                </div>
              </div>

              <div className={styles.controlGroup}>
                <span className={styles.fieldLabel}>Equipment</span>
                <div className={styles.chipRow}>
                  {EQUIPMENT_OPTIONS.map((equipment) => (
                    <MotionButton
                      key={equipment}
                      className={styles.chipButton}
                      data-selected={config.equipment.includes(equipment)}
                      onClick={() => onToggleEquipment(equipment)}
                      type="button"
                    >
                      {capitalize(equipment)}
                    </MotionButton>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </section>

        <section className={styles.stepPreviewCard}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.panelLabel}>Brew path</p>
              <strong>
                {previewRecipe.steps[0]?.title} to {previewRecipe.steps.at(-1)?.title}
              </strong>
            </div>
            <span className={styles.inlineValue}>{previewRecipe.steps.length} steps</span>
          </div>
          <div className={styles.stepListCompact}>
            {previewRecipe.steps.slice(0, 4).map((step, index) => (
              <div key={`${step.title}-${index}`} className={styles.stepCompactRow}>
                <span>{index + 1}</span>
                <p>{step.title}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.composerFooter}>
          <div>
            <p className={styles.panelLabel}>Ready to brew</p>
            <strong className={styles.footerTitle}>{previewRecipe.methodLabel}</strong>
          </div>
          <MotionButton className={styles.primaryButton} onClick={onStartBrew} type="button">
            Start Brewing
          </MotionButton>
        </div>
      </div>
    </ScreenShell>
  );
}

type BrewingScreenProps = {
  activeBrew: ActiveBrew;
  activeBrewProgress: number;
  currentBrewStep: Recipe["steps"][number];
  needsTimerToFinish: boolean;
  nextStepTitle: string | null;
  onNextStep: () => void;
  onPause: () => void;
  onResume: () => void;
  onSkipTimer: () => void;
  recoveryMessage: string | null;
  remainingGuidedTimeLabel: string | null;
  remainingTimerSeconds: number | null;
};

export function BrewingScreen({
  activeBrew,
  activeBrewProgress,
  currentBrewStep,
  needsTimerToFinish,
  nextStepTitle,
  onNextStep,
  onPause,
  onResume,
  onSkipTimer,
  recoveryMessage,
  remainingGuidedTimeLabel,
  remainingTimerSeconds,
}: BrewingScreenProps) {
  const [showRecoveryMessage, setShowRecoveryMessage] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" && event.key !== " ") {
        return;
      }

      const target = event.target;
      if (target instanceof HTMLElement) {
        const tagName = target.tagName;
        if (
          tagName === "BUTTON" ||
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }

      event.preventDefault();

      if (activeBrew.status === "brewing") {
        onPause();
        return;
      }

      onResume();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeBrew.status, onPause, onResume]);

  return (
    <ScreenShell
      eyebrow={activeBrew.recipe.methodLabel}
      title={currentBrewStep.title}
      description={currentBrewStep.instruction}
    >
      <div className={`${styles.stack} ${styles.brewStack}`}>
        <section
          className={styles.brewHero}
          data-emphasis="primary"
          data-testid="brew-progress"
        >
          <div className={styles.progressHeader}>
            <p className={styles.panelLabel}>Brew progress</p>
            <strong className={styles.progressValue}>{Math.round(activeBrewProgress)}%</strong>
          </div>
          <div className={styles.progressMeta}>
            <span>
              Step {activeBrew.currentStepIndex + 1} of {activeBrew.recipe.steps.length}
            </span>
            <span>{activeBrew.recipe.grindSize}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${activeBrewProgress}%` }} />
          </div>
          <div className={styles.stepDots} data-testid="brew-step-dots" aria-label="Brew step progress">
            {activeBrew.recipe.steps.map((step, index) => {
              const state =
                index < activeBrew.currentStepIndex
                  ? "complete"
                  : index === activeBrew.currentStepIndex
                    ? "current"
                    : "remaining";
              const ariaLabel =
                state === "complete"
                  ? `Step ${index + 1}, complete`
                  : state === "current"
                    ? `Step ${index + 1}, current`
                    : `Step ${index + 1}`;
              return (
                <span
                  key={step.title}
                  aria-label={ariaLabel}
                  className={styles.stepDot}
                  data-state={state}
                  data-testid="brew-step-dot"
                />
              );
            })}
          </div>
          <p className={styles.progressHint}>Press space to pause or resume.</p>
          <div className={styles.brewCoachRow}>
            {nextStepTitle ? <p className={styles.brewCoachText}>Next: {nextStepTitle}</p> : null}
            {remainingGuidedTimeLabel ? (
              <p className={styles.brewCoachText}>Remaining guided time: {remainingGuidedTimeLabel}</p>
            ) : null}
          </div>
        </section>

        <section className={styles.timerStage} data-layout="centered" data-testid="timer-stage">
          <AbstractMotionScene testId="ambient-scene-brewing" variant="brewing" />
          <TimerRing
            remainingSeconds={remainingTimerSeconds}
            totalSeconds={currentBrewStep.timerSeconds}
          >
            <span>{remainingTimerSeconds !== null ? formatTimer(remainingTimerSeconds) : "Ready"}</span>
          </TimerRing>
          <div className={styles.timerDetails}>
            <p className={styles.panelLabel}>{VISUAL_LABELS[currentBrewStep.visual]}</p>
            <p className={styles.timerNote}>
              {currentBrewStep.timerSeconds
                ? "Let the timer guide the pace."
                : "Move on once the step feels complete."}
            </p>
          </div>
        </section>

        <div className={styles.brewActions}>
          {activeBrew.status === "brewing" ? (
            <MotionButton className={styles.secondaryButton} onClick={onPause} type="button">
              Pause
            </MotionButton>
          ) : (
            <MotionButton className={styles.secondaryButton} onClick={onResume} type="button">
              Resume
            </MotionButton>
          )}
          {needsTimerToFinish ? (
            <MotionButton className={styles.ghostButton} onClick={onSkipTimer} type="button">
              Skip timer
            </MotionButton>
          ) : null}
          {recoveryMessage ? (
            <MotionButton
              className={styles.ghostButton}
              onClick={() => setShowRecoveryMessage((current) => !current)}
              type="button"
            >
              Lost my place
            </MotionButton>
          ) : null}
          <MotionButton
            className={styles.primaryButton}
            disabled={Boolean(needsTimerToFinish)}
            onClick={onNextStep}
            type="button"
          >
            {activeBrew.currentStepIndex === activeBrew.recipe.steps.length - 1
              ? "Finish Brewing"
              : "Continue"}
          </MotionButton>
        </div>
        {showRecoveryMessage && recoveryMessage ? (
          <p className={styles.recoveryMessage}>{recoveryMessage}</p>
        ) : null}
      </div>
    </ScreenShell>
  );
}

type CompletionScreenProps = {
  completionSummary: CompletionSummary;
  onBrewAgain: () => void;
  onSaveRecipe: () => void;
  onSetCompletionFeedback: (feedback: BrewFeedback) => void;
};

export function CompletionScreen({
  completionSummary,
  onBrewAgain,
  onSaveRecipe,
  onSetCompletionFeedback,
}: CompletionScreenProps) {
  return (
    <ScreenShell
      eyebrow="Complete"
      title="Your brew is ready"
      description="Save what worked so the next cup starts closer to perfect."
    >
      <div className={styles.stack}>
        <section className={styles.summaryHero}>
          <AbstractMotionScene testId="ambient-scene-completion" variant="completion" />
          <div className={styles.metricGrid}>
            <div className={styles.metricCard}>
              <span>Ratio</span>
              <strong>{completionSummary.recipe.ratioLabel}</strong>
            </div>
            <div className={styles.metricCard}>
              <span>Total time</span>
              <strong>{formatDuration(completionSummary.recipe.totalTimeSeconds)}</strong>
            </div>
            <div className={styles.metricCard}>
              <span>Grind</span>
              <strong>{completionSummary.recipe.grindSize}</strong>
            </div>
          </div>
        </section>

        <section className={styles.controlPanel}>
          <div className={styles.controlGroup}>
            <span className={styles.fieldLabel}>How did it taste?</span>
            <div className={styles.chipRow}>
              {FEEDBACK_OPTIONS.map((option) => (
                <MotionButton
                  key={option.value}
                  className={styles.chipButton}
                  data-selected={completionSummary.feedback === option.value}
                  onClick={() => onSetCompletionFeedback(option.value)}
                  type="button"
                >
                  {option.label}
                </MotionButton>
              ))}
            </div>
          </div>
        </section>

        <div className={styles.actionRow}>
          <MotionButton className={styles.secondaryButton} onClick={onBrewAgain} type="button">
            Brew Again
          </MotionButton>
          <MotionButton className={styles.primaryButton} onClick={onSaveRecipe} type="button">
            Save Recipe
          </MotionButton>
        </div>
      </div>
    </ScreenShell>
  );
}

type DashboardScreenProps = {
  activeBrew: ActiveBrew | null;
  adaptiveRecommendation: BrewRecommendation | null;
  onBrewSavedRecipe: (id: string) => void;
  onContinueBrew: () => void;
  onNewBrew: () => void;
  onUseRecommendation: () => void;
  recentWin: SavedRecipe | null;
  remainingTimerSeconds: number | null;
  savedRecipes: SavedRecipe[];
};

export function DashboardScreen({
  activeBrew,
  adaptiveRecommendation,
  onBrewSavedRecipe,
  onContinueBrew,
  onNewBrew,
  onUseRecommendation,
  recentWin,
  remainingTimerSeconds,
  savedRecipes,
}: DashboardScreenProps) {
  const activeStepTitle = activeBrew?.recipe.steps[activeBrew.currentStepIndex]?.title;

  return (
    <ScreenShell
      eyebrow="Dashboard"
      title="Welcome back"
      description="Pick up where you left off or start a new brew without digging through setup."
    >
      <div className={styles.stack}>
        {adaptiveRecommendation ? (
          <section className={styles.dashboardInsight}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.panelLabel}>{adaptiveRecommendation.badge}</p>
                <strong>{adaptiveRecommendation.title}</strong>
              </div>
            </div>
            <p className={styles.dashboardLead}>{adaptiveRecommendation.summary}</p>
            <p className={styles.dashboardLine}>{adaptiveRecommendation.note}</p>
            <div className={styles.actionRow}>
              <MotionButton className={styles.primaryButton} onClick={onUseRecommendation} type="button">
                Use suggestion
              </MotionButton>
            </div>
          </section>
        ) : null}

        {recentWin ? (
          <section className={styles.dashboardInsight}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.panelLabel}>Recent win</p>
                <strong>{recentWin.name}</strong>
              </div>
            </div>
            <p className={styles.dashboardLine}>
              {recentWin.recipe.methodLabel} · {recentWin.recipe.ratioLabel} · {recentWin.recipe.coffeeGrams} g
            </p>
            <div className={styles.actionRow}>
              <MotionButton
                className={styles.secondaryButton}
                onClick={() => onBrewSavedRecipe(recentWin.id)}
                type="button"
              >
                Brew recent win
              </MotionButton>
            </div>
          </section>
        ) : null}

        {activeBrew ? (
          <section className={styles.dashboardHero}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.panelLabel}>Continue now</p>
                <strong>{activeBrew.recipe.methodLabel}</strong>
              </div>
              <span className={styles.statusChip}>{capitalize(activeBrew.status)}</span>
            </div>
            <p className={styles.dashboardLead}>
              {capitalize(activeBrew.status)} on {activeStepTitle}
            </p>
            {remainingTimerSeconds !== null ? (
              <p className={styles.dashboardLine}>
                Remaining timer: {formatTimer(remainingTimerSeconds)}
              </p>
            ) : null}
            <div className={styles.actionRow}>
              <MotionButton className={styles.primaryButton} onClick={onContinueBrew} type="button">
                Continue last brew
              </MotionButton>
              <MotionButton className={styles.secondaryButton} onClick={onNewBrew} type="button">
                New brew
              </MotionButton>
            </div>
          </section>
        ) : (
          <MotionButton className={styles.primaryButton} onClick={onNewBrew} type="button">
            Start new brew
          </MotionButton>
        )}

        {savedRecipes.length > 0 ? (
          <section className={styles.savedPanel}>
            <div className={styles.sectionHeader}>
              <div>
                <p className={styles.panelLabel}>Saved recipes</p>
                <strong>Repeat a cup that already worked</strong>
              </div>
            </div>
            <div className={styles.savedList}>
              {savedRecipes.map((recipe) => (
                <article key={recipe.id} className={styles.savedRecipe}>
                  <div>
                    <strong>{recipe.name}</strong>
                    <p>
                      {recipe.recipe.methodLabel} - {recipe.recipe.ratioLabel} -{" "}
                      {recipe.recipe.coffeeGrams} g
                    </p>
                  </div>
                  <MotionButton
                    className={styles.secondaryButton}
                    onClick={() => onBrewSavedRecipe(recipe.id)}
                    type="button"
                  >
                    Brew again
                  </MotionButton>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </ScreenShell>
  );
}
