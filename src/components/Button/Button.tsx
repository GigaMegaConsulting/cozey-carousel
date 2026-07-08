import type { ButtonProps } from "./types";
import "./Button.css";

/**
 * The app's only button primitive. Composes three axes independently:
 * size (sm/md/lg), variant (primary/secondary), and content (label,
 * icon + label, or icon-only — which renders as a circle, like the
 * carousel arrows and video controls). Icons are sized by the button,
 * so any Icon dropped in fits the control.
 */
export function Button({
  size = "md",
  variant = "secondary",
  icon,
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const iconOnly = icon != null && children == null;
  const classes = [
    "btn",
    `btn--${size}`,
    `btn--${variant}`,
    iconOnly && "btn--icon-only",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {icon != null && <span className="btn__icon">{icon}</span>}
      {children != null && <span className="btn__label">{children}</span>}
    </button>
  );
}
