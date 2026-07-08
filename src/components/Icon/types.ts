import type { SVGAttributes } from "react";

export type IconName =
  | "chevron-left"
  | "chevron-right"
  | "play"
  | "pause"
  | "volume"
  | "volume-muted";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: IconName;
  /** Rendered width/height in px. Defaults to 16; parents (e.g. Button) may resize via CSS. */
  size?: number;
}
