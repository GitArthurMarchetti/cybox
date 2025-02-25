'use client'
import Navbar from "@/app/components/Navigation/navbar";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

//icons
import { FaCalculator, FaChevronUp } from "react-icons/fa6";
import { BsFillClockFill } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiBarChartFill } from "react-icons/ri";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoExtensionPuzzle } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function FrontHome() {
  return (
    <>
      <main className="flex flex-col  w-full min-h-screen">

        <div className="feixeLuz"></div>
        <Navbar type="1" />
        <section className="fundoHome ">

          <div className="flex w-10/12 mt-52 m-auto justify-center items-start">
            <div className="w-1/2 flex  flex-col">
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-white w-full">
                Gerencie seu patrimônio da forma mais eficiente do mercado
              </h1>
              <p className="text-white font-light border-solid border-l-2 pl-4 w-4/6 my-5 text-md 2xl:text-xl border-[#F6CF45]">
                Gestão Estratégica de Ativos: Monitorando, Avaliando e Otimizando Seu Patrimônio Empresarial
              </p>

              <button className="py-3 mt-5 text-md 2xl:text-xl 2xl:w-8/12 w-7/12 bg-[#F6CF45] hover:bg-[#ffdf6c] transition-all text-black rounded-full">
                Conheça nosso serviço
              </button>
            </div>
            <div className="w-1/2 m-auto flex justify-end">
              <Image className="w-[400px]" src={"/chartsPng1.png"} alt="Gráfico de patrimônio" width={400} height={300} />
            </div>
          </div>

        </section>

        <section className=" pt-32 fundoSec2 text-white">
          <div>
            <h1 className="text-3xl font-semibold w-9/12 m-auto text-center">Por que nosso sistema é essencial para sua empresa?</h1>
          </div>
          <div className="flex flex-row  flex-wrap w-3/5 m-auto">
            <div className="w-2/6 flex mt-10 flex-col gap-2 m-auto">
              <FaCalculator color="#F6CF45" size={40} />
              <p className="w-3/4">Calcule a depreciação dos ativos com precisão.</p>
            </div>
            <div className="w-2/6 flex mt-10 flex-col gap-2 m-auto">
              <BsFillClockFill color="#F6CF45" size={40} />
              <p className="w-3/4">Acompanhe o valor patrimonial em tempo real.</p>
            </div>
            <div className="w-2/6 flex mt-10 flex-col gap-2 m-auto">
              <MdOutlineAttachMoney color="#F6CF45" size={50} />
              <p className="w-3/4">Reduza custos com gestão eficiente de ativos.</p>
            </div>
            <div className="w-2/6 flex mt-10 flex-col gap-2 m-auto">
              <RiBarChartFill color="#F6CF45" size={40} />
              <p className="w-3/4">Reduza custos com gestão eficiente de ativos.</p>
            </div>
            <div className="w-2/6 flex mt-10 flex-col gap-2 m-auto">
              <FaArrowTrendUp color="#F6CF45" size={40} />
              <p className="w-3/4">Maximize o retorno sobre o investimento em ativos.</p>
            </div>
            <div className="w-2/6 flex mt-10 flex-col gap-2 m-auto">
              <IoExtensionPuzzle color="#F6CF45" size={40} />
              <p className="w-3/4">Simplifique a gestão de bens patrimoniais complexos.</p>
            </div>
          </div>
        </section>

        <section id="Sobre" className="flex w-5/6 mx-auto justify-around pt-32">
          <div className="flex flex-col w-1/2  justify-center gap-10">
            <h2 className="text-3xl font-semibold scroll-mt-40" id="about">Sobre nós</h2>
            <p className="text-md 2xl:text-xl">
              Somos a Cybox, uma iniciativa inovadora criada por estudantes do curso técnico de Desenvolvimento de Sistemas do SENAI de Florianópolis. Somos uma equipe de programadores e designers que se uniu para desenvolver um sistema integrado de gerenciamento de patrimônios. Nossa proposta é facilitar o controle, rastreamento e gestão de ativos, oferecendo uma plataforma que melhora a eficiência e precisão no acompanhamento da vida útil dos bens, cálculos de depreciação e análise de custos associados. Combinamos criatividade e dedicação para transformar a gestão de ativos empresariais e ajudar nossos clientes a otimizar suas operações.
            </p>
          </div>
          <div>
            <Image className="w-[300px]" src={"/sobrenos.png"} alt="Sobre nós" width={300} height={300} />
          </div>
        </section>

        {/* Row Reverse  */}
        <section className="flex w-5/6 mx-auto flex-row-reverse justify-around pt-10">
          <div className="flex flex-col w-1/2  justify-center gap-10">
            <h2 className="text-3xl font-semibold text-right">Missão</h2>
            <p className=" text-right text-md 2xl:text-xl">
              Em um cenário empresarial cada vez mais dinâmico e competitivo, entendemos a importância de uma gestão de patrimônios eficaz. Por isso, nossa missão é desenvolver um sistema integrado de gerenciamento de patrimônios que não apenas controle e rastreie ativos, mas que também ofereça uma visão abrangente sobre depreciação e custos. Queremos garantir que nosso  cliente possam gerenciar seus bens com precisão, otimizar a alocação de recursos e tomar decisões estratégicas bem-informadas.
            </p>
          </div>
          <div>
            <Image className="w-[300px]" src={"/missao.png"} alt="Missão" width={300} height={300} />
          </div>
        </section>

        <section className="flex w-5/6 mx-auto justify-around pt-10 pb-40">
          <div className="flex flex-col w-1/2  justify-center gap-10">
            <h2 className="text-3xl font-semibold">Visão</h2>
            <p className="text-md 2xl:text-xl">
              Almejamos ser líderes em gerenciamento de patrimônios, ajudando nossos clientes a otimizar operações, reduzir custos e tomar decisões mais estratégicas. Nossa meta é capacitar empresas de todos os tamanhos com ferramentas que promovam eficiência e controle estratégico dos recursos, contribuindo para seu crescimento e sucesso sustentável.
            </p>
          </div>
          <div>
            <Image className="w-[300px]" src={"/visao.png"} alt="Visão" width={300} height={300} />
          </div>
        </section>
      </main >
      <footer id="Contato" className="w-full bg-[#2E2E2E] h-60 rounded-t-[120px]">

      </footer>
      <div className="fixed bottom-5 right-5  p-2 text-[#F6CF45]">

        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger>
              <a href="#" >
                <FaChevronUp size={20} />
              </a></TooltipTrigger>
            <TooltipContent className="text-[#F6CF45] bg-black border-0 mr-4">
              <p>Voltar ao inicio</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    </>
  );
}