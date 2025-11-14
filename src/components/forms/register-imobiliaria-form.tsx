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
  registerImobiliaria,
  RegisterImobiliariaPayload,
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
    .string({ required_error: "Informe a razão social da imobiliária." })
    .min(2),
  cnpj: z
    .string({ required_error: "Informe o CNPJ." })
    .regex(/^\d{14}$/, "CNPJ deve conter 14 dígitos numéricos."),
  creci: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function RegisterImobiliariaForm() {
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
      cnpj: "",
      creci: "",
      website: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: RegisterImobiliariaPayload) =>
      registerImobiliaria(payload),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      });
      toast.success("Cadastro realizado com sucesso! Bem-vindo à PagPro.");
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
          <Label htmlFor="companyName">Razão social da imobiliária</Label>
          <Input id="companyName" {...form.register("companyName")} />
          {form.formState.errors.companyName ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.companyName.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            placeholder="Somente números"
            maxLength={14}
            {...form.register("cnpj")}
          />
          {form.formState.errors.cnpj ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.cnpj.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="creci">CRECI (opcional)</Label>
          <Input id="creci" {...form.register("creci")} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="fullName">Responsável pela parceria</Label>
          <Input id="fullName" {...form.register("fullName")} />
          {form.formState.errors.fullName ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.fullName.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail corporativo</Label>
          <Input
            id="email"
            type="email"
            placeholder="contato@imobiliaria.com.br"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(11) 0000-0000"
            {...form.register("phone")}
          />
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
          <Label htmlFor="website">Website (opcional)</Label>
          <Input
            id="website"
            placeholder="https://www.suaimobiliaria.com.br"
            {...form.register("website")}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Endereço</Label>
          <Input id="address" {...form.register("address")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" {...form.register("city")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" {...form.register("state")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">CEP</Label>
          <Input id="postalCode" {...form.register("postalCode")} />
        </div>
      </div>
      <Button type="submit" loading={isPending} className="w-full">
        Criar conta e acessar painel
      </Button>
    </form>
  );
}

