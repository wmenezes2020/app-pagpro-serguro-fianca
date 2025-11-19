"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  registerInquilino,
  RegisterInquilinoPayload,
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
    .regex(/^\d{11}$/, "CPF deve conter 11 dígitos numéricos."),
  birthDate: z.string().optional(),
  phone: z.string().optional(),
  monthlyIncome: z
    .number({ required_error: "Informe a renda mensal." })
    .min(0, "Valor inválido."),
  hasNegativeRecords: z.boolean(),
  employmentStatus: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface RegisterInquilinoFormProps {
  inviteToken: string;
}

export function RegisterInquilinoForm({
  inviteToken,
}: RegisterInquilinoFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      cpf: "",
      birthDate: "",
      phone: "",
      monthlyIncome: 0,
      hasNegativeRecords: false,
      employmentStatus: "",
    },
  });

  const hasNegativeRecords =
    useWatch({
      control: form.control,
      name: "hasNegativeRecords",
    }) ?? false;

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: RegisterInquilinoPayload) =>
      registerInquilino(payload),
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      });
      toast.success("Cadastro concluído! Acesse o painel para enviar documentos.");
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
      {/* Informações Pessoais */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Informações Pessoais
          </h4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nome completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              {...form.register("fullName")}
              className="h-11"
              placeholder="Digite seu nome completo"
            />
            {form.formState.errors.fullName ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.fullName.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              E-mail <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="exemplo@email.com"
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
            <Label htmlFor="cpf" className="text-sm font-medium text-gray-700">
              CPF <span className="text-red-500">*</span>
            </Label>
            <Input
              id="cpf"
              maxLength={11}
              {...form.register("cpf")}
              className="h-11"
              placeholder="00000000000"
            />
            {form.formState.errors.cpf ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.cpf.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
              Data de nascimento
            </Label>
            <Input
              id="birthDate"
              type="date"
              {...form.register("birthDate")}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Telefone
            </Label>
            <Input
              id="phone"
              {...form.register("phone")}
              className="h-11"
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>
      </div>

      {/* Informações Financeiras */}
      <div className="space-y-4">
        <div className="pb-2 border-b border-gray-100">
          <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            Informações Financeiras
          </h4>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="monthlyIncome" className="text-sm font-medium text-gray-700">
              Renda mensal <span className="text-red-500">*</span>
            </Label>
            <Input
              id="monthlyIncome"
              type="number"
              step="0.01"
              {...form.register("monthlyIncome", { valueAsNumber: true })}
              className="h-11"
              placeholder="0.00"
            />
            {form.formState.errors.monthlyIncome ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.monthlyIncome.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="employmentStatus" className="text-sm font-medium text-gray-700">
              Situação profissional
            </Label>
            <Input
              id="employmentStatus"
              placeholder="CLT, PJ, Empreendedor, etc."
              {...form.register("employmentStatus")}
              className="h-11"
            />
          </div>
          <div className="flex items-start gap-3 md:col-span-2 pt-2">
            <Checkbox
              id="hasNegativeRecords"
              checked={hasNegativeRecords}
              onChange={(event) =>
                form.setValue("hasNegativeRecords", event.currentTarget.checked)
              }
              className="mt-0.5"
            />
            <Label htmlFor="hasNegativeRecords" className="text-sm font-normal text-gray-700 leading-relaxed cursor-pointer">
              Possuo restrições em órgãos de crédito (SPC/Serasa)
            </Label>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          loading={isPending}
          className="w-full h-12 text-base font-semibold shadow-sm"
        >
          Criar conta
        </Button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Ao criar sua conta, você concorda com nossos termos de uso e política de privacidade.
        </p>
      </div>
    </form>
  );
}

