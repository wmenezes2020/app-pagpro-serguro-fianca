import Link from "next/link";
import { AuthCard, AuthCardFooterLink } from "@/components/forms/auth-card";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Acesse sua conta PagPro"
      description="Utilize suas credenciais para acompanhar solicitações, análises e apólices em tempo real."
      footer={
        <div className="flex flex-col gap-1">
          <AuthCardFooterLink
            href="/register/imobiliaria"
            label="É uma imobiliária e ainda não possui acesso?"
          />
          <p>
            Outros perfis?{" "}
            <Link
              href="/register/inquilino"
              className="font-semibold text-primary hover:underline"
            >
              Inquilinos
            </Link>{" "}
            ·{" "}
            <Link
              href="/register/corretor"
              className="font-semibold text-primary hover:underline"
            >
              Corretores
            </Link>
          </p>
        </div>
      }
    >
      <LoginForm />
    </AuthCard>
  );
}

