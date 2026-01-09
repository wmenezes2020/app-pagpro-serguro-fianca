"use client";

import { Shield } from "lucide-react";

export default function DashboardPoliticaDePrivacidadePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2240]">Política de Privacidade</h1>
        <p className="text-sm text-slate-600 mt-1">
          Como protegemos e tratamos seus dados pessoais.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-[#0F2240]" />
          <h2 className="text-3xl font-bold text-[#0F2240]">Política de Privacidade</h2>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-600 mb-8">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">1. Introdução</h3>
            <p className="text-slate-700 mb-4">
              O Grupo Life Company, proprietário da marca PagPro Seguro Fiança, está comprometido com a proteção da privacidade e dos dados pessoais de seus usuários, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD) e demais legislações aplicáveis.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">2. Dados Coletados</h3>
            <h4 className="text-xl font-semibold text-[#0F2240] mb-3">2.1. Dados Fornecidos pelo Usuário</h4>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Nome completo, CPF/CNPJ, RG;</li>
              <li>Endereço, telefone e e-mail;</li>
              <li>Dados bancários e financeiros;</li>
              <li>Informações sobre imóveis e contratos de locação;</li>
              <li>Documentos pessoais e comprovantes;</li>
              <li>Dados de renda e situação financeira.</li>
            </ul>

            <h4 className="text-xl font-semibold text-[#0F2240] mb-3">2.2. Dados Coletados Automaticamente</h4>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Endereço IP e informações do dispositivo;</li>
              <li>Dados de navegação e uso da plataforma;</li>
              <li>Cookies e tecnologias similares;</li>
              <li>Registros de acesso e atividades.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">3. Finalidade do Tratamento</h3>
            <p className="text-slate-700 mb-4">Utilizamos seus dados pessoais para:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Prestação dos serviços de proteção locatícia;</li>
              <li>Análise de risco e aprovação de solicitações;</li>
              <li>Processamento de pagamentos e cobranças;</li>
              <li>Comunicação sobre serviços e atualizações;</li>
              <li>Cumprimento de obrigações legais e regulatórias;</li>
              <li>Melhoria da plataforma e experiência do usuário;</li>
              <li>Prevenção de fraudes e segurança.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">4. Compartilhamento de Dados</h3>
            <p className="text-slate-700 mb-4">
              Podemos compartilhar seus dados pessoais com:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Prestadores de serviços:</strong> Empresas que nos auxiliam na operação da plataforma (hospedagem, processamento de pagamentos, etc.);</li>
              <li><strong>Autoridades competentes:</strong> Quando exigido por lei ou ordem judicial;</li>
              <li><strong>Parceiros comerciais:</strong> Com seu consentimento prévio, para oferta de produtos e serviços relacionados;</li>
              <li><strong>Empresas do grupo:</strong> Empresas controladas ou controladoras do Grupo Life Company.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">5. Segurança dos Dados</h3>
            <p className="text-slate-700 mb-4">
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso não autorizado, alteração, divulgação ou destruição, incluindo:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Criptografia de dados sensíveis;</li>
              <li>Controles de acesso e autenticação;</li>
              <li>Monitoramento contínuo de segurança;</li>
              <li>Backup regular dos dados;</li>
              <li>Treinamento de pessoal em segurança da informação.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">6. Direitos do Titular</h3>
            <p className="text-slate-700 mb-4">
              Conforme a LGPD, você possui os seguintes direitos:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los;</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados;</li>
              <li><strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar a eliminação ou anonimização de dados desnecessários;</li>
              <li><strong>Portabilidade:</strong> Solicitar a portabilidade dos dados para outro fornecedor;</li>
              <li><strong>Eliminação:</strong> Solicitar a eliminação de dados tratados com consentimento;</li>
              <li><strong>Informação:</strong> Obter informações sobre compartilhamento de dados;</li>
              <li><strong>Revogação:</strong> Revogar o consentimento a qualquer momento.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">7. Retenção de Dados</h3>
            <p className="text-slate-700 mb-4">
              Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, respeitando os prazos legais de retenção estabelecidos pela legislação brasileira, especialmente:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Dados contábeis e fiscais: 5 anos (Lei nº 8.159/1991);</li>
              <li>Dados de contratos: Durante a vigência do contrato e após o término, conforme prazo legal;</li>
              <li>Dados de transações financeiras: Conforme exigências do Banco Central e legislação aplicável.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">8. Cookies e Tecnologias Similares</h3>
            <p className="text-slate-700 mb-4">
              Utilizamos cookies e tecnologias similares para melhorar sua experiência na plataforma, analisar o uso e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">9. Alterações nesta Política</h3>
            <p className="text-slate-700 mb-4">
              Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas através da plataforma ou por e-mail. A continuação do uso dos serviços após as alterações constitui aceitação da nova política.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">10. Contato e Encarregado de Dados</h3>
            <p className="text-slate-700 mb-4">
              Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados pessoais, entre em contato:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-slate-700 mb-2"><strong>E-mail:</strong> privacidade@pagproseguro.com.br</p>
              <p className="text-slate-700 mb-2"><strong>Encarregado de Dados (DPO):</strong> dpo@pagproseguro.com.br</p>
              <p className="text-slate-700"><strong>Grupo Life Company</strong></p>
            </div>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-600 text-center">
              Grupo Life Company - Proprietária da marca PagPro Seguro Fiança
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
