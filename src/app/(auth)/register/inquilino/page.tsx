import { AuthCard, AuthCardFooterLink } from "@/components/forms/auth-card";
import { RegisterInquilinoForm } from "@/components/forms/register-inquilino-form";

export default function RegisterInquilinoPage() {
  return (
    <AuthCard
      title="Cadastre-se como inquilino"
      description="Envie seus dados para solicitar seguro fiança digital e acompanhar sua análise de crédito em tempo real."
      footer={
        <AuthCardFooterLink
          href="/login"
          label="Já possui cadastro? Faça login."
        />
      }
    >
      <RegisterInquilinoForm />
    </AuthCard>
  );
}

