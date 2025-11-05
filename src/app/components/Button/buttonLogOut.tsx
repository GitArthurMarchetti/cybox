"use client"

import { DoLogout } from "@/app/services/login";
import { TbLogout2 } from "react-icons/tb";
import { motion } from "framer-motion";

interface LogoutProps {
    variant?: 'default' | 'sidebar';
}

export default function Logout({ variant = 'default' }: LogoutProps) {
    if (variant === 'sidebar') {
        return (
            <form action={DoLogout} className="w-full">
                <motion.button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors duration-300 text-[#b4b4b4] hover:text-red-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Sair"
                >
                    <TbLogout2 size={20} />
                </motion.button>
            </form>
        );
    }

    return (
        <form action={DoLogout}>
            <motion.button
                type="submit"
                className="p-2 text-[#B4B4B4] hover:text-[#F6CF45] transition-colors duration-300 rounded-full hover:bg-[#1F1F1F]"
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                title="Sair"
            >
                <TbLogout2 className="text-xl cursor-pointer" />
            </motion.button>
        </form>
    );
}