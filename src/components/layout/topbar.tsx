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
        "flex items-center justify-between rounded-xl border border-slate-300/50 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-lg",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-200 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Bem-vindo de volta
          </p>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            {user?.fullName ?? user?.email}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right md:block">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Perfil
          </p>
          <p className="text-sm font-bold text-slate-900">
            {user?.role ?? "Usuário"}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white font-bold shadow-md shadow-primary-500/30 border-2 border-white">
          {user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}

