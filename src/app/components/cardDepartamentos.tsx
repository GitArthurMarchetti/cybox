'use client'

import Image from "next/image";
import Link from "next/link";
import { DepartamentoType } from "@/lib/types/types";
import { FaGear, FaUsers, FaShare, FaLocationDot } from "react-icons/fa6";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { traduzirRole } from "@/lib/utils/roleUtils";

const FOTO_PADRAO = "/placeholderImage.jpg";

interface CardDepartamentoProps {
     departamento: DepartamentoType;
     titulo: string;
     fotoDepartamento?: string;
     cargo: string;
     desc?: string | null;
     NParticipantes: number;
     onShare?: (departamento: DepartamentoType) => void;
     onViewMembers?: (departamento: DepartamentoType) => void;
     onSettings?: (departamento: DepartamentoType) => void;
}

export function CardDepartamento({
     departamento,
     titulo,
     fotoDepartamento,
     cargo,
     desc,
     NParticipantes,
     onShare,
     onViewMembers,
     onSettings
}: CardDepartamentoProps) {
     const [isMenuOpen, setIsMenuOpen] = useState(false);
     const menuRef = useRef<HTMLDivElement>(null);
     const podeGerenciar = cargo === 'owner' || cargo === 'admin';
     const temFotoPropria = !!fotoDepartamento && fotoDepartamento.startsWith('/') && fotoDepartamento !== FOTO_PADRAO;

     useEffect(() => {
          if (!isMenuOpen) return;

          const handleClickOutside = (event: MouseEvent) => {
               if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                    setIsMenuOpen(false);
               }
          };
          const handleEsc = (event: KeyboardEvent) => event.key === 'Escape' && setIsMenuOpen(false);

          document.addEventListener('mousedown', handleClickOutside);
          document.addEventListener('keydown', handleEsc);
          return () => {
               document.removeEventListener('mousedown', handleClickOutside);
               document.removeEventListener('keydown', handleEsc);
          };
     }, [isMenuOpen]);

     return (
          <article className="group relative flex h-full flex-col rounded-xl border border-transparent bg-surface-2 p-5 transition-colors duration-200 hover:border-primary/30 focus-within:border-primary/40 sm:p-6">
               <div className="mb-5 flex items-start gap-4">
                    {temFotoPropria ? (
                         <Image
                              src={fotoDepartamento}
                              alt=""
                              width={56}
                              height={56}
                              className="h-14 w-14 shrink-0 rounded-lg object-cover"
                         />
                    ) : (
                         <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-3 text-2xl font-bold text-primary" aria-hidden>
                              {titulo.charAt(0).toUpperCase()}
                         </div>
                    )}

                    <div className="min-w-0 flex-1">
                         <h2 className="text-lg font-bold leading-snug text-white transition-colors duration-200 group-hover:text-primary sm:text-xl">
                              <Link
                                   href={`/departamentos/${departamento.id_departamentos}`}
                                   className="rounded after:absolute after:inset-0 after:rounded-xl focus-visible:outline-none"
                              >
                                   {titulo}
                              </Link>
                         </h2>
                         <span className="mt-1 inline-block rounded-full bg-surface-3 px-2 py-0.5 text-xs text-muted">
                              {traduzirRole(cargo)}
                         </span>
                    </div>

                    {podeGerenciar && (
                         <div className="relative z-10 -mr-2 -mt-2" ref={menuRef}>
                              <button
                                   type="button"
                                   className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-surface-3 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                   onClick={() => setIsMenuOpen(aberto => !aberto)}
                                   aria-label={`Opções de ${titulo}`}
                                   aria-haspopup="menu"
                                   aria-expanded={isMenuOpen}
                              >
                                   <BsThreeDotsVertical size={18} />
                              </button>

                              {isMenuOpen && (
                                   <motion.div
                                        role="menu"
                                        initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ duration: 0.12 }}
                                        className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-surface-3 bg-surface-2 py-1 shadow-xl"
                                   >
                                        {onShare && (
                                             <button
                                                  type="button"
                                                  role="menuitem"
                                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface-3 hover:text-white"
                                                  onClick={() => { setIsMenuOpen(false); onShare(departamento); }}
                                             >
                                                  <FaShare size={14} aria-hidden /> Compartilhar
                                             </button>
                                        )}
                                        {onSettings && (
                                             <button
                                                  type="button"
                                                  role="menuitem"
                                                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface-3 hover:text-white"
                                                  onClick={() => { setIsMenuOpen(false); onSettings(departamento); }}
                                             >
                                                  <FaGear size={14} aria-hidden /> Configurações
                                             </button>
                                        )}
                                   </motion.div>
                              )}
                         </div>
                    )}
               </div>

               <p className="mb-5 line-clamp-2 text-sm text-muted">
                    {desc || "Sem descrição"}
               </p>

               <div className="mt-auto flex items-center justify-between gap-3 border-t border-surface-3 pt-4">
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-subtle">
                         {departamento.localizacao && (
                              <>
                                   <FaLocationDot size={12} className="shrink-0" aria-hidden />
                                   <span className="truncate">{departamento.localizacao}</span>
                              </>
                         )}
                    </div>

                    <button
                         type="button"
                         className="relative z-10 flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-sm text-primary transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                         onClick={() => onViewMembers?.(departamento)}
                    >
                         <FaUsers size={14} aria-hidden />
                         {NParticipantes} {NParticipantes === 1 ? 'membro' : 'membros'}
                    </button>
               </div>
          </article>
     );
}
