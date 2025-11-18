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
    <div className="grid min-h-[calc(100vh-2rem)] gap-6 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 md:grid-cols-[280px_1fr]">
      <div
        className={cn(
          "fixed inset-y-6 left-6 z-30 w-72 md:static md:w-auto",
          sidebarOpen ? "block" : "hidden md:block",
        )}
      >
        <Sidebar />
      </div>
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <div className="flex flex-col gap-6">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}

