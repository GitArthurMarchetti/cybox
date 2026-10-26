"use client"

import Image from "next/image";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HiMenuAlt2, HiX } from "react-icons/hi";

interface GavetaLateralProps {
     aberta: boolean;
     onFechar: () => void;
     children: ReactNode;
}

// No desktop (lg+) renderiza o conteúdo como coluna fixa; abaixo disso vira uma gaveta sobreposta.
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
                         aria-label="Fechar menu"
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
     return (
          <header className="flex h-14 shrink-0 items-center gap-3 border-b border-line bg-page px-2 lg:hidden">
               <button
                    type="button"
                    onClick={onAbrirMenu}
                    aria-label="Abrir menu"
                    className="flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
               >
                    <HiMenuAlt2 size={24} />
               </button>
               {titulo ? (
                    <span className="truncate text-base font-semibold text-white">{titulo}</span>
               ) : (
                    <Image src="/logo-completa-branca.png" alt="Cybox" width={96} height={32} className="h-7 w-auto" />
               )}
          </header>
     );
}
