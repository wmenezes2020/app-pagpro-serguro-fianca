"use client";

import { FileText } from "lucide-react";

export default function DashboardTermosDeUsoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2240]">Termos de Uso</h1>
        <p className="text-sm text-slate-600 mt-1">
          Termos e condições de uso da plataforma PagPro Seguro Fiança.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="h-8 w-8 text-[#0F2240]" />
          <h2 className="text-3xl font-bold text-[#0F2240]">Termos de Uso</h2>
        </div>

        <div className="prose prose-slate max-w-none">
          <p className="text-sm text-slate-600 mb-8">
            <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
          </p>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">1. Aceitação dos Termos</h3>
            <p className="text-slate-700 mb-4">
              Ao acessar e utilizar a plataforma PagPro Seguro Fiança, você concorda em cumprir e estar vinculado aos seguintes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">2. Definições</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>PagPro Seguro Fiança:</strong> Plataforma digital de proteção locatícia desenvolvida e operada pelo Grupo Life Company.</li>
              <li><strong>Grupo Life Company:</strong> Empresa prestadora do serviço, proprietária da marca e produto PagPro.</li>
              <li><strong>Proteção Locatícia:</strong> Serviço de garantia de pagamento de aluguéis, não configurando seguro de fato, pois não é operado por seguradora.</li>
              <li><strong>Usuário:</strong> Qualquer pessoa física ou jurídica que utiliza a plataforma.</li>
              <li><strong>Locador:</strong> Proprietário do imóvel ou imobiliária responsável pela locação.</li>
              <li><strong>Locatário:</strong> Inquilino que aluga o imóvel.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">3. Natureza do Serviço</h3>
            <p className="text-slate-700 mb-4">
              O PagPro Seguro Fiança é uma <strong>Proteção Locatícia</strong> e <strong>NÃO constitui um seguro</strong> nos termos da legislação brasileira. O serviço não é operado por seguradora e não está sujeito à regulação da Superintendência de Seguros Privados (SUSEP).
            </p>
            <p className="text-slate-700 mb-4">
              O Grupo Life Company atua como prestador de serviços de garantia de pagamento de aluguéis, oferecendo proteção locatícia mediante contrato de adesão.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">4. Uso da Plataforma</h3>
            <h4 className="text-xl font-semibold text-[#0F2240] mb-3">4.1. Requisitos</h4>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Ser maior de 18 anos ou estar devidamente representado;</li>
              <li>Fornecer informações verdadeiras, precisas e atualizadas;</li>
              <li>Manter a segurança de sua conta e senha;</li>
              <li>Notificar imediatamente sobre uso não autorizado de sua conta.</li>
            </ul>

            <h4 className="text-xl font-semibold text-[#0F2240] mb-3">4.2. Condutas Proibidas</h4>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Utilizar a plataforma para fins ilegais ou não autorizados;</li>
              <li>Fornecer informações falsas ou enganosas;</li>
              <li>Tentar acessar áreas restritas da plataforma sem autorização;</li>
              <li>Interferir no funcionamento da plataforma ou violar sua segurança;</li>
              <li>Reproduzir, duplicar ou copiar qualquer parte da plataforma sem autorização.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">5. Propriedade Intelectual</h3>
            <p className="text-slate-700 mb-4">
              Todo o conteúdo da plataforma, incluindo textos, gráficos, logotipos, ícones, imagens e software, é propriedade do Grupo Life Company ou de seus licenciadores e está protegido pelas leis de direitos autorais e propriedade intelectual do Brasil.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">6. Limitação de Responsabilidade</h3>
            <p className="text-slate-700 mb-4">
              O Grupo Life Company não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Danos diretos ou indiretos decorrentes do uso ou impossibilidade de uso da plataforma;</li>
              <li>Interrupções, falhas ou erros na plataforma;</li>
              <li>Decisões tomadas com base em informações fornecidas pela plataforma;</li>
              <li>Atos de terceiros que possam afetar o uso da plataforma.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">7. Modificações dos Termos</h3>
            <p className="text-slate-700 mb-4">
              O Grupo Life Company reserva-se o direito de modificar estes Termos de Uso a qualquer momento. As alterações entrarão em vigor imediatamente após sua publicação na plataforma. O uso continuado da plataforma após as modificações constitui aceitação dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">8. Lei Aplicável e Foro</h3>
            <p className="text-slate-700 mb-4">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa relacionada a estes termos será resolvida no foro da comarca de São Paulo, Estado de São Paulo, renunciando as partes a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-2xl font-bold text-[#0F2240] mb-4">9. Contato</h3>
            <p className="text-slate-700 mb-4">
              Para questões relacionadas a estes Termos de Uso, entre em contato conosco através dos canais disponíveis na plataforma ou pelo e-mail: <strong>contato@pagproseguro.com.br</strong>
            </p>
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
