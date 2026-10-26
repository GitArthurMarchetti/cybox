"use client"

import Image from "next/image";
import { FaGear, FaPlus, FaShare, FaArrowLeft } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { DepartamentoType, UserType } from "@/lib/types/types";
import { MembroDepartamento } from "@/app/services/membros";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { MembrosModal, ConfiguracoesUsuarioModal, NotificacoesModal } from "../modals";
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
     const [isMembrosModalOpen, setIsMembrosModalOpen] = useState(false);
     const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
     const [isNotificacoesModalOpen, setIsNotificacoesModalOpen] = useState(false);

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

     const roleUsuario = membros.find(membro => membro.id === user.id)?.role;
     const isAdmin = roleUsuario === 'owner' || roleUsuario === 'admin';

     const totalMembros = membros.length;

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
               className="w-80 max-w-full bg-gradient-to-b from-[#111] to-[#1a1a1a] p-6 flex flex-col border-r border-line h-full overflow-y-auto shadow-xl"
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
                    <Link href="/departamentos" className="flex items-center gap-2 text-muted hover:text-primary transition-colors duration-300">
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
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-surface-2 to-[#252525] flex items-center justify-center text-primary overflow-hidden border border-[#333] group-hover:border-primary transition-all duration-300">
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
                              <h2 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">{departamento.titulo}</h2>
                              <div className="flex items-center gap-2 mt-1">
                                   <p className="text-xs text-muted/60">
                                        {roleUsuario === 'owner' ? "Você é o proprietário" : `Proprietário: ${host?.nome || 'Não definido'}`}
                                   </p>
                              </div>
                         </div>
                    </div>

                    <div className="mt-4 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
                         <p className="text-sm text-muted leading-relaxed pr-2">
                              {departamento.descricao || "Sem descrição disponível para este departamento."}
                         </p>
                    </div>
               </motion.div>

               <motion.button
                    type="button"
                    className="mb-8 w-full bg-[#1c1c1c] p-4 text-left rounded-xl border border-line hover:bg-[#252525] hover:border-primary/30 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    variants={itemVariants}
                    onClick={() => setIsMembrosModalOpen(true)}
                    aria-label={`Ver membros (${totalMembros})`}
               >
                    <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2">
                              <FaUsers className="text-primary" aria-hidden />
                              <h3 className="text-sm font-medium text-white">Membros</h3>
                         </div>
                         <span className="text-xs font-medium text-muted">
                              {totalMembros} {totalMembros === 1 ? 'membro' : 'membros'}
                         </span>
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
                                   <div className="text-xs text-subtle">Nenhum membro</div>
                              )}
                         </div>
                         <div className="text-xs text-muted italic">
                              {departamento.localizacao || "Sem localização"}
                         </div>
                    </div>
               </motion.button>

               <div className="space-y-3 mt-4">
                    <motion.button
                         className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-black font-medium py-3 px-4 rounded-xl transition-colors duration-300 shadow-lg shadow-primary/10"
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
                              <FaGear size={16} className="text-primary" /> Configurações
                         </motion.button>
                    )}

                    <motion.button
                         className="w-full flex items-center justify-center gap-2 border border-[#333] bg-[#1c1c1c] hover:bg-[#252525] text-white font-medium py-3 px-4 rounded-xl transition-colors duration-300"
                         whileHover={{ scale: 1.02, borderColor: "#F6CF45" }}
                         whileTap={{ scale: 0.98 }}
                         variants={itemVariants}
                         onClick={onShareClick}
                    >
                         <FaShare size={16} className="text-primary" /> Compartilhar
                    </motion.button>
               </div>

               {/* Spacer para empurrar seção do usuário para o rodapé */}
               <div className="flex-grow"></div>



               {/* Seção do Usuário */}
               <motion.div
                    className="bg-[#1c1c1c] rounded-xl border border-line overflow-hidden"
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
                                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-black font-bold text-lg">
                                        {user.nome.charAt(0).toUpperCase()}
                                   </div>
                                   <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#1c1c1c] rounded-full"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                   <p className="text-sm font-medium text-white truncate">{user.nome}</p>
                                   <p className="text-xs text-subtle truncate">{user.email}</p>
                              </div>
                         </div>
                    </motion.div>

                    {/* Divider */}
                    <div className="border-t border-line"></div>

                    {/* Actions */}
                    <div className="p-2 flex items-center justify-end  gap-2">
                         {/* Notificações */}
                         <button
                              type="button"
                              className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-[#252525] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              onClick={() => setIsNotificacoesModalOpen(true)}
                              aria-label="Notificações"
                              title="Notificações"
                         >
                              <IoMdNotifications size={20} className="text-primary" aria-hidden />
                         </button>

                         {/* Logout */}
                         <div className="">
                              <Logout variant="sidebar" />
                         </div>
                    </div>
               </motion.div>

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