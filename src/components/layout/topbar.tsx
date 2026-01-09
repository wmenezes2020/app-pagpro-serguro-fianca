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
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar..."
              className="w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm py-2.5 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm transition-all focus:border-[#FFD700] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD700]/20 focus:shadow-md"
            />
          </div>
        </div>
        <div className="hidden lg:flex flex-wrap items-center gap-3 text-xs">
          <div className="rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFD700]/90 px-4 py-2.5 shadow-lg shadow-[#FFD700]/20 border border-[#FFD700]/30">
            <p className="uppercase tracking-[0.15em] text-[#0F2240]/80 text-[10px] font-bold mb-0.5">
              TEMPO MÉDIO
            </p>
            <p className="text-lg font-extrabold text-[#0F2240]">1h 24min</p>
          </div>
          <div className="rounded-xl bg-white px-4 py-2.5 shadow-md border border-slate-200/60">
            <p className="uppercase tracking-[0.15em] text-slate-600 text-[10px] font-bold mb-0.5">
              PRÓXIMA ATUALIZAÇÃO
            </p>
            <p className="text-lg font-extrabold text-[#0F2240]">Hoje, 16h</p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 px-4 py-2.5 shadow-md border border-blue-200/60">
            <p className="uppercase tracking-[0.15em] text-slate-600 text-[10px] font-bold mb-0.5 flex items-center gap-2">
              STATUS
              <span className="relative">
                <span className="h-2 w-2 rounded-full bg-green-500 block"></span>
                <span className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75"></span>
              </span>
            </p>
            <p className="text-lg font-extrabold text-[#0F2240]">Operação estável</p>
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
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0F2240] transition-all duration-200"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#FFD700] ring-2 ring-white shadow-sm" />
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-[#0F2240] transition-all duration-200"
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
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0F2240] to-[#0C1B33] text-white font-bold text-sm shadow-lg ring-2 ring-white">
            {user?.fullName?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
          </div>
        </div>
      </div>
    </header>
  );
}

