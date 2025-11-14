"use client";

import { Menu } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface TopbarProps {
  onToggleSidebar?: () => void;
  className?: string;
}

export function Topbar({ onToggleSidebar, className }: TopbarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header
      className={cn(
        "flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
        <div>
          <p className="text-sm font-medium text-slate-500">
            Bem-vindo de volta,
          </p>
          <h1 className="text-lg font-semibold text-slate-900">
            {user?.fullName ?? user?.email}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right md:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Perfil
          </p>
          <p className="text-sm font-medium text-slate-700">
            {user?.role ?? "Usuário"}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}

