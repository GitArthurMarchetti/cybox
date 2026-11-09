'use client'

import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { trackPointer } from "./landing/shared";

interface PlansCardProps {
     name: string
     size: string
     description: string
     price: number
     advantages: string[]
     /** 0 = small, 1 = medium, 2 = large; scales the little box illustration */
     scale: 0 | 1 | 2
     featured?: boolean
}

function BoxIcon({ scale }: { scale: 0 | 1 | 2 }) {
     const s = [26, 36, 48][scale];
     return (
          <svg viewBox="0 0 60 60" width={s} height={s} aria-hidden className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-4deg]">
               <polygon points="30,6 54,18 30,30 6,18" fill="#F6CF45" />
               <polygon points="6,18 30,30 30,56 6,44" fill="#B8952A" />
               <polygon points="54,18 30,30 30,56 54,44" fill="#7A6219" />
               <polygon points="24,9 36,15 12,27 0,21" fill="#050505" opacity="0.18" transform="translate(6 0)" />
          </svg>
     );
}

export function PlansCard({ name, size, description, price, advantages, scale, featured = false }: PlansCardProps) {
     return (
          <div
               onPointerMove={trackPointer}
               className={`spotlight group relative flex h-full w-full flex-col rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-8 ${featured
                    ? 'border border-primary/60 bg-[linear-gradient(160deg,rgba(246,207,69,0.14),rgba(13,13,13,0.9)_45%)] shadow-[0_30px_80px_-30px_rgba(246,207,69,0.45)]'
                    : 'border border-white/10 bg-[#0d0d0d]/80'}`}
          >
               {featured && (
                    <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-black">
                         Most complete
                    </span>
               )}
               <div className="flex h-14 items-end justify-between">
                    <BoxIcon scale={scale} />
                    <span className="font-mono text-xs uppercase tracking-widest text-white/40">{size}</span>
               </div>
               <h3 className="mt-6 font-display text-xl font-semibold text-white">{name}</h3>
               <p className="mt-2 text-sm leading-relaxed text-white/60">{description}</p>
               <p className="mt-8 flex items-baseline gap-1">
                    <span className="text-lg text-white/50">$</span>
                    <span className="font-display text-5xl font-semibold text-white">
                         {price.toLocaleString('en-US')}
                    </span>
                    <span className="ml-1 text-sm text-white/50">/month</span>
               </p>
               <ul className="my-8 space-y-3 text-sm">
                    {advantages.map(advantage => (
                         <li key={advantage} className="flex items-start gap-3 text-white/75">
                              <FiCheck className="mt-0.5 shrink-0 text-primary" aria-hidden />
                              {advantage}
                         </li>
                    ))}
               </ul>
               <Link
                    href="/cadastro"
                    className={`group/btn mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-full font-medium transition-colors ${featured
                         ? 'bg-primary text-black hover:bg-primary-hover'
                         : 'bg-white/5 text-white hover:bg-white/10'}`}
               >
                    Get started
                    <FiArrowRight className="transition-transform group-hover/btn:translate-x-1" aria-hidden />
               </Link>
          </div>
     )
}
