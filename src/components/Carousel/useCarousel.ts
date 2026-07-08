import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Infinite carousel logic — "triple render + silent snap" technique.
 *
 * The track renders 3 copies of the item list and starts on the middle copy.
 * Navigation animates a CSS transform. When a transition finishes outside the
 * middle copy, we snap (transition disabled for one frame) to the equivalent
 * slide in the middle copy. The user perceives endless scrolling in both
 * directions; React state stays tiny (one index).
 *
 * Why not clone-2 (one clone per end)? With variable slides-per-view on
 * desktop (~4.5 visible), a single clone isn't enough to fill the viewport
 * during the wrap transition. Three copies keeps the math trivial and the
 * memory cost is negligible (a few <video> elements, only one ever playing).
 */
export function useCarousel(itemCount: number) {
  // Index into the *extended* (3x) list; start of middle copy.
  const [extIndex, setExtIndex] = useState(itemCount);
  const [isAnimating, setIsAnimating] = useState(false);
  // When true, the track moves without transition (the silent snap).
  const [snap, setSnap] = useState(false);

  /** Logical index 0..itemCount-1 — what the UI treats as "active". */
  const activeIndex = ((extIndex % itemCount) + itemCount) % itemCount;

  const pendingSnap = useRef<number | null>(null);

  const go = useCallback(
    (delta: 1 | -1) => {
      // Ignore input while a slide transition is in flight: this is what
      // prevents rapid-click "pile-ups" — one gesture, one transition.
      if (isAnimating) return;
      setIsAnimating(true);
      setSnap(false);
      setExtIndex((i) => i + delta);
    },
    [isAnimating]
  );

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  /** Call from the track's onTransitionEnd. */
  const handleTransitionEnd = useCallback(() => {
    setIsAnimating(false);
    // Left the middle copy? Schedule a snap back to the equivalent index.
    setExtIndex((i) => {
      if (i < itemCount || i >= itemCount * 2) {
        pendingSnap.current = itemCount + (((i % itemCount) + itemCount) % itemCount);
      }
      return i;
    });
  }, [itemCount]);

  // Apply the snap on the next commit so the transition-less jump is invisible.
  useEffect(() => {
    if (pendingSnap.current !== null) {
      const target = pendingSnap.current;
      pendingSnap.current = null;
      setSnap(true);
      setExtIndex(target);
    }
  });

  return { extIndex, activeIndex, snap, next, prev, handleTransitionEnd };
}
