import Link from "next/link";

interface PlansCardProps {
     name: string
     description: string
     price: number
     advantages: string[]
     destaque?: boolean
}

export function PlansCard({ name, description, price, advantages, destaque = false }: PlansCardProps) {
     return (
          <div className={`relative flex h-full w-full flex-col rounded-2xl bg-[#1E1E1E] p-6 text-center sm:p-8 ${destaque ? 'ring-2 ring-primary' : 'ring-1 ring-white/5'}`}>
               {destaque && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-black">
                         Mais completo
                    </span>
               )}
               <h3 className="mb-3 text-xl font-semibold text-white">{name}</h3>
               <p className="mb-6 text-sm leading-relaxed text-muted">
                    {description}
               </p>
               <p className="mb-8 flex items-baseline justify-center gap-2">
                    <span className="text-lg text-muted">R$</span>
                    <span className="text-5xl font-bold text-white lg:text-6xl">
                         {price.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-sm text-muted">/mês</span>
               </p>
               <Link
                    href="/cadastro"
                    className={`mb-8 flex h-12 w-full items-center justify-center rounded-lg font-medium transition-colors ${destaque
                         ? 'bg-primary text-black hover:bg-primary-hover'
                         : 'bg-surface-2 text-white hover:bg-surface-3'}`}
               >
                    Comece já
               </Link>
               <ul className="mt-auto space-y-3 text-left text-sm">
                    {advantages.map(advantage => (
                         <li key={advantage} className="flex items-start gap-2 text-muted">
                              <span className="text-primary" aria-hidden>•</span>
                              {advantage}
                         </li>
                    ))}
               </ul>
          </div>
     )
}
