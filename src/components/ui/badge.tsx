"use client";

import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}

const badgeStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-gray-100 text-gray-700 border border-gray-200",
  success: "bg-green-100 text-green-700 border border-green-200",
  warning: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  danger: "bg-red-100 text-red-700 border border-red-200",
  outline: "border border-gray-300 text-gray-700 bg-white",
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
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold",
        badgeStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

