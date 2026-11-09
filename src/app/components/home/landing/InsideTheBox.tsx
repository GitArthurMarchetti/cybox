'use client'

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Eyebrow } from "./shared";

const STEPS = [
  {
    n: "01",
    title: "A box for every department",
    text: "Create a department, drop in a photo and location, and share an invite code. Your team joins in seconds with the right role: owner, admin or viewer.",
    chip: "DEPARTMENT · Operations",
  },
  {
    n: "02",
    title: "Smaller boxes for categories",
    text: "Group assets into categories like laptops, furniture or vehicles. Each category carries its own annual depreciation rate, so you set it once and forget it.",
    chip: "3 CATEGORIES · own rates",
  },
  {
    n: "03",
    title: "Every asset, tagged and valued",
    text: "Log each item with its purchase value and date. Cybox recalculates what it's worth every month and shows the whole department's value at a glance.",
    chip: "142 ASSETS · $1.28M today",
  },
];

// Isometric projection: x runs down-right, y runs down-left, z goes up.
const OX = 240;
const OY = 160;
const C = Math.cos(Math.PI / 6);
const S = 0.5;
const iso = (x: number, y: number, z: number) => [OX + (x - y) * C, OY + (x + y) * S - z] as const;
const pts = (list: (readonly [number, number, number])[]) => list.map((p) => iso(...p).join(",")).join(" ");

const DEPT = 240;
const DEPT_H = 150;

const CATEGORIES = [
  { x: 18, y: 18, size: 96, h: 64, top: "#F6CF45", left: "#C9A632", right: "#8E7420", label: "Laptops · 20%/yr", lx: 240, ly: 80 },
  { x: 128, y: 18, size: 96, h: 44, top: "#FFAE3F", left: "#D08A2C", right: "#93601C", label: "Vehicles · 20%/yr", lx: 400, ly: 140 },
  { x: 18, y: 128, size: 96, h: 84, top: "#EDE8DA", left: "#BDB8AA", right: "#85817A", label: "Furniture · 10%/yr", lx: 82, ly: 100 },
];

export function InsideTheBox() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const [step, setStep] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStep(v < 0.34 ? 0 : v < 0.67 ? 1 : 2);
  });

  return (
    <section id="how" ref={ref} className="relative h-[340vh] scroll-mt-0">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-6 px-4 pt-16 sm:px-6 md:grid-cols-2 md:gap-12 lg:px-8">
          <div className="order-2 md:order-1">
            <Eyebrow index="01">Inside the box</Eyebrow>
            <h2 className="font-display text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              Boxes inside boxes.
              <span className="block text-white/40">Order, finally.</span>
            </h2>

            {/* Desktop: full list with the active step lit up */}
            <ol className="mt-10 hidden flex-col gap-2 md:flex">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className={`relative rounded-2xl border p-5 transition-all duration-500 ${i === step ? "border-primary/30 bg-white/[0.03]" : "border-transparent opacity-40"}`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`font-mono text-sm ${i === step ? "text-primary" : "text-white/50"}`}>{s.n}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white lg:text-xl">{s.title}</h3>
                      <motion.p
                        initial={false}
                        animate={{ height: i === step ? "auto" : 0, opacity: i === step ? 1 : 0 }}
                        className="overflow-hidden text-sm leading-relaxed text-white/65 lg:text-base"
                      >
                        <span className="block pt-2">{s.text}</span>
                      </motion.p>
                    </div>
                  </div>
                  {i === step && (
                    <motion.span layoutId="step-bar" className="absolute bottom-4 left-0 top-4 w-[3px] rounded-full bg-primary" />
                  )}
                </li>
              ))}
            </ol>

            {/* Mobile: only the active step */}
            <div className="relative mt-6 min-h-[150px] md:hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="font-mono text-sm text-primary">{STEPS[step].n} / 03</p>
                  <h3 className="mt-1 text-lg font-semibold">{STEPS[step].title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{STEPS[step].text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="relative order-1 md:order-2">
            <IsoScene progress={progress} />
            <div className="absolute left-1/2 top-0 -translate-x-1/2 md:top-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="block whitespace-nowrap rounded-full border border-primary/30 bg-black/70 px-4 py-1.5 font-mono text-xs tracking-wider text-primary backdrop-blur"
                >
                  {STEPS[step].chip}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* progress rail */}
        <div className="absolute right-4 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-white/10 lg:block">
          <motion.div className="w-px origin-top bg-primary" style={{ height: "100%", scaleY: progress }} />
        </div>
      </div>
    </section>
  );
}

function IsoScene({ progress }: { progress: MotionValue<number> }) {
  const draw = useTransform(progress, [0.02, 0.3], [0, 1]);
  const floor = useTransform(progress, [0.05, 0.3], [0, 1]);

  const c = (x: number, y: number, z: number) => [x, y, z] as const;
  const D = DEPT;
  const H = DEPT_H;
  const front = [
    // visible edges of the department box (wireframe)
    [c(0, 0, H), c(D, 0, H), c(D, D, H), c(0, D, H), c(0, 0, H)],
    [c(D, 0, 0), c(D, 0, H)],
    [c(0, D, 0), c(0, D, H)],
    [c(D, D, 0), c(D, D, H)],
    [c(D, 0, 0), c(D, D, 0), c(0, D, 0)],
  ];
  const hidden = [
    [c(0, 0, 0), c(D, 0, 0)],
    [c(0, 0, 0), c(0, D, 0)],
    [c(0, 0, 0), c(0, 0, H)],
  ];
  const toPath = (line: (readonly [number, number, number])[]) =>
    line.map((p, i) => `${i ? "L" : "M"}${iso(...p).join(" ")}`).join(" ");

  return (
    <svg viewBox="0 0 480 420" className="mx-auto h-auto w-full max-w-[520px] overflow-visible" role="img" aria-label="A department box holding category boxes and assets">
      <defs>
        <radialGradient id="iso-floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6CF45" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F6CF45" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* department floor */}
      <motion.polygon points={pts([c(0, 0, 0), c(D, 0, 0), c(D, D, 0), c(0, D, 0)])} fill="url(#iso-floor)" style={{ opacity: floor }} />
      {hidden.map((l, i) => (
        <motion.path key={`h${i}`} d={toPath(l)} stroke="#F6CF45" strokeOpacity={0.25} strokeWidth={1.2} strokeDasharray="4 6" fill="none" style={{ pathLength: draw }} />
      ))}

      {/* empty slot hinting you can add more */}
      <motion.polygon
        points={pts([c(128, 128, 0), c(224, 128, 0), c(224, 224, 0), c(128, 224, 0)])}
        fill="none"
        stroke="#F6CF45"
        strokeOpacity={0.35}
        strokeDasharray="5 5"
        style={{ opacity: useTransform(progress, [0.55, 0.65], [0, 1]) }}
      />

      {CATEGORIES.map((cat, i) => (
        <CategoryBox key={cat.label} cat={cat} index={i} progress={progress} />
      ))}

      {front.map((l, i) => (
        <motion.path key={`f${i}`} d={toPath(l)} stroke="#F6CF45" strokeWidth={1.6} fill="none" strokeLinejoin="round" style={{ pathLength: draw }} />
      ))}

      {CATEGORIES.map((cat, i) => (
        <CategoryLabel key={cat.label} cat={cat} index={i} progress={progress} />
      ))}
    </svg>
  );
}

function CategoryBox({ cat, index, progress }: { cat: (typeof CATEGORIES)[number]; index: number; progress: MotionValue<number> }) {
  const start = 0.36 + index * 0.07;
  const grow = useTransform(progress, [start, start + 0.14], [0, 1], { clamp: true });
  const h = useTransform(grow, (g) => Math.max(0.001, cat.h * g));
  const opacity = useTransform(grow, [0, 0.1], [0, 1]);

  const { x, y, size } = cat;
  const x1 = x + size;
  const y1 = y + size;
  const top = useTransform(h, (z) => pts([[x, y, z], [x1, y, z], [x1, y1, z], [x, y1, z]]));
  const right = useTransform(h, (z) => pts([[x1, y, 0], [x1, y1, 0], [x1, y1, z], [x1, y, z]]));
  const left = useTransform(h, (z) => pts([[x, y1, 0], [x1, y1, 0], [x1, y1, z], [x, y1, z]]));


  return (
    <motion.g style={{ opacity }}>
      <motion.polygon points={left} fill={cat.left} />
      <motion.polygon points={right} fill={cat.right} />
      <motion.polygon points={top} fill={cat.top} />
      {/* assets: little boxes popping onto the category */}
      {[0, 1, 2].map((a) => (
        <AssetCube key={a} cat={cat} slot={a} h={h} progress={progress} delay={0.7 + index * 0.05 + a * 0.03} />
      ))}
    </motion.g>
  );
}

/** Callout: a leader line from the category's top face to a pill label. */
function CategoryLabel({ cat, index, progress }: { cat: (typeof CATEGORIES)[number]; index: number; progress: MotionValue<number> }) {
  const start = 0.36 + index * 0.07;
  const grow = useTransform(progress, [start, start + 0.14], [0, 1], { clamp: true });
  const cx = cat.x + cat.size / 2;
  const cy = cat.y + cat.size / 2;
  const [ax] = iso(cx, cy, 0);
  const anchorY = useTransform(grow, (g) => iso(cx, cy, cat.h * g)[1]);
  const opacity = useTransform(progress, [start + 0.1, start + 0.16], [0, 1]);
  const w = cat.label.length * 7 + 22;

  return (
    <motion.g style={{ opacity }}>
      <motion.line x1={ax} y1={anchorY} x2={cat.lx} y2={cat.ly + 12} stroke="#F6CF45" strokeOpacity={0.6} strokeWidth={1} />
      <motion.circle cx={ax} cy={anchorY} r={3} fill="#F6CF45" />
      <rect x={cat.lx - w / 2} y={cat.ly - 12} width={w} height={24} rx={12} fill="#0b0b0b" stroke="#F6CF45" strokeOpacity={0.45} />
      <text x={cat.lx} y={cat.ly + 4} textAnchor="middle" className="fill-white font-mono text-[11.5px]">
        {cat.label}
      </text>
    </motion.g>
  );
}

function AssetCube({ cat, slot, h, progress, delay }: { cat: (typeof CATEGORIES)[number]; slot: number; h: MotionValue<number>; progress: MotionValue<number>; delay: number }) {
  const pop = useTransform(progress, [delay, delay + 0.06], [0, 1], { clamp: true });
  const s = 18;
  const positions = [
    [cat.x + 14, cat.y + 14],
    [cat.x + 48, cat.y + 22],
    [cat.x + 22, cat.y + 52],
  ];
  const [ax, ay] = positions[slot];
  const geom = useTransform([h, pop] as MotionValue<number>[], ([z0, p]: number[]) => {
    const drop = (1 - p) * 40;
    const b = z0 + drop;
    const t = b + s * p;
    return {
      top: pts([[ax, ay, t], [ax + s, ay, t], [ax + s, ay + s, t], [ax, ay + s, t]]),
      right: pts([[ax + s, ay, b], [ax + s, ay + s, b], [ax + s, ay + s, t], [ax + s, ay, t]]),
      left: pts([[ax, ay + s, b], [ax + s, ay + s, b], [ax + s, ay + s, t], [ax, ay + s, t]]),
    };
  });
  const top = useTransform(geom, (g) => g.top);
  const right = useTransform(geom, (g) => g.right);
  const left = useTransform(geom, (g) => g.left);

  return (
    <motion.g style={{ opacity: pop }}>
      <motion.polygon points={left} fill="#2a2a2a" stroke="#000" strokeOpacity={0.4} />
      <motion.polygon points={right} fill="#1a1a1a" stroke="#000" strokeOpacity={0.4} />
      <motion.polygon points={top} fill="#3a3a3a" stroke="#F6CF45" strokeOpacity={0.6} strokeWidth={0.8} />
    </motion.g>
  );
}
