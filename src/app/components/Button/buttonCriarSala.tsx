'use client'



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
import { BsPlus } from "react-icons/bs";

export default function ButtonCriarSala() {
    return (
        <>
            <AlertDialog>
                <form action="">
                    <AlertDialogTrigger>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="text-black">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="bg-[#F6CF45] flex items-center gap-2  text-black 2xl:px-6 2xl:py-2 px-4 py-1 2xl:text-base text-sm rounded-full">
                                 <BsPlus className="2xl:text-3xl" /> Criar Departamento
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Crie um departamento para guardar seus patrimônios.

                                <input type="text" list="users" className="border p-2 rounded" placeholder="Search users..." />

                            </AlertDialogDescription>

                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction><button>Criar sala</button></AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </form>
            </AlertDialog>
        </>
    )
}