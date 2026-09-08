"use client";

/**
 * Tiny haptics helper for subtle tactile feedback on interactions.
 * Uses the Vibration API where available; silently no-ops elsewhere.
 */
export type HapticType =
  | "success"
  | "warning"
  | "error"
  | "light"
  | "medium"
  | "heavy"
  | "soft"
  | "rigid"
  | "selection"
  | "nudge";

type Step = { delay?: number; duration: number; intensity: number };

const PATTERNS: Record<HapticType, Step[]> = {
  success: [
    { duration: 30, intensity: 0.5 },
    { delay: 60, duration: 40, intensity: 1 },
  ],
  warning: [
    { duration: 40, intensity: 0.8 },
    { delay: 100, duration: 40, intensity: 0.6 },
  ],
  error: [
    { duration: 40, intensity: 0.9 },
    { delay: 40, duration: 40, intensity: 0.9 },
    { delay: 40, duration: 40, intensity: 0.9 },
  ],
  light: [{ duration: 15, intensity: 0.4 }],
  medium: [{ duration: 25, intensity: 0.7 }],
  heavy: [{ duration: 35, intensity: 1 }],
  soft: [{ duration: 40, intensity: 0.5 }],
  rigid: [{ duration: 10, intensity: 1 }],
  selection: [{ duration: 8, intensity: 0.3 }],
  nudge: [
    { duration: 80, intensity: 0.8 },
    { delay: 80, duration: 50, intensity: 0.3 },
  ],
};

export function isHapticsSupported() {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

export function triggerHaptic(type: HapticType = "light") {
  if (!isHapticsSupported()) return false;
  const pattern: number[] = [];
  for (const step of PATTERNS[type]) {
    if (step.delay) pattern.push(step.delay);
    pattern.push(Math.max(1, Math.round(step.duration * step.intensity)));
  }
  try {
    return navigator.vibrate(pattern);
  } catch {
    return false;
  }
}
