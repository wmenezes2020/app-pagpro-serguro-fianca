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
    "bg-gray-900 text-white shadow-sm hover:bg-gray-800 focus-visible:ring-4 focus-visible:ring-gray-900/20 transition-all duration-200 font-semibold",
  secondary:
    "bg-green-600 text-white shadow-sm hover:bg-green-700 focus-visible:ring-4 focus-visible:ring-green-600/20 transition-all duration-200 font-semibold",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-gray-300 transition-all duration-200 font-medium",
  outline:
    "border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus-visible:ring-4 focus-visible:ring-gray-300 transition-all duration-200 font-medium",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-4 focus-visible:ring-red-600/20 transition-all duration-200 font-semibold",
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

