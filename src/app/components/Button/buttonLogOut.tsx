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
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors duration-300 text-muted hover:text-red-500"
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
                className="w-10 h-10 flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                whileTap={{ scale: 0.92 }}
                title="Sair"
                aria-label="Sair da conta"
            >
                <TbLogout2 className="text-xl" aria-hidden />
            </motion.button>
        </form>
    );
}