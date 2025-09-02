"use client"

import { motion } from "framer-motion";
import { SlOptions } from "react-icons/sl";
import { ListDepartamentos } from "./listDepartamentos";
import { DepartamentoType } from "@/lib/types/types";

interface DepartmentSidebarProps {
    departamentos: DepartamentoType[];
    onDepartmentClick: (id: string | number | null) => void;
}

export default function DepartmentSidebar({
    departamentos,
    onDepartmentClick
}: DepartmentSidebarProps) {
    return (
        <motion.aside
            className="w-[20%] bg-[#1F1F1F] text-white p-6 h-[88.5vh] mt-[5.12rem] rounded-xl mr-7 overflow-y-auto hide-scrollbar"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">Lista de departamento</h2>
                <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                >
                    <SlOptions className="text-[#8C8888] hover:text-white transition-colors duration-300" />
                </motion.div>
            </div>

            <div className="space-y-4">

                {departamentos.length > 0 ? (
                    departamentos.map((d, index) => (
                        <motion.div
                            key={d.id_departamentos}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                            <ListDepartamentos
                                titulo={d.titulo}
                                data={d.created_at ?? ""}
                                onClick={() => onDepartmentClick(d.id_departamentos)}
                            />
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-6 text-[#8C8888]">
                        Nenhum departamento disponível
                    </div>
                )}
            </div>
        </motion.aside>
    );
}