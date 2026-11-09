"use client"

import { useState } from "react";
import Link from "next/link";
import { MdCheckCircle, MdLockReset } from "react-icons/md";
import { PaginaStatus, classeBotaoPrimario } from "@/app/components/PaginaStatus";
import { redefinirSenha } from "@/app/services/user";

export default function RedefinirSenha({ params }: { params: { token: string } }) {
    const [senha, setSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [erro, setErro] = useState<string | null>(null);
    const [concluido, setConcluido] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);
        setIsLoading(true);
        const resultado = await redefinirSenha(params.token, senha, confirmacao);
        setIsLoading(false);

        if (resultado.success) {
            setConcluido(true);
        } else {
            setErro(resultado.error || "Couldn't reset your password.");
        }
    };

    if (concluido) {
        return (
            <PaginaStatus
                icone={<MdCheckCircle size={28} />}
                tom="sucesso"
                titulo="Password updated"
                acoes={<Link href="/login" className={classeBotaoPrimario}>Log in</Link>}
            >
                Log in with your new password. For your security, other open sessions were signed out.
            </PaginaStatus>
        );
    }

    const campo = "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-white placeholder:text-white/30 focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/10";

    return (
        <PaginaStatus icone={<MdLockReset size={28} />} titulo="Set a new password">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                    <label htmlFor="senha" className="mb-2 block text-sm font-medium text-white/75">New password</label>
                    <input id="senha" type="password" required minLength={8} autoComplete="new-password"
                        value={senha} onChange={(e) => setSenha(e.target.value)} className={campo} />
                    <p className="mt-1 text-xs text-subtle">At least 8 characters</p>
                </div>
                <div>
                    <label htmlFor="confirmacao" className="mb-2 block text-sm font-medium text-white/75">Confirm new password</label>
                    <input id="confirmacao" type="password" required minLength={8} autoComplete="new-password"
                        value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} className={campo} />
                </div>
                {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
                <button type="submit" disabled={isLoading} className={`${classeBotaoPrimario} disabled:cursor-not-allowed disabled:opacity-60`}>
                    {isLoading ? "Saving…" : "Save new password"}
                </button>
                {erro?.includes("expired") && (
                    <Link href="/esqueci-senha" className="block text-center text-sm text-primary hover:underline">Request a new link</Link>
                )}
            </form>
        </PaginaStatus>
    );
}
