import Image from "next/image";

interface listDepartamentosProps {
     titulo: string;
     data: string;
}

export function ListDepartamentos({ titulo, data }: listDepartamentosProps) {
     return (
          <>
               <li className="flex justify-start items-center flex-row gap-3">
                    <Image src="/placeholderImage.jpg" alt="Avatar" width={40} height={40} className="rounded-full bg-slate-100 text-xs  text-black" />
                    <div className="flex items-start  flex-col">
                         <p>{titulo}</p>
                         <p className="text-sm text-[#B4B4B4]">{data}</p>
                    </div>
               </li>
          </>
     )
}