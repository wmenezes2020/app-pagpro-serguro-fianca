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
    <Card className={cn("border-slate-200", className)}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {label}
          </span>
          {icon ? (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              {icon}
            </span>
          ) : null}
        </div>
        <p className="text-3xl font-semibold text-slate-900">
          {formatValue()}
        </p>
        {description ? (
          <p className="text-xs text-slate-500">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

