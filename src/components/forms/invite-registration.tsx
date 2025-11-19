"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthCard } from "@/components/forms/auth-card";
import { RegisterImobiliariaForm } from "@/components/forms/register-imobiliaria-form";
import { RegisterCorretorForm } from "@/components/forms/register-corretor-form";
import { RegisterInquilinoForm } from "@/components/forms/register-inquilino-form";
import { RegisterFranqueadoForm } from "@/components/forms/register-franqueado-form";
import { fetchInviteDetails } from "@/services/partner-links-service";
import { UserRole } from "@/store/auth-store";
import { cn } from "@/lib/utils";

interface InviteRegistrationProps {
  token: string;
}

export function InviteRegistration({ token }: InviteRegistrationProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["invite", token],
    queryFn: () => fetchInviteDetails(token),
    retry: false,
    enabled: Boolean(token && token !== "undefined"),
  });

  if (isLoading) {
    return (
      <AuthCard title="Validando convite..." description="">
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando detalhes do convite
        </div>
      </AuthCard>
    );
  }

  if (isError || !data) {
    return (
      <AuthCard title="Convite inválido" description="">
        <p className="text-sm text-muted-foreground">
          Esse link não é mais válido. Solicite um novo convite ao responsável
          pela operação para continuar.
        </p>
      </AuthCard>
    );
  }

  let form: React.ReactNode = null;
  const role = data.targetRole as UserRole;

  switch (role) {
    case "IMOBILIARIA":
      form = <RegisterImobiliariaForm inviteToken={token} />;
      break;
    case "CORRETOR":
      form = <RegisterCorretorForm inviteToken={token} />;
      break;
    case "INQUILINO":
      form = <RegisterInquilinoForm inviteToken={token} />;
      break;
    case "FRANQUEADO":
      form = <RegisterFranqueadoForm inviteToken={token} />;
      break;
    default:
      toast.error("Convite para perfil não suportado.");
      form = (
        <p className="text-sm text-muted-foreground">
          Este convite aponta para um perfil que ainda não possui cadastro
          disponível via token. Entre em contato com o suporte.
        </p>
      );
  }

  return (
    <AuthCard
      title="Conclua seu cadastro"
      description="Todos os convites PagPro são tokenizados para garantir segurança e rastreabilidade."
      footer={
        <p className="text-xs text-muted-foreground">
          Link emitido por {data.issuer.role} · {data.issuer.name}
          {data.expiresAt
            ? ` · expira em ${formatInviteDate(data.expiresAt)}`
            : null}
        </p>
      }
    >
      <div className="mb-6 rounded-xl border border-[#f5c437]/20 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5c437]/10">
              <ShieldCheck className="h-4 w-4 text-[#f5c437]" />
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">
                Convite para {translateRole(role)}
              </p>
            </div>
            <p className="text-xs font-normal text-gray-600 leading-relaxed">
              Após concluir o cadastro, você será automaticamente vinculado ao
              emissor deste convite e terá acesso ao painel correspondente.
            </p>
          </div>
        </div>
      </div>
      {form}
    </AuthCard>
  );
}

function formatInviteDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "";

  try {
    let date: Date;

    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      // Se já for uma string ISO completa, usar diretamente
      if (dateString.includes('T') || dateString.includes('Z')) {
        date = new Date(dateString);
      } else {
        // Se for apenas YYYY-MM-DD, adicionar timezone
        date = new Date(dateString + 'T23:59:59-03:00');
      }
    } else {
      return "";
    }

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("pt-BR", {
      timeZone: 'America/Bahia',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "";
  }
}

function translateRole(role: UserRole) {
  const dictionary: Record<UserRole, string> = {
    ADMIN: "Administrador",
    DIRECTOR: "Diretor PagPro",
    FRANQUEADO: "Franqueado / Associado",
    IMOBILIARIA: "Imobiliária",
    CORRETOR: "Corretor",
    INQUILINO: "Cliente",
  };
  return dictionary[role] ?? role;
}


