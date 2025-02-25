'use client'

import Image from 'next/image'
import { MdDashboard } from "react-icons/md";
import { IoMdNotifications, IoMdSearch } from "react-icons/io";
import { FaFilter, FaGear } from "react-icons/fa6";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoNotificationsSharp } from 'react-icons/io5';
import { UserType } from '@/lib/types/types';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
    type: string
    user?: UserType
}

export default function Navbar({ type, user }: NavbarProps) {
    const [searchFocus, setSearchFocus] = useState(false);
    const [notificationCount, setNotificationCount] = useState(3); // Simulação de notificações

    // Variantes de animação
    const navbarVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    // Navbar tipo 1 - Homepage pública
    if (type === "1") {
        return (
            <motion.header
                className='fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/30'
                initial="hidden"
                animate="visible"
                variants={navbarVariants}
            >
                <nav className='flex items-center w-full gap-10 px-8 py-4'>
                    <div className='w-[25%]'>
                        <Image
                            src="/logo-branca.png"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="object-contain"
                        />
                    </div>
                    <div className='w-2/4 flex justify-evenly text-xl text-gray-300 py-2 rounded-full'>
                        <motion.a
                            className='transition-colors duration-300 hover:text-white relative group'
                            href="#home"
                            whileHover={{ scale: 1.05 }}
                        >
                            Home
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6CF45] transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                        <motion.a
                            className='transition-colors duration-300 hover:text-white relative group'
                            href="#plans"
                            whileHover={{ scale: 1.05 }}
                        >
                            Planos
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6CF45] transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                        <motion.a
                            className='transition-colors duration-300 hover:text-white relative group'
                            href="#about"
                            whileHover={{ scale: 1.05 }}
                        >
                            Sobre nós
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6CF45] transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                        <motion.a
                            className='transition-colors duration-300 hover:text-white relative group'
                            href="#contact"
                            whileHover={{ scale: 1.05 }}
                        >
                            Contato
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#F6CF45] transition-all duration-300 group-hover:w-full"></span>
                        </motion.a>
                    </div>
                    <div className='w-[25%] flex justify-end gap-3'>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href={'/cadastro'}
                                className='bg-[#2E2E2E] text-white hover:bg-[#F6CF45] hover:text-black transition-all duration-300 h-11 px-9 text-lg rounded-full flex items-center'>
                                Cadastrar
                            </Link>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link href={'/login'}
                                className='border-[#2E2E2E] hover:border-[#F6CF45] border-2 border-solid text-white transition-all duration-300 hover:bg-[#F6CF45] hover:text-black h-11 px-9 flex items-center text-lg rounded-full'>
                                Entrar
                            </Link>
                        </motion.div>
                    </div>
                </nav>
            </motion.header>
        );
    }
    // Navbar tipo 2 - Área logada
    else if (type === '2') {
        return (
            <motion.header
                className='bg-[#0F0F0F] border-b border-[#2c2c2c] h-20'
                initial="hidden"
                animate="visible"
                variants={navbarVariants}
            >
                <nav className='flex items-center w-full justify-between px-10 h-full'>
                    {/* Logo */}
                    <div className='flex items-center'>
                        <Link href="/departamentos">
                            <Image
                                src="/logo-completa-branca.png"
                                alt="Logo"
                                width={120}
                                height={40}
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    {/* Barra de pesquisa */}
                    <div className="flex items-center w-2/5 gap-5">
                        <div
                            className={`flex items-center bg-[#2C2C2C] w-full px-4 rounded-full transition-all duration-300 ${searchFocus ? 'ring-2 ring-[#F6CF45]/50' : ''
                                }`}
                        >
                            <input
                                type="text"
                                placeholder="Pesquise por sua categoria"
                                className="flex-grow py-3 bg-[#2C2C2C] text-white rounded-lg outline-none placeholder:text-[#8C8888]"
                                onFocus={() => setSearchFocus(true)}
                                onBlur={() => setSearchFocus(false)}
                            />
                            <IoMdSearch className="text-[#8C8888] text-xl" />
                        </div>
                        <motion.button
                            className="flex items-center text-[#8C8888] gap-1 group"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaFilter className="text-xl group-hover:text-[#F6CF45] transition-colors duration-300" />
                            <span className='underline underline-offset-2 italic group-hover:text-[#F6CF45] transition-colors duration-300'>Filtrar</span>
                        </motion.button>
                    </div>

                    {/* Perfil e notificações */}
                    <div className='flex justify-end items-center gap-6'>
                        {/* Botão de notificações */}
                        <motion.div
                            className="relative cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IoNotificationsSharp className='text-[#8C8888] hover:text-[#F6CF45] transition-colors duration-300' size={24} />
                            {notificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                                    {notificationCount}
                                </span>
                            )}
                        </motion.div>

                        {/* Informações do usuário */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className='text-white font-medium'>{user?.nome || 'Usuário'}</p>
                                <p className='text-[#B4B4B4] text-sm'>{user?.email || 'email@exemplo.com'}</p>
                            </div>

                            {/* Avatar do usuário */}
                            <motion.div
                                className='w-12 h-12 rounded-full bg-[#3D3D3D] flex items-center justify-center text-white text-lg font-medium cursor-pointer'
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {user?.nome?.charAt(0) || 'U'}
                            </motion.div>
                        </div>
                    </div>
                </nav>
            </motion.header>
        );
    }

    // Tipo de navbar inválido
    return null;
}