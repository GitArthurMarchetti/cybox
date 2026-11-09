'use client'

import { useEffect, useId, useMemo, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { FiMonitor, FiTruck, FiTool, FiHome } from "react-icons/fi";
import { MdOutlineChair } from "react-icons/md";
import { Eyebrow, Reveal } from "./shared";

// Same straight-line rule the app uses (src/lib/depreciacao-calculo.ts):
// value = initial × (1 − annualRate × years), never below zero.
const valueAt = (initial: number, rate: number, years: number) => Math.max(0, initial * (1 - (rate / 100) * years));

const PRESETS = [
  { id: "laptop", label: "Laptop", rate: 20, value: 2400, icon: FiMonitor },
  { id: "vehicle", label: "Vehicle", rate: 20, value: 38000, icon: FiTruck },
  { id: "furniture", label: "Furniture", rate: 10, value: 1200, icon: MdOutlineChair },
  { id: "machinery", label: "Machinery", rate: 10, value: 85000, icon: FiTool },
  { id: "building", label: "Building", rate: 4, value: 750000, icon: FiHome },
];

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => usd(v));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [mv, value]);
  return <motion.span>{text}</motion.span>;
}

export function DepreciationPlayground() {
  const [presetId, setPresetId] = useState("laptop");
  const preset = PRESETS.find((p) => p.id === presetId)!;
  const [initial, setInitial] = useState(preset.value);
  const [rate, setRate] = useState(preset.rate);
  const [years, setYears] = useState(2);
  const ids = { value: useId(), rate: useId(), years: useId() };

  const lifespan = 100 / rate; // years until fully depreciated
  const maxYears = Math.min(25, Math.max(5, Math.ceil(lifespan)));
  const clampedYears = Math.min(years, maxYears);
  const now = valueAt(initial, rate, clampedYears);
  const lost = initial - now;
  const valueMax = Math.max(10000, preset.value * 3);

  const chart = useMemo(() => {
    const W = 560;
    const H = 220;
    const xFor = (y: number) => (y / maxYears) * W;
    const yFor = (v: number) => H - (v / initial) * (H - 16);
    const line = `M0 ${yFor(initial)} L${xFor(Math.min(lifespan, maxYears))} ${yFor(valueAt(initial, rate, Math.min(lifespan, maxYears)))} L${W} ${yFor(valueAt(initial, rate, maxYears))}`;
    return {
      W,
      H,
      line,
      area: `${line} L${W} ${H} L0 ${H} Z`,
      mx: xFor(clampedYears),
      my: yFor(now),
      ticks: Array.from({ length: maxYears + 1 }, (_, i) => i).filter((i) => maxYears <= 10 || i % 5 === 0),
      xFor,
    };
  }, [initial, rate, maxYears, lifespan, clampedYears, now]);

  const pick = (id: string) => {
    const p = PRESETS.find((x) => x.id === id)!;
    setPresetId(id);
    setInitial(p.value);
    setRate(p.rate);
  };

  const fill = (v: number, min: number, max: number) => ({ "--fill": `${((v - min) / (max - min)) * 100}%` }) as React.CSSProperties;

  return (
    <section id="playground" className="relative scroll-mt-16 py-24 lg:py-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow index="02">Depreciation playground</Eyebrow>
          <h2 className="font-display text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            Watch value melt.
            <span className="block text-white/40">Without opening a spreadsheet.</span>
          </h2>
          <p className="mt-5 text-white/65">
            This is the exact math Cybox runs on every asset, every month. Go on, drag something.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div>

            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* controls */}
              <div className="flex flex-col gap-7 border-white/10 pb-10 lg:col-span-2 lg:border-r lg:pb-0 lg:pr-12">
                <div>
                  <p className="mb-3 font-mono text-xs uppercase tracking-wider text-white/40">Asset type</p>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => pick(id)}
                        aria-pressed={presetId === id}
                        className={`relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors ${presetId === id ? "text-black" : "text-white/70 hover:text-white bg-white/5"}`}
                      >
                        {presetId === id && (
                          <motion.span layoutId="preset-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                        )}
                        <Icon className="relative" aria-hidden />
                        <span className="relative">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor={ids.value} className="mb-3 flex justify-between font-mono text-xs uppercase tracking-wider text-white/40">
                    Purchase value <span className="text-white">{usd(initial)}</span>
                  </label>
                  <input
                    id={ids.value}
                    type="range"
                    className="range"
                    min={500}
                    max={valueMax}
                    step={100}
                    value={Math.min(initial, valueMax)}
                    onChange={(e) => setInitial(Number(e.target.value))}
                    style={fill(Math.min(initial, valueMax), 500, valueMax)}
                  />
                </div>

                <div>
                  <label htmlFor={ids.rate} className="mb-3 flex justify-between font-mono text-xs uppercase tracking-wider text-white/40">
                    Annual rate <span className="text-white">{rate}% / year</span>
                  </label>
                  <input
                    id={ids.rate}
                    type="range"
                    className="range"
                    min={1}
                    max={50}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    style={fill(rate, 1, 50)}
                  />
                </div>

                <div>
                  <label htmlFor={ids.years} className="mb-3 flex justify-between font-mono text-xs uppercase tracking-wider text-white/40">
                    Time since purchase <span className="text-white">{clampedYears} {clampedYears === 1 ? "year" : "years"}</span>
                  </label>
                  <input
                    id={ids.years}
                    type="range"
                    className="range"
                    min={0}
                    max={maxYears}
                    value={clampedYears}
                    onChange={(e) => setYears(Number(e.target.value))}
                    style={fill(clampedYears, 0, maxYears)}
                  />
                </div>

                <p className="rounded-xl border border-dashed border-white/10 p-4 font-mono text-xs leading-relaxed text-white/50">
                  <span className="text-primary">value</span> = {usd(initial)} × (1 − {rate}% × {clampedYears})
                  <br />
                  <span className="text-white/30">fully depreciated after {Number.isInteger(lifespan) ? lifespan : lifespan.toFixed(1)} years</span>
                </p>
              </div>

              {/* output */}
              <div className="flex flex-col gap-6 border-t border-white/10 pt-10 lg:col-span-3 lg:border-t-0 lg:pl-12 lg:pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40">Worth today</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-primary sm:text-4xl">
                      <AnimatedNumber value={now} />
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40">Value lost</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-white/80 sm:text-4xl">
                      <AnimatedNumber value={lost} />
                    </p>
                    <p className="mt-1 font-mono text-xs text-amber">−{initial ? Math.round((lost / initial) * 100) : 0}%</p>
                  </div>
                </div>

                <div className="relative">
                  <svg viewBox={`0 -10 ${chart.W} ${chart.H + 40}`} className="h-auto w-full overflow-visible" role="img" aria-label={`Value falls from ${usd(initial)} to ${usd(now)} after ${clampedYears} years`}>
                    <defs>
                      <linearGradient id="dep-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#F6CF45" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#F6CF45" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0.25, 0.5, 0.75, 1].map((f) => (
                      <line key={f} x1={0} x2={chart.W} y1={chart.H - f * (chart.H - 16)} y2={chart.H - f * (chart.H - 16)} stroke="white" strokeOpacity={0.06} />
                    ))}
                    <motion.path d={chart.area} fill="url(#dep-area)" initial={false} animate={{ d: chart.area }} transition={{ duration: 0.5 }} />
                    <motion.path d={chart.line} fill="none" stroke="#F6CF45" strokeWidth={2.5} initial={false} animate={{ d: chart.line }} transition={{ duration: 0.5 }} />
                    {/* "you are here" marker */}
                    <motion.line initial={false} animate={{ x1: chart.mx, x2: chart.mx }} y1={0} y2={chart.H} stroke="#FFAE3F" strokeDasharray="3 4" strokeOpacity={0.7} />
                    <motion.circle initial={false} animate={{ cx: chart.mx, cy: chart.my }} r={7} fill="#050505" stroke="#FFAE3F" strokeWidth={3} transition={{ type: "spring", stiffness: 300, damping: 26 }} />
                    {chart.ticks.map((t) => (
                      <text key={t} x={chart.xFor(t)} y={chart.H + 22} textAnchor="middle" className="fill-white/35 font-mono text-xs">
                        {t}y
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
