"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  listInvoices,
  generatePayment,
  checkPaymentStatus,
  Invoice,
} from "@/services/invoices-service";
import { toast } from "sonner";
import {
  RefreshCw,
  Download,
  Copy,
  QrCode,
  FileText,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Select } from "@/components/ui/select";

export default function InvoicesPage() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMethod, setFilterMethod] = useState<string>("all");

  const {
    data: invoices = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["invoices", filterStatus, filterMethod],
    queryFn: listInvoices,
  });

  const { mutateAsync: generatePaymentMutation, isPending: isGenerating } =
    useMutation({
      mutationFn: ({
        invoiceId,
        paymentMethod,
      }: {
        invoiceId: string;
        paymentMethod: "BOLETO" | "PIX";
      }) => generatePayment(invoiceId, paymentMethod),
      onSuccess: () => {
        toast.success("Cobrança gerada com sucesso.");
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
      },
      onError: () => {
        toast.error("Erro ao gerar cobrança.");
      },
    });

  const { mutateAsync: checkStatusMutation, isPending: isChecking } =
    useMutation({
      mutationFn: checkPaymentStatus,
      onSuccess: () => {
        toast.success("Status atualizado.");
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
      },
      onError: () => {
        toast.error("Erro ao verificar status.");
      },
    });

  const filteredInvoices = invoices.filter((invoice) => {
    if (filterStatus !== "all" && invoice.status !== filterStatus) {
      return false;
    }
    if (filterMethod !== "all" && invoice.paymentMethod !== filterMethod) {
      return false;
    }
    return true;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    const variants = {
      PENDING: { variant: "default" as const, label: "Pendente", icon: Clock },
      PAID: {
        variant: "success" as const,
        label: "Pago",
        icon: CheckCircle2,
      },
      OVERDUE: {
        variant: "danger" as const,
        label: "Vencido",
        icon: AlertCircle,
      },
      CANCELLED: {
        variant: "default" as const,
        label: "Cancelado",
        icon: XCircle,
      },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência.`);
  };

  const canManage = ["ADMIN", "DIRECTOR", "FRANQUEADO", "IMOBILIARIA"].includes(
    user?.role || ""
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2240]">Faturas</h1>
        <p className="text-sm text-slate-600 mt-1">
          Visualize e gerencie as faturas dos clientes em contrato.
        </p>
      </div>

      <Card className="border border-slate-200/60 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-extrabold text-[#0F2240]">
              Lista de Faturas
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: "all", label: "Todos os status" },
                  { value: "PENDING", label: "Pendente" },
                  { value: "PAID", label: "Pago" },
                  { value: "OVERDUE", label: "Vencido" },
                  { value: "CANCELLED", label: "Cancelado" },
                ]}
                className="w-48"
              />
              <Select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                options={[
                  { value: "all", label: "Todos os métodos" },
                  { value: "BOLETO", label: "Boleto" },
                  { value: "PIX", label: "PIX" },
                ]}
                className="w-40"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isFetching ? "animate-spin" : ""}`}
                />
                Atualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Nenhuma fatura encontrada
              </p>
              <p className="text-xs text-gray-500">
                As faturas aparecerão aqui quando houver apólices ativas.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Apólice</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {invoice.policy?.policyNumber || "-"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {invoice.policy?.application?.applicant?.fullName ||
                              invoice.policy?.application?.applicant?.email ||
                              "-"}
                          </p>
                          {invoice.policy?.application?.property?.title && (
                            <p className="text-xs text-gray-500">
                              {invoice.policy.application.property.title}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDate(invoice.dueDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.amount)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            invoice.paymentMethod === "BOLETO"
                              ? "default"
                              : "success"
                          }
                        >
                          {invoice.paymentMethod === "BOLETO" ? "Boleto" : "PIX"}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {invoice.status === "PENDING" &&
                            !invoice.externalPaymentId &&
                            canManage && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    generatePaymentMutation({
                                      invoiceId: invoice.id,
                                      paymentMethod: "BOLETO",
                                    })
                                  }
                                  disabled={isGenerating}
                                  title="Gerar Boleto"
                                >
                                  <FileText className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    generatePaymentMutation({
                                      invoiceId: invoice.id,
                                      paymentMethod: "PIX",
                                    })
                                  }
                                  disabled={isGenerating}
                                  title="Gerar PIX"
                                >
                                  <QrCode className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                          {invoice.barcode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(
                                  invoice.barcode!,
                                  "Código de barras"
                                )
                              }
                              title="Copiar código de barras"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {invoice.qrCode && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(invoice.qrCode!, "QR Code PIX")
                              }
                              title="Copiar QR Code PIX"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {invoice.externalPaymentId && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                checkStatusMutation(invoice.id)
                              }
                              disabled={isChecking}
                              title="Verificar status"
                            >
                              <RefreshCw
                                className={`h-3.5 w-3.5 ${
                                  isChecking ? "animate-spin" : ""
                                }`}
                              />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
