import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Control height (sm 34px / md 44px / lg 56px). Defaults to "md". */
  size?: ButtonSize;
  /** primary = navy fill; secondary = white with border (default). */
  variant?: ButtonVariant;
  /** Leading icon. With no children the button renders as a round icon button. */
  icon?: ReactNode;
  /** Label. Omit for an icon-only button — then aria-label is required. */
  children?: ReactNode;
}
