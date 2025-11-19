"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  createPartnerLink,
  listPartnerLinks,
  updatePartnerLink,
  PartnerLink,
  UpdatePartnerLinkPayload,
} from "@/services/partner-links-service";
import { useAuthStore, UserRole } from "@/store/auth-store";
import { cn } from "@/lib/utils";

const invitePermissions: Record<UserRole, { value: UserRole; label: string }[]> =
  {
    ADMIN: [
      { value: "DIRECTOR", label: "Diretor PagPro" },
      { value: "FRANQUEADO", label: "Franqueado / Associado" },
      { value: "IMOBILIARIA", label: "Imobiliária" },
      { value: "CORRETOR", label: "Corretor" },
      { value: "INQUILINO", label: "Cliente" },
    ],
    DIRECTOR: [
      { value: "FRANQUEADO", label: "Franqueado / Associado" },
      { value: "IMOBILIARIA", label: "Imobiliária" },
      { value: "CORRETOR", label: "Corretor" },
    ],
    FRANQUEADO: [
      { value: "IMOBILIARIA", label: "Imobiliária" },
      { value: "CORRETOR", label: "Corretor" },
    ],
    IMOBILIARIA: [
      { value: "CORRETOR", label: "Corretor" },
      { value: "INQUILINO", label: "Cliente" },
    ],
    CORRETOR: [{ value: "INQUILINO", label: "Cliente" }],
    INQUILINO: [{ value: "INQUILINO", label: "Cliente" }],
  };

const roleValues = [
  "ADMIN",
  "DIRECTOR",
  "FRANQUEADO",
  "IMOBILIARIA",
  "CORRETOR",
  "INQUILINO",
] as const;

const schema = z.object({
  targetRole: z.enum(roleValues, {
    required_error: "Selecione o perfil do convite.",
  }),
  maxUses: z
    .number()
    .min(1, "Informe pelo menos 1 uso.")
    .max(1000, "Valor máximo excedido.")
    .default(1),
  expiresAt: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function InvitationsPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [editingLink, setEditingLink] = useState<PartnerLink | null>(null);
  
  const allowedRoles = useMemo(() => {
    if (!user) return [];
    return invitePermissions[user.role] ?? [];
  }, [user]);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["partner-links"],
    queryFn: listPartnerLinks,
    enabled: Boolean(user),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      targetRole: (allowedRoles[0]?.value ??
        "IMOBILIARIA") as FormValues["targetRole"],
      maxUses: 1,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: FormValues) => {
      // Garantir que a data seja enviada no formato correto para o timezone
      const expiresAt = payload.expiresAt
        ? new Date(payload.expiresAt + 'T23:59:59-03:00').toISOString().split('T')[0]
        : undefined;
      
      return createPartnerLink({
        ...payload,
        targetRole: payload.targetRole as UserRole,
        expiresAt,
      });
    },
    onSuccess: (link) => {
      toast.success("Convite criado com sucesso.");
      form.reset({
        targetRole: form.getValues("targetRole"),
        maxUses: 1,
        expiresAt: "",
        notes: "",
      });
      refetch();
      copyToken(link.token);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o convite.";
      toast.error(message);
    },
  });

  const { mutateAsync: updateLink, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePartnerLinkPayload }) =>
      updatePartnerLink(id, payload),
    onSuccess: () => {
      toast.success("Convite atualizado com sucesso.");
      setEditingLink(null);
      queryClient.invalidateQueries({ queryKey: ["partner-links"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o convite.";
      toast.error(message);
    },
  });

  if (!user) {
    return null;
  }

  if (!allowedRoles.length) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Convites tokenizados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              O seu perfil não possui permissão para gerar convites. Solicite
              ajuda ao responsável pela sua operação.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Gerar novo convite</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label htmlFor="targetRole">Perfil do convite</Label>
              <Select
                id="targetRole"
                value={form.watch("targetRole")}
                options={allowedRoles}
                onChange={(event) =>
                  form.setValue("targetRole", event.target.value as FormValues["targetRole"])
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxUses">Número de usos</Label>
              <Input
                id="maxUses"
                type="number"
                min={1}
                max={100}
                {...form.register("maxUses", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Validade (opcional)</Label>
              <Input id="expiresAt" type="date" {...form.register("expiresAt")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Input id="notes" {...form.register("notes")} />
            </div>
            <Button type="submit" loading={isPending} className="md:col-span-2">
              Gerar link tokenizado
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convites emitidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : !data?.length ? (
            <p className="text-sm text-muted-foreground">
              Nenhum convite emitido até o momento.
            </p>
          ) : (
            <div className="space-y-3">
              {data.map((link) => (
                <InviteRow 
                  key={link.id} 
                  link={link} 
                  allowedRoles={allowedRoles}
                  onEdit={() => setEditingLink(link)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {editingLink && (
        <EditInviteModal
          link={editingLink}
          allowedRoles={allowedRoles}
          onClose={() => setEditingLink(null)}
          onSave={async (payload) => {
            await updateLink({ id: editingLink.id, payload });
          }}
          isSaving={isUpdating}
        />
      )}
    </div>
  );
}

function InviteRow({ link, onEdit, allowedRoles }: { 
  link: PartnerLink; 
  onEdit: () => void;
  allowedRoles: { value: UserRole; label: string }[];
}) {
  const remainingUses = Math.max(link.maxUses - link.usedCount, 0);
  const canEdit = link.usedCount === 0;

  return (
    <div className="rounded-2xl border border-muted bg-card p-4 text-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-foreground">
            {translateRole(link.targetRole as UserRole)}
          </p>
          <p className="text-xs text-muted-foreground">
            Token: <span className="font-mono">{link.token}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            Usos: {link.usedCount}/{link.maxUses}
          </span>
          <span>•</span>
          <span>
            Status:{" "}
            <strong
              className={cn(
                link.isActive ? "text-emerald-600" : "text-muted-foreground",
              )}
            >
              {link.isActive ? "Ativo" : "Encerrado"}
            </strong>
          </span>
          {link.expiresAt ? (
            <>
              <span>•</span>
              <span>
                Expira em{" "}
                {formatDate(link.expiresAt)}
              </span>
            </>
          ) : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToken(link.token)}
        >
          Copiar link
        </Button>
        {canEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
          >
            Editar
          </Button>
        )}
        <span className="text-xs text-muted-foreground">
          Restam {remainingUses} uso(s)
        </span>
      </div>
    </div>
  );
}

function copyToken(token: string) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/invite/${token}`
      : `/invite/${token}`;
  navigator.clipboard
    .writeText(url)
    .then(() => toast.success("Link copiado para a área de transferência."))
    .catch(() =>
      toast.error("Não foi possível copiar o link. Copie manualmente."),
    );
}

function EditInviteModal({
  link,
  allowedRoles,
  onClose,
  onSave,
  isSaving,
}: {
  link: PartnerLink;
  allowedRoles: { value: UserRole; label: string }[];
  onClose: () => void;
  onSave: (payload: UpdatePartnerLinkPayload) => Promise<void>;
  isSaving: boolean;
}) {
  const editForm = useForm<UpdatePartnerLinkPayload>({
    defaultValues: {
      targetRole: link.targetRole,
      maxUses: link.maxUses,
      expiresAt: link.expiresAt
        ? formatDateForInput(link.expiresAt)
        : undefined,
      notes: link.notes ?? "",
      isActive: link.isActive,
    },
  });

  const handleSubmit = async (values: UpdatePartnerLinkPayload) => {
    // Garantir que a data seja enviada no formato correto para o timezone
    const payload: UpdatePartnerLinkPayload = {
      ...values,
      expiresAt: values.expiresAt
        ? new Date(values.expiresAt + 'T23:59:59-03:00').toISOString().split('T')[0]
        : undefined,
    };
    await onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Editar convite</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={editForm.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-targetRole">Perfil do convite</Label>
              <Select
                id="edit-targetRole"
                value={editForm.watch("targetRole")}
                options={allowedRoles}
                onChange={(event) =>
                  editForm.setValue("targetRole", event.target.value as UserRole)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxUses">Número de usos</Label>
              <Input
                id="edit-maxUses"
                type="number"
                min={1}
                max={100}
                {...editForm.register("maxUses", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expiresAt">Validade (opcional)</Label>
              <Input
                id="edit-expiresAt"
                type="date"
                {...editForm.register("expiresAt")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Observações (opcional)</Label>
              <Input id="edit-notes" {...editForm.register("notes")} />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-isActive"
                checked={editForm.watch("isActive") ?? true}
                onChange={(e) => editForm.setValue("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-isActive" className="cursor-pointer">
                Convite ativo
              </Label>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" loading={isSaving} className="flex-1">
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "";
  
  try {
    let date: Date;
    
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      // Se já for uma string ISO completa, usar diretamente
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
      } else {
        // Se for apenas YYYY-MM-DD, adicionar timezone
        date = new Date(dateString + 'T23:59:59-03:00');
      }
    } else {
      return "";
    }
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return "";
    }
    
    return date.toLocaleDateString("pt-BR", {
      timeZone: 'America/Bahia',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
}

function formatDateForInput(dateString: string | Date | null | undefined): string | undefined {
  if (!dateString) return undefined;
  
  try {
    let date: Date;
    
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      // Se já for uma string ISO completa, usar diretamente
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
      } else {
        // Se for apenas YYYY-MM-DD, adicionar timezone
        date = new Date(dateString + 'T23:59:59-03:00');
      }
    } else {
      return undefined;
    }
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return undefined;
    }
    
    // Retornar no formato YYYY-MM-DD para input type="date"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Erro ao formatar data para input:", error);
    return undefined;
  }
}

function translateRole(role: UserRole) {
  const dictionary: Record<UserRole, string> = {
    ADMIN: "Administrador",
    DIRECTOR: "Diretor PagPro",
    FRANQUEADO: "Franqueado / Associado",
    IMOBILIARIA: "Imobiliária",
    CORRETOR: "Corretor",
    INQUILINO: "Cliente",
  };
  return dictionary[role] ?? role;
}


