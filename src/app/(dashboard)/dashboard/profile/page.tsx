"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { updateProfile } from "@/services/users-service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type ProfileFormValues = {
  fullName?: string;
  phone?: string;
};

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
    </div>
  );
}

