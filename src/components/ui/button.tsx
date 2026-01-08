"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "outline"
  | "danger"
  | "yellow-text";

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
    "!bg-[#FFD700] !text-[#0F2240] shadow-sm hover:!bg-[#E6C200] hover:!text-[#0F2240] focus-visible:ring-2 focus-visible:ring-[#FFD700]/40 transition-all duration-150 font-semibold",
  secondary:
    "bg-[#0F2240] text-white shadow-sm hover:bg-[#0C1B33] focus-visible:ring-2 focus-visible:ring-[#0F2240]/20 transition-all duration-150 font-medium",
  ghost:
    "bg-transparent text-[#0F2240] hover:bg-gray-100 hover:text-[#0F2240] focus-visible:ring-2 focus-visible:ring-gray-300 transition-all duration-150 font-normal",
  outline:
    "border border-[#0F2240] !text-[#0F2240] bg-white hover:bg-gray-50 hover:border-[#0C1B33] hover:!text-[#0F2240] focus-visible:ring-2 focus-visible:ring-[#0F2240] transition-all duration-150 font-normal",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-600/20 transition-all duration-150 font-medium",
  "yellow-text":
    "bg-transparent !text-[#FFD700] border-2 border-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:!bg-[#FFD700] hover:!text-[#0F2240] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] focus-visible:ring-2 focus-visible:ring-[#FFD700]/40 transition-all duration-150 font-semibold",
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

