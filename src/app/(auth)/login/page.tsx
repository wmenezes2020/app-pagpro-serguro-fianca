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
          Precisa de acesso? Solicite um convite um
          parceiro responsável pela sua imobiliária.
        </p>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

