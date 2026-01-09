"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  RefreshCw,
  Search,
  UserCog,
  Building2,
  Mail,
  Calendar,
  Plus,
  X,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listFranqueados } from "@/services/franqueados-service";
import {
  createFranqueado,
  CreateFranqueadoPayload,
} from "@/services/hierarchy-service";
import { useAuthStore } from "@/store/auth-store";

const createSchema = z
  .object({
    fullName: z.string().min(3, "Informe ao menos 3 caracteres."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme a senha."),
    phone: z.string().optional(),
    companyName: z.string().min(3, "Informe o nome da empresa."),
    document: z
      .string()
      .regex(/^\d{11}$|^\d{14}$/, "Informe 11 (CPF) ou 14 dígitos (CNPJ).")
      .optional()
      .or(z.literal("")),
    region: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export default function FranqueadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const canManage =
    user?.role === "ADMIN" || user?.role === "DIRECTOR";

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const {
    data: franqueados = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["franqueados", debouncedSearch],
    queryFn: () => listFranqueados({ search: debouncedSearch || undefined }),
  });

  const filteredFranqueados = useMemo(() => {
    return franqueados;
  }, [franqueados]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      companyName: "",
      document: "",
      region: "",
      notes: "",
    },
  });

  const { mutateAsync: handleCreate, isPending } = useMutation({
    mutationFn: (payload: CreateFranqueadoPayload) => createFranqueado(payload),
    onSuccess: () => {
      toast.success("Franqueado cadastrado com sucesso.");
      form.reset();
      setShowForm(false);
      setEditingId(null);
      refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o franqueado.";
      toast.error(message);
    },
  });

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    const payload: CreateFranqueadoPayload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phone: values.phone || undefined,
      companyName: values.companyName,
      document: values.document || undefined,
      region: values.region || undefined,
      notes: values.notes || undefined,
    };
    await handleCreate(payload);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    form.reset();
  };

  const handleNewClick = () => {
    setShowForm(true);
    setEditingId(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2240]">Franqueados</h1>
        <p className="text-sm text-slate-600 mt-1">
          Gerencie os franqueados e associados vinculados à sua conta.
        </p>
      </div>

      {canManage && showForm ? (
        <Card className="border border-slate-200/60 bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-extrabold text-[#0F2240]">
                {editingId ? "Editar franqueado" : "Adicionar franqueado"}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <Input
                    placeholder="Nome e sobrenome"
                    {...form.register("fullName")}
                  />
                  {form.formState.errors.fullName ? (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.fullName.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    E-mail corporativo
                  </label>
                  <Input
                    type="email"
                    placeholder="franqueado@pagpro.com.br"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email ? (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <Input placeholder="(11) 0000-0000" {...form.register("phone")} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Documento (CPF/CNPJ)
                  </label>
                  <Input
                    placeholder="Somente números"
                    {...form.register("document")}
                  />
                  {form.formState.errors.document ? (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.document.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Nome da empresa
                  </label>
                  <Input
                    placeholder="Razão social / marca comercial"
                    {...form.register("companyName")}
                  />
                  {form.formState.errors.companyName ? (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.companyName.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Região de atuação
                  </label>
                  <Input placeholder="Ex: Nordeste" {...form.register("region")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <Input
                    placeholder="Detalhes adicionais"
                    {...form.register("notes")}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Senha provisória
                  </label>
                  <Input
                    type="password"
                    placeholder="Defina uma senha"
                    {...form.register("password")}
                  />
                  {form.formState.errors.password ? (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Confirmar senha
                  </label>
                  <Input
                    type="password"
                    placeholder="Repita a senha"
                    {...form.register("confirmPassword")}
                  />
                  {form.formState.errors.confirmPassword ? (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.confirmPassword.message}
                    </p>
                  ) : null}
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isPending}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  loading={isPending}
                  className="bg-[#FFD700] text-[#0F2240] hover:bg-[#FFD700]/90"
                >
                  {editingId ? "Salvar alterações" : "Cadastrar franqueado"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Card className="border border-slate-200/60 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-extrabold text-[#0F2240]">
              Lista de Franqueados
            </CardTitle>
            <div className="flex items-center gap-2">
              {canManage && !showForm && (
                <Button
                  onClick={handleNewClick}
                  className="bg-[#FFD700] text-[#0F2240] hover:bg-[#FFD700]/90 font-bold"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar novo
                </Button>
              )}
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
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome, e-mail ou documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : filteredFranqueados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCog className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Nenhum franqueado encontrado
              </p>
              <p className="text-xs text-gray-500">
                {searchTerm
                  ? "Tente ajustar os termos de busca."
                  : "Crie convites para cadastrar novos franqueados."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome / Empresa</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Região</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFranqueados.map((franqueado) => (
                    <TableRow key={franqueado.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {franqueado.franqueadoProfile?.companyName ??
                                franqueado.fullName ??
                                "-"}
                            </p>
                            {franqueado.fullName &&
                              franqueado.franqueadoProfile?.companyName && (
                                <p className="text-xs text-gray-500">
                                  {franqueado.fullName}
                                </p>
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {franqueado.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {franqueado.franqueadoProfile?.document ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {franqueado.franqueadoProfile?.region ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={franqueado.isActive ? "success" : "default"}
                        >
                          {franqueado.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDate(franqueado.createdAt)}
                          </span>
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

