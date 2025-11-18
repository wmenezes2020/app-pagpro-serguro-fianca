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
    <Card className={cn("border-gray-200 shadow-lg bg-white overflow-hidden relative", className)}>
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl font-semibold text-gray-900 tracking-tight">
          {title}
        </CardTitle>
        {description ? (
          <p className="text-sm font-medium text-gray-600 leading-relaxed">{description}</p>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        {footer ? (
          <div className="border-t border-gray-200 pt-6 text-sm font-medium text-gray-600">
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
      <Link href={href} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline">
        Acessar
      </Link>
    </p>
  );
}

