import type { ElementType, HTMLAttributes } from "react";

/** Typographic scale — one variant per text role in the design. */
export type TextVariant = "heading" | "subheading" | "body" | "caption";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Visual style. Defaults to "body". */
  variant?: TextVariant;
  /**
   * Rendered element. Defaults to the semantic tag for the variant
   * (heading → h2, subheading → h3, otherwise p) — override to fit the
   * surrounding markup, e.g. as="figcaption" or as="span".
   */
  as?: ElementType;
}
