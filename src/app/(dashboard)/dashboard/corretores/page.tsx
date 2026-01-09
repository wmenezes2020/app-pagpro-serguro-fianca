"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  RefreshCw,
  Search,
  UserCog,
  Mail,
  Calendar,
  IdCard,
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
import { listCorretores } from "@/services/corretores-service";
import {
  createCorretor,
  CreateCorretorPayload,
} from "@/services/hierarchy-service";
import { useAuthStore } from "@/store/auth-store";

const createSchema = z
  .object({
    fullName: z.string().min(3, "Informe ao menos 3 caracteres."),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme a senha."),
    phone: z.string().optional().or(z.literal("")),
    cpf: z
      .string()
      .regex(/^\d{11}$/, "Informe o CPF com 11 dígitos."),
    creci: z.string().optional().or(z.literal("")),
    brokerageName: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export default function CorretoresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);
  const canManage =
    user?.role === "ADMIN" ||
    user?.role === "DIRECTOR" ||
    user?.role === "FRANQUEADO";

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const {
    data: corretores = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["corretores", debouncedSearch],
    queryFn: () => listCorretores({ search: debouncedSearch || undefined }),
  });

  const filteredCorretores = useMemo(() => corretores, [corretores]);

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
      cpf: "",
      creci: "",
      brokerageName: "",
    },
  });

  const { mutateAsync: handleCreate, isPending } = useMutation({
    mutationFn: (payload: CreateCorretorPayload) => createCorretor(payload),
    onSuccess: () => {
      toast.success("Corretor cadastrado com sucesso.");
      form.reset();
      setShowForm(false);
      setEditingId(null);
      refetch();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o corretor.";
      toast.error(message);
    },
  });

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    const payload: CreateCorretorPayload = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phone: values.phone || undefined,
      cpf: values.cpf,
      creci: values.creci || undefined,
      brokerageName: values.brokerageName || undefined,
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
        <h1 className="text-2xl font-bold text-[#0F2240]">Corretores</h1>
        <p className="text-sm text-slate-600 mt-1">
          Gerencie os corretores vinculados à sua rede PagPro.
        </p>
      </div>

      {canManage && showForm ? (
        <Card className="border border-slate-200/60 bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-extrabold text-[#0F2240]">
                {editingId ? "Editar corretor" : "Adicionar corretor"}
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
                    placeholder="corretor@pagpro.com.br"
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
                  <label className="text-sm font-medium text-gray-700">CPF</label>
                  <Input
                    placeholder="Somente números"
                    {...form.register("cpf")}
                  />
                  {form.formState.errors.cpf ? (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.cpf.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    CRECI
                  </label>
                  <Input placeholder="Opcional" {...form.register("creci")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Imobiliária / Parceiro
                  </label>
                  <Input
                    placeholder="Nome da imobiliária ou corretora"
                    {...form.register("brokerageName")}
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
                  {editingId ? "Salvar alterações" : "Cadastrar corretor"}
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
              Lista de Corretores
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
                placeholder="Buscar por nome, e-mail ou CPF..."
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
          ) : filteredCorretores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserCog className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Nenhum corretor encontrado
              </p>
              <p className="text-xs text-gray-500">
                {searchTerm
                  ? "Tente ajustar os termos de busca."
                  : "Cadastre novos corretores para aumentar sua rede."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Corretor</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>CRECI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastrado em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCorretores.map((corretor) => (
                    <TableRow key={corretor.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">
                            {corretor.fullName ?? corretor.corretorProfile?.fullName ?? "-"}
                          </p>
                          {corretor.corretorProfile?.brokerageName ? (
                            <p className="text-xs text-gray-500">
                              {corretor.corretorProfile.brokerageName}
                            </p>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {corretor.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <IdCard className="h-3.5 w-3.5 text-gray-400" />
                          {corretor.corretorProfile?.cpf ?? "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {corretor.corretorProfile?.creci ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={corretor.isActive ? "success" : "default"}>
                          {corretor.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDate(corretor.createdAt)}
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

