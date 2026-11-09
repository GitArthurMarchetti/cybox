"use client"

import { useState } from "react";
import { reenviarVerificacao } from "@/app/services/user";
import { classeBotaoPrimario } from "@/app/components/PaginaStatus";

export default function ReenviarVerificacao({ email }: { email: string }) {
    const [enviado, setEnviado] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        await reenviarVerificacao(email);
        setIsLoading(false);
        setEnviado(true);
    };

    if (enviado) {
        return <p className="text-sm text-primary" role="status">Done! Check your inbox (and your spam folder).</p>;
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className={`${classeBotaoPrimario} disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-subtle`}
        >
            {isLoading ? 'Sending…' : 'Resend confirmation link'}
        </button>
    );
}
