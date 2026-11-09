'use client'

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * Fixed background shared by the whole landing page: a faint dot grid,
 * a warm spotlight that trails the cursor, and film grain on top.
 */
export function Backdrop() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 120, damping: 30, mass: 0.6 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}px ${sy}px, rgba(246, 207, 69, 0.07), transparent 70%)`;

  useEffect(() => {
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-ink">
      <div className="bg-dots absolute inset-0" />
      <motion.div className="absolute inset-0" style={{ background: spotlight }} />
      <div className="grain absolute inset-0" />
    </div>
  );
}
