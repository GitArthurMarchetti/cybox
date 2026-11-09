'use client'

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "framer-motion";
import { FiArrowRight, FiCheck, FiEye } from "react-icons/fi";
import { DoDemoLogin } from "@/app/services/login";

/**
 * Closing statement. The slogan sits inside a packed box (dashed frame) and an
 * "Accounted for" rubber stamp slams onto it once it scrolls into view.
 */
export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const stamped = useInView(boxRef, { once: true, amount: 0.8 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });
  const frame = useTransform(p, [0, 0.6], [0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden py-28 lg:py-40">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          ref={boxRef}
          className="relative inline-block px-6 py-8 sm:px-14 sm:py-12"
          // small jolt when the stamp hits
          animate={stamped ? { y: [0, 4, 0], scale: [1, 0.99, 1] } : undefined}
          transition={{ delay: 0.62, duration: 0.25 }}
        >
          {/* the box frame */}
          <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
            <motion.rect
              x="1"
              y="1"
              width="100%"
              height="100%"
              rx="18"
              fill="none"
              stroke="#F6CF45"
              strokeWidth="2"
              strokeDasharray="10 8"
              style={{ opacity: frame }}
              animate={{ strokeDashoffset: [0, -36] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
            />
          </svg>

          <h2 className="font-display text-[1.9rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="block">Know what</span>
            <span className="block">you own.</span>
            <span className="mt-2 block text-white/40 sm:mt-3">
              Know what it&apos;s <span className="text-primary">worth.</span>
            </span>
          </h2>

          {/* rubber stamp */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scale: 2.4, rotate: -2 }}
            animate={stamped ? { opacity: 1, scale: 1, rotate: -12 } : undefined}
            transition={{ delay: 0.5, duration: 0.18, ease: [0.5, 0, 0.9, 0.4] }}
            className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-12"
          >
            <div className="flex items-center gap-2 rounded-lg border-[3px] border-amber px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-[0.2em] text-amber shadow-[inset_0_0_0_2px_#050505,inset_0_0_0_4px_rgba(255,174,63,0.5)] [mask-image:radial-gradient(circle_at_30%_40%,#000_60%,rgba(0,0,0,0.75))] sm:px-4 sm:py-2 sm:text-base">
              <FiCheck strokeWidth={3.5} />
              Accounted for
            </div>
          </motion.div>
        </motion.div>

        <p className="mt-14 max-w-md text-white/60">
          Every asset in its department, every value up to date. Set up your first box and invite your team.
        </p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/cadastro"
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 font-medium text-black shadow-[0_0_50px_-10px_rgba(246,207,69,0.8)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary-hover"
          >
            Create your account
            <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <form action={DoDemoLogin}>
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/15 px-8 text-white/90 transition-colors hover:border-primary/60 sm:w-auto"
            >
              <FiEye aria-hidden /> Explore the demo
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
