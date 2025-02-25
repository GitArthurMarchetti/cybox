'use client'

import Image from "next/image";
import { DepartamentoType } from "@/lib/types/types";
import { FaGear, FaEye, FaUsers, FaBuilding } from "react-icons/fa6";
import { irParaEndereco } from "../services/departamento";
import { useState } from "react";
import { motion } from "framer-motion";

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

export function CardDepartamento({
     departamento,
     id_departamento,
     titulo,
     fotoDepartamento,
     cargo,
     desc,
     NParticipantes,
     maximoParticipante,
     userId
}: CardDepartamentoProps) {
     const [isHovered, setIsHovered] = useState(false);

     // Calcular percentual de ocupação
     const ocupacaoPercentual = Math.round((NParticipantes / maximoParticipante) * 100);

     // Determinar cor da barra de progresso baseada na ocupação
     const getBarColor = () => {
          if (ocupacaoPercentual < 50) return "bg-green-500";
          if (ocupacaoPercentual < 75) return "bg-yellow-500";
          return "bg-red-500";
     };

     // Simular participantes para demonstração
     // Em produção, isso viria do backend
     const participantes = [
          { id: 1, nome: "Ana Silva", cargo: "Admin" },
          { id: 2, nome: "Bruno Costa", cargo: "Editor" },
          { id: 3, nome: "Carla Mendes", cargo: "Membro" },
          { id: 4, nome: "Daniel Oliveira", cargo: "Membro" },
          { id: 5, nome: "Elisa Santos", cargo: "Visitante" }
     ].slice(0, NParticipantes);

     // Gerar cores aleatórias para os avatares (apenas para demonstração)
     const avatarColors = [
          "bg-green-500",
          "bg-yellow-500",
          "bg-blue-500",
          "bg-purple-500",
          "bg-pink-500"
     ];

     return (
          <motion.div
               onClick={() => irParaEndereco(departamento.id_departamentos)}
               className="bg-[#2C2C2C] p-6 rounded-xl relative cursor-pointer group"
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               onHoverStart={() => setIsHovered(true)}
               onHoverEnd={() => setIsHovered(false)}
               transition={{ duration: 0.2 }}
          >
               {/* Efeito de brilho no hover */}
               <div className={`absolute inset-0 bg-gradient-to-r from-[#F6CF45]/0 via-[#F6CF45]/5 to-[#F6CF45]/0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

               {/* Conteúdo do card */}
               <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                         <div className="relative">
                              {fotoDepartamento ? (
                                   <Image
                                        src={fotoDepartamento}
                                        alt="Foto Departamento"
                                        width={56}
                                        height={56}
                                        className="rounded-lg object-cover"
                                   />
                              ) : (
                                   <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-[#3D3D3D] text-[#F6CF45]">
                                        <FaBuilding size={28} />
                                   </div>
                              )}

                              {/* Indicador de status (online/offline) */}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#2C2C2C] rounded-full"></div>
                         </div>

                         <div>
                              <h2 className="text-xl font-bold text-white group-hover:text-[#F6CF45] transition-colors duration-300">
                                   {titulo}
                              </h2>
                              <p className="text-sm text-gray-400 line-clamp-2 mt-1 max-w-xs">
                                   {desc ? desc : "Sem descrição"}
                              </p>
                         </div>
                    </div>

                    <div className="flex items-center space-x-1">
                         <span className="text-xs text-[#B4B4B4] bg-[#3D3D3D] px-2 py-1 rounded-full">
                              {cargo}
                         </span>
                         <motion.button
                              className="p-2 text-[#B4B4B4] hover:text-[#F6CF45] transition-colors duration-300 rounded-full hover:bg-[#3D3D3D]"
                              whileHover={{ rotate: 45 }}
                              transition={{ duration: 0.2 }}
                         >
                              <FaGear size={16} />
                         </motion.button>
                    </div>
               </div>

               {/* Footer com informações de usuários e estatísticas */}
               <div className="mt-8">
                    {/* Barra de progresso de ocupação */}
                    <div className="mb-3">
                         <div className="flex justify-between items-center mb-1 text-xs">
                              <span className="text-[#B4B4B4]">Ocupação</span>
                              <span className="text-white font-medium">{NParticipantes}/{maximoParticipante}</span>
                         </div>
                         <div className="w-full h-2 bg-[#3D3D3D] rounded-full overflow-hidden">
                              <div
                                   className={`h-full ${getBarColor()} transition-all duration-500 ease-out`}
                                   style={{ width: `${ocupacaoPercentual}%` }}
                              ></div>
                         </div>
                    </div>

                    {/* Avatares dos participantes */}
                    <div className="flex justify-between items-center">
                         <div className="flex -space-x-3">
                              {participantes.slice(0, 4).map((participante, index) => (
                                   <div
                                        key={participante.id}
                                        className={`w-8 h-8 ${avatarColors[index % avatarColors.length]} rounded-full border-2 border-[#2C2C2C] flex items-center justify-center text-xs font-bold text-white`}
                                        title={`${participante.nome} (${participante.cargo})`}
                                   >
                                        {participante.nome.charAt(0)}
                                   </div>
                              ))}

                              {NParticipantes > 4 && (
                                   <div className="w-8 h-8 bg-[#3D3D3D] rounded-full border-2 border-[#2C2C2C] flex items-center justify-center text-xs font-bold text-white">
                                        +{NParticipantes - 4}
                                   </div>
                              )}
                         </div>

                         <motion.button
                              className="flex items-center gap-2 text-[#F6CF45] text-sm px-3 py-1.5 rounded-full hover:bg-[#F6CF45]/10 transition-colors duration-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                         >
                              <FaEye size={14} />
                              <span>Visualizar</span>
                         </motion.button>
                    </div>
               </div>
          </motion.div>
     );
}