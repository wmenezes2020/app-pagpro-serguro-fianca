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
    "bg-gradient-to-r from-accent-600 via-accent-600 to-accent-700 text-black shadow-md shadow-accent-600/30 hover:shadow-lg hover:shadow-accent-600/40 hover:from-accent-700 hover:via-accent-700 hover:to-accent-800 focus-visible:ring-4 focus-visible:ring-accent-600/20 transition-all duration-200 font-bold",
  secondary:
    "bg-gradient-to-r from-secondary via-secondary-600 to-secondary-700 text-white shadow-md shadow-secondary/30 hover:shadow-lg hover:shadow-secondary/40 hover:from-secondary-600 hover:via-secondary-700 hover:to-secondary-800 focus-visible:ring-4 focus-visible:ring-secondary/20 transition-all duration-200 font-bold",
  ghost:
    "bg-transparent text-gray-300 hover:bg-gray-800 hover:text-white focus-visible:ring-2 focus-visible:ring-gray-700 transition-all duration-200 font-semibold",
  outline:
    "border-2 border-gray-700 text-white bg-transparent hover:bg-gray-800 hover:border-accent-600 hover:text-accent-600 focus-visible:ring-4 focus-visible:ring-gray-700 transition-all duration-200 font-semibold",
  danger:
    "bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-md shadow-red-500/30 hover:shadow-lg hover:shadow-red-500/40 hover:from-red-700 hover:via-red-800 hover:to-red-900 focus-visible:ring-4 focus-visible:ring-red/20 transition-all duration-200 font-bold",
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

