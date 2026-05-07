import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import type { ReactNode } from "react";

export const TIMER_RING_RADIUS = 76;
export const TIMER_RING_CIRCUMFERENCE = 2 * Math.PI * TIMER_RING_RADIUS;

import type { BrewMethod } from "@/lib/brewing";

import { capitalize, type AmbientSceneVariant } from "./model";
import styles from "../coffee-app.module.css";

export function MethodIllustration({ method }: { method: BrewMethod }) {
  const prefersReducedMotion = useReducedMotion();

  const sharedTransition = {
    duration: 3.8,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  if (method === "pour-over") {
    return (
      <svg
        aria-hidden="true"
        className={styles.methodIllustration}
        data-testid="method-illustration-pour-over"
        viewBox="0 0 240 200"
      >
        <motion.path
          className={styles.methodOutline}
          d="M94 50 C122 38 150 54 162 76 C172 94 164 118 144 134 C124 150 92 150 72 134 C54 118 48 92 60 74 C68 62 80 56 94 50 Z"
          animate={prefersReducedMotion ? undefined : { rotate: [0, 3, -2, 0], y: [0, 5, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 5.4 }}
        />
        <motion.circle
          className={styles.methodAccent}
          cx="118"
          cy="150"
          r="34"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.08, 1], x: [0, -4, 0] }}
          transition={{ ...sharedTransition, duration: 4.9 }}
        />
        <motion.path
          className={styles.methodStroke}
          d="M82 26 C124 34 142 64 122 134"
          animate={
            prefersReducedMotion
              ? undefined
              : { pathLength: [0.24, 1, 0.42], opacity: [0.35, 0.92, 0.35], x: [0, 4, 0] }
          }
          initial={{ pathLength: 0.36, opacity: 0.5 }}
          transition={sharedTransition}
        />
        <motion.path
          className={styles.methodAccent}
          d="M164 58 C186 68 194 88 180 110 C168 128 146 126 134 110 C122 94 132 72 164 58 Z"
          animate={prefersReducedMotion ? undefined : { x: [0, 8, 0], rotate: [0, 6, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 6 }}
        />
      </svg>
    );
  }

  if (method === "french-press") {
    return (
      <svg
        aria-hidden="true"
        className={styles.methodIllustration}
        data-testid="method-illustration-french-press"
        viewBox="0 0 240 200"
      >
        <motion.rect
          className={styles.methodOutline}
          height="104"
          rx="34"
          width="82"
          x="84"
          y="52"
          animate={prefersReducedMotion ? undefined : { y: [0, 4, 0], rotate: [0, 2, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 5.2 }}
        />
        <motion.path
          className={styles.methodStroke}
          d="M124 22 C126 46 126 64 124 86"
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0], pathLength: [0.3, 1, 0.4] }}
          initial={{ pathLength: 0.6 }}
          transition={{ ...sharedTransition, duration: 2.8 }}
        />
        <motion.path
          className={styles.methodAccent}
          d="M168 70 C196 86 198 116 174 132 C154 146 136 136 138 116 C140 94 144 76 168 70 Z"
          animate={prefersReducedMotion ? undefined : { x: [0, 7, 0], rotate: [0, 5, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 4.4 }}
        />
        <motion.path
          className={styles.methodAccent}
          d="M102 148 C128 138 146 146 148 164 C150 180 128 188 106 184 C84 180 78 158 102 148 Z"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 5.6 }}
        />
      </svg>
    );
  }

  if (method === "aeropress") {
    return (
      <svg
        aria-hidden="true"
        className={styles.methodIllustration}
        data-testid="method-illustration-aeropress"
        viewBox="0 0 240 200"
      >
        <motion.path
          className={styles.methodOutline}
          d="M100 38 C130 34 152 44 156 74 L148 146 C146 166 126 180 104 176 C84 174 72 154 76 136 L90 68 C92 52 94 44 100 38 Z"
          animate={prefersReducedMotion ? undefined : { rotate: [0, 3, -3, 0], y: [0, 4, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 5 }}
        />
        <motion.rect
          className={styles.methodAccent}
          height="18"
          rx="9"
          width="92"
          x="74"
          y="28"
          animate={prefersReducedMotion ? undefined : { x: [0, 6, -4, 0] }}
          transition={{ ...sharedTransition, duration: 4.2 }}
        />
        <motion.circle
          className={styles.methodOutline}
          cx="120"
          cy="164"
          r="20"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.1, 1] }}
          transition={{ ...sharedTransition, duration: 3.4 }}
        />
        <motion.path
          className={styles.methodStroke}
          d="M92 60 C126 80 142 106 124 148"
          animate={prefersReducedMotion ? undefined : { pathLength: [0.3, 1, 0.5], opacity: [0.4, 1, 0.4] }}
          initial={{ pathLength: 0.5, opacity: 0.5 }}
          transition={{ ...sharedTransition, duration: 4.8 }}
        />
      </svg>
    );
  }

  if (method === "espresso") {
    return (
      <svg
        aria-hidden="true"
        className={styles.methodIllustration}
        data-testid="method-illustration-espresso"
        viewBox="0 0 240 200"
      >
        <motion.path
          className={styles.methodOutline}
          d="M84 98 C96 78 144 76 164 90 C182 102 182 130 160 142 C140 152 100 152 84 136 C74 126 74 112 84 98 Z"
          animate={prefersReducedMotion ? undefined : { y: [0, 4, 0], rotate: [0, 2, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 4.6 }}
        />
        <motion.path
          className={styles.methodStroke}
          d="M118 40 C118 62 120 84 120 104"
          animate={prefersReducedMotion ? undefined : { opacity: [0.25, 1, 0.25], pathLength: [0.1, 1, 0.4], y: [0, 4, 0] }}
          initial={{ pathLength: 0.5, opacity: 0.6 }}
          transition={{ ...sharedTransition, duration: 2.8 }}
        />
        <motion.path
          className={styles.methodAccent}
          d="M164 100 C188 102 196 118 184 136 C174 152 150 150 148 132 C146 116 148 102 164 100 Z"
          animate={prefersReducedMotion ? undefined : { rotate: [0, 6, 0], x: [0, 5, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 4 }}
        />
        <motion.path
          className={styles.methodAccent}
          d="M90 146 C130 132 168 138 178 156 C186 172 162 180 122 182 C84 182 56 170 66 154 C70 148 80 148 90 146 Z"
          animate={prefersReducedMotion ? undefined : { scaleX: [1, 1.04, 1] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 5.4 }}
        />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      className={styles.methodIllustration}
      data-testid="method-illustration-cold-brew"
      viewBox="0 0 240 200"
    >
      <motion.path
        className={styles.methodOutline}
        d="M94 48 C126 36 156 52 164 82 L164 140 C162 162 142 178 118 178 C94 178 74 160 74 138 L74 82 C78 62 84 52 94 48 Z"
        animate={prefersReducedMotion ? undefined : { scaleY: [1, 1.04, 1], y: [0, 3, 0] }}
        style={{ originX: "50%", originY: "100%" }}
        transition={{ ...sharedTransition, duration: 5.2 }}
      />
      <motion.path
        className={styles.methodStroke}
        d="M92 38 C116 18 136 18 160 38"
        animate={prefersReducedMotion ? undefined : { y: [0, -3, 0], pathLength: [0.2, 1, 0.45] }}
        initial={{ pathLength: 0.5 }}
        transition={{ ...sharedTransition, duration: 4 }}
      />
      <motion.circle
        className={styles.methodAccent}
        cx="118"
        cy="154"
        r="18"
        animate={prefersReducedMotion ? undefined : { x: [0, 8, 0], y: [0, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ ...sharedTransition, duration: 3.6 }}
      />
      <motion.path
        className={styles.methodAccent}
        d="M166 66 C188 76 194 100 176 116 C162 128 144 122 138 108 C132 92 140 72 166 66 Z"
        animate={prefersReducedMotion ? undefined : { rotate: [0, 7, 0], x: [0, 6, 0] }}
        style={{ originX: "50%", originY: "50%" }}
        transition={{ ...sharedTransition, duration: 5.8 }}
      />
    </svg>
  );
}

export function AbstractMotionScene({
  testId,
  variant,
}: {
  testId: string;
  variant: AmbientSceneVariant;
}) {
  const prefersReducedMotion = useReducedMotion();
  const variantLabel: Record<AmbientSceneVariant, string> = {
    landing: "Coffee atmosphere",
    composer: "Recipe flow",
    brewing: "Brewing flow",
    completion: "Coffee bloom",
  };

  return (
    <div
      aria-hidden="true"
      className={`${styles.ambientScene} ${styles[`scene${capitalize(variant)}`]}`}
      data-testid={testId}
    >
      <motion.div
        className={styles.sceneHalo}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                scale: [1, 1.06, 1],
                x: [0, 8, -6, 0],
                y: [0, -10, 6, 0],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={styles.sceneBean}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                rotateX: [0, 8, -4, 0],
                rotateY: [0, -10, 8, 0],
                y: [0, -10, 0],
              }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={styles.sceneRibbon}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                rotate: [0, 8, -6, 0],
                x: [0, 14, -10, 0],
                y: [0, -8, 8, 0],
              }
        }
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className={styles.sceneSteamGroup} aria-label={variantLabel[variant]}>
        {[0, 1, 2].map((index) => (
          <motion.span
            key={`${variant}-${index}`}
            className={styles.sceneSteam}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: [0.15, 0.6, 0.15],
                    y: [0, -18 - index * 4, -30 - index * 6],
                    x: [0, index % 2 === 0 ? 8 : -8, 0],
                    scaleY: [1, 1.15, 0.96],
                  }
            }
            transition={{
              duration: 4.8 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.4,
            }}
          />
        ))}
      </div>
    </div>
  );
}

const RITUAL_SPRING = {
  type: "spring" as const,
  stiffness: 108,
  damping: 20,
  mass: 0.94,
};

const INTERACTION_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 24,
  mass: 0.72,
};

function MatisseCutouts({ testId = "matisse-cutouts" }: { testId?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={styles.cutoutField}
      data-crop="none"
      data-testid={testId}
    >
      {["leaf", "petal", "pool", "stem"].map((shape, index) => (
        <motion.span
          key={shape}
          className={`${styles.cutout} ${styles[`cutout${capitalize(shape)}`]}`}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  rotate: [0, index % 2 === 0 ? 10 : -10, index % 2 === 0 ? -4 : 4, 0],
                  x: [0, index % 2 === 0 ? 28 : -24, index % 2 === 0 ? -12 : 10, 0],
                  y: [0, -24 + index * 6, 16 - index * 3, 0],
                  scale: [1, 1.04, 0.97, 1],
                }
          }
          transition={{
            duration: 16 + index * 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.45,
          }}
        />
      ))}
    </div>
  );
}

export function PersistentMotionField() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={styles.persistentMotionField}
      data-persistent="true"
      data-testid="persistent-motion-field"
    >
      <MatisseCutouts />
      <motion.div
        className={styles.screenFlow}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: [0.16, 0.28, 0.14],
                scaleX: [1, 1.12, 0.94, 1],
                x: [0, 40, -28, 0],
                y: [0, -24, 18, 0],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={styles.screenMist}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: [0.1, 0.22, 0.12],
                x: [0, -34, 24, 0],
                y: [0, 24, -30, 0],
                scale: [1, 1.05, 0.98, 1],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={styles.screenAura}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                scale: [1, 1.03, 1],
                x: [0, 22, -16, 0],
                y: [0, -18, 12, 0],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function ScreenShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      className={styles.card}
      data-art-direction="matisse"
      data-background-overflow="visible"
      data-layout="freeform"
      data-shared-motion="enabled"
      data-spring="ritual"
      data-testid="screen-shell"
      layout
      initial={
        prefersReducedMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: 34,
              clipPath: "inset(10% 0 0 0 round 40px)",
              filter: "blur(10px)",
            }
      }
      animate={
        prefersReducedMotion
          ? { opacity: 1 }
          : {
              opacity: 1,
              y: 0,
              clipPath: "inset(0% 0 0 0 round 40px)",
              filter: "blur(0px)",
            }
      }
      exit={
        prefersReducedMotion
          ? { opacity: 0 }
          : {
              opacity: 0,
              y: -24,
              clipPath: "inset(0 0 12% 0 round 40px)",
              filter: "blur(8px)",
            }
      }
      transition={{
        ...RITUAL_SPRING,
      }}
    >
      <motion.header
        className={styles.copy}
        layout="position"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
        transition={{ ...RITUAL_SPRING, delay: prefersReducedMotion ? 0 : 0.05 }}
      >
        <motion.p className={styles.eyebrow} data-shared-element="eyebrow" layoutId="coffee-shell-eyebrow">
          {eyebrow}
        </motion.p>
        <motion.h1
          className={styles.title}
          data-shared-element="title"
          data-testid="shared-title"
          layoutId="coffee-shell-title"
        >
          {title}
        </motion.h1>
        <motion.p
          className={styles.description}
          data-shared-element="description"
          layoutId="coffee-shell-description"
        >
          {description}
        </motion.p>
      </motion.header>
      <motion.div
        className={styles.screenBody}
        data-composition="centered-column"
        data-density="airy"
        data-testid="screen-body"
        layout="position"
        layoutId="coffee-shell-body"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 28 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: -18 }}
        transition={{ ...RITUAL_SPRING, delay: prefersReducedMotion ? 0 : 0.12 }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

export function TimerRing({
  children,
  remainingSeconds,
  totalSeconds,
}: {
  children: ReactNode;
  remainingSeconds: number | null;
  totalSeconds: number | undefined;
}) {
  const prefersReducedMotion = useReducedMotion();

  const progress =
    totalSeconds !== undefined && remainingSeconds !== null
      ? Math.max(0, Math.min(1, remainingSeconds / totalSeconds))
      : 1;
  const strokeDashoffset = TIMER_RING_CIRCUMFERENCE * (1 - progress);

  return (
    <div className={styles.timerRing}>
      <svg
        aria-hidden="true"
        className={styles.timerRingSvg}
        data-testid="timer-ring-svg"
        viewBox="0 0 180 180"
      >
        <circle
          className={styles.timerRingTrack}
          cx="90"
          cy="90"
          fill="none"
          r={TIMER_RING_RADIUS}
        />
        <motion.circle
          className={styles.timerRingProgress}
          cx="90"
          cy="90"
          fill="none"
          r={TIMER_RING_RADIUS}
          strokeDasharray={TIMER_RING_CIRCUMFERENCE}
          animate={{ strokeDashoffset }}
          initial={{ strokeDashoffset }}
          // rotate -90 so the arc starts at 12 o'clock and drains clockwise
          style={{ originX: "50%", originY: "50%", rotate: -90 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 1, ease: "linear" }
          }
          data-testid="timer-ring-progress"
          data-remaining={remainingSeconds ?? "none"}
          data-total={totalSeconds ?? "none"}
        />
      </svg>
      <div className={styles.timerRingContent}>{children}</div>
    </div>
  );
}

export function MotionButton({
  children,
  className,
  disabled,
  ...props
}: Omit<HTMLMotionProps<"button">, "children"> & { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.button
      className={className}
      disabled={disabled}
      transition={INTERACTION_SPRING}
      whileHover={
        prefersReducedMotion || disabled
          ? undefined
          : {
              y: -2,
              scale: 1.012,
            }
      }
      whileTap={
        prefersReducedMotion || disabled
          ? undefined
          : {
              y: 0,
              scale: 0.988,
            }
      }
      {...props}
    >
      <span className={styles.buttonLabel}>{children}</span>
      <span aria-hidden="true" className={styles.buttonGlow} />
    </motion.button>
  );
}
