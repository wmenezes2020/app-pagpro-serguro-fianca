"use client";

import { ReactNode } from "react";
import { cn, formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: number | string | null;
  icon?: ReactNode;
  formatter?: "number" | "currency" | "percent";
  description?: string;
  className?: string;
}

export function KpiCard({
  label,
  value,
  icon,
  formatter = "number",
  description,
  className,
}: KpiCardProps) {
  const formatValue = () => {
    if (value === null || value === undefined) {
      return "--";
    }
    switch (formatter) {
      case "currency":
        return formatCurrency(Number(value));
      case "percent":
        return `${Number(value).toFixed(1)}%`;
      default:
        return value;
    }
  };

  return (
    <Card className={cn("border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 overflow-hidden relative", className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full blur-2xl -mr-16 -mt-16" />
      <CardContent className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </span>
          {icon ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25">
              {icon}
            </span>
          ) : null}
        </div>
        <p className="text-4xl font-bold text-slate-900 tracking-tight">
          {formatValue()}
        </p>
        {description ? (
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

