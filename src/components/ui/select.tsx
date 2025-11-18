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
        "flex h-12 w-full rounded-lg border-2 border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 focus-visible:border-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:shadow-md disabled:cursor-not-allowed disabled:bg-slate-100 disabled:border-slate-300 hover:border-slate-400",
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

