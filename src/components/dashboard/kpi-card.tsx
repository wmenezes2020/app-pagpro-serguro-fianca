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
    <Card className={cn("border-gray-800 bg-gradient-to-br from-gray-900 to-black overflow-hidden relative financial-card", className)}>
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-accent-600/20 to-transparent rounded-full blur-3xl -mr-20 -mt-20" />
      <CardContent className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {label}
          </span>
          {icon ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-600 via-accent-600 to-accent-700 text-black shadow-md luxury-glow border border-accent-600/30">
              {icon}
            </span>
          ) : null}
        </div>
        <p className="text-4xl font-bold text-white tracking-tight">
          {formatValue()}
        </p>
        {description ? (
          <p className="text-xs font-medium text-gray-400 leading-relaxed">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

