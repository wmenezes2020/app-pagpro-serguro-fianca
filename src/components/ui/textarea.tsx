"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, rows = 4, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm transition-all duration-200 focus-visible:border-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 focus-visible:shadow-md disabled:cursor-not-allowed disabled:bg-slate-100 disabled:border-slate-300 hover:border-slate-400",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

