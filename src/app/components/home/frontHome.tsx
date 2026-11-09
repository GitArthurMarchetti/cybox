'use client'

import { MotionConfig, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { FaChevronUp } from "react-icons/fa6";
import Navbar from "@/app/components/Navigation/navbar";
import { HomeFooter } from "./HomeFooter";
import { Backdrop } from "./landing/Backdrop";
import { Hero } from "./landing/Hero";
import { TagMarquee } from "./landing/TagMarquee";
import { InsideTheBox } from "./landing/InsideTheBox";
import { DepreciationPlayground } from "./landing/DepreciationPlayground";
import { ProductTour } from "./landing/ProductTour";
import { Pricing } from "./landing/Pricing";
import { FinalCTA } from "./landing/FinalCTA";

export default function FrontHome() {
  const { scrollY } = useScroll();
  const [showTop, setShowTop] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShowTop(y > 800));

  return (
    <MotionConfig reducedMotion="user">
      <Backdrop />
      <Navbar />

      <div className="relative w-full overflow-x-clip">
        <Hero />
        <TagMarquee />
        <InsideTheBox />
        <DepreciationPlayground />
        <ProductTour />
        <Pricing />
        <FinalCTA />
      </div>

      <HomeFooter />

      <motion.a
        href="#home"
        aria-label="Back to top"
        title="Back to top"
        initial={false}
        animate={{ opacity: showTop ? 1 : 0, y: showTop ? 0 : 16, pointerEvents: showTop ? "auto" : "none" }}
        className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/70 text-primary backdrop-blur transition-colors hover:bg-primary hover:text-black"
      >
        <FaChevronUp size={16} aria-hidden />
      </motion.a>
    </MotionConfig>
  );
}
