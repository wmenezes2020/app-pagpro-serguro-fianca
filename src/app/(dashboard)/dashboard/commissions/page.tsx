"use client";

import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { commissionsService, CommissionSummary } from "@/services/commissions-service";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { formatCurrency } from "@/lib/utils";

export default function CommissionsPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery<CommissionSummary>({
    queryKey: ["commissions", "summary"],
    queryFn: commissionsService.getCommissionSummary,
  });

  const { data: commissions, isLoading: commissionsLoading } = useQuery({
    queryKey: ["commissions"],
    queryFn: commissionsService.getCommissions,
  });

  if (summaryLoading || commissionsLoading) {
    return <LoadingScreen />;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge variant="success">Pago</Badge>;
      case "APPROVED":
        return <Badge variant="default">Aprovado</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pendente</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
          Comissões
        </h2>
        <p className="text-gray-600">
          Acompanhe suas comissões e ganhos
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Pago"
          value={formatCurrency(summary?.totalAmount ?? 0)}
          icon={<DollarSign className="h-5 w-5" />}
          description="Valor total de comissões pagas"
        />
        <KpiCard
          label="Pendentes"
          value={summary?.totalPending ?? 0}
          icon={<Clock className="h-5 w-5" />}
          description="Comissões aguardando aprovação"
        />
        <KpiCard
          label="Aprovadas"
          value={summary?.totalApproved ?? 0}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description="Comissões aprovadas para pagamento"
        />
        <KpiCard
          label="Pagas"
          value={summary?.totalPaid ?? 0}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Comissões já pagas"
        />
      </div>

      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Histórico de Comissões</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Beneficiário</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Percentual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions && commissions.length > 0 ? (
                commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-medium text-gray-900">
                      {commission.beneficiary.fullName || commission.beneficiary.email}
                    </TableCell>
                    <TableCell className="text-gray-700">{commission.commissionType}</TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(commission.amount)}
                    </TableCell>
                    <TableCell className="text-gray-700">{commission.percentage}%</TableCell>
                    <TableCell>{getStatusBadge(commission.status)}</TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(commission.createdAt).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    Nenhuma comissão encontrada
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

