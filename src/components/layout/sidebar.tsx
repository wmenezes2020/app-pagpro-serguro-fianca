"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  DollarSign,
  Files,
  Home,
  LifeBuoy,
  LogOut,
  ShieldCheck,
  UserRoundCog,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { logout } from "@/services/auth-service";
import { toast } from "sonner";

const baseNav = [
  {
    href: "/dashboard",
    label: "Visão Geral",
    icon: Home,
  },
  {
    href: "/dashboard/applications",
    label: "Solicitações",
    icon: Files,
  },
  {
    href: "/dashboard/commissions",
    label: "Comissões",
    icon: DollarSign,
  },
  {
    href: "/dashboard/support",
    label: "Suporte",
    icon: LifeBuoy,
  },
  {
    href: "/dashboard/profile",
    label: "Perfil",
    icon: UserRoundCog,
  },
];

const imobiliariaNav = [
  ...baseNav,
  {
    href: "/dashboard/clients",
    label: "Clientes",
    icon: Users,
  },
  {
    href: "/dashboard/brokers",
    label: "Corretores",
    icon: UserRoundCog,
  },
  {
    href: "/dashboard/properties",
    label: "Imóveis",
    icon: ShieldCheck,
  },
];

const adminNav = [
  ...imobiliariaNav,
  {
    href: "/dashboard/relatorios",
    label: "Relatórios",
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const navItems =
    user?.role === "ADMIN"
      ? adminNav
      : user?.role === "IMOBILIARIA"
        ? imobiliariaNav
        : baseNav;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();
      toast.success("Sessão encerrada.");
      window.location.href = "/login";
    }
  };

  return (
    <aside className="flex h-full min-h-[calc(100vh-2rem)] flex-col rounded-2xl border border-gray-800 bg-gradient-to-b from-black via-gray-900 to-black p-6 shadow-2xl backdrop-blur-sm luxury-glow">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-600 via-accent-700 to-accent-700 shadow-lg luxury-glow">
            <ShieldCheck className="h-6 w-6 text-black" />
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-black shadow-sm" />
          </div>
          <div>
            <p className="text-base font-bold text-white tracking-tight">PagPro</p>
            <p className="text-xs font-semibold text-accent-600 uppercase tracking-wider">Finance</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
      </div>
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (pathname.startsWith(item.href) && item.href !== "/dashboard");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 relative",
                isActive
                  ? "bg-gradient-to-r from-accent-600 to-accent-700 text-black shadow-md luxury-glow"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-black rounded-r-full" />
              )}
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                isActive ? "text-black" : "text-gray-400 group-hover:text-white"
              )} />
              <span className={cn(isActive ? "text-black font-bold" : "")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 pt-6 border-t border-gray-800">
        <Button
          variant="ghost"
          fullWidth
          className="justify-start text-sm font-semibold text-gray-300 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}

