"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Users,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
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

  return (
      <div className="space-y-10">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0F2240]/10 px-3 py-1 text-xs font-semibold text-[#0F2240]">
            <span className="h-2 w-2 rounded-full bg-[#FFD700] animate-pulse" />
            Performance em tempo real
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-extrabold text-[#0F2240] sm:text-5xl tracking-tight leading-tight">
              Performance, risco e receitas em um cockpit único
            </h2>
            <p className="max-w-3xl text-lg font-medium text-slate-700 leading-relaxed">
              Acompanhe cobrança inteligente, score interno proprietário, convites tokenizados e cobertura financeira
              com a identidade visual e a autoridade PagPro.
            </p>
          </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Tempo médio de aprovação",
              value: "1h 24min",
              color: "bg-white/80 border border-[#dfe6f3]",
            },
            {
              label: "Status operacional",
              value: "Operação estável",
              color: "bg-emerald-50 border border-emerald-200 text-emerald-700",
            },
            {
              label: "Cobertura garantida",
              value: formatCurrency(validatingAmount || 0),
              color: "bg-[#f7f3e0] border border-[#f0e3a8] text-[#0F2240]",
            },
            {
              label: "Comissões em tempo real",
              value: formatCurrency(paidAmount || 0),
              color: "bg-[#e8f2ff] border border-[#d3e4ff] text-[#0F2240]",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl px-5 py-4 text-sm shadow-[0_8px_24px_-4px_rgb(15_34_64_/0.12),0_0_0_1px_rgb(15_34_64_/0.06)] border transition-all hover:shadow-[0_12px_32px_-4px_rgb(15_34_64_/0.16)] ${item.color}`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0F2240]/70 mb-2">{item.label}</p>
              <p className="text-xl font-extrabold text-[#0F2240] tracking-tight">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr] xl:grid-cols-[2.1fr_1.1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-[0_8px_24px_-4px_rgb(15_34_64_/0.12),0_0_0_1px_rgb(15_34_64_/0.06)]">
          <div className="flex flex-col gap-4 bg-gradient-to-br from-[#0F2240] via-[#0C1B33] to-[#091426] px-8 py-8 text-white lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#FFD700]">
                  Carteira PagPro
                </p>
                <span className="security-indicator bg-white/10 border-white/20 text-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Protegido
                </span>
              </div>
              <p className="mt-2 text-4xl font-extrabold sm:text-5xl text-white tracking-tight">
                {formatCurrency(totalDownlineAmount)}
              </p>
              <p className="text-sm font-medium text-white/90 mt-2">Atualizado há poucos minutos</p>
            </div>
            <div className="flex flex-col gap-3 text-right">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/90">
                  Limite disponível
                </p>
                <p className="text-2xl font-semibold text-white">
                  {formatCurrency(validatingAmount)}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-white/90">
                <ShieldCheck className="h-4 w-4" />
                Cobertura garantida
              </div>
              <Button variant="primary" className="justify-center shadow-lg shadow-[#FFD700]/30" asChild>
                <Link href="/dashboard/commissions">Ver extrato financeiro</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 border-t border-[#eef2f7] bg-white px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                  {stat.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.helper}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="professional-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-600 mb-2">
                Fluxo financeiro
              </p>
              <h3 className="text-2xl font-extrabold text-[#0F2240] tracking-tight">
                Entrada de comissões
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200/60">Atualizado às 14:20</span>
          </div>
          <div className="mt-6 space-y-4">
            {receivableSummary.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 px-5 py-4 text-sm shadow-sm hover:shadow-md transition-all sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-600 mb-2">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-[#0F2240] tracking-tight">
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-xs font-medium text-slate-600 mt-1">{item.detail}</p>
                </div>
                <Badge variant={item.status === "Liberado" ? "success" : "warning"} className="font-bold">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="primary" className="mt-6 w-full" asChild>
            <Link href="/dashboard/commissions">Acessar extrato de comissões</Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <KpiCard
          label="Solicitações aprovadas"
          value={data?.approvals ?? 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Seguro fiança aprovado nos últimos 30 dias."
        />
        <KpiCard
          label="Total de solicitações"
          value={data?.totalApplications ?? 0}
          icon={<BarChart3 className="h-5 w-5" />}
          description="Análises em todas as etapas do funil."
        />
        <KpiCard
          label="Clientes ativos"
          value={data?.clients ?? 0}
          icon={<Users className="h-5 w-5" />}
          description="Imobiliárias e inquilinos com seguro vigente."
        />
        <KpiCard
          label="Taxa de Aprovação"
          value={data?.totalApplications ? Number(((data?.approvals ?? 0) / data.totalApplications) * 100) : 0}
          formatter="percent"
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Percentual de solicitações aprovadas."
        />
        <KpiCard
          label="Inadimplência"
          value={Number((data?.defaultRate ?? 0) * 100)}
          formatter="percent"
          icon={<PieChart className="h-5 w-5" />}
          description="Proporção de parcelas em atraso."
        />
        {data?.averageScore !== null && data?.averageScore !== undefined && (
          <KpiCard
            label="Score Médio"
            value={data.averageScore}
            icon={<Star className="h-5 w-5" />}
            description="Score médio das análises de crédito."
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border-gray-200 bg-white">
          <CardHeader className="flex flex-col gap-3">
            <CardTitle className="text-xl font-semibold text-gray-900">Visão geral da carteira</CardTitle>
            <p className="text-sm font-normal text-gray-600 leading-relaxed">
              Acompanhe a distribuição das solicitações por status e identifique
              oportunidades de ação rápida.
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={[
                  {
                    name: "Aprovadas",
                    value: data?.approvals ?? 0,
                  },
                  {
                    name: "Total",
                    value: data?.totalApplications ?? 0,
                  },
                  {
                    name: "Clientes",
                    value: data?.clients ?? 0,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  style={{ fontSize: '12px', fontWeight: 400 }}
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  style={{ fontSize: '12px', fontWeight: 400 }}
                  tick={{ fill: '#6b7280' }}
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
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                <Bar
                  dataKey="value"
                  fill="#FFD700"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="gradient-card hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-xl font-semibold text-[#0F2240]">Ações rápidas</CardTitle>
              <Badge className="bg-[#FFD700] text-[#0F2240] shadow-sm">Fluxo prioritário</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Cadastre operações, convites tokenizados e acione suporte dedicado em poucos cliques.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col gap-1 rounded-2xl border border-gray-100 px-4 py-3 transition-all hover:border-[#0F2240]/20 hover:bg-[#0F2240]/5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0F2240]">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#FFD700] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
            {primaryCta ? (
              <Button className="w-full shadow-md shadow-[#FFD700]/30" asChild>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#0F2240]">Últimas atualizações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm font-normal text-gray-700 leading-relaxed">
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-[#FFD700] mt-2 flex-shrink-0" />
              <p>
                Cobertura máxima de acordo com o score interno atualizada
                automaticamente após análise de crédito.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-[#FFD700] mt-2 flex-shrink-0" />
              <p>
                Monitoramento contínuo de pagamentos com alerta de inadimplência
                em tempo real.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-[#FFD700] mt-2 flex-shrink-0" />
              <p>
                Acesso ao histórico de cada solicitação, incluindo documentos,
                notas internas e decisões da análise.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[#0F2240]">Status operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {operationalTimeline.map((event) => (
              <div key={event.title} className="rounded-2xl border border-[#e5eaf3] bg-white/70 px-4 py-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#0F2240]">{event.title}</p>
                  <Badge
                    variant={
                      event.status === "Ativo" || event.status === "Disponível"
                        ? "success"
                        : event.status === "Automático"
                          ? "default"
                          : "warning"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">{event.description}</p>
              </div>
            ))}
            <Button variant="ghost" asChild className="justify-start px-0 w-fit h-auto py-0 text-[#f5c437] hover:text-[#f1b60d]">
              <Link href="/dashboard/support">Acessar central de suporte →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="gradient-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Movimentações recentes
          </CardTitle>
          <Button variant="outline" asChild className="h-10 px-4 text-sm font-medium">
            <Link href="/dashboard/applications">Ver extrato completo</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhuma movimentação registrada até o momento.
            </p>
          ) : (
            recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-col gap-3 border-b border-gray-100 pb-4 last:border-none last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{transaction.description}</p>
                  <p className="text-xs text-gray-500">
                    {transaction.reference} • {transaction.date}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      transaction.status === "PAID" ? "text-emerald-600" : "text-gray-600",
                    )}
                  >
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.status}</p>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
