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
    <aside className="flex h-full min-h-[calc(100vh-2rem)] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-slate-500">Navegação</h2>
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
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Button
        variant="ghost"
        fullWidth
        className="mt-6 justify-start text-sm text-slate-600 hover:bg-red-50 hover:text-red-600"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sair
      </Button>
    </aside>
  );
}

