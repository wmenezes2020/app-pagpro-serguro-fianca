"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

const badgeStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200/80 shadow-sm",
  success: "bg-gradient-to-r from-secondary-50 to-secondary-100 text-secondary-700 border border-secondary-200/80 shadow-sm",
  warning: "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200/80 shadow-sm",
  danger: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200/80 shadow-sm",
  outline: "border-2 border-slate-300 text-slate-700 bg-white shadow-sm",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider",
        badgeStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

