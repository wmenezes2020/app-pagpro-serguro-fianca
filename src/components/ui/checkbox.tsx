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
        "h-4 w-4 rounded border border-slate-300 text-primary focus:ring-primary focus:ring-offset-0",
        className,
      )}
      {...props}
    />
  ),
);
Checkbox.displayName = "Checkbox";

