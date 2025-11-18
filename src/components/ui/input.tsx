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
        "flex h-12 w-full rounded-lg border-2 border-gray-700 bg-gray-900 px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 focus-visible:border-accent-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-600/20 focus-visible:shadow-md disabled:cursor-not-allowed disabled:bg-gray-800 disabled:border-gray-800 hover:border-gray-600 placeholder:text-gray-500",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

