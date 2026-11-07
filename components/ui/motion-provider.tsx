"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";

// One setting for every framer-motion component: when a visitor asks for reduced motion,
// transforms and layout animation drop out and opacity fades stay.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
