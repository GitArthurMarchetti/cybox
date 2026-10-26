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
            setErro(resultado.error || "Não foi possível redefinir a senha.");
        }
    };

    if (concluido) {
        return (
            <PaginaStatus
                icone={<MdCheckCircle size={28} />}
                tom="sucesso"
                titulo="Senha alterada!"
                acoes={<Link href="/login" className={classeBotaoPrimario}>Entrar</Link>}
            >
                Use a nova senha para entrar. Por segurança, as outras sessões abertas foram encerradas.
            </PaginaStatus>
        );
    }

    const campo = "w-full rounded-lg bg-surface-2 px-4 py-3 text-white placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-primary";

    return (
        <PaginaStatus icone={<MdLockReset size={28} />} titulo="Criar nova senha">
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                    <label htmlFor="senha" className="mb-2 block text-sm font-medium text-muted">Nova senha</label>
                    <input id="senha" type="password" required minLength={8} autoComplete="new-password"
                        value={senha} onChange={(e) => setSenha(e.target.value)} className={campo} />
                    <p className="mt-1 text-xs text-subtle">Mínimo de 8 caracteres</p>
                </div>
                <div>
                    <label htmlFor="confirmacao" className="mb-2 block text-sm font-medium text-muted">Confirme a nova senha</label>
                    <input id="confirmacao" type="password" required minLength={8} autoComplete="new-password"
                        value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)} className={campo} />
                </div>
                {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
                <button type="submit" disabled={isLoading} className={`${classeBotaoPrimario} disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-subtle`}>
                    {isLoading ? "Salvando..." : "Salvar nova senha"}
                </button>
                {erro?.includes("expirou") && (
                    <Link href="/esqueci-senha" className="block text-center text-sm text-primary hover:underline">Pedir um novo link</Link>
                )}
            </form>
        </PaginaStatus>
    );
}
