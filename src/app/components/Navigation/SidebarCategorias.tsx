"use client"

import Image from "next/image";
import { FaGear, FaPlus, FaShare, FaArrowLeft } from "react-icons/fa6";
import { FaUsers, FaChartLine } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import { DepartamentoType, UserType } from "@/lib/types/types";
import { MembroDepartamento } from "@/app/services/membros";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { CompartilharModal, MembrosModal, ConfiguracoesUsuarioModal, NotificacoesModal } from "../modals";
import Logout from "../Button/buttonLogOut";

interface SidebarProps {
     departamento: DepartamentoType;
     user: UserType;
     host: UserType | null;
     membros: MembroDepartamento[];
     onAddCategoryClick: () => void;
     onConfigClick?: () => void;
     onShareClick?: () => void;
     hasInitiallyLoaded?: boolean;
}

export function SidebarCategorias({ departamento, user, host, membros = [], onAddCategoryClick, onConfigClick, onShareClick, hasInitiallyLoaded = false }: SidebarProps) {
     const [isShareModalOpen, setIsShareModalOpen] = useState(false);
     const [isMembrosModalOpen, setIsMembrosModalOpen] = useState(false);
     const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
     const [isNotificacoesModalOpen, setIsNotificacoesModalOpen] = useState(false);
     const [notificacoesCount] = useState(3);

     const sidebarVariants = hasInitiallyLoaded ? {
          hidden: { x: 0, opacity: 1 },
          visible: { x: 0, opacity: 1 }
     } : {
          hidden: { x: -20, opacity: 0 },
          visible: {
               x: 0,
               opacity: 1,
               transition: {
                    duration: 0.4,
                    when: "beforeChildren",
                    staggerChildren: 0.1
               }
          }
     };

     const itemVariants = hasInitiallyLoaded ? {
          hidden: { y: 0, opacity: 1 },
          visible: { y: 0, opacity: 1 }
     } : {
          hidden: { y: 10, opacity: 0 },
          visible: {
               y: 0,
               opacity: 1,
               transition: { duration: 0.3 }
          }
     };

     const isAdmin = host?.email === user.email;

     const totalMembros = membros.length;
     const maxMembros = 50;
     const ocupacaoPercentual = maxMembros > 0 ? Math.round((totalMembros / maxMembros) * 100) : 0;

     const avatarColors = [
          'bg-green-500',
          'bg-blue-500',
          'bg-purple-500',
          'bg-pink-500',
          'bg-yellow-500',
          'bg-red-500',
          'bg-indigo-500',
          'bg-orange-500'
     ];

     return (
          <motion.aside
               className="w-80 bg-gradient-to-b from-[#111] to-[#1a1a1a] p-6 flex flex-col border-r border-[#2c2c2c] h-full shadow-xl"
               initial={hasInitiallyLoaded ? "visible" : "hidden"}
               animate="visible"
               variants={sidebarVariants}
          >
               {/* Logo */}
               <motion.div
                    className="mb-6"
                    variants={itemVariants}
               >
                    <Image
                         src="/logo-completa-branca.png"
                         alt="Logo"
                         width={140}
                         height={46}
                         className="mb-4"
                    />
               </motion.div>

               <motion.div
                    className="mb-6"
                    variants={itemVariants}
               >
                    <Link href="/departamentos" className="flex items-center gap-2 text-[#b4b4b4] hover:text-[#F6CF45] transition-colors duration-300">
                         <FaArrowLeft size={14} />
                         <span className="text-sm">Voltar aos departamentos</span>
                    </Link>
               </motion.div>

               <motion.div
                    className="mb-8"
                    variants={itemVariants}
               >
                    <div className="flex items-center gap-4 mb-4">
                         <div className="relative group">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2c2c2c] to-[#252525] flex items-center justify-center text-[#F6CF45] overflow-hidden border border-[#333] group-hover:border-[#F6CF45] transition-all duration-300">
                                   {departamento.fotoDepartamento && departamento.fotoDepartamento.startsWith('/') ? (
                                        <Image
                                             src={departamento.fotoDepartamento}
                                             alt={departamento.titulo}
                                             width={64}
                                             height={64}
                                             className="rounded-xl object-cover"
                                             onError={(e) => {
                                                  const target = e.target as HTMLElement;
                                                  target.style.display = 'none';
                                             }}
                                        />
                                   ) : (
                                        <span className="text-2xl font-bold">{departamento.titulo.charAt(0)}</span>
                                   )}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#111] rounded-full"></div>
                         </div>
                         <div>
                              <h2 className="text-xl font-bold text-white group-hover:text-[#F6CF45] transition-colors duration-300">{departamento.titulo}</h2>
                              <div className="flex items-center gap-2 mt-1">
                                   <p className="text-xs text-[#b4b4b4]/60">
                                        {isAdmin ? "Você é o proprietário" : `Proprietário: ${host?.nome || 'Não definido'}`}
                                   </p>
                              </div>
                         </div>
                    </div>

                    <div className="mt-4 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-[#F6CF45] scrollbar-track-transparent">
                         <p className="text-sm text-[#b4b4b4] leading-relaxed pr-2">
                              {departamento.descricao || "Sem descrição disponível para este departamento."}
                         </p>
                    </div>
               </motion.div>

               <motion.div
                    className="mb-8 bg-[#1c1c1c] p-4 rounded-xl border border-[#2c2c2c] cursor-pointer hover:bg-[#252525] hover:border-[#F6CF45]/30 transition-all duration-300"
                    variants={itemVariants}
                    onClick={() => setIsMembrosModalOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
               >
                    <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                              <FaUsers className="text-[#F6CF45]" />
                              <h3 className="text-sm font-medium text-white">Membros</h3>
                         </div>
                         <span className="text-sm font-bold text-white bg-[#2c2c2c] px-2 py-1 rounded-full">{totalMembros}/{maxMembros}</span>
                    </div>

                    <div className="w-full h-2 bg-[#2c2c2c] rounded-full overflow-hidden mb-2">
                         <motion.div
                              className={`h-full ${ocupacaoPercentual < 50 ? 'bg-green-500' : ocupacaoPercentual < 75 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              initial={{ width: '0%' }}
                              animate={{ width: `${ocupacaoPercentual}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                         />
                    </div>

                    <div className="flex justify-between items-center">
                         <div className="flex -space-x-2">
                              {membros.slice(0, 4).map((membro, index) => (
                                   <div
                                        key={membro.id}
                                        className={`w-7 h-7 rounded-full border-2 border-[#1c1c1c] ${avatarColors[index % avatarColors.length]} flex items-center justify-center text-xs font-bold text-white`}
                                        title={membro.nome}
                                   >
                                        {membro.nome.charAt(0).toUpperCase()}
                                   </div>
                              ))}
                              {totalMembros > 4 && (
                                   <div className="w-7 h-7 rounded-full border-2 border-[#1c1c1c] bg-gray-600 flex items-center justify-center text-xs font-bold text-white">
                                        +{totalMembros - 4}
                                   </div>
                              )}
                              {totalMembros === 0 && (
                                   <div className="text-xs text-[#8c8888]">Nenhum membro</div>
                              )}
                         </div>
                         <div className="text-xs text-[#b4b4b4] italic">
                              {departamento.localizacao || "Sem localização"}
                         </div>
                    </div>
               </motion.div>

               <div className="space-y-3 mt-4">
                    <motion.button
                         className="w-full flex items-center justify-center gap-2 bg-[#F6CF45] hover:bg-[#f7d665] text-black font-medium py-3 px-4 rounded-xl transition-colors duration-300 shadow-lg shadow-[#F6CF45]/10"
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.98 }}
                         onClick={onAddCategoryClick}
                         variants={itemVariants}
                    >
                         <FaPlus size={16} /> Criar categoria
                    </motion.button>


                    {isAdmin && (
                         <motion.button
                              className="w-full flex items-center justify-center gap-2 border border-[#333] bg-[#1c1c1c] hover:bg-[#252525] text-white font-medium py-3 px-4 rounded-xl transition-colors duration-300"
                              whileHover={{ scale: 1.02, borderColor: "#F6CF45" }}
                              whileTap={{ scale: 0.98 }}
                              variants={itemVariants}
                              onClick={() => {
                                   if (onConfigClick) onConfigClick();
                              }}
                         >
                              <FaGear size={16} className="text-[#F6CF45]" /> Configurações
                         </motion.button>
                    )}

                    <motion.button
                         className="w-full flex items-center justify-center gap-2 border border-[#333] bg-[#1c1c1c] hover:bg-[#252525] text-white font-medium py-3 px-4 rounded-xl transition-colors duration-300"
                         whileHover={{ scale: 1.02, borderColor: "#F6CF45" }}
                         whileTap={{ scale: 0.98 }}
                         variants={itemVariants}
                         onClick={() => {
                              if (onShareClick) {
                                   onShareClick();
                              } else {
                                   setIsShareModalOpen(true);
                              }
                         }}
                    >
                         <FaShare size={16} className="text-[#F6CF45]" /> Compartilhar
                    </motion.button>
               </div>

               {/* Spacer para empurrar seção do usuário para o rodapé */}
               <div className="flex-grow"></div>



               {/* Seção do Usuário */}
               <motion.div
                    className="bg-[#1c1c1c] rounded-xl border border-[#2c2c2c] overflow-hidden"
                    variants={itemVariants}
               >
                    {/* User Info - Clicável */}
                    <motion.div
                         className="p-4 cursor-pointer hover:bg-[#252525] transition-all duration-300"
                         onClick={() => setIsConfigModalOpen(true)}
                         whileHover={{ scale: 1.01 }}
                         whileTap={{ scale: 0.99 }}
                    >
                         <div className="flex items-center gap-3">
                              <div className="relative">
                                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F6CF45] to-[#f7d665] flex items-center justify-center text-black font-bold text-lg">
                                        {user.nome.charAt(0).toUpperCase()}
                                   </div>
                                   <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#1c1c1c] rounded-full"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                   <p className="text-sm font-medium text-white truncate">{user.nome}</p>
                                   <p className="text-xs text-[#8c8888] truncate">{user.email}</p>
                              </div>
                         </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="border-t border-[#2c2c2c]"></div>

                    {/* Actions */}
                    <div className="p-2 flex items-center justify-end  gap-2">
                         {/* Notificações */}
                         <motion.button
                              className="  relative flex items-center justify-center gap-2 px-6 py-2 rounded-lg hover:bg-[#252525] transition-colors duration-300 text-[#b4b4b4] hover:text-white"
                              onClick={() => setIsNotificacoesModalOpen(true)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                         >
                              <IoMdNotifications size={20} className="text-[#F6CF45]" />
                              {notificacoesCount > 0 && (
                                   <span className="absolute top-1 right-2 flex h-5 w-5 items-center justify-center">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F6CF45] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-5 w-5 bg-[#F6CF45] text-black text-xs font-bold items-center justify-center">
                                             {notificacoesCount > 9 ? '9+' : notificacoesCount}
                                        </span>
                                   </span>
                              )}
                         </motion.button>

                         {/* Logout */}
                         <div className="">
                              <Logout variant="sidebar" />
                         </div>
                    </div>
               </motion.div>

               <CompartilharModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    departamento={departamento}
               />

               <MembrosModal
                    isOpen={isMembrosModalOpen}
                    onClose={() => setIsMembrosModalOpen(false)}
                    departamento={departamento}
                    membros={membros}
               />

               <ConfiguracoesUsuarioModal
                    isOpen={isConfigModalOpen}
                    onClose={() => setIsConfigModalOpen(false)}
                    user={user}
                    onSuccess={() => setIsConfigModalOpen(false)}
               />

               <NotificacoesModal
                    isOpen={isNotificacoesModalOpen}
                    onClose={() => setIsNotificacoesModalOpen(false)}
               />
          </motion.aside>
     );
}