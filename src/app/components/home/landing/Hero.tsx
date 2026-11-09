'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { FiArrowRight, FiArrowUp, FiEye } from "react-icons/fi";
import { DoDemoLogin } from "@/app/services/login";
import { AssetTag, Eyebrow, Slash, type AssetTagData } from "./shared";

const WORDS = ["laptop", "desk", "server", "truck", "drill", "monitor", "tablet", "printer"];

// Where each tag lands, relative to the box centre (vw / vh), plus its tilt.
const FLYING_TAGS: (AssetTagData & { x: number; y: number; r: number })[] = [
  { code: "CYB-0142", name: "MacBook Pro 14\"", dept: "IT · 20%/yr", x: -30, y: -26, r: -8 },
  { code: "CYB-0388", name: "Forklift FX-2", dept: "Warehouse · 10%/yr", x: 28, y: -29, r: 6 },
  { code: "CYB-0051", name: "Standing desk", dept: "Office · 10%/yr", x: -36, y: 3, r: 5 },
  { code: "CYB-0907", name: "Dell R750 server", dept: "IT · 20%/yr", x: 35, y: -1, r: -6 },
  { code: "CYB-0233", name: "Ford Transit", dept: "Logistics · 20%/yr", x: -2, y: -37, r: 3 },
  { code: "CYB-0610", name: "Espresso machine", dept: "Kitchen · 10%/yr", x: -30, y: 31, r: -4 },
  { code: "CYB-0720", name: "3D printer", dept: "R&D · 20%/yr", x: 31, y: 32, r: 4 },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

/**
 * Scroll story (progress 0 → 1 while the hero is pinned):
 *   0.00–0.22  the copy recedes; the box grows in the centre and opens
 *   0.20–0.50  asset tags fly out, big, across the screen
 *   0.50–0.70  hold
 *   0.66–0.80  the tags are pulled back into the box
 *   0.80–0.88  the lid closes: everything is back in its box
 *   0.84–1.00  the box sinks behind the next section, which slides over it
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  // Pointer tilt, normalised to -1..1 across the viewport.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltX = useSpring(px, { stiffness: 90, damping: 18 });
  const tiltY = useSpring(py, { stiffness: 90, damping: 18 });
  const peek = useSpring(0, { stiffness: 200, damping: 14 });

  const rotateY = useTransform([progress, tiltX] as MotionValue<number>[], ([p, t]: number[]) => -38 + p * 40 + t * 14);
  const rotateX = useTransform([progress, tiltY] as MotionValue<number>[], ([p, t]: number[]) => -24 - p * 8 - t * 8);
  // hover peek only counts before the scroll story starts
  const peekNow = useTransform([progress, peek] as MotionValue<number>[], ([p, k]: number[]) => clamp01(k) * (1 - clamp01(p / 0.05)));
  const lidOpen = useTransform(progress, (p) => clamp01((p - 0.03) / 0.22) * (1 - clamp01((p - 0.8) / 0.08)));
  const lidAngle = useTransform([lidOpen, peekNow] as MotionValue<number>[], ([o, k]: number[]) => 90 + o * 118 + k * 32);
  const lidTransform = useMotionTemplate`translateZ(calc(var(--s) / -2)) rotateX(${lidAngle}deg)`;
  // the lid's underside, lit from inside the box
  const lidUnderTransform = useMotionTemplate`translateZ(calc(var(--s) / -2)) rotateX(${lidAngle}deg) translateZ(-1px) rotateY(180deg)`;
  const inner = useTransform([progress, peekNow] as MotionValue<number>[], ([p, k]: number[]) => Math.max(k, clamp01(p / 0.15) * (1 - clamp01((p - 0.82) / 0.06))));
  const beam = useTransform(progress, [0.1, 0.3, 0.74, 0.84], [0, 1, 1, 0]);
  const glow = useTransform([progress, peekNow] as MotionValue<number>[], ([p, k]: number[]) => Math.max(0.3 + clamp01(p / 0.25) * 0.7, 0.3 + k * 0.2) * (1 - clamp01((p - 0.82) / 0.15)));

  // the box takes the stage, then sinks behind the next section
  const boxScale = useTransform(progress, [0, 0.22], [1, desktop ? 1.6 : 1.35]);
  const boxY = useTransform(progress, [0.84, 1], ["0vh", "62vh"]);

  // the copy recedes into the background
  const textOpacity = useTransform(progress, [0, 0.16], [1, 0]);
  const textScale = useTransform(progress, [0, 0.2], [1, 0.82]);
  const textBlur = useTransform(progress, [0, 0.18], [0, 10]);
  const textFilter = useMotionTemplate`blur(${textBlur}px)`;
  const titleX = useTransform(progress, [0, 0.2], [0, -70]);
  const descX = useTransform(progress, [0, 0.2], [0, 70]);
  const buttonsY = useTransform(progress, [0, 0.2], [0, 50]);
  const textPointer = useTransform(textOpacity, (o) => (o < 0.3 ? "none" : "auto"));
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  return (
    <section id="home" ref={ref} className="relative h-[340vh] scroll-mt-0">
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        onPointerMove={(e) => {
          px.set((e.clientX / window.innerWidth) * 2 - 1);
          py.set((e.clientY / window.innerHeight) * 2 - 1);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        {/* warehouse floor + glow */}
        <div aria-hidden className="pointer-events-none absolute inset-x-[-50%] bottom-0 h-[42%] animate-floor-scroll floor-grid opacity-60" />
        <motion.div
          aria-hidden
          style={{ opacity: glow }}
          className="pointer-events-none absolute left-1/2 top-[44%] h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(246,207,69,0.26),rgba(255,174,63,0.08)_45%,transparent_70%)] blur-2xl lg:top-1/2"
        />

        {/* The box (and the tags it throws out), anchored at the centre */}
        <motion.div style={{ y: boxY }} className="absolute inset-x-0 top-[45%] z-10 h-0 lg:top-1/2">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 [--s:130px] sm:[--s:170px] lg:[--s:200px] xl:[--s:230px]" style={{ perspective: "1100px" }}>
            <motion.div style={{ scale: boxScale }} className="preserve-3d">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="preserve-3d relative"
              >
                {/* floor shadow */}
                <div aria-hidden className="absolute left-1/2 top-[calc(var(--s)*1.1)] h-[calc(var(--s)*0.35)] w-[calc(var(--s)*1.6)] -translate-x-1/2 rounded-[50%] bg-black/80 blur-xl" />
                <motion.div
                  className="preserve-3d relative h-[var(--s)] w-[var(--s)] cursor-pointer"
                  style={{ rotateX, rotateY }}
                  onPointerEnter={() => peek.set(1)}
                  onPointerLeave={() => peek.set(0)}
                >
                  <Box lidTransform={lidTransform} lidUnderTransform={lidUnderTransform} beam={beam} inner={inner} />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-0">
            {FLYING_TAGS.map((tag, i) => (
              <FlyingTag key={tag.code} tag={tag} index={i} progress={progress} />
            ))}
          </div>
        </motion.div>

        {/* Copy: title on the left, description on the right, buttons below */}
        <div className="pointer-events-none absolute inset-0 z-20 mx-auto max-w-7xl">
          <div className="absolute left-4 right-4 top-[84px] sm:left-6 sm:right-6 lg:left-8 lg:right-auto lg:top-1/2 lg:w-[32%] lg:-translate-y-1/2">
            <motion.div
              style={{ opacity: textOpacity, scale: textScale, filter: textFilter, x: titleX, pointerEvents: textPointer }}
              className="origin-left"
            >
              <Eyebrow>Asset management, unboxed</Eyebrow>
              <h1 className="font-display text-[1.75rem] font-semibold leading-[1.08] tracking-tight text-white sm:text-[2.6rem] lg:text-[2rem] xl:text-[2.6rem]">
                <span className="block">
                  Every{" "}
                  <span className="relative inline-flex text-primary">
                    <RotatingWord />
                  </span>
                </span>
                <span className="block">your company</span>
                <span className="block">owns.</span>
                <span className="mt-1 flex items-center gap-3">
                  One box.
                  <Slash className="h-[0.8em] w-auto text-amber" />
                </span>
              </h1>
            </motion.div>
          </div>

          <div className="absolute bottom-[136px] left-4 right-4 sm:left-6 sm:right-6 lg:bottom-auto lg:left-auto lg:right-8 lg:top-1/2 lg:w-[28%] lg:-translate-y-1/2">
            <motion.div style={{ opacity: textOpacity, scale: textScale, filter: textFilter, x: descX, pointerEvents: textPointer }} className="origin-right">
              <p className="text-[15px] leading-relaxed text-white/70 lg:text-base xl:text-lg">
                Cybox puts every asset in its place, by department, so you always know what you have and where it is.
                <span className="text-white"> Stop buying what you already own, and cut what&apos;s costing you&nbsp;money.</span>
              </p>
              <ul className="mt-6 hidden flex-col gap-2 font-mono text-xs uppercase tracking-wider text-white/45 lg:flex">
                <li>▸ Everything organized</li>
                <li>▸ No duplicate purchases</li>
                <li>▸ Lower asset costs</li>
              </ul>
            </motion.div>
          </div>

          <div className="absolute bottom-[60px] left-4 right-4 sm:left-6 sm:right-6 lg:bottom-[12vh] lg:left-1/2 lg:right-auto lg:-translate-x-1/2">
            <motion.div style={{ opacity: textOpacity, y: buttonsY, pointerEvents: textPointer }} className="flex gap-3">
              <Link
                href="/cadastro"
                className="group inline-flex h-12 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primary px-5 font-medium text-black shadow-[0_0_40px_-8px_rgba(246,207,69,0.7)] transition-[transform,background-color] hover:-translate-y-0.5 hover:bg-primary-hover sm:px-7 lg:flex-none"
              >
                Get started
                <FiArrowRight className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
              <form action={DoDemoLogin} className="flex flex-1 lg:flex-none">
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-black/30 px-5 text-white/90 backdrop-blur transition-colors hover:border-primary/60 hover:text-white sm:px-7"
                >
                  <FiEye aria-hidden /> Try the demo
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#how"
          style={{ opacity: hintOpacity }}
          className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45 lg:flex"
        >
          Scroll to open the box
          <span className="relative block h-6 w-px overflow-hidden bg-white/15">
            <motion.span
              className="absolute left-0 top-0 block h-3 w-px bg-primary"
              animate={reduceMotion ? undefined : { y: [-12, 24] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeIn" }}
            />
          </span>
        </motion.a>
      </div>
    </section>
  );
}

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={WORDS[index]}
          initial={{ y: "0.5em", opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-0.5em", opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
      <span className="ml-1 inline-block w-[0.08em] animate-blink self-stretch bg-primary/80 my-[0.12em]" aria-hidden />
    </>
  );
}

const FACE = "absolute inset-0 border border-primary/30 [backface-visibility:visible]";
const FACE_BG = "bg-[linear-gradient(150deg,#1d1d1d,#0b0b0b)]";

const INNER_WALL = "absolute inset-0 [backface-visibility:hidden] bg-[radial-gradient(ellipse_70%_60%_at_50%_35%,rgba(255,226,130,0.95),rgba(246,207,69,0.5)_55%,rgba(255,174,63,0.25))]";

function Box({ lidTransform, lidUnderTransform, beam, inner }: { lidTransform: MotionValue<string>; lidUnderTransform: MotionValue<string>; beam: MotionValue<number>; inner: MotionValue<number> }) {
  return (
    <>
      {/* something glowing inside the box: a warm orb sitting below the rim */}
      {[0, 60, 120].map((deg) => (
        <motion.div
          key={`orb-${deg}`}
          aria-hidden
          className="absolute left-[10%] top-[-6%] h-[80%] w-[80%] rounded-full bg-[radial-gradient(circle,rgba(255,248,215,1),rgba(255,220,110,0.85)_22%,rgba(246,207,69,0.3)_48%,transparent_68%)]"
          style={{ opacity: inner, transform: `rotateY(${deg}deg)` }}
        />
      ))}
      {/* its light on the inner walls */}
      <motion.div aria-hidden className={INNER_WALL} style={{ opacity: inner, transform: "translateZ(calc(var(--s) / -2 + 1px))" }} />
      <motion.div aria-hidden className={INNER_WALL} style={{ opacity: inner, transform: "rotateY(90deg) translateZ(calc(var(--s) / -2 + 1px))" }} />
      <motion.div aria-hidden className={INNER_WALL} style={{ opacity: inner, transform: "rotateY(-90deg) translateZ(calc(var(--s) / -2 + 1px))" }} />
      {/* …and on the underside of the lid, strongest near its opening edge */}
      <motion.div
        aria-hidden
        className="absolute inset-0 origin-top [backface-visibility:hidden] bg-[linear-gradient(to_top,rgba(255,214,102,0.7),rgba(246,207,69,0.15)_60%,transparent)]"
        style={{ opacity: inner, transform: lidUnderTransform }}
      />

      {/* glowing floor inside the box */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(246,207,69,0.9),rgba(255,174,63,0.35)_45%,transparent_75%)]"
        style={{ transform: "rotateX(90deg) translateZ(calc(var(--s) / -2 + 2px))" }}
      />

      {/* light beams pouring out once the lid opens */}
      {[0, 90].map((deg) => (
        <motion.div
          key={deg}
          aria-hidden
          className="absolute left-0 h-[calc(var(--s)*1.8)] w-full bg-[linear-gradient(to_top,rgba(246,207,69,0.55),rgba(246,207,69,0.08)_55%,transparent)]"
          style={{ opacity: beam, bottom: "50%", transform: `rotateY(${deg}deg)` }}
        />
      ))}

      {/* back */}
      <div className={`${FACE} ${FACE_BG}`} style={{ transform: "rotateY(180deg) translateZ(calc(var(--s) / 2))" }} />
      {/* left */}
      <div className={`${FACE} ${FACE_BG}`} style={{ transform: "rotateY(-90deg) translateZ(calc(var(--s) / 2))" }} />
      {/* bottom */}
      <div className={`${FACE} bg-[#080808]`} style={{ transform: "rotateX(-90deg) translateZ(calc(var(--s) / 2))" }} />

      {/* front: shipping label */}
      <div className={`${FACE} ${FACE_BG} flex flex-col justify-between p-[8%]`} style={{ transform: "translateZ(calc(var(--s) / 2))" }}>
        <div className="flex items-start justify-between">
          <Image src="/brand/cybox-wordmark.png" alt="" width={900} height={234} className="h-auto w-[52%]" />
          <span className="font-mono text-[calc(var(--s)*0.045)] text-white/40">No. 0001</span>
        </div>
        <div className="rounded-sm bg-[#f3efe4] p-[6%] font-mono text-[calc(var(--s)*0.048)] leading-tight text-black">
          <p className="font-bold">DEPT. 04 · OPERATIONS</p>
          <p className="opacity-70">142 assets · $1.28M</p>
          <div className="barcode mt-[6%] h-[calc(var(--s)*0.1)] text-black" />
        </div>
        <p className="font-mono text-[calc(var(--s)*0.05)] font-bold tracking-widest text-amber">FRAGILE · ASSETS INSIDE</p>
      </div>

      {/* right: this side up */}
      <div
        className={`${FACE} bg-[linear-gradient(150deg,#161616,#070707)] flex flex-col items-center justify-center gap-[6%]`}
        style={{ transform: "rotateY(90deg) translateZ(calc(var(--s) / 2))" }}
      >
        <div className="flex gap-[10%] text-primary">
          <FiArrowUp className="h-[calc(var(--s)*0.22)] w-[calc(var(--s)*0.22)]" strokeWidth={2.5} />
          <FiArrowUp className="h-[calc(var(--s)*0.22)] w-[calc(var(--s)*0.22)]" strokeWidth={2.5} />
        </div>
        <p className="font-mono text-[calc(var(--s)*0.055)] font-bold tracking-[0.2em] text-primary">THIS SIDE UP</p>
        <Slash className="mt-[4%] h-[calc(var(--s)*0.18)] w-auto text-amber" />
      </div>

      {/* lid, hinged on its back edge */}
      <motion.div
        className={`${FACE} ${FACE_BG} origin-top`}
        style={{ transform: lidTransform }}
      >
        <div className="absolute inset-y-0 left-1/2 flex w-[26%] -translate-x-1/2 items-center justify-center bg-primary/80">
          <span className="rotate-90 whitespace-nowrap font-mono text-[calc(var(--s)*0.045)] font-bold tracking-[0.3em] text-black">
            OPEN HERE
          </span>
        </div>
      </motion.div>
    </>
  );
}

function FlyingTag({ tag, index, progress }: { tag: (typeof FLYING_TAGS)[number]; index: number; progress: MotionValue<number> }) {
  const start = 0.2 + index * 0.04;
  // out of the box, hold, then back into it
  const t = useTransform(progress, [start, start + 0.18, 0.66 + index * 0.012, 0.8], [0, 1, 1, 0], { clamp: true });
  // they leave from, and go back into, the box's opening (just above its centre)
  const x = useTransform(t, (v) => `${tag.x * v}vw`);
  const y = useTransform(t, (v) => `${-12 * (1 - v) + tag.y * v - Math.sin(v * Math.PI) * 4}vh`);
  const rotate = useTransform(t, (v) => tag.r * v);
  const scale = useTransform(t, [0, 1], [0.25, 1]);
  const opacity = useTransform(t, [0, 0.12, 1], [0, 1, 1]);

  return (
    <motion.div className="absolute left-0 top-0" style={{ x, y, rotate, scale, opacity }}>
      <div className="-translate-x-1/2 -translate-y-1/2">
        <AssetTag tag={tag} className="origin-center scale-[0.75] sm:scale-100 lg:scale-[1.3]" />
      </div>
    </motion.div>
  );
}
