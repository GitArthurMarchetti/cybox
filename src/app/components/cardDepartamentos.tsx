'use client'

import Image from "next/image";
import { DepartamentoType } from "@/lib/types/types";

import { FaGear } from "react-icons/fa6";



interface CardDepartamentoProps {
     departamento: DepartamentoType;
     id_departamento: string | number | null;
     titulo: string;
     fotoDepartamento?: string;
     cargo: string;
     desc?: string | null;
     maximoParticipante: number;
     NParticipantes: number;
     userId: string
}




export function CardDepartamento({ departamento, id_departamento, titulo, fotoDepartamento, cargo, desc, NParticipantes, maximoParticipante, userId }: CardDepartamentoProps) {
     return (
          <>
               <div className="bg-[#2C2C2C] 2xl:p-6 px-4 p-2  rounded-lg relative cursor-pointer hover:shadow-md hover:shadow-black">
                    <div className="flex justify-between items-center ">
                         <div className="flex items-center 2xl:gap-7 gap-3 mb-8">
                              <Image src={fotoDepartamento ? fotoDepartamento : '/placeholderImage.jpg'} alt="Foto Departamento" width={48} height={48} className="rounded-full bg-slate-100 2xl:scale-125 text-black" />
                              <div>
                                   <h2 className="text-base font-bold text-white 2xl:text-2xl">{titulo}</h2>
                                   <p className="text-xs 2xl:text-base 2xl:w-5/6 text-gray-400">{desc ? desc : ""}</p>
                              </div>
                         </div>
                         <div className="flex flex-row absolute top-3 right-3 text-gray-500 ">
                              <span className="mr-2 text-xs 2xl:text-base">{cargo}</span>
                              <span className="cursor-pointer hover:text-gray-100 transition-all"><FaGear /> </span>
                         </div>
                    </div>
                    <div className="flex justify-end relative items-center text-right w-full pb-2">
                         <span className="w-6 h-6 bg-green-500 rounded-full border border-[#ffffff90] absolute left-0"></span>
                         <span className="w-6 h-6 bg-yellow-500 rounded-full border border-[#ffffff90] absolute left-3"></span>
                         <span className="w-6 h-6 bg-blue-500 rounded-full border border-[#ffffff90] absolute left-6"></span>
                         <span className="text-gray-400 text-xs 2xl:text-sm ">{NParticipantes} participantes</span>
                    </div>
               </div>
          </>
     )
}