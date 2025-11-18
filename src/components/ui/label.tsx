"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-semibold text-slate-700 tracking-tight",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

