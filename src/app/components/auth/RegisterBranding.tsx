"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../../../public/logo-completa-branca.png";

export default function RegisterBranding() {
    return (
        <motion.div 
            className="hidden lg:flex flex-col justify-center space-y-8 px-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="space-y-6">
                <div className="flex items-center">
                    <Image className="w-40 -ml-3 -mb-4" src={logo} alt="logo cybox" />
                </div>
                
                <h1 className="text-5xl font-bold leading-tight text-white">
                    Junte-se ao Cybox!
                </h1>
                
                <p className="text-xl text-[#b4b4b4] leading-relaxed">
                    Crie sua conta e comece a gerenciar seus patrimônios de forma 
                    profissional e organizada.
                </p>
                
                <div className="space-y-4 pt-4">
                    <div className="flex items-center space-x-3 text-[#F6CF45]">
                        <div className="w-2 h-2 bg-[#F6CF45] rounded-full"></div>
                        <span className="text-sm">Controle total de patrimônios</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#F6CF45]">
                        <div className="w-2 h-2 bg-[#F6CF45] rounded-full"></div>
                        <span className="text-sm">Relatórios de depreciação</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#F6CF45]">
                        <div className="w-2 h-2 bg-[#F6CF45] rounded-full"></div>
                        <span className="text-sm">Gestão colaborativa</span>
                    </div>
                    <div className="flex items-center space-x-3 text-[#F6CF45]">
                        <div className="w-2 h-2 bg-[#F6CF45] rounded-full"></div>
                        <span className="text-sm">Interface intuitiva</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}