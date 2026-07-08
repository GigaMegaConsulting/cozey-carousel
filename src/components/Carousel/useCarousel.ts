import { useCallback, useRef, useState } from "react";
import type { TransitionEvent } from "react";

/**
 * Infinite carousel logic — "triple render + silent snap" technique.
 *
 * The track renders 3 copies of the item list and starts on the middle copy.
 * Navigation animates a CSS transform. When a transition finishes outside the
 * middle copy, we snap (transition disabled for one commit) to the equivalent
 * slide in the middle copy. The user perceives endless scrolling in both
 * directions; React state stays tiny (one index).
 *
 * Why not clone-2 (one clone per end)? With variable slides-per-view on
 * desktop (~4.5 visible), a single clone isn't enough to fill the viewport
 * during the wrap transition. Three copies keeps the math trivial and the
 * memory cost is negligible (a few <video> elements, only one ever playing).
 *
 * The in-flight gate and the current index are mirrored in refs, not read
 * from state, because both are consulted inside event handlers: state reads
 * are stale for events batched into the same tick (N same-tick clicks would
 * all see the gate open and advance N slides), while a ref flips
 * synchronously, so the second and later clicks of a burst are dropped.
 */
export function useCarousel(itemCount: number) {
  // Index into the *extended* (3x) list; start of middle copy.
  const [extIndex, setExtIndex] = useState(itemCount);
  const extIndexRef = useRef(itemCount);
  // When true, the track moves without transition (the silent snap).
  const [snap, setSnap] = useState(false);
  // Transition-in-flight gate — see the ref rationale above.
  const isAnimating = useRef(false);

  /** Logical index 0..itemCount-1 — what the UI treats as "active". */
  const activeIndex = ((extIndex % itemCount) + itemCount) % itemCount;

  const go = useCallback((delta: 1 | -1) => {
    // Ignore input while a slide transition is in flight: this is what
    // prevents rapid-click "pile-ups" — one gesture, one transition.
    if (isAnimating.current) return;
    isAnimating.current = true;
    extIndexRef.current += delta;
    setSnap(false);
    setExtIndex(extIndexRef.current);
  }, []);

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  /** Call from the track's onTransitionEnd. */
  const handleTransitionEnd = useCallback(
    (e: TransitionEvent<HTMLElement>) => {
      // transitionend bubbles — ignore the cards' border/shadow transitions
      // (they finish earlier and would unlock navigation mid-slide). Only the
      // track's own transform transition ends the gesture.
      if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
      isAnimating.current = false;
      // Left the middle copy? Snap silently to the equivalent middle slide.
      const i = extIndexRef.current;
      if (i < itemCount || i >= itemCount * 2) {
        extIndexRef.current = itemCount + (((i % itemCount) + itemCount) % itemCount);
        setSnap(true);
        setExtIndex(extIndexRef.current);
      }
    },
    [itemCount]
  );

  return { extIndex, activeIndex, snap, next, prev, handleTransitionEnd };
}
