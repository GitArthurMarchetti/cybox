"use client"

import Image from "next/image";
import { format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

interface ListDepartamentosProps {
     titulo: string;
     data: string;
     onClick?: () => void;
}

export function ListDepartamentos({ titulo, data, onClick }: ListDepartamentosProps) {
     // Formatar a data de maneira amigável
     const formatarData = (dataString: string) => {
          try {
               const data = parseISO(dataString);
               if (!isValid(data)) return "Data inválida";

               // Se for o ano atual, mostra só o dia e mês
               const dataAtual = new Date();
               const formatoData = data.getFullYear() === dataAtual.getFullYear()
                    ? 'd MMM'
                    : 'd MMM yyyy';

               return format(data, formatoData, { locale: ptBR });
          } catch (error) {
               return "Data inválida";
          }
     };

     const dataFormatada = formatarData(data);

     return (
          <motion.li
               className="group p-2 rounded-lg hover:bg-[#2C2C2C] transition-colors duration-300 cursor-pointer"
               onClick={onClick}
               whileHover={{ x: 5 }}
               whileTap={{ scale: 0.98 }}
          >
               <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                         <div className="w-10 h-10 bg-[#3D3D3D] group-hover:bg-[#4D4D4D] text-[#F6CF45] rounded-lg flex items-center justify-center transition-colors duration-300">
                              <FaBuilding size={20} />
                         </div>
                         <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-[#1F1F1F] group-hover:border-[#2C2C2C] rounded-full transition-colors duration-300"></div>
                    </div>

                    <div className="flex-grow min-w-0">
                         <p className="font-medium text-white truncate group-hover:text-[#F6CF45] transition-colors duration-300">
                              {titulo}
                         </p>
                         <div className="flex items-center text-xs text-[#B4B4B4] mt-1">
                              <FaCalendarAlt className="mr-1" size={10} />
                              <span>Criado em {dataFormatada}</span>
                         </div>
                    </div>
               </div>
          </motion.li>
     );
}