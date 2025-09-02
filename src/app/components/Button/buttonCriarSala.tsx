'use client';

import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { CriarDepartamentoModal } from "../modals";

type Props = {
    userId: string;
};

export default function ButtonCriarSala({ userId }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#F6CF45] text-black flex items-center gap-2 2xl:px-6 2xl:py-2 px-4 py-1 2xl:text-base text-sm rounded-full"
            >
                <BsPlus className="2xl:text-2xl" /> Criar departamento
            </button>
            <CriarDepartamentoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userId={userId}
                onSuccess={() => {
                    setIsModalOpen(false);
                    window.location.reload();
                }}
            />
        </>
    );
}
