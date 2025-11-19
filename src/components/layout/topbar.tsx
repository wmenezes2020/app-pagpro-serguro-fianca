"use client";

import Image from "next/image";
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
        "flex flex-col gap-4 border-b border-gray-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8 md:py-6",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <Image
          src="/logo-m-black.png"
          alt="PagPro Seguro Fiança"
          width={150}
          height={40}
          className="hidden sm:block h-8 w-auto"
          priority
        />
        <div className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500">
          <div>
            <p className="uppercase tracking-[0.2em] text-gray-400">Tempo médio</p>
            <p className="text-sm font-semibold text-gray-900">1h 24min</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div>
            <p className="uppercase tracking-[0.2em] text-gray-400">Próxima atualização</p>
            <p className="text-sm font-semibold text-gray-900">Hoje, 16h</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div>
            <p className="uppercase tracking-[0.2em] text-gray-400">Status</p>
            <p className="text-sm font-semibold text-emerald-600">Operação estável</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
        <div className="text-right md:text-left">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Bem-vindo de volta
          </p>
          <p className="text-lg font-semibold text-gray-900 sm:text-xl">
            {user?.fullName ?? user?.email}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden text-right md:block">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Perfil
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {user?.role ?? "Usuário"}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a1a1a] text-white font-semibold text-sm">
          {user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
}

