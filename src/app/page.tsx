import Navbar from "@/app/components/Navigation/navbar";
import Image from "next/image";
import chart from "../img/chartsPng 1.png"
import { FaCalculator } from "react-icons/fa6";
import { BsFillClockFill } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiBarChartFill } from "react-icons/ri";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoExtensionPuzzle } from "react-icons/io5";


export default function Home() {

  return (
    <>
      <main className="flex flex-col fundoHome w-full min-h-screen">
        <Navbar type="1" />
        <section>
          <div className="flex w-10/12 mt-20 m-auto justify-center items-start">
            <div className="w-1/2 flex  flex-col">
              <h1 className="text-5xl font-semibold text-white w-full">
                Gerencie seu patrimônio da forma mais eficiente do mercado
              </h1>
              <p className="text-white font-light border-solid border-l-2 pl-4 w-4/6 my-5 text-xl border-[#F6CF45]">
                Gestão Estratégica de Ativos: Monitorando, Avaliando e Otimizando Seu Patrimônio Empresarial
              </p>
              <button className="py-3 mt-5 text-xl w-2/4 bg-[#F6CF45] rounded-full">
                Conheça nosso serviço
              </button>
            </div>
            <div className="w-1/2 m-auto flex justify-end">
              <Image className="h-[550px] w-[721px]" src={chart} alt="" />
            </div>
          </div>

        </section>
      </main>
    </>
  );
}
