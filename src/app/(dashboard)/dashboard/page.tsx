"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  PieChart,
  ShieldCheck,
  Users,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Link from "next/link";
import { fetchDashboardMetrics } from "@/services/applications-service";
import { fetchMyCommissions, Commission } from "@/services/commissions-service";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardHomePage() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: fetchDashboardMetrics,
  });

  const { data: commissionsData } = useQuery({
    queryKey: ["commissions", "my"],
    queryFn: fetchMyCommissions,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  const commissions: Commission[] = commissionsData ?? [];
  const paidAmount = commissions
    .filter((commission) => commission.status === "PAID")
    .reduce((sum, commission) => sum + Number(commission.amount), 0);
  const validatingAmount = commissions
    .filter((commission) => commission.status === "PENDING" || commission.status === "APPROVED")
    .reduce((sum, commission) => sum + Number(commission.amount), 0);
  const totalDownlineAmount = commissions.reduce(
    (sum, commission) => sum + Number(commission.amount),
    0,
  );

  type QuickAction = { title: string; description: string; href: string };

  const defaultActions: QuickAction[] = [
    {
      title: "Cadastrar novo imóvel",
      description: "Inclua novas oportunidades para análise",
      href: "/dashboard/applications/new",
    },
    {
      title: "Criar solicitação",
      description: "Inicie uma nova proposta de seguro fiança",
      href: "/dashboard/applications/new",
    },
    {
      title: "Gerar convites tokenizados",
      description: "Convide franqueados, imobiliárias, corretores ou clientes",
      href: "/dashboard/invitations",
    },
    {
      title: "Abrir chamado",
      description: "Fale com o time dedicado PagPro",
      href: "/dashboard/support",
    },
  ];

  const quickActionsByRole: Record<string, QuickAction[]> = {
    DIRECTOR: [
      {
        title: "Cadastrar franqueado",
        description: "Amplie a rede com novos associados",
        href: "/dashboard/franqueados",
      },
      {
        title: "Cadastrar imobiliária",
        description: "Adicione players estratégicos em sua carteira",
        href: "/dashboard/imobiliarias",
      },
      {
        title: "Cadastrar corretor",
        description: "Adicione corretores diretamente pelo painel",
        href: "/dashboard/corretores",
      },
      {
        title: "Emitir convites tokenizados",
        description: "Gere links seguros para todo o ecossistema",
        href: "/dashboard/invitations",
      },
      {
        title: "Acesso ao suporte dedicado",
        description: "Acione especialistas PagPro 24/7",
        href: "/dashboard/support",
      },
    ],
    FRANQUEADO: [
      {
        title: "Cadastrar imobiliária",
        description: "Cadastre parceiros direto do painel",
        href: "/dashboard/imobiliarias",
      },
      {
        title: "Cadastrar corretor",
        description: "Crie acessos para corretores associados",
        href: "/dashboard/corretores",
      },
      {
        title: "Convidar corretores",
        description: "Emita convites tokenizados para corretores",
        href: "/dashboard/invitations",
      },
      {
        title: "Consultar comissões",
        description: "Acompanhe ganhos da rede em tempo real",
        href: "/dashboard/commissions",
      },
      {
        title: "Falar com suporte PagPro",
        description: "Time dedicado para operações críticas",
        href: "/dashboard/support",
      },
    ],
    IMOBILIARIA: defaultActions,
    CORRETOR: [
      {
        title: "Cadastrar novo cliente",
        description: "Envie propostas de seguro para inquilinos",
        href: "/dashboard/clients",
      },
      {
        title: "Gerar convites",
        description: "Convide clientes para completar o cadastro",
        href: "/dashboard/invitations",
      },
      {
        title: "Acompanhar solicitações",
        description: "Verifique o status das análises em tempo real",
        href: "/dashboard/applications",
      },
      {
        title: "Acionar suporte PagPro",
        description: "Abra um chamado com especialistas",
        href: "/dashboard/support",
      },
    ],
  };

  const primaryCtaByRole: Record<
    string,
    { label: string; href: string } | undefined
  > = {
    DIRECTOR: { label: "Criar novo franqueado", href: "/dashboard/franqueados" },
    FRANQUEADO: {
      label: "Cadastrar imobiliária",
      href: "/dashboard/imobiliarias",
    },
    IMOBILIARIA: {
      label: "Criar nova operação",
      href: "/dashboard/applications/new",
    },
    CORRETOR: {
      label: "Nova proposta",
      href: "/dashboard/applications/new",
    },
  };

  const quickActions =
    quickActionsByRole[user?.role ?? ""] ?? defaultActions;
  const primaryCta = primaryCtaByRole[user?.role ?? ""];

  const heroStats = [
    {
      label: "Receita liberada",
      value: formatCurrency(paidAmount),
      helper: "Pagamentos confirmados pelo sistema",
    },
    {
      label: "Em validação",
      value: formatCurrency(validatingAmount),
      helper: "Valores em análise financeira",
    },
    {
      label: "Coberturas ativas",
      value: `${data?.clients ?? 0} contratos`,
      helper: "Imobiliárias e clientes vigentes",
    },
  ];

  const receivableSummary = [
    {
      label: "Pagamentos liberados",
      amount: paidAmount,
      detail: "Disponíveis para transferência imediata",
      status: "Liberado",
    },
    {
      label: "Pagamentos em análise",
      amount: validatingAmount,
      detail: "Dependendo da confirmação do contrato",
      status: "Em análise",
    },
  ];

  const operationalTimeline = [
    {
      title: "Convites tokenizados",
      description: "Links gerados e monitorados pelo painel",
      status: "Ativo",
    },
    {
      title: "Comissões hierárquicas",
      description: "Distribuição automática por nível",
      status: "Automático",
    },
    {
      title: "Suporte prioritário",
      description: "Equipe dedicada 24/7 para operações críticas",
      status: "Disponível",
    },
  ];

  const recentTransactions = commissions.slice(0, 4).map((commission) => ({
    id: commission.id,
    description: commission.application
      ? `Operação ${commission.application.applicationNumber}`
      : commission.commissionType,
    reference:
      commission.beneficiary.fullName ?? commission.beneficiary.email,
    date: formatDate(commission.createdAt),
    amount: Number(commission.amount),
    status: commission.status,
  }));

  // Dados para o gráfico de linha (Taxa de entrega)
  const deliveryRateData = [
    { month: "Jan", value: 1200 },
    { month: "Fev", value: 1400 },
    { month: "Mar", value: 1600 },
    { month: "Abr", value: 1750 },
    { month: "Mai", value: 1877 },
  ];

  // Dados para o gráfico de barras (Sinistro em risco)
  const riskData = [
    { month: "Nov", value: 25 },
    { month: "Dez", value: 35 },
    { month: "Jan", value: 45 },
    { month: "Fev", value: 75 },
  ];

  // Features cards data
  const features = [
    {
      label: "Fiador 100% digital",
      description: "Onboarding tokenizado e assinatura eletrônica",
    },
    {
      label: "Cobertura configurável",
      description: "Garantia até 3x aluguel com gatilhos automáticos",
    },
    {
      label: "Hierarquia premiada",
      description: "Diretor → Cliente comissionados em tempo real",
    },
    {
      label: "IA antifraude proprietária",
      description: "Score interno + detecção contínua",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0F2240]/10 px-3 py-1 text-xs font-semibold text-[#0F2240]">
          <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse" />
          Performance em tempo real
        </div>
        <h2 className="text-3xl font-extrabold text-[#0F2240] sm:text-4xl tracking-tight leading-tight">
          Performance em tempo real
        </h2>
      </div>

      {/* Main Layout: Left Column (Charts) + Right Column (Features) */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Column - Charts */}
        <div className="space-y-6">
          {/* Card grande com gráfico de linha - Taxa de entrega */}
          <Card className="border border-slate-200/60 bg-white shadow-[0_8px_24px_-4px_rgb(15_34_64_/0.12)]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-[#0F2240] flex items-center gap-2">
                  Taxa de entrega
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-extrabold text-[#0F2240] tracking-tight">
                  {formatCurrency(1877.09)}
                </p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={deliveryRateData}>
                  <defs>
                    <linearGradient id="colorDelivery" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FFD700" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px', fontWeight: 400 }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '12px', fontWeight: 400 }}
                    tick={{ fill: '#6b7280' }}
                    domain={[0, 2000]}
                    ticks={[0, 500, 1000, 1500, 2000]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                      fontSize: '12px'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#FFD700"
                    strokeWidth={2}
                    fill="url(#colorDelivery)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Card com gráfico de barras - Sinistro em risco */}
          <Card className="border border-slate-200/60 bg-white shadow-[0_8px_24px_-4px_rgb(15_34_64_/0.12)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-[#0F2240]">
                Sinistro em risco
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px', fontWeight: 400 }}
                    tick={{ fill: '#6b7280' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: '12px', fontWeight: 400 }}
                    tick={{ fill: '#6b7280' }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                      fontSize: '12px'
                    }}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                  >
                    {riskData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === riskData.length - 1 ? "#FFD700" : "#9ca3af"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Features Cards */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <Card
              key={feature.label}
              className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#0F2240] mb-1">
                      {feature.label}
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Card destacado amarelo */}
          <Card className="border-2 border-[#FFD700]/40 bg-gradient-to-br from-[#FFD700]/20 via-[#FFD700]/10 to-[#FFD700]/5 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-extrabold text-[#0F2240] mb-3">
                Cobertura apropriada sob medida
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Monitoramento contínuo, acionamento imediato e suporte especializado para imobiliária e inquilino.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
