"use client";

import Image from "next/image";
import { Menu, Search, Bell, Settings } from "lucide-react";
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
        "flex flex-col gap-4 border-b border-white/60 bg-white/90 px-6 py-5 shadow-[0_12px_30px_rgba(15,34,64,0.08)] backdrop-blur-sm md:flex-row md:items-center md:justify-between md:px-8 md:py-6",
        className,
      )}
    >
      <div className="flex items-center gap-4 flex-1">
        <Image
          src="/logo-m-black.png"
          alt="PagPro Seguro Fiança"
          width={150}
          height={40}
          className="hidden sm:block h-8 w-auto"
          priority
        />
        {/* Barra de busca centralizada */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20"
            />
          </div>
        </div>
        <div className="hidden lg:flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-600">
          <div className="rounded-xl bg-[#f7f3e0] px-3 py-2 shadow-sm">
            <p className="uppercase tracking-[0.18em] text-[#0F2240]/70">Tempo médio</p>
            <p className="text-sm font-semibold text-[#0F2240]">1h 24min</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#0F2240]/8">
            <p className="uppercase tracking-[0.18em] text-[#0F2240]/70">Próxima atualização</p>
            <p className="text-sm font-semibold text-[#0F2240]">Hoje, 16h</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="rounded-xl bg-[#e8f2ff] px-3 py-2 shadow-sm ring-1 ring-[#0F2240]/10">
            <p className="uppercase tracking-[0.18em] text-[#0F2240]/70">Status</p>
            <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
              Operação estável
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {onToggleSidebar ? (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}
        
        {/* Ícones de notificações e configurações */}
        <div className="hidden md:flex items-center gap-2">
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FFD700] ring-2 ring-white" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Configurações"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Indicador de status Online */}
        <div className="hidden lg:flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
          <span className="text-xs font-semibold text-green-700">Online</span>
        </div>

        {/* Perfil do usuário */}
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-right">
            <p className="text-xs font-medium text-gray-500 mb-0.5">
              {user?.role ?? "Usuário"}
            </p>
            <p className="text-sm font-semibold text-gray-900">
              {user?.fullName ?? user?.email}
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0F2240] to-[#0C1B33] text-white font-semibold text-sm shadow-lg">
            {user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

