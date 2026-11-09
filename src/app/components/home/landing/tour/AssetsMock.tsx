'use client'

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronRight, FiPlus, FiSearch, FiTrendingDown, FiX } from "react-icons/fi";
import { CATEGORIES, money, percentLeft, valueToday, valueTone, type Asset } from "./data";

function DetailPanel({ asset, rate, category, onClose }: { asset: Asset; rate: number; category: string; onClose: () => void }) {
  const pct = percentLeft(asset, rate);
  const tone = valueTone(pct);
  const now = valueToday(asset, rate);
  const life = 100 / rate;

  // value line: purchase → today (solid), today → zero (projection, dashed)
  const W = 240;
  const H = 90;
  const x = (y: number) => (y / life) * W;
  const y = (v: number) => H - (v / asset.price) * H;

  return (
    <motion.aside
      className="no-scrollbar absolute inset-y-0 right-0 z-10 flex w-full flex-col gap-4 overflow-y-auto border-l border-white/10 bg-[#161616] p-5 sm:w-[300px]"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
    >
      <div className="flex items-start gap-3">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-white ${tone.bg}`}>{asset.name.charAt(0)}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-white">{asset.name}</p>
          <p className="font-mono text-xs text-[#9A9696]">
            {asset.code} · {category}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close asset" className="rounded-md p-1 text-white/50 hover:bg-white/10 hover:text-white">
          <FiX size={16} />
        </button>
      </div>

      <div className="rounded-xl bg-[#1F1F1F] p-3">
        <p className={`text-xl font-bold ${tone.text}`}>{pct}% of value</p>
        <p className="text-xs text-[#9A9696]">Depreciation: {100 - pct}% · {rate}% / year</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-[#9A9696]">Purchase price</p>
            <p className="text-white">{money(asset.price)}</p>
          </div>
          <div>
            <p className="text-[#9A9696]">Value today</p>
            <p className="font-semibold text-primary">{money(now)}</p>
          </div>
          <div>
            <p className="text-[#9A9696]">Acquired</p>
            <p className="text-white">{asset.acquired}</p>
          </div>
          <div>
            <p className="text-[#9A9696]">Location</p>
            <p className="text-white">{asset.location}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#9A9696]">
          Specs: <span className="text-white">{asset.specs}</span>
        </p>
      </div>

      <div className="rounded-xl bg-[#1F1F1F] p-3">
        <p className="mb-2 text-xs font-medium text-white">Value over time</p>
        <svg viewBox={`0 -6 ${W} ${H + 24}`} className="w-full overflow-visible" aria-label={`Value falls from ${money(asset.price)} to ${money(now)}`}>
          <line x1={x(asset.age)} x2={W} y1={y(now)} y2={H} stroke="#F6CF45" strokeOpacity={0.4} strokeDasharray="4 4" strokeWidth={1.5} />
          <motion.path
            d={`M0 ${y(asset.price)} L${x(asset.age)} ${y(now)}`}
            stroke="#F6CF45"
            strokeWidth={2.5}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
          <motion.circle cx={x(asset.age)} cy={y(now)} r={4.5} fill="#050505" stroke="#FFAE3F" strokeWidth={2.5} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
          <text x={0} y={H + 18} className="fill-white/40 font-mono text-[9px]">bought</text>
          <text x={x(asset.age)} y={H + 18} textAnchor="middle" className="fill-[#FFAE3F] font-mono text-[9px]">today</text>
          <text x={W} y={H + 18} textAnchor="end" className="fill-white/40 font-mono text-[9px]">
            {Number.isInteger(life) ? life : life.toFixed(1)}y
          </text>
        </svg>
      </div>
    </motion.aside>
  );
}

export function AssetsMock() {
  const [catId, setCatId] = useState("laptops");
  const [sortDepreciated, setSortDepreciated] = useState(false);
  const [open, setOpen] = useState<Asset | null>(null);
  const cat = CATEGORIES.find((c) => c.id === catId)!;

  const rows = useMemo(() => {
    const list = [...cat.assets];
    if (sortDepreciated) list.sort((a, b) => percentLeft(a, cat.rate) - percentLeft(b, cat.rate));
    return list;
  }, [cat, sortDepreciated]);
  const total = cat.assets.reduce((s, a) => s + valueToday(a, cat.rate), 0);

  return (
    <div className="relative flex h-full flex-col overflow-hidden md:flex-row">
      {/* categories sidebar */}
      <div className="shrink-0 border-white/10 p-3 md:w-48 md:border-r md:p-4">
        <p className="hidden text-sm font-bold text-white md:block">Categories</p>
        <div className="mt-2 hidden items-center gap-2 rounded-lg bg-[#1F1F1F] px-2.5 py-1.5 text-xs text-white/35 md:flex">
          <FiSearch size={11} aria-hidden /> Search category…
        </div>
        <ul className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1 md:mt-3 md:flex-col md:overflow-visible md:pb-0">
          {CATEGORIES.map((c) => (
            <li key={c.id} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setCatId(c.id);
                  setOpen(null);
                }}
                className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${catId === c.id ? "bg-primary/15 text-white ring-1 ring-primary/40" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
              >
                <span className="whitespace-nowrap">{c.name}</span>
                <span className={`rounded-md px-1.5 font-mono text-[10px] ${c.assets.length ? "bg-white/10" : "bg-white/5 text-white/30"}`}>{c.assets.length}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* table */}
      <div className="flex min-w-0 flex-1 flex-col p-3 pt-0 md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-white">{cat.name}</p>
            <p className="text-xs text-[#9A9696]">
              {cat.rate}% / year · {cat.assets.length} assets · <span className="text-primary">{money(total)}</span> today
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSortDepreciated((v) => !v)}
              aria-pressed={sortDepreciated}
              className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs transition-colors ${sortDepreciated ? "bg-red-500/15 text-red-300 ring-1 ring-red-500/40" : "bg-white/5 text-white/70 hover:text-white"}`}
            >
              <FiTrendingDown size={12} aria-hidden /> Most depreciated
            </button>
            <span className="hidden h-8 items-center gap-1 rounded-full px-3 text-xs text-primary ring-1 ring-primary/30 sm:flex">
              <FiPlus size={12} aria-hidden /> New asset
            </span>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-10 text-center">
            <p className="text-sm text-white/60">No assets in this category yet.</p>
            <p className="mt-1 text-xs text-primary">Add the first asset</p>
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl ring-1 ring-white/10">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1a1a1a] font-mono text-[10px] uppercase tracking-wider text-[#9A9696]">
                <tr>
                  <th className="px-3 py-2.5 font-normal">Asset</th>
                  <th className="hidden px-3 py-2.5 font-normal lg:table-cell">Acquired</th>
                  <th className="hidden px-3 py-2.5 text-right font-normal sm:table-cell">Purchase</th>
                  <th className="px-3 py-2.5 text-right font-normal">Today</th>
                  <th className="whitespace-nowrap px-3 py-2.5 font-normal sm:w-32">Value left</th>
                  <th className="w-6" />
                </tr>
              </thead>
              <motion.tbody layout>
                {rows.map((a) => {
                  const pct = percentLeft(a, cat.rate);
                  const tone = valueTone(pct);
                  return (
                    <motion.tr
                      key={a.code}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 36 }}
                      onClick={() => setOpen(a)}
                      onKeyDown={(e) => e.key === "Enter" && setOpen(a)}
                      tabIndex={0}
                      className={`cursor-pointer border-t border-white/5 transition-colors hover:bg-white/[0.04] ${open?.code === a.code ? "bg-primary/[0.07]" : ""}`}
                    >
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${tone.bg}`}>{a.name.charAt(0)}</span>
                          <div className="min-w-0">
                            <p className="truncate text-white">{a.name}</p>
                            <p className="font-mono text-[10px] text-white/35">{a.code}</p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-3 py-2.5 text-white/60 lg:table-cell">{a.acquired}</td>
                      <td className="hidden px-3 py-2.5 text-right text-white/60 sm:table-cell">{money(a.price)}</td>
                      <td className="px-3 py-2.5 text-right font-medium text-white">{money(valueToday(a, cat.rate))}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="hidden h-1.5 flex-1 overflow-hidden rounded-full bg-white/10 sm:block">
                            <motion.div
                              className={`h-full rounded-full ${tone.bg}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                          <span className={`w-8 text-right font-mono text-[10px] ${tone.text}`}>{pct}%</span>
                        </div>
                      </td>
                      <td className="pr-2 text-white/30">
                        <FiChevronRight size={14} aria-hidden />
                      </td>
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        )}
        {rows.length > 0 && !open && (
          <p className="mt-3 font-mono text-[10px] text-white/35">↑ Click a row to open the asset</p>
        )}
      </div>

      <AnimatePresence>
        {open && <DetailPanel key={open.code} asset={open} rate={cat.rate} category={cat.name} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}
