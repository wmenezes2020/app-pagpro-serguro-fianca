"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  BarChart3,
  Building2,
  DollarSign,
  Files,
  Home,
  LifeBuoy,
  Link2,
  LogOut,
  ShieldCheck,
  UserRoundCog,
  Users,
  UserCog,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore, UserRole } from "@/store/auth-store";
import { logout } from "@/services/auth-service";
import { toast } from "sonner";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  badge?: string;
};

const baseNav: NavItem[] = [
  {
    href: "/dashboard",
    label: "Visão Geral",
    icon: Home,
  },
  {
    href: "/dashboard/invitations",
    label: "Convites",
    icon: Link2,
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
    badge: "3",
  },
];

const profileNav: NavItem = {
  href: "/dashboard/profile",
  label: "Perfil",
  icon: UserRoundCog,
};

const roleNavMap: Partial<Record<UserRole, NavItem[]>> = {
  CORRETOR: [
    {
      href: "/dashboard/clients",
      label: "Clientes",
      icon: Users,
    },
  ],
  IMOBILIARIA: [
    {
      href: "/dashboard/clients",
      label: "Clientes",
      icon: Users,
    },
    {
      href: "/dashboard/brokers",
      label: "Corretores",
      icon: UserCog,
    },
    {
      href: "/dashboard/properties",
      label: "Imóveis",
      icon: ShieldCheck,
    },
  ],
  FRANQUEADO: [
    {
      href: "/dashboard/imobiliarias",
      label: "Imobiliárias",
      icon: Building2,
    },
  ],
  DIRECTOR: [
    {
      href: "/dashboard/franqueados",
      label: "Franqueados",
      icon: UserCog,
    },
    {
      href: "/dashboard/imobiliarias",
      label: "Imobiliárias",
      icon: Building2,
    },
  ],
  ADMIN: [
    {
      href: "/dashboard/franqueados",
      label: "Franqueados",
      icon: UserCog,
    },
    {
      href: "/dashboard/imobiliarias",
      label: "Imobiliárias",
      icon: Building2,
    },
    {
      href: "/dashboard/clients",
      label: "Clientes",
      icon: Users,
    },
    {
      href: "/dashboard/brokers",
      label: "Corretores",
      icon: UserCog,
    },
    {
      href: "/dashboard/properties",
      label: "Imóveis",
      icon: ShieldCheck,
    },
    {
      href: "/dashboard/relatorios",
      label: "Relatórios",
      icon: BarChart3,
    },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const navItems = useMemo(() => {
    const merged = [...baseNav];
    if (user?.role) {
      const extras = roleNavMap[user.role] ?? [];
      extras.forEach((item) => {
        if (!merged.some((existing) => existing.href === item.href)) {
          merged.push(item);
        }
      });
    }
    if (!merged.some((item) => item.href === profileNav.href)) {
      merged.push(profileNav);
    }
    return merged;
  }, [user?.role]);

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
    <aside className="flex h-full flex-col bg-gradient-to-b from-[#080808] via-[#0f0f12] to-[#050505] p-4 sm:p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.65)] md:h-screen">
      <div className="border-b border-white/10 pb-4">
        <Image
          src="/logo-m-white.png"
          alt="PagPro Seguro Fiança"
          width={160}
          height={42}
          priority
          className="h-10 w-auto"
        />
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/40">Menu principal</p>
        <nav className="mt-4 space-y-1.5">
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
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white text-gray-900 shadow-[0_15px_30px_rgba(0,0,0,0.25)]"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                {isActive ? (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-[#f5c437]" />
                ) : null}
                <Icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-gray-900" : "text-white/50 group-hover:text-white",
                  )}
                />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="ml-auto rounded-full bg-red-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/50">
            Suporte premium
          </p>
          <p className="mt-2 text-base font-semibold text-white">
            Canal dedicado 24/7
          </p>
          <p className="text-xs text-white/60">
            Atendimento exclusivo para parceiros PagPro.
          </p>
          <button className="mt-3 text-xs font-semibold text-[#f5c437] hover:text-[#f1b60d]">
            Falar com especialista →
          </button>
        </div> */}
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-all duration-200 hover:bg-white/5 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}

