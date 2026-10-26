"use client"

import Image from "next/image";
import { FaGear } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import Logout from "../Button/buttonLogOut";
import { motion } from "framer-motion";
import { useState } from "react";
import { UserType } from "@/lib/types/types";
import { useRouter, usePathname } from "next/navigation";
import ConfiguracoesUsuarioModal from "../modals/ConfiguracoesUsuarioModal";
import NotificacoesModal from "../modals/NotificacoesModal";

type Props = {
     userName: string | null | undefined;
     userEmail: string | null | undefined;
     user?: UserType;
};

export function SideBar({ userName, userEmail, user }: Props) {
     const router = useRouter();
     const pathname = usePathname();
     const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
     const [isNotificacoesModalOpen, setIsNotificacoesModalOpen] = useState(false);

     const menuItems = [
          { id: "Departamentos", icon: MdDashboard, label: "Departamentos", path: "/departamentos", isModal: false },
          { id: "Notificacoes", icon: IoMdNotifications, label: "Notificações", path: "/notificacoes", isModal: true },
          { id: "Configuracoes", icon: FaGear, label: "Configurações", path: "/configuracoes", isModal: true }
     ];

     const handleMenuClick = (itemId: string) => {
          if (itemId === "Configuracoes") {
               setIsConfigModalOpen(true);
          } else if (itemId === "Notificacoes") {
               setIsNotificacoesModalOpen(true);
          } else if (itemId === "Departamentos") {
               router.push("/departamentos");
          }
     };

     const handleConfigSuccess = () => {
          setIsConfigModalOpen(false);
     };

     const isActive = (path: string, isModal: boolean) => {
          if (isModal) return false;
          return pathname === path || pathname?.startsWith(path + '/');
     };

     const sidebarVariants = {
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

     const itemVariants = {
          hidden: { x: -20, opacity: 0 },
          visible: {
               x: 0,
               opacity: 1,
               transition: { duration: 0.3 }
          }
     };

     return (
          <motion.aside
               className="w-72 lg:w-[20%] lg:min-w-[250px] bg-page text-white p-6 flex flex-col justify-between border-r border-line h-full overflow-y-auto"
               initial="hidden"
               animate="visible"
               variants={sidebarVariants}
          >
               <div>
                    <motion.div
                         className="mb-12"
                         variants={itemVariants}
                    >
                         <Image
                              src="/logo-completa-branca.png"
                              alt="Logo"
                              width={140}
                              height={46}
                              className="mb-8"
                         />
                    </motion.div>

                    <nav className="flex-grow">
                         <ul className="space-y-3">
                              {menuItems.map((item) => (
                                   <motion.li key={item.id} variants={itemVariants}>
                                        <button
                                             className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.path, item.isModal)
                                                  ? "text-black bg-primary font-medium"
                                                  : "text-white hover:bg-surface-2"
                                                  }`}
                                             onClick={() => handleMenuClick(item.id)}
                                        >
                                             <item.icon className="text-xl" />
                                             {item.label}
                                        </button>
                                   </motion.li>
                              ))}
                         </ul>
                    </nav>
               </div>

               <motion.div
                    className="mt-auto"
                    variants={itemVariants}
               >
                    <div className="flex items-center gap-3 bg-surface-2 p-3 rounded-xl relative overflow-hidden group">
                         <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                         <div className="relative">
                              <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-base font-semibold text-white">
                                   {userName?.charAt(0) || "U"}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-line rounded-full"></div>
                         </div>

                         <div className="flex-1 min-w-0" title={`${userName || "Usuário"}\n${userEmail || ""}`}>
                              <p className="text-sm font-medium text-white truncate group-hover:text-primary transition-colors duration-300">
                                   {userName || "Usuário"}
                              </p>
                              <p className="text-xs text-muted truncate">
                                   {userEmail || "email@exemplo.com"}
                              </p>
                         </div>

                         <div className="relative shrink-0">
                              <Logout />
                         </div>
                    </div>

                    <div className="mt-4 text-center text-xs text-subtle">
                         <p>Cybox v0.0.1</p>
                    </div>
               </motion.div>

               {user && (
                    <>
                         <ConfiguracoesUsuarioModal
                              isOpen={isConfigModalOpen}
                              onClose={() => setIsConfigModalOpen(false)}
                              user={user}
                              onSuccess={handleConfigSuccess}
                         />
                         <NotificacoesModal
                              isOpen={isNotificacoesModalOpen}
                              onClose={() => setIsNotificacoesModalOpen(false)}
                         />
                    </>
               )}
          </motion.aside>
     );
}