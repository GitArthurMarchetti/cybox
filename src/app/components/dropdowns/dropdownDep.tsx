'use client'


import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { SlOptionsVertical } from "react-icons/sl";
import { removeDepartamento } from "@/app/services/departamento";
import { DepartamentoType } from "@/lib/types/types";

interface Props {
    departamento: DepartamentoType
    id_departamento: string | number | null;
    titulo: string;
    fotoDepartamento?: string;
    cargo: string;
    desc?: string | null;
    NParticipantes: number;
}

export default function DropDownDepartamento({ departamento, id_departamento, titulo, fotoDepartamento, cargo, desc, NParticipantes }: Props) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleOpenAlert = () => setIsAlertOpen(true);
    const handleCloseAlert = () => setIsAlertOpen(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="hover:text-gray-300 cursor-pointer transition-all">
                    <SlOptionsVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>{titulo}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleOpenAlert}>Excluir</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent className="text-black">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Departamento</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeDepartamento(departamento)}>
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
