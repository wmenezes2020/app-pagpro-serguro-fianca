import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const heroHighlights = [
  {
    label: "Fiador 100% digital",
    description: "Onboarding tokenizado e assinatura eletrônica",
  },
  {
    label: "Cobertura configurável",
    description: "Garantia até 40x aluguel com gatilhos automáticos",
  },
  {
    label: "Hierarquia premiada",
    description: "Diretor → Cliente comissionados em tempo real",
  },
  {
    label: "IA antifraude proprietária",
    description: "Score interno + detecção contínua",
  },
];

const trustedBrands = [
  "Imóveis Premium",
  "Casa Nova",
  "Imobiliária Central",
  "Real Estate Pro",
  "Casa Segura",
];

const advantages = [
  {
    title: "Seguro Fiança PagPro",
    description:
      "Garantia imediata com cobertura de até 3x o valor do aluguel e aprovação inclusiva.",
  },
  {
    title: "Score Interno Proprietário",
    description:
      "Análise baseada em comportamento financeiro real, aceitando clientes com restrições.",
  },
  {
    title: "Proteção Multicamadas",
    description:
      "Monitoramento constante, validação de dados e IA atuando contra fraudes.",
  },
];

const growthPillars = [
  {
    title: "Sustentabilidade e Rentabilidade",
    copy: "Carteira sólida com seleção inteligente de locatários e recebimento garantido.",
  },
  {
    title: "Experiência do Cliente",
    copy: "Jornada fluida para imobiliária e inquilino, com transparência e automação.",
  },
  {
    title: "Segurança e Pioneirismo",
    copy: "Proteção em todas as etapas, da análise ao contrato, com tecnologia PagPro.",
  },
];

const pricingBenefits = [
  "Elimina a necessidade de fiador tradicional",
  "Taxas competitivas com previsibilidade",
  "Processo de aprovação em minutos",
  "Cobertura sob medida para o perfil da carteira",
  "Contratação 100% digital e monitorada",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="#home" className="flex items-center gap-3">
            <Image
              src="/logo-m-black.png"
              alt="PagPro Seguro Fiança"
              width={140}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <Link href="#home" className="transition-colors hover:text-primary">
              Início
            </Link>
            <Link href="#about" className="transition-colors hover:text-primary">
              Quem Somos
            </Link>
            <Link href="#products" className="transition-colors hover:text-primary">
              Produtos
            </Link>
            <Link href="#club" className="transition-colors hover:text-primary">
              Clube
            </Link>
            <Link href="#contact" className="transition-colors hover:text-primary">
              Contato
            </Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Área do Cliente</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="#contact">Contato comercial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="home" className="flex-1">
        <section className="bg-gradient-to-b from-primary-50/50 via-white to-white py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center gap-5">
              <Badge variant="outline" className="w-fit border-primary-200 bg-primary-50 text-primary">
                Plataforma integrada para imobiliárias
              </Badge>
              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl lg:text-5xl">
                A garantia inteligente que sua imobiliária precisa para{" "}
                <span className="text-primary">alugar mais e melhor</span>
              </h1>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                Seguro fiança com análise inclusiva, cobertura ampliada e
                experiência digital completa. Elimine o fiador tradicional,
                reduza a inadimplência e acelere suas locações.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="lg"
                  iconRight={<ArrowRight className="h-4 w-4" />}
                  asChild
                >
                  <Link href="#contact">Solicitar demonstração</Link>
                </Button>
                <Button variant="ghost" size="lg" asChild>
                  <Link href="#products">Conheça os produtos</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Dashboard PagPro
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-slate-900">
                    Performance em tempo real
                  </h3>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" />
                  Online
                </span>
              </div>
              <div className="mb-5 grid gap-3">
                {heroHighlights.map((highlight) => (
                  <div
                    key={highlight.label}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {highlight.label}
                      </p>
                      <p className="text-xs text-slate-600">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-primary/10 p-4">
                <p className="text-sm font-medium text-primary">
                  Cobertura garantida até{" "}
                  <span className="font-semibold">3x o valor do aluguel</span>
                </p>
                <p className="mt-1.5 text-xs text-slate-600">
                  Monitoramento contínuo, acionamento imediato e suporte
                  especializado para imobiliária e inquilino.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Imobiliárias parceiras em todo o Brasil
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500 md:gap-6 md:text-base">
              {trustedBrands.map((brand) => (
                <span
                  key={brand}
                  className="rounded-full border border-slate-200 px-4 py-1"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col gap-5">
              <Badge variant="outline" className="w-fit border-slate-200 bg-white">
                O futuro do aluguel começa aqui
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl">
                Ecossistema financeiro completo para imobiliárias que querem
                escalar com segurança
              </h2>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                Com tecnologia proprietária e inteligência de dados, a PagPro
                transforma o seguro fiança em um motor de crescimento. Nosso
                score interno considera histórico bancário e capacidade real de
                pagamento, mesmo para clientes negativados.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="#contact">
                    Quero fazer parte
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link href="#contact">Falar com especialista</Link>
                </Button>
              </div>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="mb-4 text-lg font-semibold text-primary">
                Diferenciais PagPro
              </h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  • Score interno proprietário conectado a dados financeiros reais.
                </p>
                <p>
                  • IA antifraude com monitoramento contínuo da carteira.
                </p>
                <p>
                  • Cobertura parametrizável: do onboarding ao distrato digital.
                </p>
                <p>
                  • Tokenização e convites seguros para toda a hierarquia de parceiros.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="bg-slate-50 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 max-w-2xl">
              <Badge variant="outline" className="w-fit border-primary-200 bg-white">
                Produtos PagPro
              </Badge>
              <h2 className="mt-3 text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl">
                Soluções que cobrem toda a jornada do aluguel
              </h2>
              <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                Seguro fiança, score interno proprietário e proteção total
                combinados para entregar previsibilidade, segurança e escala.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {advantages.map((advantage) => (
                <Card
                  key={advantage.title}
                  className="border-slate-200 bg-white"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-slate-600">
                    {advantage.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="club" className="bg-white py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <Badge variant="outline" className="w-fit border-secondary/40 bg-secondary/10 text-secondary">
                Clube PagPro
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl">
                Crescimento compartilhado com benefícios exclusivos
              </h2>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                Acesso a campanhas de marketing cooperado, materiais de apoio,
                treinamentos para corretores, indicadores comparativos e
                consultoria especializada.
              </p>
              <Button asChild>
                <Link href="#contact">Quero participar</Link>
              </Button>
            </div>
            <Card className="border-slate-200 bg-slate-50">
              <CardContent className="space-y-5">
                {growthPillars.map((pillar) => (
                  <div key={pillar.title}>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{pillar.copy}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-b from-primary-600 via-primary-500 to-primary-400 py-16 md:py-20" id="protection">
          <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-6 md:flex-row md:items-center md:gap-10">
            <div className="flex-1 space-y-4">
              <span className="inline-flex items-center rounded-full border border-white/40 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                Proteção Multicamadas
              </span>
              <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                Sua imobiliária blindada contra fraudes e inadimplência
              </h2>
              <ul className="space-y-3 text-sm leading-relaxed text-white">
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
                  <span>Análise de crédito com IA proprietária e leitura de extratos bancários.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
                  <span>Validação documental instantânea e cruzamento de dados em órgãos oficiais.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-white" />
                  <span>Monitoramento da carteira e alertas proativos para tomada de decisão.</span>
                </li>
              </ul>
              <Link
                href="#contact"
                className="mt-6 inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-medium text-primary transition-colors hover:bg-slate-50 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Quero proteger minha carteira
              </Link>
            </div>
            <Card className="flex-1 border-0 bg-white shadow-2xl">
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  Indicadores que importam
                </h3>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  <li>
                    • Renovação automatizada com alertas proativos para cada contrato.
                  </li>
                  <li>
                    • SLA de acionamento operacional inferior a 24 horas, com
                    acompanhamento humano.
                  </li>
                  <li>
                    • Pagamentos disponibilizados assim que o sistema confirma a quitação.
                  </li>
                  <li>
                    • Relatórios transparentes de comissionamento para toda a cadeia.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-white py-16 md:py-20" id="pricing">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <Badge variant="outline" className="w-fit border-slate-200 bg-white">
                Condições exclusivas
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900 md:text-3xl lg:text-4xl">
                Mais segurança e maior rentabilidade para sua carteira
              </h2>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">
                Cobrança transparente: taxa de adesão única, parcelas flexíveis
                , ativação imediata após pagamento e liberação automática do
                repasse aos parceiros.
              </p>
            </div>
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Plano PagPro</CardTitle>
                  <Badge variant="default">Maior cobertura do mercado</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Modelos sob medida para cada carteira — configuramos cobertura,
                  taxa e forma de cobrança conforme sua estratégia.
                </p>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {pricingBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" asChild>
                  <Link href="#contact">Solicitar proposta</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="contact" className="bg-slate-50 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle>Contato e suporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">
                    Imobiliárias:
                  </span>{" "}
                  imobiliarias@pagproseguro.com.br
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Inquilinos:
                  </span>{" "}
                  inquilino@pagproseguro.com.br
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Telefone:
                  </span>{" "}
                  (11) 0000-0000
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Horário de atendimento:
                  </span>{" "}
                  Segunda a sexta-feira: 8h às 18h | Sábado: 8h às 13h
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">
                    São Paulo
                  </span>
                  <br />
                  Alameda Jaú, 1177, Andar 4 - Jardim Paulista
                  <br />
                  São Paulo - SP, 01420-903
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-medium text-slate-700">
              2025 © PagPro Seguro Fiança
            </p>
            <p className="mt-1">
              Grupo Life Company Soluções e Tecnologia LTDA · CNPJ
              50.206.225/0001-77
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
            <Link href="#about" className="transition-colors hover:text-primary">
              Quem Somos
            </Link>
            <Link href="#products" className="transition-colors hover:text-primary">
              Produtos
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-primary">
              Planos
            </Link>
            <Link href="#contact" className="transition-colors hover:text-primary">
              Contato
            </Link>
            <Link href="/login" className="transition-colors hover:text-primary">
              Área do Cliente
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
