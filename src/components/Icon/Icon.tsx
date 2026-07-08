import type { ReactNode } from "react";
import type { IconName, IconProps } from "./types";

/** Icon registry — `filled` icons paint with fill, the rest with stroke. */
const icons: Record<IconName, { filled?: boolean; shape: ReactNode }> = {
  "chevron-left": { shape: <polyline points="15 18 9 12 15 6" /> },
  "chevron-right": { shape: <polyline points="9 18 15 12 9 6" /> },
  play: { filled: true, shape: <path d="M8 5v14l11-7z" /> },
  pause: {
    filled: true,
    shape: (
      <>
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </>
    ),
  },
  volume: {
    shape: (
      <>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      </>
    ),
  },
  "volume-muted": {
    shape: (
      <>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        <line x1="22" y1="9" x2="16" y2="15" />
        <line x1="16" y1="9" x2="22" y2="15" />
      </>
    ),
  },
};

/**
 * Single source for every glyph in the app. Inherits color from the parent
 * (currentColor) and is decorative by default (aria-hidden) — interactive
 * meaning belongs on the wrapping control, e.g. a Button's aria-label.
 */
export function Icon({ name, size = 16, ...rest }: IconProps) {
  const { filled, shape } = icons[name];
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={filled ? undefined : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {shape}
    </svg>
  );
}
