"use client"

import { FormEvent } from "react";

type Props = {
    departamentoId: number;
    email: string;
};

export default function EnviarConviteButton({ departamentoId, email }: Props) {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(`Enviando convite para o departamento ${departamentoId} para o email ${email}`);
        // Aqui você pode chamar a função de envio de convite
        // await convidarUsuarioParaDepartamento(departamentoId, email); (se necessário)
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <button
                    type="submit"
                    className="bg-none border-2 border-[#F6CF45] text-black w-fit mx-auto rounded-full 2xl:h-14 2xl:py-0 p-2 text-xl font-semibold items-center text-center justify-center mt-2"
                >
                    Enviar Convite
                </button>
            </form>
        </>
    );
}
