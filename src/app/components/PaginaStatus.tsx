import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { Backdrop } from "./home/landing/Backdrop";

interface PaginaStatusProps {
    icone: ReactNode;
    tom?: "sucesso" | "aviso" | "erro";
    titulo: string;
    children: ReactNode;
    acoes?: ReactNode;
}

const TONES = {
    sucesso: "border-green-500/30 bg-green-500/10 text-green-400",
    aviso: "border-primary/30 bg-primary/10 text-primary",
    erro: "border-red-500/30 bg-red-500/10 text-red-400",
};

/** Centered single-message screen (invites, email verification, access denied…). */
export function PaginaStatus({ icone, tom = "aviso", titulo, children, acoes }: PaginaStatusProps) {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
            <Backdrop />
            <Link href="/" aria-label="Cybox home" className="mb-10">
                <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-7 w-auto" priority />
            </Link>
            <main className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-surface/90 p-8 text-center shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent">
                <div className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border ${TONES[tom]}`} aria-hidden>
                    {icone}
                </div>
                <h1 className="mb-3 font-display text-xl font-semibold tracking-tight text-white">{titulo}</h1>
                <div className="mb-7 text-sm leading-relaxed text-white/60">{children}</div>
                {acoes && <div className="flex flex-col items-center gap-3">{acoes}</div>}
            </main>
        </div>
    );
}

export const classeBotaoPrimario = "inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 font-semibold text-black shadow-[0_0_30px_-10px_rgba(246,207,69,0.7)] transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface";
export const classeBotaoSecundario = "inline-flex h-12 w-full items-center justify-center rounded-full border border-white/15 px-6 font-medium text-white transition-colors hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
