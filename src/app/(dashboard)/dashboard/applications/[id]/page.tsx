"use client";

import { notFound } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApplication,
  updateApplicationStatus,
  updatePaymentStatus,
  reanalyzeApplication,
} from "@/services/applications-service";
import { useAuthStore } from "@/store/auth-store";
import { applicationStatusLabels, paymentStatusLabels, statusVariant } from "@/utils/status";
import { ApplicationStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LoadingScreen } from "@/components/layout/loading-screen";
import { toast } from "sonner";
import { DocumentUpload } from "@/components/applications/document-upload";
import { DocumentList } from "@/components/applications/document-list";
import { CreditAnalysisView } from "@/components/applications/credit-analysis-view";
import { RefreshCw } from "lucide-react";

const statusOptions: { value: ApplicationStatus; label: string }[] = [
  { value: "SUBMITTED", label: applicationStatusLabels.SUBMITTED },
  { value: "IN_ANALYSIS", label: applicationStatusLabels.IN_ANALYSIS },
  { value: "APPROVED", label: applicationStatusLabels.APPROVED },
  { value: "REJECTED", label: applicationStatusLabels.REJECTED },
  { value: "CANCELLED", label: applicationStatusLabels.CANCELLED },
];

export default function ApplicationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "">("");
  const [notes, setNotes] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["applications", params.id],
    queryFn: () => getApplication(params.id),
    enabled: Boolean(params.id),
  });

  const canManageStatus = useMemo(
    () => user?.role === "ADMIN" || user?.role === "IMOBILIARIA",
    [user?.role],
  );

  const { mutateAsync: mutateStatus, isPending: isUpdatingStatus } = useMutation({
    mutationFn: () =>
      updateApplicationStatus(params.id, {
        status: selectedStatus as ApplicationStatus,
        notes,
      }),
    onSuccess: () => {
      toast.success("Status da solicitação atualizado com sucesso.");
      setNotes("");
      setSelectedStatus("");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications", params.id] });
    },
    onError: () => {
      toast.error("Não foi possível atualizar o status.");
    },
  });

  const { mutateAsync: mutatePayment, isPending: isUpdatingPayment } = useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: () => {
      toast.success("Status de pagamento atualizado.");
      queryClient.invalidateQueries({ queryKey: ["applications", params.id] });
    },
    onError: () => {
      toast.error("Não foi possível atualizar o pagamento.");
    },
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!data) {
    notFound();
  }

  const policy = data.insurancePolicy;

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>
              Solicitação {data.applicationNumber}
            </CardTitle>
            <p className="text-sm text-slate-600">
              Última atualização em {formatDate(data.updatedAt)}
            </p>
          </div>
          <Badge variant={statusVariant(data.status)}>
            {applicationStatusLabels[data.status]}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-700">
            <h3 className="text-base font-semibold text-slate-900">
              Detalhes do imóvel
            </h3>
            <p>
              <span className="font-medium">Título:</span>{" "}
              {data.property.title}
            </p>
            <p>
              <span className="font-medium">Endereço:</span>{" "}
              {data.property.address}, {data.property.city} -{" "}
              {data.property.state}
            </p>
            <p>
              <span className="font-medium">Aluguel solicitado:</span>{" "}
              {formatCurrency(data.requestedRentValue)}
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-700">
            <h3 className="text-base font-semibold text-slate-900">
              Perfil do inquilino
            </h3>
            <p>
              <span className="font-medium">Nome:</span>{" "}
              {data.applicant.fullName ?? data.applicant.email}
            </p>
            <p>
              <span className="font-medium">E-mail:</span>{" "}
              {data.applicant.email}
            </p>
            <p>
              <span className="font-medium">Renda declarada:</span>{" "}
              {formatCurrency(data.monthlyIncome)}
            </p>
            <p>
              <span className="font-medium">Possui restrições:</span>{" "}
              {data.hasNegativeRecords ? "Sim" : "Não"}
            </p>
          </div>
        </CardContent>
      </Card>

      {data.creditAnalysis ? (
        <CreditAnalysisView analysis={data.creditAnalysis} />
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <DocumentUpload applicationId={params.id} />
        <Card className="border-slate-200">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle>Reanálise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-slate-600">
              Reanalise esta solicitação com os documentos mais recentes. Se a IA estiver
              configurada, ela será usada para gerar uma nova análise.
            </p>
            <ReanalyzeButton applicationId={params.id} />
          </CardContent>
        </Card>
      </div>

      <DocumentList applicationId={params.id} />

      {canManageStatus ? (
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Atualizar status da solicitação</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as ApplicationStatus)
                }
                options={statusOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Observações (opcional)</Label>
              <Textarea
                rows={4}
                placeholder="Detalhe o motivo da alteração ou informe próximos passos."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button
                onClick={() => mutateStatus()}
                loading={isUpdatingStatus}
                disabled={!selectedStatus}
              >
                Salvar alteração
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {policy ? (
        <Card className="border-slate-200">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Apólice emitida</CardTitle>
              <p className="text-sm text-slate-600">
                Cobertura ativa desde {policy.startDate ? formatDate(policy.startDate) : "--"}
              </p>
            </div>
            <Badge variant={statusVariant(policy.status)}>
              {policy.status}
            </Badge>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-slate-500">Número da apólice</p>
              <p className="text-lg font-semibold text-slate-900">
                {policy.policyNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Cobertura</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(policy.coverageAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Parcela mensal</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(policy.monthlyPremium)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Taxa de adesão</p>
              <p className="text-lg font-semibold text-slate-900">
                {formatCurrency(policy.adhesionFee)}
              </p>
            </div>
          </CardContent>

          {policy.paymentSchedule?.length ? (
            <CardContent>
              <h3 className="mb-4 text-base font-semibold text-slate-900">
                Parcela e status de pagamento
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Comprovante</TableHead>
                      <TableHead>Nota</TableHead>
                      {canManageStatus ? (
                        <TableHead className="text-right">Ações</TableHead>
                      ) : null}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {policy.paymentSchedule.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="text-sm text-slate-700">
                          {formatDate(payment.dueDate)}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-900">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusVariant(payment.status)}>
                            {paymentStatusLabels[payment.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {payment.paymentReference ?? "--"}
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {payment.notes ?? "--"}
                        </TableCell>
                        {canManageStatus ? (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              loading={isUpdatingPayment}
                              onClick={() =>
                                mutatePayment({
                                  paymentId: payment.id,
                                  status:
                                    payment.status === "PAID"
                                      ? "PENDING"
                                      : "PAID",
                                })
                              }
                            >
                              {payment.status === "PAID"
                                ? "Marcar pendente"
                                : "Confirmar pagamento"}
                            </Button>
                          </TableCell>
                        ) : null}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          ) : null}
        </Card>
      ) : null}
    </div>
  );
}

function ReanalyzeButton({ applicationId }: { applicationId: string }) {
  const queryClient = useQueryClient();
  const { mutateAsync: reanalyze, isPending } = useMutation({
    mutationFn: () => reanalyzeApplication(applicationId),
    onSuccess: () => {
      toast.success("Reanálise concluída com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["applications", applicationId] });
    },
    onError: () => {
      toast.error("Erro ao reanalisar solicitação");
    },
  });

  return (
    <Button
      onClick={() => reanalyze()}
      disabled={isPending}
      loading={isPending}
      variant="outline"
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Reanalisar solicitação
    </Button>
  );
}

