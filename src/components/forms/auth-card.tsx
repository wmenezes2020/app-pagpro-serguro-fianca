"use client";

import Image from "next/image";
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
    <Card className={cn("border-gray-200 shadow-xl bg-white overflow-hidden relative max-w-2xl w-full", className)}>
      <CardHeader className="space-y-4 text-center pb-6 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="flex justify-center">
          <Image
            src="/logo-m-black.png"
            alt="PagPro Seguro Fiança"
            width={180}
            height={48}
            priority
            className="h-12 w-auto"
          />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold text-gray-900 tracking-tight">
            {title}
          </CardTitle>
          {description ? (
            <p className="text-sm font-normal text-gray-600 leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        {children}
        {footer ? (
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="text-xs font-normal text-gray-500 text-center leading-relaxed">
              {footer}
            </div>
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
      <Link href={href} className="font-semibold text-[#f5c437] hover:text-[#f1b60d] hover:underline">
        Acessar
      </Link>
    </p>
  );
}

