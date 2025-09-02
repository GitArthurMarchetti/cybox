"use client"

import { motion } from "framer-motion";
import { UserType } from "@/lib/types/types";
import RegisterBranding from "../components/auth/RegisterBranding";
import RegisterForm from "../components/auth/RegisterForm";

type Props = {
    user: UserType;
};

export default function Cadastro({ user }: Props) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F0F0F] via-[#1a1a1a] to-[#0F0F0F] flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F6CF45]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#F6CF45]/5 rounded-full blur-2xl"></div>
            </div>

            <motion.div 
                className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <RegisterBranding />
                <RegisterForm user={user} />
            </motion.div>
        </div>
    );
}