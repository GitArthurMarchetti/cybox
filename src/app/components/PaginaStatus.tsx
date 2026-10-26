import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

interface PaginaStatusProps {
    icone: ReactNode;
    tom?: "sucesso" | "aviso" | "erro";
    titulo: string;
    children: ReactNode;
    acoes?: ReactNode;
}

const CORES_TOM = {
    sucesso: "bg-green-500/15 text-green-400",
    aviso: "bg-primary/15 text-primary",
    erro: "bg-red-500/15 text-red-400",
};

export function PaginaStatus({ icone, tom = "aviso", titulo, children, acoes }: PaginaStatusProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-page via-[#1a1a1a] to-page px-4 py-10">
            <Link href="/" aria-label="Cybox - início" className="mb-8">
                <Image src="/logo-completa-branca.png" alt="Cybox" width={140} height={46} priority />
            </Link>
            <main className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-2xl">
                <div className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${CORES_TOM[tom]}`} aria-hidden>
                    {icone}
                </div>
                <h1 className="mb-3 text-xl font-bold text-white">{titulo}</h1>
                <div className="mb-6 text-sm leading-relaxed text-muted">{children}</div>
                {acoes && <div className="flex flex-col items-center gap-3">{acoes}</div>}
            </main>
        </div>
    );
}

export const classeBotaoPrimario = "inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-6 font-medium text-black transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
export const classeBotaoSecundario = "inline-flex h-11 w-full items-center justify-center rounded-lg bg-surface-2 px-6 font-medium text-white transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
