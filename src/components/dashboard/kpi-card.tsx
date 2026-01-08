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
    <Card className={cn("border-slate-200/80 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1", className)}>
      <CardContent className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {label}
          </span>
          {icon ? (
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F2240] to-[#0C1B33] text-[#FFD700] shadow-lg">
              {icon}
            </span>
          ) : null}
        </div>
        <p className="text-4xl font-extrabold text-[#0F2240] tracking-tight">
          {formatValue()}
        </p>
        {description ? (
          <p className="text-xs font-medium text-slate-600 leading-relaxed">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

