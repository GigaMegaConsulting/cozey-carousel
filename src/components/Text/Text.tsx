import type { TextVariant, TextProps } from "./types";
import "./Text.css";

const defaultTag: Record<TextVariant, "h2" | "h3" | "p"> = {
  heading: "h2",
  subheading: "h3",
  body: "p",
  caption: "p",
};

/**
 * The only way text is rendered in the app: every string goes through a
 * variant of the typographic scale, so sizes/fonts stay consistent and a
 * scale change is a one-file edit. Element and style are independent —
 * pick the tag with `as`, the look with `variant`.
 */
export function Text({ variant = "body", as, className, ...rest }: TextProps) {
  const Tag = as ?? defaultTag[variant];
  const classes = ["text", `text--${variant}`, className].filter(Boolean).join(" ");
  return <Tag className={classes} {...rest} />;
}
