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

interface RegisterImobiliariaFormProps {
  inviteToken: string;
}

export function RegisterImobiliariaForm({
  inviteToken,
}: RegisterImobiliariaFormProps) {
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
    await mutateAsync({ ...values, inviteToken });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Dados da Empresa */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Dados da Imobiliária
          </h4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
              Razão social da imobiliária <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              {...form.register("companyName")}
              className="h-11"
              placeholder="Nome completo da empresa"
            />
            {form.formState.errors.companyName ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.companyName.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
              CNPJ <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cnpj"
              placeholder="Somente números"
              maxLength={14}
              {...form.register("cnpj")}
              className="h-11"
            />
            {form.formState.errors.cnpj ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.cnpj.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="creci" className="text-sm font-medium text-gray-700">
              CRECI (opcional)
            </Label>
            <Input
              id="creci"
              {...form.register("creci")}
              className="h-11"
              placeholder="000000"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="website" className="text-sm font-medium text-gray-700">
              Website (opcional)
            </Label>
            <Input
              id="website"
              placeholder="https://www.suaimobiliaria.com.br"
              {...form.register("website")}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Dados do Responsável */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Dados do Responsável
          </h4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nome do responsável <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              {...form.register("fullName")}
              className="h-11"
              placeholder="Nome completo do responsável"
            />
            {form.formState.errors.fullName ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.fullName.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              E-mail corporativo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="contato@imobiliaria.com.br"
              {...form.register("email")}
              className="h-11"
            />
            {form.formState.errors.email ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
              className="h-11"
              placeholder="Mínimo 6 caracteres"
            />
            {form.formState.errors.password ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Telefone
            </Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              {...form.register("phone")}
              className="h-11"
            />
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Endereço
          </h4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">
              Endereço completo
            </Label>
            <Input
              id="address"
              {...form.register("address")}
              className="h-11"
              placeholder="Rua, número, complemento"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium text-gray-700">
              Cidade
            </Label>
            <Input
              id="city"
              {...form.register("city")}
              className="h-11"
              placeholder="Nome da cidade"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium text-gray-700">
              Estado (UF)
            </Label>
            <Input
              id="state"
              {...form.register("state")}
              className="h-11"
              placeholder="SP"
              maxLength={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode" className="text-sm font-medium text-gray-700">
              CEP
            </Label>
            <Input
              id="postalCode"
              {...form.register("postalCode")}
              className="h-11"
              placeholder="00000-000"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          loading={isPending}
          className="w-full h-12 text-base font-semibold shadow-sm"
        >
          Criar conta e acessar painel
        </Button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </form>
  );
}

