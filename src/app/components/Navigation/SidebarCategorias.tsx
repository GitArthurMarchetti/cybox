"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiArrowLeft, FiBell, FiChevronRight, FiLogOut, FiMapPin, FiPlus, FiSettings, FiShare2 } from "react-icons/fi";
import { DepartamentoType, UserType } from "@/lib/types/types";
import { MembroDepartamento } from "@/app/services/membros";
import MembrosModal from "../modals/MembrosModal";
import ConfiguracoesUsuarioModal from "../modals/ConfiguracoesUsuarioModal";
import NotificacoesModal from "../modals/NotificacoesModal";
import Logout from "../Button/buttonLogOut";
import { getCorPorRole } from "@/lib/utils/roleUtils";
import { useDemo } from "../demo/DemoContext";
import { DoLogout } from "@/app/services/login";

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

const AVATAR_COLORS = ["#F6CF45", "#FFAE3F", "#60A5FA", "#34D399", "#F472B6", "#A78BFA", "#EDE8DA"];

export function SidebarCategorias({ departamento, user, host, membros = [], onAddCategoryClick, onConfigClick, onShareClick }: SidebarProps) {
     const { isDemo } = useDemo();
     const [isMembrosModalOpen, setIsMembrosModalOpen] = useState(false);
     const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
     const [isNotificacoesModalOpen, setIsNotificacoesModalOpen] = useState(false);

     const myRole = membros.find(m => m.id === user.id)?.role ?? 'member';
     const isAdmin = myRole === 'owner' || myRole === 'admin';
     const badge = getCorPorRole(myRole);
     const total = membros.length;

     const actionClass = "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/[0.05] hover:text-white";

     return (
          <aside className="flex h-full w-80 max-w-full flex-col overflow-y-auto border-r border-white/[0.06] bg-[#080808] p-5">
               <div className="mb-6 flex items-center justify-between px-1">
                    <Link href="/departamentos" aria-label="Cybox rooms">
                         <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-6 w-auto" />
                    </Link>
               </div>

               <Link href="/departamentos" className="mb-5 inline-flex w-fit items-center gap-2 rounded-full px-2 py-1 text-xs text-white/50 transition-colors hover:text-primary">
                    <FiArrowLeft aria-hidden /> All rooms
               </Link>

               {/* room card */}
               <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                    <div className="flex items-center gap-3">
                         <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-primary/10 font-display text-lg font-semibold text-primary">
                              {departamento.fotoDepartamento && departamento.fotoDepartamento.startsWith('/') && departamento.fotoDepartamento !== '/placeholderImage.jpg' ? (
                                   <Image src={departamento.fotoDepartamento} alt="" width={48} height={48} className="h-full w-full object-cover" />
                              ) : (
                                   departamento.titulo.charAt(0).toUpperCase()
                              )}
                         </div>
                         <div className="min-w-0">
                              <h2 className="truncate font-display text-base font-semibold tracking-tight text-white">{departamento.titulo}</h2>
                              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.background} ${badge.text}`}>
                                   {myRole === 'owner' ? "You're the owner" : myRole === 'admin' ? "You're an admin" : "You're a member"}
                              </span>
                         </div>
                    </div>
                    {departamento.descricao && <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-white/55">{departamento.descricao}</p>}
                    <dl className="mt-4 space-y-1.5 text-xs text-white/45">
                         {departamento.localizacao && (
                              <div className="flex items-center gap-2"><FiMapPin size={12} aria-hidden /><dd className="truncate">{departamento.localizacao}</dd></div>
                         )}
                         {myRole !== 'owner' && host?.nome && <div className="truncate">Owner: <span className="text-white/70">{host.nome}</span></div>}
                    </dl>
               </div>

               {/* members */}
               <button
                    type="button"
                    onClick={() => setIsMembrosModalOpen(true)}
                    className="group mt-3 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 text-left transition-colors hover:border-primary/30"
                    aria-label={`See members (${total})`}
               >
                    <div>
                         <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">Members</p>
                         <div className="mt-2 flex -space-x-2">
                              {membros.slice(0, 5).map((m, i) => (
                                   <span
                                        key={m.id ?? i}
                                        title={m.nome}
                                        className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0b0b0b] text-[11px] font-bold text-black"
                                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                                   >
                                        {m.nome.charAt(0).toUpperCase()}
                                   </span>
                              ))}
                              {total > 5 && <span className="flex h-7 items-center rounded-full border-2 border-[#0b0b0b] bg-white/15 px-1.5 text-[10px] text-white">+{total - 5}</span>}
                         </div>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-white/50 group-hover:text-primary">
                         {total} <FiChevronRight aria-hidden />
                    </span>
               </button>

               {/* actions */}
               <div className="mt-5 space-y-1">
                    <button
                         type="button"
                         onClick={onAddCategoryClick}
                         className="mb-2 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-black shadow-[0_0_30px_-10px_rgba(246,207,69,0.7)] transition-colors hover:bg-primary-hover"
                    >
                         <FiPlus aria-hidden /> New category
                    </button>
                    <button type="button" onClick={onShareClick} className={actionClass}>
                         <FiShare2 className="text-primary" aria-hidden /> Invite people
                    </button>
                    {isAdmin && (
                         <button type="button" onClick={() => onConfigClick?.()} className={actionClass}>
                              <FiSettings className="text-primary" aria-hidden /> Room settings
                         </button>
                    )}
                    <button type="button" onClick={() => setIsNotificacoesModalOpen(true)} className={actionClass}>
                         <FiBell className="text-primary" aria-hidden /> Notifications
                    </button>
               </div>

               <div className="flex-1" />

               {/* account */}
               {isDemo ? (
                    <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/[0.06] p-4">
                         <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" /> Demo mode
                         </span>
                         <p className="mt-3 text-xs leading-relaxed text-white/60">Sample data. Nothing you change is saved.</p>
                         <Link href="/cadastro" className="mt-3 flex h-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-black hover:bg-primary-hover">
                              Create an account
                         </Link>
                         <form action={DoLogout}>
                              <button type="submit" className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-full text-xs text-white/60 hover:bg-white/5 hover:text-white">
                                   <FiLogOut aria-hidden /> Exit demo
                              </button>
                         </form>
                    </div>
               ) : (
                    <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                         <button type="button" onClick={() => setIsConfigModalOpen(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left" title="Account settings">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber font-display text-sm font-semibold text-black">
                                   {user.nome.charAt(0).toUpperCase()}
                              </span>
                              <span className="min-w-0">
                                   <span className="block truncate text-sm font-medium text-white">{user.nome}</span>
                                   <span className="block truncate text-xs text-white/45">{user.email}</span>
                              </span>
                         </button>
                         <Logout />
                    </div>
               )}

               <MembrosModal isOpen={isMembrosModalOpen} onClose={() => setIsMembrosModalOpen(false)} departamento={departamento} membros={membros} />
               <ConfiguracoesUsuarioModal isOpen={isConfigModalOpen} onClose={() => setIsConfigModalOpen(false)} user={user} onSuccess={() => setIsConfigModalOpen(false)} />
               <NotificacoesModal isOpen={isNotificacoesModalOpen} onClose={() => setIsNotificacoesModalOpen(false)} />
          </aside>
     );
}
