"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { LoadingScreen } from "@/components/layout/loading-screen";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading } = useAuthGuard();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="p-6">
        <LoadingScreen />
      </div>
    );
  }

  return <DashboardShell>{children}</DashboardShell>;
}

