"use client"

import Image from "next/image";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { useDemo } from "../demo/DemoContext";

interface GavetaLateralProps {
     aberta: boolean;
     onFechar: () => void;
     children: ReactNode;
}

// On desktop (lg+) the content renders as a fixed column; below that it becomes an overlay drawer.
export function GavetaLateral({ aberta, onFechar, children }: GavetaLateralProps) {
     const pathname = usePathname();

     useEffect(() => {
          onFechar();
          // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [pathname]);

     useEffect(() => {
          if (!aberta) return;

          const fecharComEsc = (e: KeyboardEvent) => e.key === 'Escape' && onFechar();
          const overflowAnterior = document.body.style.overflow;

          window.addEventListener('keydown', fecharComEsc);
          document.body.style.overflow = 'hidden';

          return () => {
               window.removeEventListener('keydown', fecharComEsc);
               document.body.style.overflow = overflowAnterior;
          };
     }, [aberta, onFechar]);

     return (
          <>
               <div
                    className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${aberta ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                    onClick={onFechar}
                    aria-hidden
               />
               <div
                    className={`fixed inset-y-0 left-0 z-50 flex h-full max-w-[85vw] transition-transform duration-300 ease-out lg:static lg:z-auto lg:max-w-none lg:translate-x-0 lg:transition-none ${aberta ? 'translate-x-0' : '-translate-x-full'}`}
               >
                    {children}
                    <button
                         type="button"
                         onClick={onFechar}
                         aria-label="Close menu"
                         className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-white lg:hidden"
                    >
                         <HiX size={22} />
                    </button>
               </div>
          </>
     );
}

interface BarraTopoMobileProps {
     onAbrirMenu: () => void;
     titulo?: string;
}

export function BarraTopoMobile({ onAbrirMenu, titulo }: BarraTopoMobileProps) {
     const { isDemo } = useDemo();
     return (
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] bg-[#080808]/90 px-2 backdrop-blur lg:hidden">
               <button
                    type="button"
                    onClick={onAbrirMenu}
                    aria-label="Open menu"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
               >
                    <HiMenuAlt2 size={24} />
               </button>
               {titulo ? (
                    <span className="truncate text-base font-semibold text-white">{titulo}</span>
               ) : (
                    <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-5 w-auto" />
               )}
               {isDemo && (
                    <span className="ml-auto mr-2 rounded-full bg-primary px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black">Demo</span>
               )}
          </header>
     );
}
