"use client";

import { createContext, useCallback, useContext, useMemo } from "react";

import { isHapticsSupported, triggerHaptic, type HapticType } from "@/lib/haptics";

type HapticsContextValue = {
  trigger: (type?: HapticType) => void;
  isSupported: boolean;
};

const HapticsContext = createContext<HapticsContextValue>({
  trigger: () => {},
  isSupported: false,
});

export function HapticsProvider({ children }: { children: React.ReactNode }) {
  const trigger = useCallback((type: HapticType = "light") => {
    triggerHaptic(type);
  }, []);

  const value = useMemo(
    () => ({ trigger, isSupported: isHapticsSupported() }),
    [trigger],
  );

  return <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>;
}

export function useHaptics() {
  return useContext(HapticsContext);
}
