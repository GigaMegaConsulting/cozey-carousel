# Cozey Carousel — Part 2

A video carousel built to the provided Figma: infinite navigation in both
directions, autoplaying first video, active-only interactivity, responsive
from mobile (1 card + peek) to desktop (~4.5 cards).

## Run it

```bash
npm install
npm run dev
```

## Media files

The 15 provided videos are included in `public/videos/`, re-encoded to 720p
portrait (H.264, CRF 28) so the repo stays clonable and the first slide can
autoplay without pulling a 130 MB original. The manifest in
`src/data/media.ts` maps each file to an id/title. Slides whose source is
missing or fails to load render the Figma checkerboard placeholder instead
of breaking.

## Architecture

Every component lives in its own folder with its own `types.ts` and
`index.ts` barrel, so each one can be lifted into another project as a unit.
The UI primitives (`Text`, `Icon`, `Button`) are app-agnostic; `Carousel`
composes them.

```
src/components/
  Text/            ← all text goes through this: variant = heading |
                     subheading | body | caption; polymorphic `as` prop
  Icon/            ← glyph registry (chevrons, play/pause, volume), sized
                     by parents, currentColor, decorative by default
  Button/          ← size (sm/md/lg) × variant (primary/secondary) ×
                     content (label / icon+label / icon-only → circle)
  Carousel/
    useCarousel.ts   ← infinite-scroll logic (pure state, no DOM)
    VideoSlide.tsx   ← one card; owns its <video>, enforces active-only rules
    Carousel.tsx     ← thin orchestrator: header, arrows, track, a11y
    Carousel.css     ← geometry + Figma styling
    types.ts         ← MediaItem / CarouselProps / VideoSlideProps contracts
```

## Design decisions

**Infinite scrolling — triple render + silent snap.** The track renders the
item list three times and starts on the middle copy. Arrows animate a CSS
transform; when a transition ends outside the middle copy, the track snaps
(transition disabled for one frame) to the equivalent slide in the middle.
Endless in both directions, and React state is a single integer. One clone
per end wasn't enough because desktop shows ~4.5 cards during the wrap.

**Geometry lives in CSS custom properties.** `--slide-w` and `--slide-gap`
drive both the responsive layout *and* the track transform
(`translateX(calc(-1 * var(--ext-index) * (var(--slide-w) + var(--slide-gap))))`).
JS never measures the DOM, so window resizes can't desync the position — no
resize listeners, no layout thrash.

**Active-only interactivity.** The active slide autoplays (muted +
`playsInline`, required by mobile autoplay policies; the `play()` promise
rejection is handled for browsers that still block) and shows mute/pause
controls. Inactive slides are paused, rewound, `pointer-events: none`, and
`aria-hidden` — they can't be tabbed into or clicked, satisfying the
"only the visible video is interactive" requirement structurally rather
than by guarding every handler.

**Navigation is transition-gated.** Clicks during an in-flight transition are
ignored: one gesture, one animation. Rapid clicking can't queue transforms or
desync the active index (the same input-storm discipline flagged in the
Part 1 review).

**Accessibility.** `aria-roledescription="carousel"`, keyboard ←/→ support,
visible focus rings, a polite live region announcing "Video 2 of 5: …", and
`prefers-reduced-motion` disables the slide animation.

**Mobile.** Arrows hide under 640px per the Figma comp (swipe-first layouts);
keyboard navigation still works. Card width switches to `78vw` for the
one-card-plus-peek composition.

## Bonus ideas (not implemented, easy next steps)

- Touch/drag gestures on the track (pointer events + threshold)
- IntersectionObserver to pause the active video when the section scrolls
  off-screen
- `preload="none"` upgrade strategy: prime only active ± 1 neighbors
