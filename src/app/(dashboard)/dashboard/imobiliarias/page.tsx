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
  Building2,
  Mail,
  Calendar,
  MapPin,
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
import {
  listImobiliarias,
  ImobiliariaUser,
} from "@/services/imobiliarias-service";
import {
  createImobiliaria,
  CreateImobiliariaPayload,
} from "@/services/hierarchy-service";
import { useAuthStore } from "@/store/auth-store";

const createSchema = z
  .object({
    companyName: z.string().min(3, "Informe o nome da imobiliária."),
    cnpj: z
      .string()
      .regex(/^\d{14}$/, "Informe o CNPJ com 14 dígitos."),
    creci: z.string().optional().or(z.literal("")),
    website: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    city: z.string().optional().or(z.literal("")),
    state: z.string().optional().or(z.literal("")),
    postalCode: z.string().optional().or(z.literal("")),
    fullName: z.string().min(3, "Informe o responsável."),
    phone: z.string().optional().or(z.literal("")),
    email: z.string().email("E-mail inválido."),
    password: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme a senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export default function ImobiliariasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
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
    data: imobiliarias = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["imobiliarias", debouncedSearch],
    queryFn: () => listImobiliarias({ search: debouncedSearch || undefined }),
  });

  const filteredImobiliarias = useMemo(() => {
    return imobiliarias;
  }, [imobiliarias]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Imobiliárias</h1>
        <p className="text-sm text-gray-600 mt-1">
          Gerencie as imobiliárias vinculadas à sua conta.
        </p>
      </div>

      {canManage && showForm ? (
        <Card className="border border-slate-200/60 bg-white shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-extrabold text-[#0F2240]">
                Adicionar imobiliária
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ImobiliariaForm
              onSuccess={() => {
                refetch();
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card className="border border-slate-200/60 bg-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-extrabold text-[#0F2240]">
              Lista de Imobiliárias
            </CardTitle>
            <div className="flex items-center gap-2">
              {canManage && !showForm && (
                <Button
                  onClick={() => setShowForm(true)}
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
                placeholder="Buscar por nome, e-mail, CNPJ ou CRECI..."
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
          ) : filteredImobiliarias.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Nenhuma imobiliária encontrada
              </p>
              <p className="text-xs text-gray-500">
                {searchTerm
                  ? "Tente ajustar os termos de busca."
                  : "Cadastre novas imobiliárias para acompanhar a performance."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Razão Social</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>CNPJ</TableHead>
                    <TableHead>CRECI</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cadastrada em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredImobiliarias.map((imobiliaria) => (
                    <TableRow key={imobiliaria.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {imobiliaria.imobiliariaProfile?.companyName ??
                                imobiliaria.fullName ??
                                "-"}
                            </p>
                            {imobiliaria.fullName &&
                              imobiliaria.imobiliariaProfile?.companyName && (
                                <p className="text-xs text-gray-500">
                                  {imobiliaria.fullName}
                                </p>
                              )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {imobiliaria.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {imobiliaria.imobiliariaProfile?.cnpj ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-700">
                          {imobiliaria.imobiliariaProfile?.creci ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {imobiliaria.imobiliariaProfile?.city ||
                        imobiliaria.imobiliariaProfile?.state ? (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {[
                                imobiliaria.imobiliariaProfile?.city,
                                imobiliaria.imobiliariaProfile?.state,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={imobiliaria.isActive ? "success" : "default"}
                        >
                          {imobiliaria.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            {formatDate(imobiliaria.createdAt)}
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

function ImobiliariaForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel?: () => void;
}) {
  const form = useForm<z.infer<typeof createSchema>>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
      creci: "",
      website: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: CreateImobiliariaPayload) => createImobiliaria(payload),
    onSuccess: () => {
      toast.success("Imobiliária cadastrada com sucesso.");
      form.reset();
      onSuccess();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar a imobiliária.";
      toast.error(message);
    },
  });

  const onSubmit = async (values: z.infer<typeof createSchema>) => {
    const payload: CreateImobiliariaPayload = {
      companyName: values.companyName,
      cnpj: values.cnpj,
      creci: values.creci || undefined,
      website: values.website || undefined,
      address: values.address || undefined,
      city: values.city || undefined,
      state: values.state || undefined,
      postalCode: values.postalCode || undefined,
      fullName: values.fullName,
      phone: values.phone || undefined,
      email: values.email,
      password: values.password,
    };
    await mutateAsync(payload);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">
            Razão social
          </label>
          <Input placeholder="Nome completo da empresa" {...form.register("companyName")} />
          {form.formState.errors.companyName ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.companyName.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">CNPJ</label>
          <Input placeholder="Somente números" {...form.register("cnpj")} />
          {form.formState.errors.cnpj ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.cnpj.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">CRECI</label>
          <Input placeholder="Opcional" {...form.register("creci")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Website</label>
          <Input placeholder="https://..." {...form.register("website")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-700">Endereço</label>
          <Input placeholder="Rua, número, complemento" {...form.register("address")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Cidade</label>
          <Input {...form.register("city")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Estado</label>
          <Input {...form.register("state")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">CEP</label>
          <Input {...form.register("postalCode")} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Nome do responsável
          </label>
          <Input placeholder="Contato principal" {...form.register("fullName")} />
          {form.formState.errors.fullName ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.fullName.message}
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
            E-mail corporativo
          </label>
          <Input type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Senha provisória
          </label>
          <Input type="password" {...form.register("password")} />
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
          <Input type="password" {...form.register("confirmPassword")} />
          {form.formState.errors.confirmPassword ? (
            <p className="text-xs text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          loading={isPending}
          className="bg-[#FFD700] text-[#0F2240] hover:bg-[#FFD700]/90"
        >
          Cadastrar imobiliária
        </Button>
      </div>
    </form>
  );
}

