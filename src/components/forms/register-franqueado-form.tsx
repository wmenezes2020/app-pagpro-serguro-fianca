"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  registerFranqueado,
  RegisterFranqueadoPayload,
} from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  fullName: z
    .string({ required_error: "Informe o nome do responsável." })
    .min(3, "Informe ao menos 3 caracteres."),
  email: z
    .string({ required_error: "Informe um e-mail." })
    .email("Formato de e-mail inválido."),
  password: z
    .string({ required_error: "Informe uma senha." })
    .min(6, "A senha deve ter ao menos 6 caracteres."),
  phone: z.string().optional(),
  companyName: z
    .string({ required_error: "Informe o nome da unidade ou empresa." })
    .min(2),
  document: z.string().optional(),
  region: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RegisterFranqueadoFormProps {
  inviteToken: string;
}

export function RegisterFranqueadoForm({
  inviteToken,
}: RegisterFranqueadoFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      companyName: "",
      document: "",
      region: "",
      notes: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: RegisterFranqueadoPayload) =>
      registerFranqueado(payload),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      });
      toast.success("Cadastro concluído com sucesso! Bem-vindo à PagPro.");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível concluir o cadastro.";
      toast.error(message);
    },
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync({ ...values, inviteToken });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="companyName">Unidade / Razão Social</Label>
          <Input id="companyName" {...form.register("companyName")} />
          {form.formState.errors.companyName ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.companyName.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="document">Documento (CNPJ ou CPF)</Label>
          <Input id="document" {...form.register("document")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="region">Região de atuação</Label>
          <Input id="region" {...form.register("region")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullName">Responsável</Label>
          <Input id="fullName" {...form.register("fullName")} />
          {form.formState.errors.fullName ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.fullName.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail corporativo</Label>
          <Input id="email" type="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...form.register("phone")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha de acesso</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Observações (opcional)</Label>
          <Input id="notes" {...form.register("notes")} />
        </div>
      </div>
      <Button type="submit" loading={isPending} className="w-full">
        Concluir cadastro
      </Button>
    </form>
  );
}


