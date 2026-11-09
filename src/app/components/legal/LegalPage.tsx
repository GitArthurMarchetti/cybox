import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Backdrop } from "../home/landing/Backdrop";
import { HomeFooter } from "../home/HomeFooter";

export const LEGAL_UPDATED = "November 8, 2026";

/** Shared layout for the Privacy Policy and Terms of Use. */
export function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: ReactNode; children: ReactNode }) {
    return (
        <div className="relative min-h-screen">
            <Backdrop />
            <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6 sm:px-6">
                <Link href="/" aria-label="Cybox home">
                    <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-6 w-auto" priority />
                </Link>
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white">
                    <FiArrowLeft aria-hidden /> Back to home
                </Link>
            </header>

            <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">{eyebrow}</p>
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
                <p className="mt-3 font-mono text-xs text-white/40">Last updated: {LEGAL_UPDATED}</p>
                <div className="mt-6 text-base leading-relaxed text-white/70">{intro}</div>
                <div className="legal mt-12 space-y-10">{children}</div>
            </main>

            <HomeFooter />
        </div>
    );
}

export function LegalSection({ n, title, children }: { n: number; title: string; children: ReactNode }) {
    return (
        <section aria-labelledby={`s${n}`} className="border-t border-white/[0.07] pt-8">
            <h2 id={`s${n}`} className="flex items-baseline gap-3 font-display text-lg font-semibold tracking-tight text-white">
                <span className="font-mono text-xs text-primary">{String(n).padStart(2, "0")}</span>
                {title}
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-white/65 [&_a]:text-primary [&_a]:underline-offset-4 hover:[&_a]:underline [&_li]:pl-1 [&_strong]:font-medium [&_strong]:text-white/90 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {children}
            </div>
        </section>
    );
}
