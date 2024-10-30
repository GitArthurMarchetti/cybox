import Image from "next/image";
import { FaGear } from "react-icons/fa6";
import { IoMdNotifications } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { TbLogout2 } from "react-icons/tb";

export function SideBar() {
     return (
          <>
               <aside className="w-[20%] min-w-[250px] bg-[#0F0F0F] text-white p-6 flex flex-col justify-between border-r border-[#2C2C2C]">
                    <Image src="/logo-completa-branca.png" alt="Logo" width={80} height={80} className="mb-8 2xl:w-36 2xl:relative absolute top-1" />
                    {/* <Image src="/logo-completa-branca.png" alt="Logo" width={80} height={80} className="mb-8 2xl:w-36 2xl:opacity-100 opacity-0" /> */}

                    <nav className="flex-grow">
                         <ul>
                              <li className="2xl:mb-6 mb-3">
                                   <a href="#" className="flex items-center gap-3 2xl:text-xl text-black bg-[#F6CF45] 2x:px-4 2xl:p-3 p-1.5  rounded-3xl">
                                        <MdDashboard className="2xl:text-2xl" />
                                        Departamentos
                                   </a>
                              </li>
                              <li className="2xl:mb-6 mb-3">
                                   <a href="#" className="flex items-center gap-3 2xl:text-xl text-white  2x:px-4 2xl:p-3 p-1.5  hover:bg-[#2C2C2C] rounded-3xl">
                                        <IoMdNotifications className="2xl:text-2xl" />
                                        Notificações
                                   </a>
                              </li>
                              <li className="2xl:mb-6 mb-3">
                                   <a href="#" className="flex items-center gap-3 2xl:text-xl text-white  2x:px-4 2xl:p-3 p-1.5  hover:bg-[#2C2C2C] rounded-3xl">
                                        <FaGear className="2xl:text-2xl" />
                                        Configurações
                                   </a>
                              </li>
                         </ul>
                    </nav>

                    <div className="flex items-center gap-4 bg-[#2C2C2C] 2xl:p-6 px-1.5 py-4 rounded-lg relative">
                         <Image src="/avatar.png" alt="Avatar" width={48} height={48} className="rounded-full bg-slate-100" />
                         <div className="flex flex-col gap-1">
                              <p className="2xl:text-base text-sm">Arthur D{"'"}eça</p>
                              <p className="text-xs text-[#B4B4B4]">arthurdeca@cybox.com</p>
                              <TbLogout2 className="absolute top-3 right-3 2xl:text-xl" />
                         </div>
                         {/* <Logout /> */}
                    </div>
               </aside>
          </>
     )
}