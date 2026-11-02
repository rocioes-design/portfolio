import type { Transition } from "framer-motion";

// The site's three speeds, after Fluid Functionalism's motion system but timed to Rocío's rules:
// the bigger the thing that moves, the slower the tier. Exits are tweens one step quicker, so a
// dismissal reads crisp instead of replaying the entrance backwards.
// The same values live in CSS as --dur-* in app/globals.css; change both together.
const tier = (duration: number, bounce: number, exit: number) => ({
  type: "spring" as const,
  duration,
  bounce,
  exit: { type: "tween" as const, duration: exit, ease: [0.4, 0, 1, 1] as const },
});

export const spring = {
  fast: tier(0.125, 0, 0.09), // hover, fades, focus, selection indicators
  moderate: tier(0.2, 0, 0.15), // short travel, small expansions, tabs
  slow: tier(0.275, 0.12, 0.2), // windows, dialogs, large surfaces
};

// Deliberately outside the tiers, so each is named once here instead of re-typed
export const sendSpring: Transition = { type: "spring", visualDuration: 0.42, bounce: 0.28 }; // FAQ answers, Rare UI's timing
export const sendShift: Transition = { type: "spring", visualDuration: 0.4, bounce: 0.1 }; // bubbles sliding to make room
export const sendExit: Transition = { duration: 0.16, ease: [0.4, 0, 1, 1] };
export const instant: Transition = { duration: 0 };
