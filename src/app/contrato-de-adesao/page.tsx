import Link from "next/link";
import { ArrowLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContratoDeAdesaoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Button>
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <FileCheck className="h-8 w-8 text-[#0F2240]" />
            <h1 className="text-3xl font-bold text-[#0F2240]">Contrato de Adesão e Regras de Negócio</h1>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-slate-600 mb-8">
              <strong>Última atualização:</strong> {new Date().toLocaleDateString("pt-BR")}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CONTRATO DE ADESÃO À PROTEÇÃO LOCATÍCIA PAGPRO</h2>
              <p className="text-slate-700 mb-4">
                <strong>CONTRATANTE:</strong> Grupo Life Company, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 50.206.225/0001-77, com sede em Alameda Jau, 1177, Andar 4 - Jardim Paulista, São Paulo - SP, doravante denominada <strong>"PAGPRO"</strong> ou <strong>"CONTRATADA"</strong>.
              </p>
              <p className="text-slate-700 mb-4">
                <strong>CONTRATADO:</strong> Usuário da plataforma PagPro Seguro Fiança, pessoa física ou jurídica, que adere aos termos deste contrato mediante utilização da plataforma, doravante denominado <strong>"CONTRATANTE"</strong> ou <strong>"USUÁRIO"</strong>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA PRIMEIRA - DO OBJETO</h2>
              <p className="text-slate-700 mb-4">
                O presente contrato tem por objeto a prestação de serviços de <strong>Proteção Locatícia</strong> pela PAGPRO ao CONTRATANTE, mediante adesão à plataforma digital PagPro Seguro Fiança.
              </p>
              <p className="text-slate-700 mb-4">
                <strong>IMPORTANTE:</strong> O serviço oferecido pela PAGPRO constitui uma <strong>Proteção Locatícia</strong> e <strong>NÃO configura seguro</strong> nos termos da legislação brasileira. A PAGPRO não é seguradora e não está sujeita à regulação da Superintendência de Seguros Privados (SUSEP). O serviço é prestado pelo Grupo Life Company como prestador de serviços de garantia de pagamento de aluguéis.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA SEGUNDA - DA COBERTURA</h2>
              <h3 className="text-xl font-semibold text-[#0F2240] mb-3">2.1. Escopo da Proteção</h3>
              <p className="text-slate-700 mb-4">
                A proteção locatícia oferecida pela PAGPRO cobre o pagamento de até <strong>3 (três) aluguéis mensais</strong> em caso de inadimplência do locatário, desde que atendidas as condições estabelecidas neste contrato.
              </p>

              <h3 className="text-xl font-semibold text-[#0F2240] mb-3">2.2. Condições para Ativação da Cobertura</h3>
              <p className="text-slate-700 mb-4">
                A cobertura será ativada <strong>apenas</strong> se os seguintes requisitos forem cumpridos:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
                <li><strong>Período de carência:</strong> A proteção só será efetiva após <strong>6 (seis) meses</strong> de vigência do contrato de locação;</li>
                <li><strong>Pagamento das mensalidades em dia:</strong> <strong>OBRIGATORIAMENTE</strong>, todas as mensalidades de proteção locatícia (equivalente a <strong>15% do valor do aluguel</strong>) devem estar em dia e pagas através da plataforma PagPro;</li>
                <li><strong>Inadimplência comprovada:</strong> Ocorrência de inadimplência do locatário após o período de carência;</li>
                <li><strong>Quebra de contrato:</strong> Rescisão do contrato de locação por inadimplência do locatário.</li>
              </ul>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-slate-800 font-semibold mb-2">ℹ️ INFORMAÇÃO IMPORTANTE:</p>
                <p className="text-slate-700 mb-2">
                  Os pagamentos dos <strong>aluguéis podem ser realizados diretamente à imobiliária e/ou ao proprietário</strong>, conforme acordado no contrato de locação. A forma de pagamento do aluguel não afeta a proteção locatícia oferecida pela PAGPRO.
                </p>
                <p className="text-slate-700">
                  <strong>No entanto, para que a proteção esteja ativa e em vigor</strong>, é necessário que as <strong>mensalidades de proteção locatícia (15% do valor do aluguel)</strong> estejam em dia e sejam pagas através da plataforma PagPro.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA TERCEIRA - DO PERÍODO DE CARÊNCIA</h2>
              <p className="text-slate-700 mb-4">
                A proteção locatícia terá início após <strong>6 (seis) meses</strong> de vigência do contrato de locação, contados a partir da data de assinatura do contrato de locação e início efetivo do pagamento das mensalidades de proteção através da plataforma.
              </p>
              <p className="text-slate-700 mb-4">
                Durante o período de carência, a PAGPRO não se obriga ao pagamento de aluguéis em caso de inadimplência do locatário.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA QUARTA - DO LIMITE DE COBERTURA</h2>
              <p className="text-slate-700 mb-4">
                A proteção locatícia cobre o pagamento de até <strong>3 (três) parcelas mensais de aluguel</strong>, limitadas ao valor do aluguel contratado e processado através da plataforma PagPro.
              </p>
              <p className="text-slate-700 mb-4">
                O limite de cobertura aplica-se por contrato de locação e por imóvel protegido.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA QUINTA - DAS OBRIGAÇÕES DO CONTRATANTE</h2>
              <p className="text-slate-700 mb-4">O CONTRATANTE se obriga a:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Fornecer informações verdadeiras, precisas e atualizadas;</li>
                <li>Pagar pontualmente as <strong>mensalidades de proteção locatícia</strong> (equivalente a 15% do valor do aluguel), que serão geradas automaticamente pela plataforma PagPro no vencimento mensal;</li>
                <li>Manter atualizados os dados cadastrais e financeiros;</li>
                <li>Comunicar imediatamente qualquer alteração relevante ao contrato de locação, especialmente alterações no valor do aluguel;</li>
                <li>Pagar pontualmente todas as taxas e valores devidos à PAGPRO;</li>
                <li>Cumprir todas as regras e condições estabelecidas neste contrato e na plataforma.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA SEXTA - DAS OBRIGAÇÕES DA CONTRATADA</h2>
              <p className="text-slate-700 mb-4">A PAGPRO se obriga a:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Manter a plataforma funcionando de forma adequada e segura;</li>
                <li><strong>Gerar automaticamente, todos os meses, no vencimento mensal, a cobrança da mensalidade de proteção locatícia</strong> (equivalente a 15% do valor do aluguel) para cada inquilino protegido;</li>
                <li>Disponibilizar sistema de monitoramento para franqueados, imobiliárias e corretores acompanharem as cobranças e confirmações de pagamento das mensalidades, garantindo transparência;</li>
                <li>Permitir que franqueados, imobiliárias e corretores reenviem manualmente as mensalidades aos clientes/inquilinos, de forma opcional, para agilizar e reforçar a cobrança;</li>
                <li>Efetuar o pagamento da cobertura quando atendidas todas as condições estabelecidas;</li>
                <li>Manter sigilo sobre as informações dos usuários, conforme Política de Privacidade;</li>
                <li>Prestar suporte adequado aos usuários da plataforma.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA SÉTIMA - DA LEI DO INQUILINATO</h2>
              <p className="text-slate-700 mb-4">
                Este contrato está em conformidade com a Lei nº 8.245/1991 (Lei do Inquilinato) e demais normas aplicáveis. A proteção locatícia oferecida pela PAGPRO complementa as garantias previstas na legislação, sem substituí-las.
              </p>
              <p className="text-slate-700 mb-4">
                O serviço de proteção locatícia não altera os direitos e obrigações estabelecidos no contrato de locação entre locador e locatário, servindo apenas como garantia adicional de pagamento.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA OITAVA - DAS TAXAS E VALORES</h2>
              <p className="text-slate-700 mb-4">
                O CONTRATANTE pagará à PAGPRO as taxas e valores estabelecidos na plataforma, que podem incluir:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Taxa de adesão;</li>
                <li>Taxa mensal de proteção;</li>
                <li>Taxas de processamento de pagamento;</li>
                <li>Outras taxas previstas na plataforma.</li>
              </ul>
              <p className="text-slate-700 mb-4 mt-4">
                Os valores serão informados previamente ao CONTRATANTE antes da confirmação da adesão.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA NONA - DA RESCISÃO</h2>
              <p className="text-slate-700 mb-4">
                Este contrato poderá ser rescindido:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Pelo CONTRATANTE, a qualquer momento, mediante comunicação através da plataforma;</li>
                <li>Pela PAGPRO, em caso de descumprimento das obrigações pelo CONTRATANTE;</li>
                <li>Por término do contrato de locação protegido;</li>
                <li>Por não processamento dos pagamentos através da plataforma conforme exigido.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA DÉCIMA - DAS EXCLUSÕES</h2>
              <p className="text-slate-700 mb-4">
                A proteção locatícia <strong>NÃO</strong> cobre:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Inadimplência ocorrida antes do período de carência de 6 meses;</li>
                <li><strong>Mensalidades de proteção locatícia em atraso:</strong> Se as mensalidades de proteção (15% do aluguel) não estiverem em dia, a proteção não estará ativa;</li>
                <li>Danos materiais ao imóvel;</li>
                <li>Multas e penalidades contratuais;</li>
                <li>Despesas extras não relacionadas ao aluguel;</li>
                <li>Casos de fraude comprovada do CONTRATANTE;</li>
                <li>Inadimplência do locatário quando a proteção não estiver ativa por falta de pagamento das mensalidades.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA DÉCIMA PRIMEIRA - DA ADESÃO</h2>
              <p className="text-slate-700 mb-4">
                O CONTRATANTE declara ter lido, compreendido e aceito todos os termos e condições deste Contrato de Adesão, bem como os Termos de Uso e Política de Privacidade da plataforma PagPro Seguro Fiança.
              </p>
              <p className="text-slate-700 mb-4">
                A adesão a este contrato ocorre mediante:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Cadastro na plataforma PagPro Seguro Fiança;</li>
                <li>Aceite expresso dos termos através de checkbox ou botão de confirmação;</li>
                <li>Utilização efetiva dos serviços da plataforma.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA DÉCIMA SEGUNDA - DO FORO</h2>
              <p className="text-slate-700 mb-4">
                Fica eleito o foro da comarca de São Paulo, Estado de São Paulo, para dirimir quaisquer controvérsias oriundas deste contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-[#0F2240] mb-4">CLÁUSULA DÉCIMA TERCEIRA - DISPOSIÇÕES GERAIS</h2>
              <p className="text-slate-700 mb-4">
                Este contrato é regido pelas leis da República Federativa do Brasil. Quaisquer alterações serão comunicadas através da plataforma e entrarão em vigor após publicação.
              </p>
              <p className="text-slate-700 mb-4">
                O Grupo Life Company, como prestador do serviço e proprietário da marca PagPro Seguro Fiança, reserva-se o direito de modificar este contrato, sempre respeitando os direitos adquiridos dos usuários.
              </p>
            </section>

            <div className="bg-slate-50 p-6 rounded-lg my-8">
              <p className="text-slate-800 font-semibold mb-2">📋 RESUMO DAS REGRAS DE NEGÓCIO:</p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Cobertura de até <strong>3 aluguéis</strong> em caso de inadimplência;</li>
                <li>Período de carência de <strong>6 meses</strong>;</li>
                <li>Mensalidade de proteção: <strong>15% do valor do aluguel</strong>, gerada automaticamente pela plataforma;</li>
                <li>Mensalidades devem estar <strong>em dia</strong> para manter a proteção ativa;</li>
                <li>Aluguéis podem ser pagos diretamente à imobiliária/proprietário;</li>
                <li>Monitoramento transparente para franqueados, imobiliárias e corretores;</li>
                <li>Reenvio opcional de cobranças pelos parceiros;</li>
                <li>Proteção Locatícia - <strong>NÃO é seguro</strong>;</li>
                <li>Serviço prestado pelo <strong>Grupo Life Company</strong>.</li>
              </ul>
            </div>

            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600 text-center mb-2">
                <strong>Grupo Life Company</strong> - Proprietária da marca PagPro Seguro Fiança
              </p>
              <p className="text-xs text-slate-500 text-center">
                CNPJ: 50.206.225/0001-77 | Endereço: Alameda Jau, 1177, Andar 4 - Jardim Paulista, São Paulo - SP | Contato: contato@pagproseguro.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
