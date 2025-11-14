"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Contact,
  Pencil,
  Plus,
  RefreshCw,
  Search,
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
  BrokerStatus,
  ImobiliariaBroker,
  createImobiliariaBroker,
  deleteImobiliariaBroker,
  listImobiliariaBrokers,
  updateImobiliariaBroker,
} from "@/services/imobiliaria-brokers-service";

const statusOptions: { label: string; value: BrokerStatus }[] = [
  { label: "Ativo", value: "ACTIVE" },
  { label: "Inativo", value: "INACTIVE" },
  { label: "Convidado", value: "INVITED" },
  { label: "Pend. documentos", value: "PENDING_DOCUMENTS" },
];

const statusLabels: Record<BrokerStatus, string> = statusOptions.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<BrokerStatus, string>,
);

const formSchema = z.object({
  fullName: z.string().min(3, "Informe ao menos 3 caracteres."),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos."),
  creci: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email("E-mail inválido.")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  status: z
    .enum(
      ["ACTIVE", "INACTIVE", "INVITED", "PENDING_DOCUMENTS"] as const,
    )
    .default("INVITED"),
  notes: z.string().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

const defaultValues: FormValues = {
  fullName: "",
  cpf: "",
  creci: "",
  email: "",
  phone: "",
  status: "INVITED",
  notes: "",
};

export default function BrokersPage() {
  const queryClient = useQueryClient();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BrokerStatus | "ALL">("ALL");
  const [editingBroker, setEditingBroker] = useState<ImobiliariaBroker | null>(
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
    if (editingBroker) {
      form.reset({
        fullName: editingBroker.fullName,
        cpf: editingBroker.cpf,
        creci: editingBroker.creci ?? "",
        email: editingBroker.email ?? "",
        phone: editingBroker.phone ?? "",
        status: editingBroker.status,
        notes: editingBroker.notes ?? "",
      });
    } else {
      form.reset(defaultValues);
    }
  }, [editingBroker, form]);

  const {
    data: brokers = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["imobiliaria-brokers", statusFilter, debouncedSearch],
    queryFn: () =>
      listImobiliariaBrokers({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        search: debouncedSearch || undefined,
      }),
  });

  const createOrUpdateMutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        fullName: values.fullName.trim(),
        cpf: values.cpf.trim(),
        creci: values.creci ? values.creci.trim() : undefined,
        email: values.email ? values.email.trim() : undefined,
        phone: values.phone ? values.phone.trim() : undefined,
        status: values.status,
        notes: values.notes ? values.notes.trim() : undefined,
      };
      return editingBroker
        ? updateImobiliariaBroker(editingBroker.id, payload)
        : createImobiliariaBroker(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["imobiliaria-brokers"],
      });
      toast.success(
        editingBroker
          ? "Corretor atualizado com sucesso."
          : "Corretor cadastrado.",
      );
      setEditingBroker(null);
      form.reset(defaultValues);
      setIsFormVisible(false);
    },
    onError: () => toast.error("Não foi possível salvar o corretor."),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteImobiliariaBroker(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imobiliaria-brokers"] });
      toast.success("Corretor removido.");
    },
    onError: () => toast.error("Não foi possível remover o corretor."),
  });

  const handleSubmit = (values: FormValues) => {
    createOrUpdateMutation.mutate(values);
  };

  const tableData = useMemo(() => brokers, [brokers]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary uppercase">
            Rede de corretores
          </p>
          <p className="text-2xl font-bold text-slate-900">
            Colaboradores com foco em proteção e crescimento
          </p>
          <p className="text-sm text-slate-500">
            Convide ou gerencie corretores parceiros, alinhados à estratégia de
            expansão apresentada na landing.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingBroker(null);
            setIsFormVisible((prev) => !prev);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isFormVisible ? "Ocultar formulário" : "Cadastrar corretor"}
        </Button>
      </div>

      {isFormVisible && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBroker ? "Editar corretor" : "Novo corretor"}
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
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" maxLength={11} {...form.register("cpf")} />
                {form.formState.errors.cpf && (
                  <p className="text-xs text-red-600">
                    {form.formState.errors.cpf.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="creci">CRECI</Label>
                <Input id="creci" {...form.register("creci")} />
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
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  {...form.register("status")}
                  options={statusOptions}
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
                >
                  {editingBroker ? "Salvar alterações" : "Convidar corretor"}
                </Button>
                {editingBroker && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingBroker(null)}
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
            <Contact className="h-4 w-4 text-primary" />
            Corretores ativos
          </CardTitle>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Buscar por nome, CPF ou CRECI"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="md:w-64"
              />
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as BrokerStatus | "ALL")
              }
              options={[
                { value: "ALL", label: "Todos os status" },
                ...statusOptions,
              ]}
            />
            <Button
              variant="outline"
              onClick={() =>
                queryClient.invalidateQueries({ queryKey: ["imobiliaria-brokers"] })
              }
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
            <p className="text-sm text-slate-500">Carregando corretores...</p>
          ) : tableData.length === 0 ? (
            <p className="text-sm text-slate-500">
              Nenhum corretor encontrado com os filtros atuais.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Corretor</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    CRECI / Contato
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((broker) => (
                  <TableRow key={broker.id}>
                    <TableCell>
                      <div className="font-semibold text-slate-900">
                        {broker.fullName}
                      </div>
                      <p className="text-sm text-slate-500">
                        {broker.email || "—"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {broker.phone || "—"}
                      </p>
                    </TableCell>
                    <TableCell>{broker.cpf}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {statusLabels[broker.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-slate-700">
                        CRECI: {broker.creci || "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Atualizado em{" "}
                        {new Date(broker.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingBroker(broker);
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
                                `Remover ${broker.fullName}? Essa ação é irreversível.`,
                              )
                            ) {
                              deleteMutation.mutate(broker.id);
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


