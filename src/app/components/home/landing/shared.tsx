'use client'

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** The orange parallelogram from the logo, reused as a graphic accent. */
export function Slash({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 40" className={className} aria-hidden>
      <path d="M12 0 H30 L10 40 L0 26 Z" fill="currentColor" />
    </svg>
  );
}

/** Small mono label above section titles, e.g. "[ 02 — INSIDE THE BOX ]". */
export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <p className="mb-5 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-primary/80">
      <Slash className="h-3.5 w-auto text-amber" />
      {index && <span className="text-white/55">{index}</span>}
      <span>{children}</span>
    </p>
  );
}

/** Fades and lifts its children into view once, when they enter the viewport. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Sets --mx / --my on the element so `.spotlight` cards glow under the pointer. */
export function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export type AssetTagData = { code: string; name: string; dept: string };

/** A physical-style asset label: code, name, department and a barcode. */
export function AssetTag({ tag, className = "" }: { tag: AssetTagData; className?: string }) {
  return (
    <div className={`flex shrink-0 items-stretch overflow-hidden rounded-md border border-white/10 bg-[#111] font-mono text-xs leading-tight shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${className}`}>
      <div className="flex w-2 bg-primary" />
      <div className="flex flex-col justify-center gap-1 px-3 py-2">
        <span className="text-primary">{tag.code}</span>
        <span className="whitespace-nowrap text-white">{tag.name}</span>
        <span className="text-white/55">{tag.dept}</span>
      </div>
      <div className="barcode my-2 mr-3 w-10 text-white/70" />
    </div>
  );
}
