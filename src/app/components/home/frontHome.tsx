'use client'
import Navbar from "@/app/components/Navigation/navbar";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ajuda from "../../../../public/ajuda.png"

import { FaCalculator, FaChevronUp } from "react-icons/fa6";
import { BsFillClockFill } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiBarChartFill } from "react-icons/ri";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoExtensionPuzzle } from "react-icons/io5";
import { PlansCard } from "./PlansCard";
import { HomeFooter } from "./HomeFooter";

const BENEFICIOS = [
  { icon: FaCalculator, texto: "Calcule a depreciação dos ativos com precisão." },
  { icon: BsFillClockFill, texto: "Acompanhe o valor patrimonial em tempo real." },
  { icon: MdOutlineAttachMoney, texto: "Reduza custos com gestão eficiente de ativos." },
  { icon: RiBarChartFill, texto: "Visualize o patrimônio de cada departamento em um só lugar." },
  { icon: FaArrowTrendUp, texto: "Maximize o retorno sobre o investimento em ativos." },
  { icon: IoExtensionPuzzle, texto: "Simplifique a gestão de bens patrimoniais complexos." },
];

const SERVICOS = [
  {
    titulo: "Análise detalhada",
    texto: "Avaliamos todos os custos associados ao ciclo de vida dos seus ativos, desde a aquisição até a manutenção e descarte.",
  },
  {
    titulo: "Identificação de Oportunidades",
    texto: "Através do LCC (Life Cycle Cost), identificamos áreas onde é possível reduzir custos e aumentar a eficiência operacional.",
  },
  {
    titulo: "Tomada de Decisão Informada",
    texto: "Fornecemos dados claros para que você possa tomar decisões embasadas e estratégicas, otimizando seu retorno sobre investimento.",
  },
  {
    titulo: "Sustentabilidade e Conformidade",
    texto: "Ajudamos a garantir que suas decisões estejam alinhadas com padrões de sustentabilidade e regulamentações.",
  },
];

export default function FrontHome() {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col overflow-x-hidden">
        <Navbar />

        <section id="home" className="fundoHome scroll-mt-20">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 pb-16 pt-28 sm:px-6 md:flex-row md:items-center md:gap-12 md:pt-40 lg:px-8 lg:pb-24 lg:pt-48">
            <div className="flex w-full flex-col md:w-1/2">
              <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl 2xl:text-5xl">
                Gerencie seu patrimônio da forma mais eficiente do mercado
              </h1>
              <p className="my-5 max-w-md border-l-2 border-solid border-primary pl-4 text-base font-light text-white 2xl:text-xl">
                Gestão Estratégica de Ativos: Monitorando, Avaliando e Otimizando Seu Patrimônio Empresarial
              </p>

              <a
                href="#sobre"
                className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-8 text-base font-medium text-black transition-colors hover:bg-primary-hover sm:w-auto sm:self-start 2xl:text-lg"
              >
                Conheça nosso serviço
              </a>
            </div>
            <div className="flex w-full justify-center md:w-1/2 md:justify-end">
              <Image className="w-64 sm:w-80 lg:w-[400px]" src={"/chartsPng1.png"} alt="Gráfico de patrimônio" width={400} height={300} priority />
            </div>
          </div>
        </section>

        <section className="fundoSec2 py-20 text-white lg:py-32">
          <h2 className="mx-auto max-w-3xl px-4 text-center text-2xl font-semibold sm:text-3xl">
            Por que nosso sistema é essencial para sua empresa?
          </h2>
          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-x-10 gap-y-10 px-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFICIOS.map(({ icon: Icone, texto }) => (
              <li key={texto} className="flex flex-col gap-3">
                <Icone color="#F6CF45" size={36} aria-hidden />
                <p className="max-w-xs text-base text-gray-200">{texto}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="sobre" className="scroll-mt-20 py-20 text-white lg:py-28">
          <h2 className="mx-auto max-w-3xl px-4 text-center text-2xl font-semibold sm:text-3xl">Como podemos te ajudar?</h2>
          <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center gap-10 px-6 md:flex-row md:gap-16 lg:px-8">
            <div className="w-full max-w-sm md:w-1/2 md:max-w-none">
              <Image src={ajuda} alt="" width={800} className="h-auto w-full" />
            </div>
            <div className="flex w-full flex-col gap-8 md:w-1/2">
              {SERVICOS.map(servico => (
                <div key={servico.titulo} className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold lg:text-2xl">{servico.titulo}</h3>
                  <p className="max-w-lg text-sm leading-relaxed text-gray-300 lg:text-base">{servico.texto}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="planos" className="mb-16 scroll-mt-20 pt-12 text-white lg:pt-20">
          <h2 className="mx-auto mb-12 max-w-3xl px-4 text-center text-2xl font-semibold sm:text-3xl">Nossos planos</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 px-6 md:grid-cols-3 lg:gap-10 lg:px-8">
            <PlansCard
              name={"Básico"}
              description={"Perfeito para pequenas empresas, que querem inovar com a Cybox"}
              price={350}
              advantages={["Limite de 2 departamentos", "Quatro colaboradores por departamento"]} />
            <PlansCard
              name={"Intermediário"}
              description={"Perfeito para médias empresas, com um estoque intermediário"}
              price={850}
              advantages={["Limite de 8 departamentos", "Oito colaboradores por departamento"]} />
            <PlansCard
              name={"Empresarial"}
              description={"Perfeito para grandes empresas, com um estoque grande"}
              price={5000}
              destaque
              advantages={["Departamentos ilimitados", "Quinze colaboradores por departamento"]} />
          </div>
        </section>
      </main>

      <HomeFooter />

      <div className="fixed bottom-5 right-5 z-40">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href="#home"
                aria-label="Voltar ao início"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/70 text-primary backdrop-blur transition-colors hover:bg-primary hover:text-black"
              >
                <FaChevronUp size={18} aria-hidden />
              </a>
            </TooltipTrigger>
            <TooltipContent className="mr-4 border-0 bg-black text-primary">
              <p>Voltar ao início</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </>
  );
}
