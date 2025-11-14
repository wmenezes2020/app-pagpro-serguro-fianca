import { AuthCard, AuthCardFooterLink } from "@/components/forms/auth-card";
import { RegisterCorretorForm } from "@/components/forms/register-corretor-form";

export default function RegisterCorretorPage() {
  return (
    <AuthCard
      title="Cadastre-se como corretor parceiro"
      description="Integre-se ao ecossistema PagPro, ganhe agilidade na aprovação de locações e acompanhe suas solicitações."
      footer={
        <AuthCardFooterLink
          href="/login"
          label="Já possui credenciais? Acesse sua conta."
        />
      }
    >
      <RegisterCorretorForm />
    </AuthCard>
  );
}

