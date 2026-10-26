"use client"

import { motion } from "framer-motion";
import { CardDepartamento } from "./cardDepartamentos";
import { DepartamentoType } from "@/lib/types/types";
import { FaBuilding } from "react-icons/fa";

interface DepartmentGridProps {
    departamentos: DepartamentoType[];
    searchTerm: string;
    onSetSearchTerm: (value: string) => void;
    onShare: (dept: DepartamentoType) => void;
    onViewMembers: (dept: DepartamentoType) => void;
    onSettings: (dept: DepartamentoType) => void;
    containerVariants: {
        hidden: { opacity: number };
        visible: { opacity: number; transition: { staggerChildren: number } };
    };
    itemVariants: {
        hidden: { opacity: number; y: number };
        visible: { opacity: number; y: number; transition: { delay?: number; duration?: number } };
    };
}

export default function DepartmentGrid({
    departamentos,
    searchTerm,
    onSetSearchTerm,
    onShare,
    onViewMembers,
    onSettings,
    containerVariants,
    itemVariants
}: DepartmentGridProps) {
    const filteredDepartamentos = departamentos.filter((d) =>
        d.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredDepartamentos.length === 0) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-64 text-center"
                variants={itemVariants}
            >
                <div className="bg-surface-2 text-primary p-8 rounded-xl mb-4 w-16 h-16 flex items-center justify-center">
                    <FaBuilding />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">Nenhum departamento encontrado</h3>
                <p className="text-subtle max-w-md">
                    Não encontramos departamentos com esse nome. Tente outro termo ou crie um novo departamento.
                </p>
                <motion.button
                    onClick={() => onSetSearchTerm("")}
                    className="mt-4 text-primary border border-primary px-4 py-2 rounded-full hover:bg-primary/10 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Limpar busca
                </motion.button>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 2xl:grid-cols-3"
            variants={containerVariants}
        >
            {filteredDepartamentos.map((d, index) => (
                <motion.div
                    key={d.id_departamentos}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                >
                    <CardDepartamento
                        departamento={d}
                        titulo={d.titulo}
                        desc={d.descricao}
                        cargo={d.role || 'member'}
                        NParticipantes={Number(d.num_participantes) || 0}
                        fotoDepartamento={d.fotoDepartamento || "/placeholderImage.jpg"}
                        onShare={onShare}
                        onViewMembers={onViewMembers}
                        onSettings={onSettings}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}