"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
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
    <aside className="flex h-full min-h-[calc(100vh-2rem)] flex-col rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-6 shadow-xl backdrop-blur-sm">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg shadow-primary-500/25">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">PagPro</p>
            <p className="text-xs font-medium text-slate-500">Seguro Fiança</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
      <nav className="flex-1 space-y-2">
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
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/25"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200",
                isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 pt-6 border-t border-slate-200">
        <Button
          variant="ghost"
          fullWidth
          className="justify-start text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}

