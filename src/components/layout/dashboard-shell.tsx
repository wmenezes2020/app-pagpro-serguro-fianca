"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="grid min-h-[calc(100vh-2rem)] gap-6 rounded-3xl bg-surface p-4 md:grid-cols-[260px_1fr]">
      <div
        className={cn(
          "fixed inset-y-4 left-4 z-30 w-64 md:static md:w-auto",
          sidebarOpen ? "block" : "hidden md:block",
        )}
      >
        <Sidebar />
      </div>
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <div className="flex flex-col gap-4">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

