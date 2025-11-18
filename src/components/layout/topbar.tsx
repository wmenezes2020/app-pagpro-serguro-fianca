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
        "flex items-center justify-between rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
        <div>
          <p className="text-xs font-medium text-gray-500">
            Bem-vindo de volta
          </p>
          <h1 className="text-lg font-semibold text-gray-900">
            {user?.fullName ?? user?.email}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right md:block">
          <p className="text-xs font-medium text-gray-500">
            Perfil
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {user?.role ?? "Usuário"}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 text-white font-semibold text-sm">
          {user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}

