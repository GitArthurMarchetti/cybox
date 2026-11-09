'use client'

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMapPin, FiPlus, FiLogIn, FiBox } from "react-icons/fi";
import { INVITE_CODE, JOINED_ROOM, MEMBERS, ROLE_BADGE, ROLE_LABEL, ROOMS, compact, type Room } from "./data";

type Phase = "idle" | "typing" | "joining" | "done";

function RoomCard({ room, fresh = false, onOpen }: { room: Room; fresh?: boolean; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      layout
      initial={fresh ? { opacity: 0, scale: 0.85, y: 10 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`group overflow-hidden rounded-xl bg-[#1F1F1F] text-left transition-colors hover:bg-[#262626] ${fresh ? "ring-2 ring-primary" : "ring-1 ring-white/5"}`}
    >
      <div className={`relative h-16 bg-gradient-to-br ${room.hue} to-[#141414] sm:h-20`}>
        <FiBox className="absolute bottom-2 left-3 text-white/30" size={22} aria-hidden />
        <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[room.role]}`}>{ROLE_LABEL[room.role]}</span>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-semibold text-white">{room.name}</p>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-[#9A9696]">
          <FiMapPin size={10} aria-hidden /> {room.location}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div className="flex -space-x-1.5">
            {MEMBERS.slice(0, Math.min(3, room.members)).map((m) => (
              <span key={m.email} className="h-5 w-5 rounded-full border-2 border-[#1F1F1F]" style={{ background: m.color }} />
            ))}
            {room.members > 3 && (
              <span className="flex h-5 items-center rounded-full border-2 border-[#1F1F1F] bg-[#3D3D3D] px-1 text-[9px] text-white">+{room.members - 3}</span>
            )}
          </div>
          <div className="text-right">
            <p className="whitespace-nowrap font-mono text-[10px] text-[#9A9696]">{room.assets} assets</p>
            <p className="text-sm font-semibold text-primary">{compact(room.value)}</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export function RoomsMock({ onOpenRoom }: { onOpenRoom: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runJoin = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    setPhase("typing");
    setTyped(0);
    for (let i = 1; i <= INVITE_CODE.length; i++) at(500 + i * 110, () => setTyped(i));
    at(500 + INVITE_CODE.length * 110 + 350, () => setPhase("joining"));
    at(500 + INVITE_CODE.length * 110 + 1150, () => setPhase("done"));
  }, []);

  useEffect(() => {
    const t = setTimeout(runJoin, 1400);
    const list = timers;
    return () => {
      clearTimeout(t);
      list.current.forEach(clearTimeout);
    };
  }, [runJoin]);

  const rooms = phase === "done" ? [...ROOMS, JOINED_ROOM] : ROOMS;

  return (
    <div className="relative h-full p-4 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-lg font-bold text-white">Your rooms</p>
          <p className="text-xs text-[#9A9696]">{rooms.length} rooms · one per department</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={runJoin}
            className="flex h-8 items-center gap-1.5 rounded-full border border-white/15 px-3 text-xs text-white transition-colors hover:border-primary"
          >
            <FiLogIn size={12} aria-hidden /> Join with code
          </button>
          <span className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-xs font-medium text-black">
            <FiPlus size={12} aria-hidden /> New room
          </span>
        </div>
      </div>

      <motion.div layout className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} fresh={room.id === JOINED_ROOM.id} onOpen={onOpenRoom} />
        ))}
      </motion.div>

      {/* "Join a room" dialog */}
      <AnimatePresence>
        {(phase === "typing" || phase === "joining") && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-[280px] rounded-2xl bg-[#1F1F1F] p-5 ring-1 ring-white/10"
            >
              <p className="font-semibold text-white">Join a room</p>
              <p className="mt-1 text-xs text-[#9A9696]">Paste the invite code a teammate shared with you.</p>
              <div className="mt-4 flex h-11 items-center rounded-lg bg-[#0F0F0F] px-3 font-mono tracking-[0.25em] text-primary ring-1 ring-primary/40">
                {INVITE_CODE.slice(0, typed)}
                {phase === "typing" && <span className="ml-0.5 h-5 w-[2px] animate-blink bg-primary" />}
              </div>
              <div className="mt-4 flex h-9 items-center justify-center rounded-lg bg-primary text-sm font-medium text-black">
                {phase === "joining" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/30 border-t-black" /> Joining…
                  </span>
                ) : (
                  "Join"
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "done" && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center font-mono text-xs text-white/55"
        >
          You joined <span className="text-primary">Marketing</span> as a member. Click any room to open it.
        </motion.p>
      )}
    </div>
  );
}
