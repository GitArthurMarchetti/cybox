'use client'

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { FiBox, FiGrid, FiLock, FiUsers } from "react-icons/fi";
import type { IconType } from "react-icons";
import { Eyebrow, Reveal } from "./shared";
import { RoomsMock } from "./tour/RoomsMock";
import { RolesMock } from "./tour/RolesMock";
import { AssetsMock } from "./tour/AssetsMock";

type ChapterId = "rooms" | "people" | "assets";

const CHAPTERS: { id: ChapterId; n: string; icon: IconType; title: string; text: string; url: string; hint: string }[] = [
  {
    id: "rooms",
    n: "01",
    icon: FiGrid,
    title: "Rooms",
    text: "Every department gets its own room, with a photo, a location and its total value. Create one, or join a teammate's with an invite code.",
    url: "app.cybox.com/rooms",
    hint: "Click “Join with code”, or open a room",
  },
  {
    id: "people",
    n: "02",
    icon: FiUsers,
    title: "People & roles",
    text: "Owners, admins and members. Everyone sees the same numbers, but only the right people can change the room or delete it.",
    url: "app.cybox.com/rooms/operations/members",
    hint: "Switch between Owner, Admin and Member",
  },
  {
    id: "assets",
    n: "03",
    icon: FiBox,
    title: "Categories & assets",
    text: "Categories carry their own depreciation rate. Every asset shows what it cost, what it's worth today and how much value is left.",
    url: "app.cybox.com/rooms/operations/laptops",
    hint: "Pick a category, sort it, open an asset",
  },
];

const AUTO_MS = 9000;

export function ProductTour() {
  const [active, setActive] = useState<ChapterId>("rooms");
  const [auto, setAuto] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { amount: 0.4 });
  const chapter = CHAPTERS.find((c) => c.id === active)!;
  const running = auto && inView;

  const go = (id: ChapterId) => {
    setActive(id);
    setAuto(false);
  };
  const next = () => {
    const i = CHAPTERS.findIndex((c) => c.id === active);
    setActive(CHAPTERS[(i + 1) % CHAPTERS.length].id);
  };

  return (
    <section id="product" className="relative scroll-mt-16 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow index="03">The product</Eyebrow>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            This is Cybox.
            <span className="block text-white/40">Go ahead, click around.</span>
          </h2>
          <p className="mt-5 text-white/65">
            Rooms for your departments, roles for your people, and a table where every asset knows what it&apos;s worth.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          {/* chapters */}
          <div className="lg:col-span-4">
            <ol className="no-scrollbar flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0" role="tablist" aria-label="Product tour">
              {CHAPTERS.map((c) => {
                const isActive = c.id === active;
                const Icon = c.icon;
                return (
                  <li key={c.id} role="presentation" className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => go(c.id)}
                      className={`relative w-full overflow-hidden rounded-2xl border text-left transition-colors lg:p-5 ${isActive ? "border-primary/40 bg-white/[0.03]" : "border-white/10 hover:border-white/20 lg:border-transparent"} px-4 py-2.5`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${isActive ? "bg-primary text-black" : "bg-white/5 text-white/50"}`}>
                          <Icon size={15} aria-hidden />
                        </span>
                        <span className={`whitespace-nowrap font-semibold transition-colors lg:text-lg ${isActive ? "text-white" : "text-white/50"}`}>{c.title}</span>
                        <span className="ml-auto hidden font-mono text-xs text-white/30 lg:block">{c.n}</span>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ height: isActive ? "auto" : 0, opacity: isActive ? 1 : 0 }}
                        className="hidden overflow-hidden lg:block"
                      >
                        <p className="pl-11 pt-3 text-sm leading-relaxed text-white/60">{c.text}</p>
                      </motion.div>
                      {/* auto-advance progress */}
                      {isActive && running && (
                        <motion.span
                          key={`${c.id}-progress`}
                          className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-primary"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                          onAnimationComplete={next}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ol>
            {/* mobile description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm leading-relaxed text-white/60 lg:hidden"
              >
                {chapter.text}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* app frame */}
          <div className="lg:col-span-8">
            <div
              ref={frameRef}
              onPointerDown={() => setAuto(false)}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F0F0F]"
            >
              <div className="flex items-center gap-3 border-b border-white/10 bg-[#141414] px-4 py-2.5">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-black/50 px-3 py-1 font-mono text-xs text-white/60">
                  <FiLock size={10} className="shrink-0" aria-hidden />
                  <AnimatePresence mode="wait">
                    <motion.span key={chapter.url} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="truncate">
                      {chapter.url}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative min-h-[420px] sm:h-[500px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    className="relative h-full"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {active === "rooms" && <RoomsMock onOpenRoom={() => go("assets")} />}
                    {active === "people" && <RolesMock />}
                    {active === "assets" && <AssetsMock />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-2 font-mono text-xs text-white/55">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              {chapter.hint}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
