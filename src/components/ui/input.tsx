"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition-all duration-200 focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:shadow-md disabled:cursor-not-allowed disabled:bg-slate-50 disabled:border-slate-200 hover:border-slate-300",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

