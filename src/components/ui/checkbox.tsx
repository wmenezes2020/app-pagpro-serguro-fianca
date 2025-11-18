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
        "h-5 w-5 rounded-lg border-2 border-slate-300 text-primary-600 focus:ring-4 focus:ring-primary/20 focus:ring-offset-0 transition-all duration-200 cursor-pointer hover:border-primary-400",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";

