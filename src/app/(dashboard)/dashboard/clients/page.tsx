"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Search,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
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
  ClientStatus,
  ImobiliariaClient,
  createImobiliariaClient,
  deleteImobiliariaClient,
  listImobiliariaClients,
  updateImobiliariaClient,
} from "@/services/imobiliaria-clients-service";

const statusOptions: { label: string; value: ClientStatus }[] = [
  { label: "Novo", value: "NEW" },
  { label: "Em análise", value: "IN_ANALYSIS" },
  { label: "Aprovado", value: "APPROVED" },
  { label: "Reprovado", value: "REJECTED" },
  { label: "Docs pendentes", value: "DOCUMENTS_PENDING" },
  { label: "Onboarding", value: "ONBOARDING" },
];

const statusLabels: Record<ClientStatus, string> = statusOptions.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<ClientStatus, string>,
);

const formSchema = z.object({
  fullName: z.string().min(3, "Informe ao menos 3 caracteres."),
  document: z
    .string()
    .regex(/^\d{11}$|^\d{14}$/, "Use 11 dígitos (CPF) ou 14 (CNPJ)."),
  email: z
    .string()
    .email("E-mail inválido.")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  monthlyIncome: z.string().optional().or(z.literal("")),
  origin: z.string().optional().or(z.literal("")),
  status: z
    .enum(
      [
        "NEW",
        "IN_ANALYSIS",
        "APPROVED",
        "REJECTED",
        "DOCUMENTS_PENDING",
        "ONBOARDING",
      ] as const,
    )
    .default("NEW"),
  notes: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  fullName: "",
  document: "",
  email: "",
  phone: "",
  monthlyIncome: "",
  origin: "",
  status: "NEW",
  notes: "",
};

export default function ClientsPage() {
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ClientStatus | "ALL">(
    "ALL",
  );
  const [editingClient, setEditingClient] = useState<ImobiliariaClient | null>(
    null,
  );

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingClient) {
      form.reset({
        fullName: editingClient.fullName,
        document: editingClient.document,
        email: editingClient.email ?? "",
        phone: editingClient.phone ?? "",
        monthlyIncome: editingClient.monthlyIncome
          ? String(editingClient.monthlyIncome)
          : "",
        origin: editingClient.origin ?? "",
        status: editingClient.status,
        notes: editingClient.notes ?? "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editingClient, form]);

  const {
    data: clients = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["imobiliaria-clients", statusFilter, debouncedSearch],
    queryFn: () =>
      listImobiliariaClients({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      }),
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        fullName: values.fullName.trim(),
        document: values.document.trim(),
        email: values.email ? values.email.trim() : undefined,
        phone: values.phone ? values.phone.trim() : undefined,
        monthlyIncome: values.monthlyIncome
          ? Number(values.monthlyIncome)
          : undefined,
        origin: values.origin ? values.origin.trim() : undefined,
        status: values.status,
        notes: values.notes ? values.notes.trim() : undefined,
      };
      return editingClient
        ? updateImobiliariaClient(editingClient.id, payload)
        : createImobiliariaClient(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["imobiliaria-clients"],
      });
      toast.success(
        editingClient ? "Cliente atualizado com sucesso." : "Cliente cadastrado.",
      );
      setEditingClient(null);
      form.reset(defaultValues);
    },
    onError: () => {
      toast.error("Não foi possível salvar o cliente.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImobiliariaClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imobiliaria-clients"] });
      toast.success("Cliente removido.");
    },
    onError: () => {
      toast.error("Não foi possível remover o cliente.");
    },
  });

  const handleSubmit = (values: FormValues) => {
    createOrUpdateMutation.mutate(values);
  };

  const filteredClients = useMemo(() => clients, [clients]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary uppercase">
            Clientes da imobiliária
          </p>
          <p className="text-2xl font-bold text-slate-900">
            Relacionamentos em cada etapa do funil
          </p>
          <p className="text-sm text-slate-500">
            Cadastre clientes e acompanhe o status de análise, documentos e
            onboarding, conforme divulgado na landing da PagPro.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingClient(null);
            setIsFormVisible((prev) => !prev);
          }}
          variant="primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isFormVisible ? "Ocultar formulário" : "Cadastrar cliente"}
        </Button>
      </div>

      {isFormVisible && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingClient ? "Editar cliente" : "Novo cliente"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input id="fullName" {...form.register("fullName")} />
                {form.formState.errors.fullName && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="document">CPF/CNPJ</Label>
                <Input id="document" maxLength={14} {...form.register("document")} />
                {form.formState.errors.document && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.document.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" {...form.register("phone")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Renda mensal</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  step="0.01"
                  {...form.register("monthlyIncome")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origem do lead</Label>
                <Input id="origin" {...form.register("origin")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  {...form.register("status")}
                  options={statusOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                  }))}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notas internas</Label>
                <Input id="notes" {...form.register("notes")} />
              </div>
              <div className="flex items-center gap-3 md:col-span-2">
                <Button
                  type="submit"
                  loading={createOrUpdateMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {editingClient ? "Salvar alterações" : "Cadastrar cliente"}
                </Button>
                {editingClient && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingClient(null)}
                  >
                    Cancelar edição
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" />
            Clientes cadastrados
          </CardTitle>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar por nome ou documento"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="md:w-64"
              />
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as ClientStatus | "ALL")
              }
              options={[
                { label: "Todos os status", value: "ALL" },
                ...statusOptions,
              ]}
            />
            <Button
              variant="outline"
              onClick={() => queryClient.invalidateQueries({
                queryKey: ["imobiliaria-clients"],
              })}
              disabled={isFetching}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-slate-500">Carregando clientes...</p>
          ) : filteredClients.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum cliente encontrado com os filtros atuais.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Renda mensal
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Origem</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-900">
                        {client.fullName}
                      </div>
                      <p className="text-sm text-slate-500">{client.email}</p>
                      <p className="text-sm text-slate-500">{client.phone}</p>
                    </TableCell>
                    <TableCell>{client.document}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {statusLabels[client.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.monthlyIncome
                        ? client.monthlyIncome.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.origin || "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingClient(client);
                            setIsFormVisible(true);
                          }}
                        >
                          <Pencil className="mr-1 h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-600"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Remover ${client.fullName}? Essa ação é irreversível.`,
                              )
                            ) {
                              deleteMutation.mutate(client.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


