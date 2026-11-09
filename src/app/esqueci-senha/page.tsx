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
                titulo="Check your inbox"
                acoes={<Link href="/login" className={classeBotaoSecundario}>Back to log in</Link>}
            >
                If there&apos;s an account for <strong className="text-white">{email.trim()}</strong>, we sent it a link
                to set a new password. It works for 1 hour, so check your spam folder too.
            </PaginaStatus>
        );
    }

    return (
        <PaginaStatus icone={<MdLockReset size={28} />} titulo="Forgot your password?">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <p className="text-center">Enter your account&apos;s email and we&apos;ll send you a link to set a new one.</p>
                <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/75">Email</label>
                    <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30 focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/10"
                    />
                </div>
                <button type="submit" disabled={isLoading} className={`${classeBotaoPrimario} disabled:cursor-not-allowed disabled:opacity-60`}>
                    {isLoading ? "Sending…" : "Send reset link"}
                </button>
                <Link href="/login" className={classeBotaoSecundario}>Back to log in</Link>
            </form>
        </PaginaStatus>
    );
}
