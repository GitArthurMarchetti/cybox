'use client';

import { saveDepartamento } from "@/app/services/departamento";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DepartamentoType } from "@/lib/types/types";
import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import CreateDepartmentModal from "../modals/criarSala";

type Props = {
    userId: string;
    departamento: DepartamentoType;
};

export default function ButtonCriarSala({ userId, departamento: novoDepartamento }: Props) {
    const [departamento, setDepartamento] = useState<DepartamentoType>(novoDepartamento);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            await saveDepartamento(formData, userId);
        } catch (error) {
            console.error('Erro ao salvar o departamento:', error);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#F6CF45] text-black flex items-center gap-2 2xl:px-6 2xl:py-2 px-4 py-1 2xl:text-base text-sm rounded-full"
            >
                <BsPlus className="2xl:text-2xl" /> Criar sala
            </button>
            <CreateDepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
            />
        </>
    );
}
