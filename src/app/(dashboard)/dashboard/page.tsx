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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Solicitações aprovadas"
          value={data?.approvals ?? 0}
          icon={<CheckCircle2 className="h-4 w-4" />}
          description="Seguro fiança aprovado nos últimos 30 dias."
        />
        <KpiCard
          label="Total de solicitações"
          value={data?.totalApplications ?? 0}
          icon={<BarChart3 className="h-4 w-4" />}
          description="Análises em todas as etapas do funil."
        />
        <KpiCard
          label="Clientes ativos"
          value={data?.clients ?? 0}
          icon={<Users className="h-4 w-4" />}
          description="Imobiliárias e inquilinos com seguro vigente."
        />
        <KpiCard
          label="Inadimplência"
          value={Number((data?.defaultRate ?? 0) * 100)}
          formatter="percent"
          icon={<PieChart className="h-4 w-4" />}
          description="Proporção de parcelas em atraso."
        />
        {data?.averageScore !== null && data?.averageScore !== undefined && (
          <KpiCard
            label="Score Médio"
            value={data.averageScore}
            icon={<Star className="h-4 w-4" />}
            description="Score médio das análises de crédito."
          />
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="border-slate-200">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>Visão geral da carteira</CardTitle>
            <p className="text-sm text-slate-600">
              Acompanhe a distribuição das solicitações por status e identifique
              oportunidades de ação rápida.
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
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
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4A90E2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Ações rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline" asChild>
              <Link href="/dashboard/applications">Ver solicitações</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/properties">Cadastrar imóvel</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/support">Abrir chamado</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Últimas atualizações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <p>
              • Cobertura máxima de acordo com o score interno atualizada
              automaticamente após análise de crédito.
            </p>
            <p>
              • Monitoramento contínuo de pagamentos com alerta de inadimplência
              em tempo real.
            </p>
            <p>
              • Acesso ao histórico de cada solicitação, incluindo documentos,
              notas internas e decisões da análise.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Suporte dedicado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <p>
              Em caso de dúvidas operacionais ou acionamento de cobertura, fale
              com nosso time especializado via painel ou canais diretos.
            </p>
            <Button variant="ghost" asChild className="justify-start px-0">
              <Link href="/dashboard/support">Acessar central de suporte</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

