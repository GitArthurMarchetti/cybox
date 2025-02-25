import Image from "next/image";
import { FaGear } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";
import Logout from "../Button/buttonLogOut";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
     userName: string | null | undefined;
     userEmail: string | null | undefined;
};

export function SideBar({ userName, userEmail }: Props) {
     const [activeMenu, setActiveMenu] = useState("Departamentos");

     // Itens do menu
     const menuItems = [
          { id: "Departamentos", icon: MdDashboard, label: "Departamentos" },
          { id: "Notificacoes", icon: IoMdNotifications, label: "Notificações" },
          { id: "Configuracoes", icon: FaGear, label: "Configurações" }
     ];

     // Variantes de animação
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
               className="w-[20%] min-w-[250px] bg-[#0F0F0F] text-white p-6 flex flex-col justify-between border-r border-[#2C2C2C] h-screen"
               initial="hidden"
               animate="visible"
               variants={sidebarVariants}
          >
               <div>
                    {/* Logo */}
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

                    {/* Menu de navegação */}
                    <nav className="flex-grow">
                         <ul className="space-y-3">
                              {menuItems.map((item) => (
                                   <motion.li key={item.id} variants={itemVariants}>
                                        <a
                                             href="#"
                                             className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${activeMenu === item.id
                                                  ? "text-black bg-[#F6CF45] font-medium"
                                                  : "text-white hover:bg-[#2C2C2C]"
                                                  }`}
                                             onClick={() => setActiveMenu(item.id)}
                                        >
                                             <item.icon className="text-xl" />
                                             {item.label}
                                        </a>
                                   </motion.li>
                              ))}
                         </ul>
                    </nav>
               </div>

               {/* Seção do perfil do usuário */}
               <motion.div
                    className="mt-auto"
                    variants={itemVariants}
               >
                    <div className="flex items-center gap-4 bg-[#2C2C2C] p-4 rounded-xl relative overflow-hidden group">
                         {/* Efeito de brilho no hover */}
                         <div className="absolute inset-0 bg-gradient-to-r from-[#F6CF45]/0 via-[#F6CF45]/5 to-[#F6CF45]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                         {/* Avatar e badge de status */}
                         <div className="relative">
                              <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-xl font-semibold text-white">
                                   {userName?.charAt(0) || "U"}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-[#2C2C2C] rounded-full"></div>
                         </div>

                         {/* Informações do usuário */}
                         <div className="flex-1 min-w-0">
                              <p className="font-medium text-white truncate group-hover:text-[#F6CF45] transition-colors duration-300">
                                   {userName || "Usuário"}
                              </p>
                              <p className="text-xs text-[#B4B4B4] truncate">
                                   {userEmail || "email@exemplo.com"}
                              </p>
                         </div>

                         <div className=" z-50">
                              <Logout />
                         </div>
                         {/* Botão de logout */}
                    </div>

                    {/* Versão e informação do sistema */}
                    <div className="mt-4 text-center text-xs text-[#666666]">
                         <p>Cybox v0.0.1</p>
                    </div>
               </motion.div>
          </motion.aside>
     );
}