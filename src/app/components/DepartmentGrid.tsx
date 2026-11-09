"use client"

import { motion } from "framer-motion";
import { CardDepartamento } from "./cardDepartamentos";
import { DepartamentoType } from "@/lib/types/types";
import { FiBox, FiSearch } from "react-icons/fi";
import type { ReactNode } from "react";

interface DepartmentGridProps {
    departamentos: DepartamentoType[];
    searchTerm: string;
    onSetSearchTerm: (value: string) => void;
    onShare: (dept: DepartamentoType) => void;
    onViewMembers: (dept: DepartamentoType) => void;
    onSettings: (dept: DepartamentoType) => void;
    emptyAction?: ReactNode;
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
    emptyAction,
    containerVariants,
    itemVariants
}: DepartmentGridProps) {
    const filteredDepartamentos = departamentos.filter((d) =>
        d.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filteredDepartamentos.length === 0) {
        const searching = searchTerm.trim().length > 0;
        return (
            <motion.div
                className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 px-6 py-16 text-center"
                variants={itemVariants}
            >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    {searching ? <FiSearch size={22} /> : <FiBox size={22} />}
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                    {searching ? "No rooms match your search" : "No rooms here yet"}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/55">
                    {searching
                        ? `Nothing called "${searchTerm.trim()}". Try another name or clear the search.`
                        : "Create a room for a department, or join a teammate's room with an invite code."}
                </p>
                {searching ? (
                    <button
                        type="button"
                        onClick={() => onSetSearchTerm("")}
                        className="mt-6 rounded-full border border-white/15 px-5 py-2 text-sm text-white/80 transition-colors hover:border-primary/60 hover:text-white"
                    >
                        Clear search
                    </button>
                ) : (
                    emptyAction && <div className="mt-6">{emptyAction}</div>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3"
            variants={containerVariants}
        >
            {filteredDepartamentos.map((d, index) => (
                <motion.div
                    key={d.id_departamentos}
                    variants={itemVariants}
                    custom={index}
                    whileHover={{ y: -4 }}
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