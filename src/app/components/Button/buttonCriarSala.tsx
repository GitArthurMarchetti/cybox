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

type Props = {
    userId: string;
    departamento: DepartamentoType;
};

export default function ButtonCriarSala({ userId, departamento: novoDepartamento }: Props) {
    const [departamento, setDepartamento] = useState<DepartamentoType>(novoDepartamento);

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
            <AlertDialog>
                <AlertDialogTrigger className="bg-[#F6CF45] flex items-center gap-2  text-black 2xl:px-6 2xl:py-2 px-4 py-1 2xl:text-base text-sm rounded-full">
                    <BsPlus className="2xl:text-3xl" /> Criar Departamento
                </AlertDialogTrigger>
                <AlertDialogContent className="text-black">
                    <form onSubmit={handleSubmit}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Criar o seu departamento.</AlertDialogTitle>
                            <AlertDialogDescription>
                                Crie um departamento para cuidar de seus bens.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <section>
                            <input
                                type="text"
                                name="titulo"
                                className="w-11/12 p-2 text-black rounded-md"
                                placeholder="Novo Departamento..."
                                value={departamento.titulo}
                                onChange={(e) => setDepartamento({ ...departamento, titulo: e.target.value })}
                                required />

                            <input
                                name="descricao"
                                value={departamento.descricao ?? ""}
                                onChange={(e) => setDepartamento({ ...departamento, descricao: e.target.value })}
                                type="text"
                                className="border p-2 rounded"
                                placeholder="Descrição..."
                            />
                        </section>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <button type="submit">
                                    Criar
                                </button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
