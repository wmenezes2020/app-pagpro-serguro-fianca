"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:from-primary-700 hover:to-primary-800 focus-visible:ring-primary/30 transition-all duration-200",
  secondary:
    "bg-gradient-to-r from-secondary to-secondary-700 text-white shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/30 hover:from-secondary-700 hover:to-secondary-800 focus-visible:ring-secondary/30 transition-all duration-200",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100/80 focus-visible:ring-slate-200 transition-all duration-200",
  outline:
    "border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-slate-200 transition-all duration-200",
  danger:
    "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:from-red-600 hover:to-red-700 focus-visible:ring-red-200 transition-all duration-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      type = "button",
      loading,
      disabled,
      icon,
      iconRight,
      fullWidth,
      asChild,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const Component = asChild ? Slot : "button";
    const content = (
      <>
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        ) : (
          icon
        )}
        <span className="inline-flex items-center gap-2">{children}</span>
        {iconRight}
      </>
    );

    return (
      <Component
        ref={ref}
        type={asChild ? undefined : type}
        disabled={asChild ? undefined : isDisabled}
        aria-disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && "w-full",
          className,
        )}
        {...props}
      >
        {content}
      </Component>
    );
  },
);
Button.displayName = "Button";

