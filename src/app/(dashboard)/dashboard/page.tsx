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
    <div className="space-y-8">
      <div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          Visão Geral
        </h2>
        <p className="text-sm font-normal text-gray-600">
          Acompanhe suas métricas e performance em tempo real
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.7fr_1fr] xl:grid-cols-[2.1fr_1.1fr]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 bg-[#121212] px-8 py-6 text-white lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/90">
                Carteira PagPro
              </p>
              <p className="mt-2 text-3xl font-semibold sm:text-4xl">
                {formatCurrency(totalDownlineAmount)}
              </p>
              <p className="text-sm text-white/90">Atualizado há poucos minutos</p>
            </div>
            <div className="flex flex-col gap-3 text-right">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/90">
                  Limite disponível
                </p>
                <p className="text-2xl font-semibold">
                  {formatCurrency(validatingAmount)}
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 text-xs text-white/90">
                <ShieldCheck className="h-4 w-4" />
                Cobertura garantida
              </div>
              <Button variant="primary" className="justify-center" asChild>
                <Link href="/dashboard/commissions">Ver extrato financeiro</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 border-t border-gray-100 bg-white px-6 py-6 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Fluxo financeiro
              </p>
              <h3 className="text-xl font-semibold text-gray-900">
                Entrada de comissões
              </h3>
            </div>
            <span className="text-xs text-gray-500">Atualizado às 14:20</span>
          </div>
          <div className="mt-6 space-y-4">
            {receivableSummary.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-3 rounded-2xl border border-gray-100 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {formatCurrency(item.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{item.detail}</p>
                </div>
                <Badge variant={item.status === "Liberado" ? "success" : "warning"}>
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
                  fill="#4b5563"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col gap-1 rounded-2xl border border-gray-100 px-4 py-3 transition-all hover:border-gray-300 hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-400 transition group-hover:text-gray-900" />
              </Link>
            ))}
            {primaryCta ? (
              <Button className="w-full" asChild>
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Últimas atualizações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm font-normal text-gray-700 leading-relaxed">
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>
                Cobertura máxima de acordo com o score interno atualizada
                automaticamente após análise de crédito.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>
                Monitoramento contínuo de pagamentos com alerta de inadimplência
                em tempo real.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
              <p>
                Acesso ao histórico de cada solicitação, incluindo documentos,
                notas internas e decisões da análise.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Status operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {operationalTimeline.map((event) => (
              <div key={event.title} className="rounded-2xl border border-gray-100 px-4 py-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900">{event.title}</p>
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

      <Card className="border-gray-200 bg-white">
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
