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
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 md:static md:z-auto",
          sidebarOpen ? "block" : "hidden md:block",
        )}
      >
        <div className="h-full overflow-y-auto bg-black md:sticky md:top-0 md:h-screen md:bg-transparent">
          <Sidebar />
        </div>
      </div>
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}
      <div className="flex flex-1 flex-col md:ml-0">
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <div className="mx-auto w-full max-w-7xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

