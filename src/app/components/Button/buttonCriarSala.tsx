'use client';

import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import { CriarDepartamentoModal } from "../modals";

export default function ButtonCriarSala() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-5 inline-flex items-center gap-2 rounded-full border border-primary bg-primary text-sm font-medium text-black transition-colors duration-200 hover:bg-primary-hover hover:border-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
            >
                <BsPlus className="text-xl" aria-hidden /> Criar departamento
            </button>
            <CriarDepartamentoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    window.location.reload();
                }}
            />
        </>
    );
}
