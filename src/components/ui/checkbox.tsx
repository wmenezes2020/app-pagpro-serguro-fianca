"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 transition-all duration-200 cursor-pointer hover:border-gray-400",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";

