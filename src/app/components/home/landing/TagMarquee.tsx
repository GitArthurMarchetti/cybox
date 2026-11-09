'use client'

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { AssetTag, type AssetTagData } from "./shared";

const ROW_A: AssetTagData[] = [
  { code: "CYB-0142", name: "MacBook Pro 14\"", dept: "IT" },
  { code: "CYB-0388", name: "Forklift FX-2", dept: "Warehouse" },
  { code: "CYB-0051", name: "Standing desk", dept: "Office" },
  { code: "CYB-0907", name: "Dell R750 server", dept: "IT" },
  { code: "CYB-0233", name: "Ford Transit", dept: "Logistics" },
  { code: "CYB-0610", name: "Espresso machine", dept: "Kitchen" },
  { code: "CYB-0077", name: "Laser cutter", dept: "Workshop" },
];

const ROW_B: AssetTagData[] = [
  { code: "CYB-1204", name: "Conference TV 75\"", dept: "Meeting rooms" },
  { code: "CYB-0815", name: "Pallet jack", dept: "Warehouse" },
  { code: "CYB-0462", name: "iPad Air", dept: "Sales" },
  { code: "CYB-0999", name: "Air compressor", dept: "Maintenance" },
  { code: "CYB-0318", name: "Ergonomic chair", dept: "Office" },
  { code: "CYB-0720", name: "3D printer", dept: "R&D" },
  { code: "CYB-0156", name: "Network switch", dept: "IT" },
];

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** A row that drifts on its own and speeds up (or reverses) with scroll velocity. */
function Row({ tags, baseVelocity }: { tags: AssetTagData[]; baseVelocity: number }) {
  const reduceMotion = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return;
    let move = direction.current * (baseVelocity / 2) * (delta / 1000);
    if (factor.get() < 0) direction.current = -1;
    else if (factor.get() > 0) direction.current = 1;
    move += direction.current * move * factor.get();
    base.set(base.get() + move);
  });

  return (
    <div className="flex overflow-hidden">
      <motion.div className="flex gap-4 pr-4" style={{ x }}>
        {[...tags, ...tags, ...tags, ...tags].map((tag, i) => (
          <AssetTag key={`${tag.code}-${i}`} tag={tag} />
        ))}
      </motion.div>
    </div>
  );
}

export function TagMarquee() {
  return (
    <section
      aria-label="Example asset tags"
      // pulled up over the end of the hero: the hero's box sinks behind this panel
      className="relative z-20 -mt-[30vh] flex min-h-[34vh] flex-col justify-center overflow-hidden rounded-t-[32px] border-t border-white/10 bg-ink py-8 shadow-[0_-40px_80px_rgba(0,0,0,0.75)] sm:rounded-t-[48px]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex flex-col gap-4">
        <Row tags={ROW_A} baseVelocity={-2} />
        <Row tags={ROW_B} baseVelocity={2} />
      </div>
    </section>
  );
}
