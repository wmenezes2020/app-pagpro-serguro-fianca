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
  registerCorretor,
  RegisterCorretorPayload,
} from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  fullName: z
    .string({ required_error: "Informe seu nome completo." })
    .min(3),
  email: z
    .string({ required_error: "Informe um e-mail." })
    .email("Formato de e-mail inválido."),
  password: z
    .string({ required_error: "Informe uma senha." })
    .min(6, "A senha deve ter no mínimo 6 caracteres."),
  cpf: z
    .string({ required_error: "Informe seu CPF." })
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos."),
  creci: z.string().optional(),
  phone: z.string().optional(),
  brokerageName: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RegisterCorretorForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      cpf: "",
      creci: "",
      phone: "",
      brokerageName: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: RegisterCorretorPayload) =>
      registerCorretor(payload),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      });
      toast.success("Cadastro realizado! Acesse o painel e acompanhe suas solicitações.");
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
    await mutateAsync(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullName">Nome completo</Label>
          <Input id="fullName" {...form.register("fullName")} />
          {form.formState.errors.fullName ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.fullName.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" {...form.register("password")} />
          {form.formState.errors.password ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input id="cpf" maxLength={11} {...form.register("cpf")} />
          {form.formState.errors.cpf ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.cpf.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="creci">CRECI (opcional)</Label>
          <Input id="creci" {...form.register("creci")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input id="phone" {...form.register("phone")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="brokerageName">Nome da imobiliária / parceria</Label>
          <Input id="brokerageName" {...form.register("brokerageName")} />
        </div>
      </div>
      <Button type="submit" loading={isPending} className="w-full">
        Criar conta de corretor
      </Button>
    </form>
  );
}

