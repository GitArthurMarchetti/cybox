import Image from "next/image";

interface CardDepartamentoProps {
     nome: string;
     avatar?: string;
     cargo: string;
     desc?: string;
     NParticipantes: number;
}

export function CardDepartamento({ nome, avatar, cargo, desc, NParticipantes }: CardDepartamentoProps) {
     return (
          <>
               <div className="bg-[#2C2C2C] 2xl:p-6 px-4 p-2  rounded-lg relative">
                    <div className="flex justify-between items-center ">
                         <div className="flex items-center 2xl:gap-7 gap-3 mb-8">
                              <Image src={avatar ? avatar : '/avatar'} alt="Avatar" width={48} height={48} className="rounded-full bg-slate-100 2xl:scale-125 text-black" />
                              <div>
                                   <h2 className="text-base font-bold text-white 2xl:text-2xl">{nome}</h2>
                                   <p className="text-xs 2xl:text-base 2xl:w-5/6 text-gray-400">{desc ? desc : ""}</p>
                              </div>
                         </div>
                         <span className="text-gray-500 absolute top-3 right-3 text-xs 2xl:text-base">{cargo}</span>
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