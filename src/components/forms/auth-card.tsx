"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  footer,
  children,
  className,
}: AuthCardProps) {
  return (
    <Card className={cn("border-slate-200 shadow-lg", className)}>
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-semibold text-slate-900">
          {title}
        </CardTitle>
        {description ? (
          <p className="text-sm text-slate-600">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        {footer ? (
          <div className="border-t border-slate-200 pt-4 text-sm text-slate-600">
            {footer}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AuthCardFooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <p>
      {label}{" "}
      <Link href={href} className="font-semibold text-primary hover:underline">
        Acessar
      </Link>
    </p>
  );
}

