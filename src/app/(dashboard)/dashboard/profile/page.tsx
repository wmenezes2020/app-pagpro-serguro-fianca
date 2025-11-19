"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input };
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { updateProfile } from "@/services/users-service";
import {
  changePassword,
  ChangePasswordPayload,
} from "@/services/auth-service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type ProfileFormValues = {
  fullName?: string;
  phone?: string;
};

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Informe sua senha atual."),
    newPassword: z.string().min(6, "A nova senha deve ter ao menos 6 caracteres."),
    confirmPassword: z.string().min(6, "Confirme a nova senha."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const form = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user?.fullName ?? "",
      phone: user?.phone ?? "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success("Perfil atualizado com sucesso.");
    },
    onError: () => {
      toast.error("Não foi possível atualizar os dados.");
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    await mutateAsync(values);
  };

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    mutateAsync: mutatePassword,
    isPending: isChangingPassword,
  } = useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
    onSuccess: () => {
      toast.success("Senha atualizada com sucesso.");
      passwordForm.reset();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Não foi possível alterar a senha.";
      toast.error(message);
    },
  });

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    await mutatePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Informações do perfil</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">E-mail</p>
            <p className="text-base font-medium text-slate-900">
              {user?.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Perfil de acesso</p>
            <Badge variant="outline">{user?.role ?? "Usuário"}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Atualizar dados pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input id="fullName" {...form.register("fullName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...form.register("phone")} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" loading={isPending}>
                Salvar alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                type="password"
                {...passwordForm.register("currentPassword")}
              />
              {passwordForm.formState.errors.currentPassword ? (
                <p className="text-xs text-red-500">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                type="password"
                {...passwordForm.register("newPassword")}
              />
              {passwordForm.formState.errors.newPassword ? (
                <p className="text-xs text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...passwordForm.register("confirmPassword")}
              />
              {passwordForm.formState.errors.confirmPassword ? (
                <p className="text-xs text-red-500">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" loading={isChangingPassword}>
                Atualizar senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

