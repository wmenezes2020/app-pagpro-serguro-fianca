"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listApplications } from "@/services/applications-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { applicationStatusLabels, statusVariant } from "@/utils/status";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LoadingScreen } from "@/components/layout/loading-screen";

export default function ApplicationsPage() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["applications"],
    queryFn: listApplications,
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Solicitações de seguro fiança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl text-sm text-slate-600">
              Gerencie as solicitações acompanhando status, análise de crédito e
              emissão de apólices.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/applications/new")}
            >
              Nova solicitação
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Processo</TableHead>
                <TableHead>Imóvel</TableHead>
                <TableHead>Inquilino</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {application.applicationNumber}
                    <p className="text-xs text-slate-500">
                      {formatCurrency(application.requestedRentValue)}/mês
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">
                    <span className="font-medium">
                      {application.property.title}
                    </span>
                    <p className="text-xs text-slate-500">
                      {application.property.city} · {application.property.state}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">
                    <span className="font-medium">
                      {application.applicant.fullName ??
                        application.applicant.email}
                    </span>
                    <p className="text-xs text-slate-500">
                      {application.applicant.email}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(application.status)}>
                      {applicationStatusLabels[application.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">
                    {application.creditAnalysis?.score ?? "--"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {formatDate(application.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/applications/${application.id}`)
                      }
                    >
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Nenhuma solicitação encontrada. Clique em “Nova solicitação”
                    para iniciar um processo.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

