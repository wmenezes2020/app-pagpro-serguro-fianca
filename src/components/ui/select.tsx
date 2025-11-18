"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-12 w-full rounded-xl border-2 border-slate-200 bg-white px-4 text-sm text-slate-900 shadow-sm transition-all duration-200 focus-visible:border-primary-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:shadow-md disabled:cursor-not-allowed disabled:bg-slate-50 disabled:border-slate-200 hover:border-slate-300",
        className,
      )}
      {...props}
    >
      {children}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
);
Select.displayName = "Select";

