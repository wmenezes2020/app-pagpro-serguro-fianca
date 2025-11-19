import Link from "next/link";
import { AuthCard } from "@/components/forms/auth-card";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Acesse sua conta PagPro"
      description="Utilize suas credenciais para acompanhar solicitações, análises e apólices em tempo real."
      footer={
        <p className="text-sm text-muted-foreground">
          Precisa de acesso? Solicite um convite ao seu diretor, franqueado ou
          parceiro responsável. Cada cadastro PagPro é tokenizado para manter a
          conformidade e a rastreabilidade da operação.
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

