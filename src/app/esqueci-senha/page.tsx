"use client"

import { useState } from "react";
import Link from "next/link";
import { MdLockReset, MdMarkEmailRead } from "react-icons/md";
import { PaginaStatus, classeBotaoPrimario, classeBotaoSecundario } from "@/app/components/PaginaStatus";
import { solicitarRedefinicaoSenha } from "@/app/services/user";

export default function EsqueciSenha() {
    const [email, setEmail] = useState("");
    const [enviado, setEnviado] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await solicitarRedefinicaoSenha(email.trim());
        setIsLoading(false);
        setEnviado(true);
    };

    if (enviado) {
        return (
            <PaginaStatus
                icone={<MdMarkEmailRead size={28} />}
                tom="sucesso"
                titulo="Confira seu email"
                acoes={<Link href="/login" className={classeBotaoSecundario}>Voltar ao login</Link>}
            >
                Se existir uma conta com <strong className="text-white">{email.trim()}</strong>, enviamos um link
                para criar uma nova senha. Ele vale por 1 hora. Não esqueça de olhar o spam.
            </PaginaStatus>
        );
    }

    return (
        <PaginaStatus icone={<MdLockReset size={28} />} titulo="Esqueceu sua senha?">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <p className="text-center">Digite o email da sua conta e enviaremos um link para criar uma nova senha.</p>
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-muted">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        className="w-full rounded-lg bg-surface-2 px-4 py-3 text-white placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <button type="submit" disabled={isLoading} className={`${classeBotaoPrimario} disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-subtle`}>
                    {isLoading ? "Enviando..." : "Enviar link"}
                </button>
                <Link href="/login" className={classeBotaoSecundario}>Voltar ao login</Link>
            </form>
        </PaginaStatus>
    );
}
