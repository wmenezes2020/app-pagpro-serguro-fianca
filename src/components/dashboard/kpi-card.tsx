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
    <Card className={cn("border-gray-200 bg-white overflow-hidden relative", className)}>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {label}
          </span>
          {icon ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
              {icon}
            </span>
          ) : null}
        </div>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">
          {formatValue()}
        </p>
        {description ? (
          <p className="text-xs font-medium text-gray-500 leading-relaxed">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

