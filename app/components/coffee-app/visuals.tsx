import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

export const TIMER_RING_RADIUS = 76;
export const TIMER_RING_CIRCUMFERENCE = 2 * Math.PI * TIMER_RING_RADIUS;

import type { BrewMethod } from "@/lib/brewing";

import { capitalize, type AmbientSceneVariant } from "./model";
import styles from "../coffee-app.module.css";

const COMPACT_VIEWPORT_QUERY = "(max-width: 768px)";

function useLiteBackgroundMotionMode() {
  const prefersReducedMotion = useReducedMotion();
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const media = window.matchMedia(COMPACT_VIEWPORT_QUERY);
    const update = () => {
      setIsCompactViewport(media.matches);
    };

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return prefersReducedMotion || isCompactViewport;
}

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
        <defs>
          <linearGradient id="pour-over-body" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(233, 169, 101, 0.08)" />
          </linearGradient>
        </defs>
        <motion.ellipse
          className={styles.methodShadow}
          cx="122"
          cy="170"
          rx="52"
          ry="14"
          animate={prefersReducedMotion ? undefined : { scaleX: [1, 1.08, 1], opacity: [0.22, 0.32, 0.22] }}
          transition={{ ...sharedTransition, duration: 5.1 }}
        />
        <motion.path
          className={styles.methodOutline}
          data-testid="method-feature-pour-over-dripper"
          d="M88 54 L154 54 L136 112 C132 126 122 132 110 132 C98 132 88 126 84 112 Z"
          animate={prefersReducedMotion ? undefined : { y: [0, 2, 0], rotate: [0, 1.4, 0] }}
          style={{ fill: "url(#pour-over-body)", originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 4.8 }}
        />
        <motion.path
          className={styles.methodOutline}
          d="M84 128 C90 144 100 154 112 154 C124 154 134 144 140 128 Z"
          style={{ fill: "rgba(255, 255, 255, 0.07)" }}
        />
        <motion.path
          className={styles.methodStroke}
          data-testid="method-feature-pour-over-kettle-stream"
          d="M166 40 C150 58 138 80 122 110"
          animate={
            prefersReducedMotion
              ? undefined
              : { pathLength: [0.2, 1, 0.46], opacity: [0.35, 0.95, 0.35], x: [0, 2, 0] }
          }
          initial={{ pathLength: 0.4, opacity: 0.5 }}
          transition={sharedTransition}
        />
        <motion.path
          className={styles.methodAccent}
          d="M168 44 C182 44 194 56 194 70 C194 78 188 84 180 84 C164 84 156 72 160 60 C162 52 166 46 168 44 Z"
          animate={prefersReducedMotion ? undefined : { x: [0, 5, 0], rotate: [0, 4, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 5.6 }}
        />
        <motion.circle
          className={styles.methodAccent}
          cx="112"
          cy="146"
          r="10"
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.1, 1], y: [0, -1, 0] }}
          transition={{ ...sharedTransition, duration: 4.2 }}
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
        <defs>
          <linearGradient id="french-press-glass" x1="0%" x2="0%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.04)" />
          </linearGradient>
        </defs>
        <motion.rect
          className={styles.methodOutline}
          height="108"
          rx="22"
          width="88"
          x="78"
          y="56"
          style={{ fill: "url(#french-press-glass)", originX: "50%", originY: "50%" }}
          animate={prefersReducedMotion ? undefined : { y: [0, 4, 0], rotate: [0, 2, 0] }}
          transition={{ ...sharedTransition, duration: 5.2 }}
        />
        <motion.path
          className={styles.methodStroke}
          data-testid="method-feature-french-press-plunger"
          d="M122 24 L122 94"
          animate={prefersReducedMotion ? undefined : { y: [0, 6, 0], pathLength: [0.3, 1, 0.4] }}
          initial={{ pathLength: 0.6 }}
          transition={{ ...sharedTransition, duration: 2.8 }}
        />
        <motion.rect
          className={styles.methodAccent}
          data-testid="method-feature-french-press-handle"
          height="48"
          rx="12"
          width="14"
          x="170"
          y="76"
          animate={prefersReducedMotion ? undefined : { x: [0, 3, 0] }}
          transition={{ ...sharedTransition, duration: 4.7 }}
        />
        <motion.path
          className={styles.methodAccent}
          d="M94 66 C108 62 136 62 150 66 L150 136 C138 142 106 142 94 136 Z"
          animate={prefersReducedMotion ? undefined : { x: [0, 7, 0], rotate: [0, 5, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 4.4 }}
        />
        <motion.path
          className={styles.methodAccent}
          d="M88 150 C122 142 158 142 166 154 C172 162 156 170 124 172 C96 172 78 164 88 150 Z"
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
        <defs>
          <linearGradient id="aeropress-shell" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(233, 169, 101, 0.1)" />
          </linearGradient>
        </defs>
        <motion.path
          className={styles.methodOutline}
          data-testid="method-feature-aeropress-chamber"
          d="M92 52 C92 42 100 34 110 34 L130 34 C140 34 148 42 148 52 L144 142 C142 154 132 162 120 162 C108 162 98 154 96 142 Z"
          animate={prefersReducedMotion ? undefined : { rotate: [0, 3, -3, 0], y: [0, 4, 0] }}
          style={{ fill: "url(#aeropress-shell)", originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 5 }}
        />
        <motion.rect
          className={styles.methodAccent}
          data-testid="method-feature-aeropress-plunger"
          height="18"
          rx="9"
          width="98"
          x="70"
          y="24"
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
          d="M98 72 C120 86 132 108 122 144"
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
        <defs>
          <linearGradient id="espresso-metal" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.24)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.08)" />
          </linearGradient>
        </defs>
        <motion.path
          className={styles.methodOutline}
          data-testid="method-feature-espresso-cup"
          d="M86 102 C94 88 146 86 164 100 C176 108 176 126 162 134 C146 144 102 144 88 132 C80 124 80 112 86 102 Z"
          animate={prefersReducedMotion ? undefined : { y: [0, 4, 0], rotate: [0, 2, 0] }}
          style={{ originX: "50%", originY: "50%" }}
          transition={{ ...sharedTransition, duration: 4.6 }}
        />
        <motion.path
          className={styles.methodOutline}
          data-testid="method-feature-espresso-portafilter"
          d="M98 56 C104 50 136 50 142 56 L146 74 C140 80 102 80 96 74 Z"
          style={{ fill: "url(#espresso-metal)" }}
          animate={prefersReducedMotion ? undefined : { y: [0, 2, 0], rotate: [0, -2, 0] }}
          transition={{ ...sharedTransition, duration: 4.4 }}
        />
        <motion.path
          className={styles.methodStroke}
          d="M112 78 C112 90 112 98 112 108 M128 78 C128 90 128 98 128 108"
          animate={prefersReducedMotion ? undefined : { opacity: [0.25, 1, 0.25], pathLength: [0.1, 1, 0.4], y: [0, 4, 0] }}
          initial={{ pathLength: 0.5, opacity: 0.6 }}
          transition={{ ...sharedTransition, duration: 2.8 }}
        />
        <motion.path
          className={styles.methodAccent}
          d="M166 104 C186 106 194 122 182 136 C174 146 156 144 152 132 C150 120 152 106 166 104 Z"
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
      <defs>
        <linearGradient id="cold-brew-glass" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.18)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
        </linearGradient>
      </defs>
      <motion.path
        className={styles.methodOutline}
        data-testid="method-feature-cold-brew-jar"
        d="M92 50 C104 44 136 44 148 50 C158 56 162 66 162 80 L162 142 C160 162 142 174 120 174 C98 174 80 162 78 142 L78 80 C78 66 82 56 92 50 Z"
        animate={prefersReducedMotion ? undefined : { scaleY: [1, 1.04, 1], y: [0, 3, 0] }}
        style={{ fill: "url(#cold-brew-glass)", originX: "50%", originY: "100%" }}
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
        data-testid="method-feature-cold-brew-ice"
        cx="106"
        cy="146"
        r="12"
        animate={prefersReducedMotion ? undefined : { x: [0, 8, 0], y: [0, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ ...sharedTransition, duration: 3.6 }}
      />
      <motion.circle
        className={styles.methodAccent}
        cx="132"
        cy="154"
        r="10"
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

function MatisseCutouts({
  liteBackgroundMotion,
  testId = "matisse-cutouts",
}: {
  liteBackgroundMotion: boolean;
  testId?: string;
}) {
  if (liteBackgroundMotion) {
    return null;
  }

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
          animate={{
            rotate: [0, index % 2 === 0 ? 10 : -10, index % 2 === 0 ? -4 : 4, 0],
            x: [0, index % 2 === 0 ? 28 : -24, index % 2 === 0 ? -12 : 10, 0],
            y: [0, -24 + index * 6, 16 - index * 3, 0],
            scale: [1, 1.04, 0.97, 1],
          }}
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
  const liteBackgroundMotion = useLiteBackgroundMotionMode();

  return (
    <div
      aria-hidden="true"
      className={styles.persistentMotionField}
      data-persistent="true"
      data-performance-mode={liteBackgroundMotion ? "lite" : "full"}
      data-testid="persistent-motion-field"
    >
      <MatisseCutouts liteBackgroundMotion={liteBackgroundMotion} />
      {liteBackgroundMotion ? (
        <div className={styles.screenAura} />
      ) : (
        <>
          <motion.div
            className={styles.screenFlow}
            animate={{
              opacity: [0.16, 0.28, 0.14],
              scaleX: [1, 1.12, 0.94, 1],
              x: [0, 40, -28, 0],
              y: [0, -24, 18, 0],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={styles.screenMist}
            animate={{
              opacity: [0.1, 0.22, 0.12],
              x: [0, -34, 24, 0],
              y: [0, 24, -30, 0],
              scale: [1, 1.05, 0.98, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={styles.screenAura}
            animate={{
              scale: [1, 1.03, 1],
              x: [0, 22, -16, 0],
              y: [0, -18, 12, 0],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
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
      <div className={styles.timerRingContent} data-testid="timer-ring-content">{children}</div>
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
