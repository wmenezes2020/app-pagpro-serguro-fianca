"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { login, forgotPassword } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

const schema = z.object({
  email: z
    .string({ required_error: "Informe um e-mail válido." })
    .email("Formato de e-mail inválido."),
  password: z
    .string({ required_error: "Informe sua senha." })
    .min(6, "A senha deve possuir no mínimo 6 caracteres."),
});

type LoginFormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
      });
      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível realizar login. Verifique suas credenciais.";
      toast.error(message);
    },
  });

  const { mutateAsync: requestPasswordReset, isPending: isResetting } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("Instruções de recuperação enviadas para seu e-mail!");
      setShowForgotPassword(false);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível solicitar recuperação de senha.";
      toast.error(message);
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await mutateAsync(values);
  };

  const onForgotPasswordSubmit = async (email: string) => {
    await requestPasswordReset({ email });
  };

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail corporativo</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="exemplo@pagproseguro.com.br"
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-xs font-medium text-[#f5c437] hover:text-[#f1b60d] transition-colors cursor-pointer"
            >
              Recuperar acesso
            </button>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Digite sua senha"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-xs text-red-600">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
      </div>
      <Button type="submit" loading={isPending} className="w-full">
        Acessar painel
      </Button>
    </form>

    {showForgotPassword && (
      <ForgotPasswordModal
        onClose={() => setShowForgotPassword(false)}
        onSubmit={onForgotPasswordSubmit}
        isSubmitting={isResetting}
        defaultEmail={form.watch("email")}
      />
    )}
    </>
  );
}

function ForgotPasswordModal({
  onClose,
  onSubmit,
  isSubmitting,
  defaultEmail,
}: {
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  isSubmitting: boolean;
  defaultEmail: string;
}) {
  const [email, setEmail] = useState(defaultEmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    await onSubmit(email);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar acesso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">
                E-mail cadastrado
              </Label>
              <Input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="h-11"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500">
                Enviaremos um link de recuperação para este e-mail.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" loading={isSubmitting} className="flex-1">
                Enviar link
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

