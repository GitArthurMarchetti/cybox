"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FiBell, FiGrid, FiLogOut, FiSettings } from "react-icons/fi";
import Logout from "../Button/buttonLogOut";
import { UserType } from "@/lib/types/types";
import ConfiguracoesUsuarioModal from "../modals/ConfiguracoesUsuarioModal";
import NotificacoesModal from "../modals/NotificacoesModal";
import { useDemo } from "../demo/DemoContext";
import { DoLogout } from "@/app/services/login";

type Props = {
     userName: string | null | undefined;
     userEmail: string | null | undefined;
     user?: UserType;
};

const MENU = [
     { id: "rooms", icon: FiGrid, label: "Rooms", path: "/departamentos" },
     { id: "notifications", icon: FiBell, label: "Notifications", path: null },
     { id: "settings", icon: FiSettings, label: "Settings", path: null },
] as const;

export function SideBar({ userName, userEmail, user }: Props) {
     const router = useRouter();
     const pathname = usePathname();
     const { isDemo } = useDemo();
     const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
     const [isNotificacoesModalOpen, setIsNotificacoesModalOpen] = useState(false);

     const handleMenuClick = (id: (typeof MENU)[number]["id"]) => {
          if (id === "settings") setIsConfigModalOpen(true);
          else if (id === "notifications") setIsNotificacoesModalOpen(true);
          else router.push("/departamentos");
     };

     const isActive = (path: string | null) => !!path && (pathname === path || pathname?.startsWith(path + "/"));

     return (
          <motion.aside
               className="relative flex h-full w-72 flex-col justify-between overflow-y-auto border-r border-white/[0.06] bg-[#080808] p-5 text-white lg:w-64"
               initial={{ x: -16, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 0.35 }}
          >
               <div>
                    <Link href="/departamentos" aria-label="Cybox rooms" className="mb-10 mt-1 block px-2">
                         <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-6 w-auto" priority />
                    </Link>

                    <p className="mb-3 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">Workspace</p>
                    <nav>
                         <ul className="space-y-1">
                              {MENU.map((item) => {
                                   const active = isActive(item.path);
                                   return (
                                        <li key={item.id}>
                                             <button
                                                  type="button"
                                                  onClick={() => handleMenuClick(item.id)}
                                                  aria-current={active ? "page" : undefined}
                                                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active ? "bg-white/[0.06] text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white"}`}
                                             >
                                                  {active && <motion.span layoutId="sidebar-active" className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-primary" />}
                                                  <item.icon className={`text-[17px] ${active ? "text-primary" : "text-white/50 group-hover:text-white"}`} aria-hidden />
                                                  {item.label}
                                             </button>
                                        </li>
                                   );
                              })}
                         </ul>
                    </nav>
               </div>

               <div className="mt-8">
                    {isDemo ? (
                         <div className="rounded-2xl border border-primary/30 bg-primary/[0.06] p-4">
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black">
                                   <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-black" /> Demo mode
                              </span>
                              <p className="mt-3 text-xs leading-relaxed text-white/60">
                                   You&apos;re exploring sample data. Nothing you change is saved.
                              </p>
                              <Link
                                   href="/cadastro"
                                   className="mt-3 flex h-9 items-center justify-center rounded-full bg-primary text-xs font-semibold text-black transition-colors hover:bg-primary-hover"
                              >
                                   Create an account
                              </Link>
                              <form action={DoLogout}>
                                   <button type="submit" className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-full text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white">
                                        <FiLogOut aria-hidden /> Exit demo
                                   </button>
                              </form>
                         </div>
                    ) : (
                         <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
                              <div className="relative">
                                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-amber font-display text-sm font-semibold text-black">
                                        {userName?.charAt(0)?.toUpperCase() || "U"}
                                   </div>
                                   <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#080808] bg-green-500" />
                              </div>
                              <div className="min-w-0 flex-1" title={`${userName || "User"}\n${userEmail || ""}`}>
                                   <p className="truncate text-sm font-medium text-white">{userName || "User"}</p>
                                   <p className="truncate text-xs text-white/45">{userEmail}</p>
                              </div>
                              <Logout />
                         </div>
                    )}
                    <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-white/25">Cybox · v0.1</p>
               </div>

               {user && (
                    <>
                         <ConfiguracoesUsuarioModal
                              isOpen={isConfigModalOpen}
                              onClose={() => setIsConfigModalOpen(false)}
                              user={user}
                              onSuccess={() => setIsConfigModalOpen(false)}
                         />
                         <NotificacoesModal isOpen={isNotificacoesModalOpen} onClose={() => setIsNotificacoesModalOpen(false)} />
                    </>
               )}
          </motion.aside>
     );
}
