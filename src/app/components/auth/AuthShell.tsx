"use client"

import Image from "next/image";
import Link from "next/link";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { motion } from "framer-motion";
import { FiArrowLeft, FiEye } from "react-icons/fi";
import { useFormStatus } from "react-dom";
import { Backdrop } from "../home/landing/Backdrop";
import { AssetTag, Slash } from "../home/landing/shared";
import { DoDemoLogin } from "@/app/services/login";

const TAGS = [
     { code: "CYB-0142", name: "MacBook Pro 14\"", dept: "IT · 70% value", className: "left-[8%] top-[14%] -rotate-6" },
     { code: "CYB-0388", name: "Forklift FX-2", dept: "Warehouse · 65% value", className: "right-[10%] top-[30%] rotate-3" },
     { code: "CYB-0051", name: "Standing desk", dept: "Office · 80% value", className: "right-[8%] top-[52%] rotate-2" },
];

/** Split layout shared by every auth screen: brand panel on the left (desktop), form on the right. */
export function AuthShell({ title, accent, text, children }: { title: string; accent: string; text: string; children: ReactNode }) {
     return (
          <div className="relative grid min-h-screen lg:grid-cols-2">
               <Backdrop />

               {/* brand panel */}
               <aside className="relative hidden overflow-hidden border-r border-white/[0.06] lg:flex lg:flex-col lg:justify-between lg:p-12">
                    <div aria-hidden className="floor-grid pointer-events-none absolute inset-x-[-50%] bottom-0 h-[45%] animate-floor-scroll opacity-50" />
                    <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,207,69,0.16),transparent_65%)] blur-2xl" />

                    <Link href="/" aria-label="Cybox home" className="relative w-fit">
                         <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-7 w-auto" priority />
                    </Link>

                    <div aria-hidden className="pointer-events-none absolute inset-0">
                         {TAGS.map((tag, i) => (
                              <motion.div
                                   key={tag.code}
                                   className={`absolute ${tag.className}`}
                                   animate={{ y: [0, -10, 0] }}
                                   transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
                              >
                                   <AssetTag tag={tag} className="opacity-70" />
                              </motion.div>
                         ))}
                    </div>

                    <div className="relative max-w-md">
                         <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight xl:text-5xl">
                              {title}
                              <span className="mt-1 flex items-center gap-3 text-primary">
                                   {accent}
                                   <Slash className="h-[0.75em] w-auto text-amber" />
                              </span>
                         </h1>
                         <p className="mt-5 text-base leading-relaxed text-white/60">{text}</p>
                    </div>
               </aside>

               {/* form */}
               <main className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-6">
                    <Link href="/" aria-label="Cybox home" className="mb-8 lg:hidden">
                         <Image src="/brand/cybox-wordmark.png" alt="Cybox" width={900} height={234} className="h-6 w-auto" priority />
                    </Link>
                    <motion.div
                         initial={{ opacity: 0, y: 16 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                         className="w-full max-w-md"
                    >
                         {children}
                    </motion.div>
                    <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm text-white/45 transition-colors hover:text-white">
                         <FiArrowLeft aria-hidden /> Back to home
                    </Link>
               </main>
          </div>
     );
}

/** Title + subtitle at the top of an auth form. */
export function AuthHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: ReactNode }) {
     return (
          <div className="mb-8">
               <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary/80">{eyebrow}</p>
               <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
               {subtitle && <p className="mt-2 text-sm text-white/55">{subtitle}</p>}
          </div>
     );
}

export const inputClass =
     "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-[15px] text-white placeholder:text-white/30 transition-colors focus:border-primary/60 focus:bg-white/[0.05] focus:outline-none focus:ring-4 focus:ring-primary/10";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; icon: ReactNode; trailing?: ReactNode; hint?: ReactNode };

/** Labelled input with a leading icon and an optional trailing control (e.g. show password). */
export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field({ label, icon, trailing, hint, id, className = "", ...props }, ref) {
     const inputId = id ?? props.name;
     return (
          <div>
               <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-white/75">{label}</label>
               <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35">{icon}</span>
                    <input ref={ref} id={inputId} className={`${inputClass} ${trailing ? "pr-12" : ""} ${className}`} {...props} />
                    {trailing && <span className="absolute right-2 top-1/2 -translate-y-1/2">{trailing}</span>}
               </div>
               {hint}
          </div>
     );
});

export function OrDivider({ label = "or" }: { label?: string }) {
     return (
          <div className="my-6 flex items-center gap-4">
               <span className="h-px flex-1 bg-white/10" />
               <span className="font-mono text-[11px] uppercase tracking-widest text-white/35">{label}</span>
               <span className="h-px flex-1 bg-white/10" />
          </div>
     );
}

function DemoSubmit({ compact }: { compact?: boolean }) {
     const { pending } = useFormStatus();
     return (
          <button
               type="submit"
               disabled={pending}
               aria-label="Explore the demo, no account needed"
               className={`group flex w-full items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/[0.04] text-left transition-colors hover:border-primary hover:bg-primary/[0.08] disabled:opacity-60 ${compact ? "px-4 py-3" : "px-5 py-4"}`}
          >
               <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-black">
                    {pending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" /> : <FiEye size={18} aria-hidden />}
               </span>
               <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{pending ? "Opening the demo…" : "Explore the demo"}</span>
                    <span className="block text-xs text-white/50">No account needed. Sample data, nothing is saved.</span>
               </span>
          </button>
     );
}

/** One-click entry into demo (exhibition) mode. */
export function DemoButton({ compact }: { compact?: boolean }) {
     return (
          <form action={DoDemoLogin}>
               <DemoSubmit compact={compact} />
          </form>
     );
}
