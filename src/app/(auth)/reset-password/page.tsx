"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthCard } from "@/components/forms/auth-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/services/auth-service";
import Link from "next/link";

const schema = z
  .object({
    newPassword: z
      .string({ required_error: "Informe uma nova senha." })
      .min(8, "A senha deve ter no mínimo 8 caracteres."),
    confirmPassword: z.string({
      required_error: "Confirme sua senha.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Carregando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Senha redefinida com sucesso! Faça login com sua nova senha.");
      router.push("/login");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível redefinir a senha. O link pode ter expirado.";
      toast.error(message);
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      toast.error("Token de recuperação inválido.");
      return;
    }
    await mutateAsync({ token, newPassword: values.newPassword });
  };

  if (!token) {
    return (
      <AuthCard
        title="Link inválido"
        description="O link de recuperação de senha não é válido ou expirou."
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Solicite um novo link de recuperação na página de login.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">Voltar para login</Link>
          </Button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Redefinir senha"
      description="Digite sua nova senha abaixo. Ela deve ter no mínimo 8 caracteres."
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
              Nova senha <span className="text-red-500">*</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              {...form.register("newPassword")}
              className="h-11"
              placeholder="Mínimo 8 caracteres"
              autoFocus
            />
            {form.formState.errors.newPassword ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.newPassword.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirmar senha <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...form.register("confirmPassword")}
              className="h-11"
              placeholder="Digite a senha novamente"
            />
            {form.formState.errors.confirmPassword ? (
              <p className="text-xs text-red-600 mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
        </div>
        <Button type="submit" loading={isPending} className="w-full h-12 text-base font-semibold">
          Redefinir senha
        </Button>
        <div className="text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-[#f5c437] hover:text-[#f1b60d] transition-colors"
          >
            Voltar para login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

