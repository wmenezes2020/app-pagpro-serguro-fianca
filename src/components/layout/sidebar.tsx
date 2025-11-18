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
    <aside className="flex h-full min-h-[calc(100vh-2rem)] flex-col rounded-xl border border-gray-200 bg-gray-800 p-5 shadow-lg">
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-white">
            <ShieldCheck className="h-5 w-5 text-gray-800" />
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-tight">PagPro</p>
            <p className="text-xs font-medium text-gray-400">Finance</p>
          </div>
        </div>
        <div className="h-px bg-gray-700" />
      </div>
      <nav className="flex-1 space-y-1">
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
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white",
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-transform duration-200 flex-shrink-0",
                isActive ? "text-gray-900" : "text-gray-400 group-hover:text-white"
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <Button
          variant="ghost"
          fullWidth
          className="justify-start text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
}

