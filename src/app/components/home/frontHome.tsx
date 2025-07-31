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


//icons
import { FaCalculator, FaChevronUp } from "react-icons/fa6";
import { BsFillClockFill } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiBarChartFill } from "react-icons/ri";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoExtensionPuzzle } from "react-icons/io5";
import { FaLinkedin, FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import { useRouter } from "next/navigation";
import { PlansCard } from "./PlansCard";
import { HomeFooter } from "./HomeFooter";

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

        <section className="pt-32  text-white">
          <h2 className="text-3xl font-semibold w-9/12 m-auto text-center">Como podemos te ajudar?</h2>
          <div className="flex w-4/5 mx-auto justify-center items-center">
            <div className="w-1/2"><Image src={ajuda} alt="" width={800} /></div>
            <div className="flex flex-col ju w-1/2 gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Análise detalhada</h3>
                <p className="text-sm w-4/5">Avaliamos todos os custos associados ao ciclo de vida dos seus ativos, desde a aquisição até a manutenção e descarte.</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Identificação de Oportunidades</h3>
                <p className="text-sm w-4/5">Através do LCC (Life Cycle Cost), identificamos áreas onde é possível reduzir custos e aumentar a eficiência operacional.</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Tomada de Decisão Informada</h3>
                <p className="text-sm w-4/5">Fornecemos dados claros para que você possa tomar decisões embasadas e estratégicas, otimizando seu retorno sobre investimento.</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-semibold">Sustentabilidade e Conformidade</h3>
                <p className="text-sm w-4/5">Ajudamos a garantir que suas decisões estejam alinhadas com padrões de sustentabilidade e regulamentações.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pt-24 text-white mb-10">
          <h2 className="text-3xl font-semibold w-9/12 m-auto text-center mb-12">Nossos planos</h2>
          <div className="flex w-4/5 mx-auto justify-center items-center gap-16">
            <PlansCard
              name={"Básico"}
              description={"Perfeito para pequenas empresas, que querem inovar com a Cybox"}
              price={350}
              colorButton={"#B4B4B4"}
              advantages={["Limites de 2 departamentos", "Quatro colaboradores por departamento"]} />
            <PlansCard
              name={"Empresarial"}
              description={"Perfeito para grandes empresas, com um estoque grande"}
              price={5000} colorButton={"#F6CF45"}
              advantages={["Departamentos ilimitados", "Quinze colaboradores por departamento"]} />
            <PlansCard
              name={"Intermediário"}
              description={"Perfeito para médias empresas, com um estoque intermediário"}
              price={850}
              colorButton={"#B4B4B4"}
              advantages={["Limite de 8 departamentos", "Oito colaboradores por departamento"]} />
          </div>
        </section>



      </main >

      <HomeFooter />

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