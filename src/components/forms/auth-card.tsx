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
    <Card className={cn("border-slate-300/50 shadow-xl bg-white overflow-hidden relative financial-card", className)}>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/20 to-transparent rounded-full blur-3xl -mr-32 -mt-32" />
      <CardHeader className="space-y-3 relative z-10">
        <CardTitle className="text-3xl font-bold text-slate-900 tracking-tight">
          {title}
        </CardTitle>
        {description ? (
          <p className="text-sm font-medium text-slate-600 leading-relaxed">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        {children}
        {footer ? (
          <div className="border-t border-slate-300/50 pt-6 text-sm font-medium text-slate-600">
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

