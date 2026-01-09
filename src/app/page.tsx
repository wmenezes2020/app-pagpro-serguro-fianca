import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Users, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
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
    description: "Garantia até 3x aluguel com gatilhos automáticos",
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
    <div className="min-h-screen bg-white" style={{ backgroundColor: '#FFFFFF', color: '#0F2240' }}>
      <header className="sticky top-0 z-50 border-b border-slate-200/40 bg-white/95 backdrop-blur-xl shadow-[0_4px_20px_-2px_rgb(15_34_64_/0.08)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="#home" className="flex items-center gap-4 group">
            <div className="relative">
              <Image
                src="/logo-m-black.png"
                alt="PagPro Seguro Fiança"
                width={150}
                height={40}
                className="h-10 w-auto transition-all group-hover:scale-105"
                priority
              />
            </div>
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200/60">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 shadow-sm">
                <div className="relative">
                  <span className="h-2 w-2 rounded-full bg-green-500 block" />
                  <span className="absolute inset-0 h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75" />
                </div>
                <span className="text-xs font-bold text-green-700 tracking-wide">Plataforma Certificada</span>
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 xl:gap-2 text-sm font-bold text-slate-800 lg:flex">
            <Link href="#home" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-100 hover:text-[#0F2240] relative group">
              Início
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FFD700] transition-all group-hover:w-3/4" />
            </Link>
            <Link href="#about" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-100 hover:text-[#0F2240] relative group">
              Quem Somos
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FFD700] transition-all group-hover:w-3/4" />
            </Link>
            <Link href="#products" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-100 hover:text-[#0F2240] relative group">
              Produtos
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FFD700] transition-all group-hover:w-3/4" />
            </Link>
            <Link href="#club" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-100 hover:text-[#0F2240] relative group">
              Clube
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FFD700] transition-all group-hover:w-3/4" />
            </Link>
            <Link href="#contact" className="px-4 py-2 rounded-lg transition-all hover:bg-slate-100 hover:text-[#0F2240] relative group">
              Contato
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#FFD700] transition-all group-hover:w-3/4" />
            </Link>
          </nav>
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="sm" asChild className="font-bold text-slate-700 hover:text-[#0F2240]">
              <Link href="/login">Área do Cliente</Link>
            </Button>
            <Button size="sm" asChild className="font-bold shadow-lg shadow-[#FFD700]/20">
              <Link href="#contact">Contato comercial</Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="home" className="flex-1">
        {/* Hero Section - Redesenhado com mais impacto */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-20 md:py-28">
          {/* Background decorativo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#FFD700]/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-100/20 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6">
            {/* Conteúdo principal centralizado */}
            <div className="max-w-4xl mx-auto text-center space-y-8 z-10">
              <h1 className="mx-auto border-primary-200/60 bg-white/90 backdrop-blur-sm text-primary shadow-sm px-4 py-2">
                Plataforma integrada para imobiliárias
              </h1>
              <h2 className="text-5xl font-extrabold leading-[1.1] text-[#0F2240] tracking-tight md:text-6xl lg:text-7xl">
                A garantia inteligente que sua imobiliária precisa para{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">alugar mais e melhor</span>
                  <span className="absolute bottom-3 left-0 right-0 h-5 bg-[#FFD700]/50 -skew-x-12 -z-10" />
                </span>
              </h2>
              <p className="text-xl leading-relaxed text-slate-700 md:text-2xl max-w-3xl mx-auto font-medium">
                Seguro fiança com análise inclusiva, cobertura ampliada e
                experiência digital completa. Elimine o fiador tradicional,
                reduza a inadimplência e acelere suas locações.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <Button
                  size="lg"
                  iconRight={<ArrowRight className="h-5 w-5" />}
                  asChild
                  className="shadow-xl shadow-[#FFD700]/25 hover:shadow-2xl hover:shadow-[#FFD700]/35 text-base px-8 py-6"
                >
                  <Link href="#contact">Solicitar demonstração</Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-2 border-[#0F2240]/30 hover:border-[#0F2240]/50 hover:bg-[#0F2240] hover:text-white font-bold text-base px-8 py-6">
                  <Link href="#products">Conheça os produtos</Link>
                </Button>
              </div>
            </div>

            {/* Dashboard Card - Abaixo do hero, não competindo */}
            <div className="mt-16 max-w-5xl mx-auto relative z-10">
              <div className="professional-card p-10 bg-white/98 backdrop-blur-md border-slate-200/60 shadow-[0_25px_80px_-12px_rgb(15_34_64_/0.2)]">
                <div className="mb-8 flex items-center justify-between border-b border-slate-200/60 pb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-[#0F2240] to-[#0C1B33]">
                        <ShieldCheck className="h-5 w-5 text-[#FFD700]" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Dashboard PagPro
                      </p>
                      {/* <span className="px-3 py-1 rounded-full bg-green-50 border border-green-200/60 text-green-700 text-xs font-bold">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block mr-1.5 animate-pulse" />
                        SSL Seguro
                      </span> */}
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#0F2240] tracking-tight">
                      Performance em tempo real
                    </h3>
                  </div>
                  {/* <span className="flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 text-xs font-bold text-green-700 border border-green-200/60 shadow-md">
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                    Online
                  </span> */}
                </div>
                <div className="mb-8 grid gap-4 md:grid-cols-2">
                  {heroHighlights.map((highlight, index) => (
                    <div
                      key={highlight.label}
                      className="group flex items-start gap-4 rounded-xl border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 p-5 shadow-sm hover:shadow-lg hover:border-[#FFD700]/40 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex-shrink-0 p-2.5 rounded-xl bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-all">
                        <CheckCircle2 className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-extrabold text-[#0F2240] mb-2">
                          {highlight.label}
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-[#0F2240] via-[#0C1B33] to-[#091426] p-8 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD700]/10 rounded-full blur-3xl" />
                  <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-xl bg-[#FFD700]/20">
                        <ShieldCheck className="h-6 w-6 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-white mb-1">
                          Cobertura garantida até{" "}3x o valor do aluguel
                        </h3>
                        <p className="text-sm text-white leading-relaxed font-bold">
                          Monitoramento contínuo, acionamento imediato e suporte
                          especializado para imobiliária e inquilino.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partners Section - Visual e Impactante */}
        <section className="border-b border-slate-200/40 bg-white py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">
                Imobiliárias parceiras em todo o Brasil
              </p>
              <div className="section-divider" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {trustedBrands.map((brand) => (
                <div
                  key={brand}
                  className="group relative flex items-center justify-center rounded-2xl border-2 border-slate-200/60 bg-gradient-to-br from-white to-slate-50/50 px-6 py-8 shadow-sm hover:shadow-xl hover:border-[#FFD700]/40 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-[#0F2240] transition-colors relative z-10 text-center">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section - Layout Centralizado */}
        <section id="about" className="relative bg-gradient-to-b from-white via-slate-50/30 to-white py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,34,64,0.03),transparent_70%)] pointer-events-none" />
          <div className="relative mx-auto max-w-6xl px-6 z-10">
            <div className="text-center mb-16">
              <h1 className="mx-auto border-primary-200/60 bg-white/90 backdrop-blur-sm text-primary shadow-sm px-4 py-2 mb-6">
                O futuro do aluguel começa aqui
              </h1>
              <h2 className="text-4xl font-extrabold text-[#0F2240] tracking-tight leading-[1.1] md:text-5xl lg:text-6xl mb-6">
                Ecossistema financeiro completo para imobiliárias que querem
                escalar com segurança
              </h2>
              <p className="text-xl leading-relaxed text-slate-700 md:text-2xl max-w-3xl mx-auto font-medium mb-8">
                Com tecnologia proprietária e inteligência de dados, a PagPro
                transforma o seguro fiança em um motor de crescimento. Nosso
                score interno considera histórico bancário e capacidade real de
                pagamento, mesmo para clientes negativados.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <Button asChild size="lg" className="shadow-xl shadow-[#FFD700]/25 text-base px-8 py-6">
                  <Link href="#contact">
                    Quero fazer parte
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="border-2 border-[#0F2240]/30 hover:border-[#0F2240]/50 font-bold text-base px-8 py-6">
                  <Link href="#contact">Falar com especialista</Link>
                </Button>
              </div>
              <div className="section-divider" />
            </div>

            {/* Diferenciais em Grid */}
            <div className="grid md:grid-cols-2 gap-8 mt-16">
              {[
                { icon: ShieldCheck, title: "Score interno proprietário", desc: "Conectado a dados financeiros reais" },
                { icon: ShieldCheck, title: "IA antifraude", desc: "Monitoramento contínuo da carteira" },
                { icon: ShieldCheck, title: "Cobertura parametrizável", desc: "Do onboarding ao distrato digital" },
                { icon: ShieldCheck, title: "Tokenização segura", desc: "Convites seguros para toda a hierarquia" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <Card key={index} className="professional-card p-8 hover:-translate-y-2 border-2 border-slate-200/60 hover:border-[#FFD700]/40 group">
                    <div className="flex items-start gap-5">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F2240] to-[#0C1B33] group-hover:scale-110 transition-transform shadow-xl">
                        <Icon className="h-7 w-7 text-[#FFD700]" />
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-xl font-extrabold text-[#0F2240] mb-3 tracking-tight">{item.title}</h3>
                        <p className="text-base text-slate-700 font-semibold leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products Section - Mais impactante */}
        <section id="products" className="relative bg-gradient-to-b from-slate-50 via-white to-white py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,34,64,0.03),transparent_50%)] pointer-events-none" />
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-12 max-w-3xl text-center mx-auto">
              <h1 className="w-fit mx-auto border-primary-200/60 bg-white/80 backdrop-blur-sm text-primary shadow-sm">
                Produtos PagPro
              </h1>
              <h2 className="mt-4 text-4xl font-extrabold text-[#0F2240] tracking-tight md:text-5xl lg:text-6xl">
                Soluções que cobrem toda a jornada do aluguel
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl max-w-2xl mx-auto font-medium">
                Seguro fiança, score interno proprietário e proteção total
                combinados para entregar previsibilidade, segurança e escala.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {advantages.map((advantage, index) => (
                <Card
                  key={advantage.title}
                  className="professional-card group hover:-translate-y-3 transition-all duration-500 relative overflow-hidden border-2 border-slate-200/60 hover:border-[#FFD700]/40"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#FFD700]/10 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="pb-6 relative z-10">
                    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#0F2240] to-[#0C1B33] w-fit shadow-xl group-hover:scale-110 transition-transform">
                      <ShieldCheck className="h-8 w-8 text-[#FFD700]" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-[#0F2240] tracking-tight leading-tight">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-base leading-relaxed text-slate-700 font-semibold relative z-10">
                    {advantage.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Club Section - Layout Vertical Centralizado */}
        <section id="club" className="relative bg-gradient-to-b from-white via-slate-50/30 to-white py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,215,0,0.05),transparent_60%)] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6 z-10">
            <div className="text-center mb-16">
              <h1 className="mx-auto px-4 py-2 mb-6">
                Clube PagPro
              </h1>
              <h2 className="text-4xl font-extrabold text-[#0F2240] tracking-tight leading-[1.1] md:text-5xl lg:text-6xl mb-6">
                Crescimento compartilhado com benefícios exclusivos
              </h2>
              <p className="text-xl leading-relaxed text-slate-700 md:text-2xl max-w-3xl mx-auto font-medium mb-8">
                Acesso a campanhas de marketing cooperado, materiais de apoio,
                treinamentos para corretores, indicadores comparativos e
                consultoria especializada.
              </p>
              <Button asChild size="lg" className="shadow-xl shadow-[#FFD700]/25 text-base px-8 py-6">
                <Link href="#contact">Quero participar</Link>
              </Button>
            </div>

            {/* Cards em Grid Horizontal */}
            <div className="grid md:grid-cols-3 gap-6">
              {growthPillars.map((pillar, index) => (
                <Card key={pillar.title} className="professional-card p-8 hover:-translate-y-2 border-2 border-slate-200/60 hover:border-[#FFD700]/40 group">
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/5 w-fit group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-6 w-6 text-[#FFD700]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#0F2240] tracking-tight mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-700 font-semibold">{pillar.copy}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Protection Section - Mais impactante */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0F2240] via-[#0C1B33] to-[#091426] py-20 md:py-28" id="protection">
          {/* Background decorativo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFD700]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,215,0,0.05),transparent_50%)]" />
          </div>

          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 md:flex-row md:items-center md:gap-16 z-10">
            <div className="flex-1 space-y-6">
              <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                Proteção Multicamadas
              </span>
              <h2 className="text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl tracking-tight" style={{ color: 'white' }}>
                Sua imobiliária blindada contra fraudes e inadimplência
              </h2>
              <ul className="space-y-4 text-base leading-relaxed md:text-lg" style={{ color: 'white' }}>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1.5 p-1 rounded-full bg-[#FFD700]/20">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#FFD700] block" />
                  </div>
                  <span className="font-bold" style={{ color: 'white', fontWeight: 'bold' }}>Análise de crédito com IA proprietária e leitura de extratos bancários.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1.5 p-1 rounded-full bg-[#FFD700]/20">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#FFD700] block" />
                  </div>
                  <span className="font-bold" style={{ color: 'white', fontWeight: 'bold' }}>Validação documental instantânea e cruzamento de dados em órgãos oficiais.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1.5 p-1 rounded-full bg-[#FFD700]/20">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#FFD700] block" />
                  </div>
                  <span className="font-bold" style={{ color: 'white', fontWeight: 'bold' }}>Monitoramento da carteira e alertas proativos para tomada de decisão.</span>
                </li>
              </ul>
              <Button variant="yellow-text" size="lg" asChild className="mt-8 shadow-lg shadow-[#FFD700]/20 hover:shadow-xl hover:shadow-[#FFD700]/30">
                <Link href="#contact">
                  Quero proteger minha carteira
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div
              style={{
                flex: '1',
                borderRadius: '1rem',
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: '#CBD5E1',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '2rem',
                color: '#0F2240'
              }}
            >
              <div style={{ color: '#0F2240 !important' as any }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{
                    padding: '0.75rem',
                    borderRadius: '0.75rem',
                    background: 'linear-gradient(to bottom right, #0F2240, #0C1B33)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}>
                    <ShieldCheck className="h-5 w-5" style={{ color: '#FFD700 !important' as any }} />
                  </div>
                  <h3
                    style={{
                      color: '#0F2240 !important' as any,
                      fontWeight: '800',
                      fontSize: '1.25rem',
                      margin: 0,
                      lineHeight: '1.2'
                    }}
                  >
                    Indicadores que importam
                  </h3>
                </div>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    color: '#0F2240 !important' as any
                  }}
                >
                  {[
                    "Renovação automatizada com alertas proativos para cada contrato.",
                    "SLA de acionamento operacional inferior a 24 horas, com acompanhamento humano.",
                    "Pagamentos disponibilizados assim que o sistema confirma a quitação.",
                    "Relatórios transparentes de comissionamento para toda a cadeia."
                  ].map((item, index) => (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        marginBottom: '1rem',
                        color: '#0F2240 !important' as any
                      }}
                    >
                      <div style={{
                        flexShrink: 0,
                        marginTop: '0.125rem',
                        padding: '0.625rem',
                        borderRadius: '0.75rem',
                        background: 'linear-gradient(to bottom right, #0F2240, #0C1B33)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        <CheckCircle2 className="h-5 w-5" style={{ color: '#FFD700 !important' as any }} />
                      </div>
                      <span
                        style={{
                          color: '#0F2240 !important' as any,
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          display: 'block',
                          lineHeight: '1.6',
                          paddingTop: '0.125rem'
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section - Layout Centralizado */}
        <section className="relative bg-white py-24 md:py-32 overflow-hidden" id="pricing">
          <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/3 via-transparent to-primary-50/20 pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-6 z-10">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mx-auto border-slate-200/60 bg-white/90 backdrop-blur-sm text-primary shadow-sm px-4 py-2 mb-6">
                Condições exclusivas
              </Badge>
              <h2 className="text-4xl font-extrabold text-[#0F2240] tracking-tight leading-[1.1] md:text-5xl lg:text-6xl mb-6">
                Mais segurança e maior rentabilidade para sua carteira
              </h2>
              <p className="text-xl leading-relaxed text-slate-700 md:text-2xl max-w-3xl mx-auto font-medium">
                Cobrança transparente: taxa de adesão única, parcelas flexíveis
                , ativação imediata após pagamento e liberação automática do
                repasse aos parceiros.
              </p>
            </div>
            <Card className="relative border-2 border-[#FFD700]/40 bg-gradient-to-br from-white via-primary-50/30 to-white shadow-2xl overflow-hidden max-w-2xl mx-auto">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFD700]/5 rounded-full blur-3xl" />
              <CardHeader className="border-b border-slate-200/60 pb-8 pt-8 px-8 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-3xl font-extrabold text-[#0F2240] tracking-tight">Plano PagPro</CardTitle>
                  <Badge variant="default" className="bg-[#FFD700] text-[#0F2240] font-bold shadow-lg px-4 py-2 text-sm">
                    Maior cobertura do mercado
                  </Badge>
                </div>
                <p className="text-base text-slate-700 leading-relaxed font-semibold mt-4">
                  Modelos sob medida para cada carteira — configuramos cobertura,
                  taxa e forma de cobrança conforme sua estratégia.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 pt-8 px-8 pb-8 relative z-10">
                <ul className="space-y-4 text-base text-[#0F2240]">
                  {pricingBenefits.map((benefit, index) => (
                    <li key={benefit} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 p-2 rounded-xl bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-all group-hover:scale-110">
                        <CheckCircle2 className="h-5 w-5 text-[#FFD700]" />
                      </div>
                      <span className="font-bold text-[#0F2240] leading-relaxed group-hover:text-[#0F2240] transition-colors pt-0.5">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Link href="#contact" className="text-center" style={{ color: '#FFFFFF !important' as any }}>
                  <Badge variant="default" className="bg-[#0f2240] text-[#FFFFFF] font-bold shadow-lg px-4 py-2 text-sm text-center">
                    <b style={{ color: '#FFFFFF !important' as any }}>Solicitar proposta</b>
                  </Badge>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Section - Layout Centralizado */}
        <section id="contact" className="relative bg-white py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50/20 via-transparent to-[#FFD700]/5 pointer-events-none" />
          <div className="relative mx-auto max-w-6xl px-6 z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-[#0F2240] tracking-tight leading-[1.1] md:text-5xl lg:text-6xl mb-6">
                Fale Conosco
              </h2>
              <p className="text-xl leading-relaxed text-slate-700 md:text-2xl max-w-3xl mx-auto font-medium">
                Estamos prontos para transformar a gestão de aluguéis da sua imobiliária
              </p>
            </div>
            <div className="grid md:grid-cols-1 gap-8 justify-center">
              <Card className="professional-card p-10 hover:-translate-y-2 border-2 border-slate-200/60 hover:border-[#FFD700]/40 mx-auto">
                <CardHeader className="pb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F2240] to-[#0C1B33] shadow-lg">
                      <Users className="h-6 w-6 text-[#FFD700]" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-[#0F2240] tracking-tight">Contato e suporte</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-base">
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-xl bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-all group-hover:scale-110">
                      <Mail className="h-5 w-5 text-[#0F2240]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-[#0F2240] text-xs uppercase tracking-wider mb-2">Licenciamento:</p>
                      <a href="mailto:licenciamento@pagproseguro.com.br" className="text-[#0F2240] font-bold hover:text-[#0C1B33] transition-colors text-lg">
                        licenciamento@pagproseguro.com.br
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-xl bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-all group-hover:scale-110">
                      <Mail className="h-5 w-5 text-[#0F2240]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-[#0F2240] text-xs uppercase tracking-wider mb-2">Imobiliárias:</p>
                      <a href="mailto:imobiliarias@pagproseguro.com.br" className="text-[#0F2240] font-bold hover:text-[#0C1B33] transition-colors text-lg">
                        imobiliarias@pagproseguro.com.br
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-xl bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-all group-hover:scale-110">
                      <Mail className="h-5 w-5 text-[#0F2240]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-[#0F2240] text-xs uppercase tracking-wider mb-2">Inquilinos:</p>
                      <a href="mailto:inquilino@pagproseguro.com.br" className="text-[#0F2240] font-bold hover:text-[#FFD700] transition-colors text-lg">
                        inquilino@pagproseguro.com.br
                      </a>
                    </div>
                  </div>
                  {/* <div className="flex items-start gap-4 group">
                    <div className="p-3 rounded-xl bg-[#FFD700]/10 group-hover:bg-[#FFD700]/20 transition-all group-hover:scale-110">
                      <Phone className="h-5 w-5 text-[#0F2240]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-[#0F2240] text-xs uppercase tracking-wider mb-2">Telefone:</p>
                      <a href="tel:+5511942204240" className="text-[#0F2240] font-bold hover:text-[#0C1B33] transition-colors text-lg">
                        (11) 94220-4240
                      </a>
                    </div>
                  </div> */}
                  <div className="pt-6 border-t-2 border-slate-200/60 text-center">
                    <p className="font-extrabold text-[#0F2240] text-xs uppercase tracking-wider mb-3">Horário de atendimento:</p>
                    <p className="text-slate-700 font-bold text-base text-center">
                      Segunda a sexta-feira: 8h às 18h<br />
                      Sábado: 8h às 13h
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* <Card className="professional-card p-10 hover:-translate-y-2 border-2 border-slate-200/60 hover:border-[#FFD700]/40">
                <CardHeader className="pb-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0F2240] to-[#0C1B33] shadow-lg">
                      <MapPin className="h-6 w-6 text-[#FFD700]" />
                    </div>
                    <CardTitle className="text-2xl font-extrabold text-[#0F2240] tracking-tight">Endereço</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-base">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#FFD700]/10">
                      <MapPin className="h-5 w-5 text-[#0F2240]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-extrabold text-[#0F2240] text-xs uppercase tracking-wider mb-3">São Paulo</p>
                      <p className="text-[#0F2240] font-bold leading-relaxed text-lg">
                        Alameda Jaú, 1177, Andar 4<br />
                        Jardim Paulista<br />
                        São Paulo - SP, 01420-903
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-slate-200/40 bg-gradient-to-b from-white via-slate-50/50 to-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12 justify-center">
            <div className="md:col-span space-y-6">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo-m-black.png"
                  alt="PagPro Seguro Fiança"
                  width={160}
                  height={42}
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-base font-extrabold text-[#0F2240]">
                2026 © PagPro Seguro Fiança
              </p>
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-[#0F2240] uppercase tracking-wider mb-4">Empresa</h5>
              <nav className="flex flex-col gap-3 text-sm font-bold text-slate-700">
                <Link href="#about" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Quem Somos
                </Link>
                <Link href="#products" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Produtos
                </Link>
                <Link href="#pricing" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Planos
                </Link>
              </nav>
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-[#0F2240] uppercase tracking-wider mb-4">Suporte</h5>
              <nav className="flex flex-col gap-3 text-sm font-bold text-slate-700">
                <Link href="#contact" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Contato
                </Link>
                <Link href="/login" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Área do Cliente
                </Link>
              </nav>
            </div>
            <div>
              <h5 className="text-sm font-extrabold text-[#0F2240] uppercase tracking-wider mb-4">Legal</h5>
              <nav className="flex flex-col gap-3 text-sm font-bold text-slate-700">
                <Link href="/termos-de-uso" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Termos de Uso
                </Link>
                <Link href="/politica-de-privacidade" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Política de Privacidade
                </Link>
                {/* <Link href="/contrato-de-adesao" className="transition-colors hover:text-[#0C1B33] w-fit flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" /> Contrato de Adesão
                </Link> */}
              </nav>
            </div>
          </div>
          <div className="pt-8 border-t-2 border-slate-200/60 text-center">
            <p className="text-xs text-slate-500 text-center font-medium">
              Todos os direitos reservados. PagPro é uma marca registrada do
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-medium text-center">
              Grupo Life Company Soluções e Tecnologia LTDA<br />
              CNPJ: 50.206.225/0001-77
            </p>
            <p>&nbsp;</p>
            <div className="flex flex-wrap items-center gap-4 pt-2 justify-center w-full">
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/60 shadow-md">
                <ShieldCheck className="h-5 w-5 text-green-700" />
                <span className="text-sm font-extrabold text-green-700">Seguro e Confiável</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200/60 shadow-md">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                <span className="text-sm font-extrabold text-slate-700">SSL Seguro</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
