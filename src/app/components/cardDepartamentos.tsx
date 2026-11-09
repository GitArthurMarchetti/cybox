'use client'

import Image from "next/image";
import Link from "next/link";
import { DepartamentoType } from "@/lib/types/types";
import { FiArrowUpRight, FiBox, FiMapPin, FiMoreVertical, FiSettings, FiShare2, FiUsers } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { getCorPorRole, traduzirRole } from "@/lib/utils/roleUtils";
import { trackPointer } from "./home/landing/shared";

const FOTO_PADRAO = "/placeholderImage.jpg";

// A warm tint per room, picked from its name so it stays stable.
const COVERS = ["from-primary/35", "from-amber/35", "from-blue-500/25", "from-emerald-500/25", "from-rose-500/25", "from-violet-500/25"];
const coverFor = (name: string) => COVERS[name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % COVERS.length];

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
     const canManage = cargo === 'owner' || cargo === 'admin';
     const hasPhoto = !!fotoDepartamento && fotoDepartamento.startsWith('/') && fotoDepartamento !== FOTO_PADRAO;
     const badge = getCorPorRole(cargo);

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
          <article
               onPointerMove={trackPointer}
               className="spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-surface transition-colors duration-300 hover:border-primary/30 focus-within:border-primary/40"
          >
               {/* cover */}
               <div className={`relative h-24 bg-gradient-to-br ${coverFor(titulo)} to-[#121212]`}>
                    {hasPhoto ? (
                         <Image src={fotoDepartamento} alt="" fill className="object-cover opacity-70" sizes="400px" />
                    ) : (
                         <div aria-hidden className="bg-dots absolute inset-0 opacity-60" />
                    )}
                    <div className="absolute bottom-0 left-5 flex h-12 w-12 translate-y-1/2 items-center justify-center rounded-2xl border border-white/10 bg-[#141414] font-display text-lg font-semibold text-primary shadow-lg">
                         {titulo.charAt(0).toUpperCase() || <FiBox />}
                    </div>
                    <span className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badge.background} ${badge.text}`}>
                         {traduzirRole(cargo)}
                    </span>
               </div>

               <div className="flex flex-1 flex-col px-5 pb-5 pt-9">
                    <div className="flex items-start justify-between gap-3">
                         <div className="min-w-0">
                              <h2 className="truncate font-display text-lg font-semibold tracking-tight text-white transition-colors duration-200 group-hover:text-primary">
                                   <Link
                                        href={`/departamentos/${departamento.id_departamentos}`}
                                        className="rounded after:absolute after:inset-0 after:rounded-3xl focus-visible:outline-none"
                                   >
                                        {titulo}
                                   </Link>
                              </h2>
                              {departamento.localizacao && (
                                   <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-white/45">
                                        <FiMapPin size={11} className="shrink-0" aria-hidden />
                                        {departamento.localizacao}
                                   </p>
                              )}
                         </div>

                         {canManage && (
                              <div className="relative z-10 -mr-2" ref={menuRef}>
                                   <button
                                        type="button"
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                        onClick={() => setIsMenuOpen(open => !open)}
                                        aria-label={`Options for ${titulo}`}
                                        aria-haspopup="menu"
                                        aria-expanded={isMenuOpen}
                                   >
                                        <FiMoreVertical size={17} />
                                   </button>

                                   {isMenuOpen && (
                                        <motion.div
                                             role="menu"
                                             initial={{ opacity: 0, scale: 0.95, y: -6 }}
                                             animate={{ opacity: 1, scale: 1, y: 0 }}
                                             transition={{ duration: 0.12 }}
                                             className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#151515] p-1.5 shadow-2xl"
                                        >
                                             {onShare && (
                                                  <button
                                                       type="button"
                                                       role="menuitem"
                                                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
                                                       onClick={() => { setIsMenuOpen(false); onShare(departamento); }}
                                                  >
                                                       <FiShare2 size={14} aria-hidden /> Invite people
                                                  </button>
                                             )}
                                             {onSettings && (
                                                  <button
                                                       type="button"
                                                       role="menuitem"
                                                       className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/75 transition-colors hover:bg-white/[0.06] hover:text-white"
                                                       onClick={() => { setIsMenuOpen(false); onSettings(departamento); }}
                                                  >
                                                       <FiSettings size={14} aria-hidden /> Room settings
                                                  </button>
                                             )}
                                        </motion.div>
                                   )}
                              </div>
                         )}
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/55">
                         {desc || "No description yet."}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                         <button
                              type="button"
                              className="relative z-10 flex h-9 items-center gap-2 rounded-full border border-white/10 px-3 text-xs text-white/70 transition-colors hover:border-primary/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              onClick={() => onViewMembers?.(departamento)}
                         >
                              <FiUsers size={13} className="text-primary" aria-hidden />
                              {NParticipantes} {NParticipantes === 1 ? 'member' : 'members'}
                         </button>
                         <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-white/35 transition-colors group-hover:text-primary">
                              Open <FiArrowUpRight aria-hidden />
                         </span>
                    </div>
               </div>
          </article>
     );
}
