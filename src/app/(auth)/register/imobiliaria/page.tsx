import { AuthCard, AuthCardFooterLink } from "@/components/forms/auth-card";
import { RegisterImobiliariaForm } from "@/components/forms/register-imobiliaria-form";

export default function RegisterImobiliariaPage() {
  return (
    <AuthCard
      title="Cadastre sua imobiliária na PagPro"
      description="Acesse a plataforma de seguros fiança líder em aprovação inclusiva, cobertura ampliada e monitoramento inteligente."
      footer={
        <AuthCardFooterLink
          href="/login"
          label="Já possui credenciais? Acesse sua conta."
        />
      }
    >
      <RegisterImobiliariaForm />
    </AuthCard>
  );
}

