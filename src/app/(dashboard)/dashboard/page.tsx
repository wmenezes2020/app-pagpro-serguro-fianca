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
import { fetchDashboardMetrics, listApplications } from "@/services/applications-service";
import { fetchMyCommissions, Commission } from "@/services/commissions-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { applicationStatusLabels, statusVariant } from "@/utils/status";
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

  const { data: applicationsData } = useQuery({
    queryKey: ["applications", "dashboard"],
    queryFn: listApplications,
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

  // Calcular dados para gráficos usando dados reais do backend
  const approvalRateData = data?.monthlyTrends?.map((trend) => ({
    month: trend.month,
    value: trend.approvalRate,
  })) ?? deliveryRateData;

  const defaultRateData = data?.monthlyTrends?.map((trend) => ({
    month: trend.month,
    value: trend.defaultRate,
  })) ?? riskData;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FFD700]/20 to-[#FFD700]/10 px-4 py-1.5 text-xs font-bold text-[#0F2240] border border-[#FFD700]/30 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse shadow-sm" />
          Performance em tempo real
        </div>
        <h2 className="text-4xl font-extrabold text-[#0F2240] sm:text-5xl tracking-tight leading-tight">
          Performance em tempo real
        </h2>
      </div>

      {/* KPIs Principais - Cards Destacados */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-2 border-[#FFD700]/50 bg-gradient-to-br from-[#FFD700]/20 via-[#FFD700]/10 to-white shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                  Taxa de Aprovação
                </p>
                <p className="text-4xl font-extrabold text-[#0F2240]">
                  {data?.approvalRate ?? 0}%
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0F2240] to-[#0C1B33] flex items-center justify-center shadow-lg">
                <CheckCircle2 className="h-8 w-8 text-[#FFD700]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 via-white to-white shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                  Inadimplência
                </p>
                <p className="text-4xl font-extrabold text-red-600">
                  {data?.defaultRate ?? 0}%
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-white shadow-lg hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide">
                  Score Médio
                </p>
                <p className="text-4xl font-extrabold text-[#0F2240]">
                  {data?.averageScore ?? 0}
                </p>
              </div>
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0F2240] to-[#0C1B33] flex items-center justify-center shadow-lg">
                <BarChart3 className="h-8 w-8 text-[#FFD700]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout: Left Column (Charts) + Right Column (Features) */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Column - Charts */}
        <div className="space-y-6">
          {/* Card com gráfico de linha - Taxa de Aprovação */}
          <Card className="border border-slate-200/60 bg-white shadow-[0_8px_24px_-4px_rgb(15_34_64_/0.12)] hover:shadow-[0_12px_32px_-4px_rgb(15_34_64_/0.16)] transition-shadow duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-extrabold text-[#0F2240] flex items-center gap-2">
                  Taxa de Aprovação
                  <ChevronDown className="h-4 w-4 text-slate-400 hover:text-[#0F2240] transition-colors cursor-pointer" />
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-5">
                <p className="text-4xl font-extrabold text-[#0F2240] tracking-tight">
                  {data?.approvalRate ?? 0}%
                </p>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={approvalRateData}>
                  <defs>
                    <linearGradient id="colorApproval" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(value: number) => `${value}%`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#FFD700"
                    strokeWidth={2}
                    fill="url(#colorApproval)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Card com gráfico de barras - Inadimplência */}
          <Card className="border border-slate-200/60 bg-white shadow-[0_8px_24px_-4px_rgb(15_34_64_/0.12)] hover:shadow-[0_12px_32px_-4px_rgb(15_34_64_/0.16)] transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-extrabold text-[#0F2240]">
                Inadimplência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={defaultRateData}>
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
                    formatter={(value: number) => `${value}%`}
                  />
                  <Bar
                    dataKey="value"
                    radius={[4, 4, 0, 0]}
                  >
                    {defaultRateData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === defaultRateData.length - 1 ? "#FFD700" : "#9ca3af"}
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
              className="border border-slate-200/60 bg-white shadow-sm hover:shadow-lg transition-all duration-200 hover:border-[#FFD700]/30"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F2240] to-[#0C1B33] shadow-lg">
                      <CheckCircle2 className="h-5 w-5 text-[#FFD700]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-extrabold text-[#0F2240] mb-1.5">
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
          <Card className="border-2 border-[#FFD700]/50 bg-gradient-to-br from-[#FFD700]/25 via-[#FFD700]/15 to-[#FFD700]/8 shadow-xl hover:shadow-2xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#0F2240] to-[#0C1B33] shadow-lg">
                    <ShieldCheck className="h-5 w-5 text-[#FFD700]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold text-[#0F2240] mb-2">
                    Cobertura apropriada sob medida
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Monitoramento contínuo, acionamento imediato e suporte especializado para imobiliária e inquilino.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabela de Contratos */}
      <Card className="border border-slate-200/60 bg-white shadow-[0_8px_24px_-4px_rgb(15_34_64_/0.12)]">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-extrabold text-[#0F2240]">
            Contratos ({applicationsData?.filter((app) => app.status === 'APPROVED').length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-[#0F2240]">Nome</TableHead>
                <TableHead className="font-bold text-[#0F2240]">Data</TableHead>
                <TableHead className="font-bold text-[#0F2240]">Status</TableHead>
                <TableHead className="font-bold text-[#0F2240]">Remuneração</TableHead>
                <TableHead className="font-bold text-[#0F2240]">Score Médio</TableHead>
                <TableHead className="font-bold text-[#0F2240]">Score Obtido</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicationsData?.slice(0, 4).map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-semibold text-[#0F2240]">
                    {application.applicant.fullName ?? application.applicant.email}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatDate(application.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(application.status)}>
                      {applicationStatusLabels[application.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-[#0F2240]">
                    {formatCurrency(application.requestedRentValue)}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {data?.averageScore ?? 0}
                  </TableCell>
                  <TableCell className="font-bold text-[#0F2240]">
                    {application.creditAnalysis?.score ?? '-'}
                  </TableCell>
                </TableRow>
              ))}
              {(!applicationsData || applicationsData.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    Nenhum contrato encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
