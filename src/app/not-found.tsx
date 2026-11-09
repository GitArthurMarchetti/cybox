import Image from "next/image";
import Link from "next/link";
import { Backdrop } from "./components/home/landing/Backdrop";
import { EmptyBoxScene } from "./components/EmptyBoxScene";

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12 text-center">
            <Backdrop />
            <Link href="/" aria-label="Cybox home" className="mb-10">
                <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-6 w-auto" priority />
            </Link>
            <EmptyBoxScene />
            <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-primary/80">Error 404</p>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">This box is empty.</h1>
            <p className="mt-3 max-w-sm text-white/55">
                The page you&apos;re looking for isn&apos;t here. It may have moved, or the link might be wrong.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                    href="/"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 font-semibold text-black shadow-[0_0_30px_-10px_rgba(246,207,69,0.7)] transition-colors hover:bg-primary-hover"
                >
                    Back to home
                </Link>
                <Link
                    href="/departamentos"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 px-7 text-white/90 transition-colors hover:border-primary/60"
                >
                    Go to my rooms
                </Link>
            </div>
        </div>
    );
}
