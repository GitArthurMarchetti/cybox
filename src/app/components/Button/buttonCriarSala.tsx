'use client';

import { useState } from "react";
import { BsPlus } from "react-icons/bs";
import CriarDepartamentoModal from "../modals/criarSala";

export default function ButtonCriarSala() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-primary px-5 text-sm font-semibold text-black shadow-[0_0_30px_-10px_rgba(246,207,69,0.7)] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-page"
            >
                <BsPlus className="text-xl" aria-hidden /> New room
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
