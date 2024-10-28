"use client"

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
import { UserType } from "@/lib/types/types";
import { useState } from "react";

import { IoArrowRedoSharp } from "react-icons/io5";

type ConviteProps = {
    users: UserType[];
    departamentoNome: string;
};

export default function Convite({ users, departamentoNome }: ConviteProps) {
    const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);

    
    const removeUser = (id: number) => {
        setSelectedUsers((prevSelected) => prevSelected.filter((user) => user.id !== id));
    };

    return (
        <>
            <AlertDialog>
                <form action="">
                    <AlertDialogTrigger>
                        <IoArrowRedoSharp />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="text-black">

                        <AlertDialogHeader>
                            <AlertDialogTitle>Invite Users</AlertDialogTitle>
                            <AlertDialogDescription>
                                Selecione um usuário para convidar ao {departamentoNome}

                                <input type="text" list="users" className="border p-2 rounded" placeholder="Search users..." />
                                <datalist id="users">
                                    {users.map((user) => (
                                        <option key={user.id} value={user.nome}>
                                            {user.email}
                                        </option>
                                    ))}
                                </datalist>


                                <div className="mt-4">
                                    {selectedUsers.map((user) => (
                                        <div key={user.id} className="flex items-center mb-2">
                                            <span className="mr-2">{user.nome}</span>
                                            <button
                                                type="button"
                                                className="text-red-500"
                                                onClick={() => {
                                                    if (typeof user.id === "number") {
                                                        removeUser(user.id);
                                                    } else {
                                                        console.error("User ID is not a valid number.");
                                                    }
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </AlertDialogDescription>

                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction><button>Enviar convite</button></AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </form>
            </AlertDialog>
        </>
    );
}
