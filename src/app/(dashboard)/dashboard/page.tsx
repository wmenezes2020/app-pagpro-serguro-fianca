"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  CheckCircle2,
  PieChart,
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
import { fetchDashboardMetrics } from "@/services/applications-service";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LoadingScreen } from "@/components/layout/loading-screen";

export default function DashboardHomePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "metrics"],
    queryFn: fetchDashboardMetrics,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">
          Visão Geral
        </h2>
        <p className="text-slate-600">
          Acompanhe suas métricas e performance em tempo real
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
        <Card className="border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50">
          <CardHeader className="flex flex-col gap-3">
            <CardTitle className="text-2xl">Visão geral da carteira</CardTitle>
            <p className="text-sm text-slate-600 leading-relaxed">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <YAxis 
                  stroke="#64748b"
                  style={{ fontSize: '12px', fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="url(#colorGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5450d4" stopOpacity={1} />
                    <stop offset="100%" stopColor="#6b6ef1" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50">
          <CardHeader>
            <CardTitle className="text-2xl">Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" asChild className="justify-start h-12">
              <Link href="/dashboard/applications">Ver solicitações</Link>
            </Button>
            <Button variant="outline" asChild className="justify-start h-12">
              <Link href="/dashboard/properties">Cadastrar imóvel</Link>
            </Button>
            <Button variant="outline" asChild className="justify-start h-12">
              <Link href="/dashboard/support">Abrir chamado</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50">
          <CardHeader>
            <CardTitle className="text-2xl">Últimas atualizações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
              <p>
                Cobertura máxima de acordo com o score interno atualizada
                automaticamente após análise de crédito.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
              <p>
                Monitoramento contínuo de pagamentos com alerta de inadimplência
                em tempo real.
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex h-2 w-2 rounded-full bg-primary-600 mt-2 flex-shrink-0" />
              <p>
                Acesso ao histórico de cada solicitação, incluindo documentos,
                notas internas e decisões da análise.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50">
          <CardHeader>
            <CardTitle className="text-2xl">Suporte dedicado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Em caso de dúvidas operacionais ou acionamento de cobertura, fale
              com nosso time especializado via painel ou canais diretos.
            </p>
            <Button variant="ghost" asChild className="justify-start px-0 w-fit">
              <Link href="/dashboard/support" className="text-primary-600 hover:text-primary-700 font-semibold">
                Acessar central de suporte →
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

