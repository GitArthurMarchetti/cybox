'use client'

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiCopy, FiMail, FiRefreshCw, FiX } from "react-icons/fi";
import { INVITE_CODE, MEMBERS, PERMISSIONS, ROLE_BADGE, ROLE_LABEL, type Role } from "./data";

const VIEWER: Record<Role, string> = { owner: "ana@acme.co", admin: "lucas@acme.co", member: "bia@acme.co" };

export function RolesMock() {
  const [role, setRole] = useState<Role>("owner");
  const canRegenerate = role !== "member";

  return (
    <div className="grid h-full grid-cols-1 gap-5 p-4 sm:p-6 md:grid-cols-2">
      {/* Members + invite */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-lg font-bold text-white">Members</p>
          <p className="text-xs text-[#9A9696]">Operations · {MEMBERS.length} people</p>
        </div>
        <ul className="flex flex-col gap-2">
          {MEMBERS.map((m) => {
            const isYou = m.email === VIEWER[role];
            return (
              <motion.li
                key={m.email}
                layout
                className={`flex items-center gap-3 rounded-lg p-2.5 transition-colors ${isYou ? "bg-[#2C2C2C] ring-1 ring-primary/40" : "bg-[#1F1F1F]"}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-black" style={{ background: m.color }}>
                  {m.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">
                    {m.name} {isYou && <span className="font-mono text-[10px] text-primary">(you)</span>}
                  </p>
                  <p className="truncate text-xs text-[#9A9696]">{m.email}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${ROLE_BADGE[m.role]}`}>{ROLE_LABEL[m.role]}</span>
              </motion.li>
            );
          })}
        </ul>

        <div className="rounded-xl bg-[#1F1F1F] p-3">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#9A9696]">Invite code</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="flex-1 rounded-lg border border-dashed border-primary/40 px-3 py-1.5 font-mono text-sm tracking-[0.25em] text-primary">{INVITE_CODE}</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2C2C2C] text-white/70" title="Copy">
              <FiCopy size={13} aria-hidden />
            </span>
            <motion.span
              animate={{ opacity: canRegenerate ? 1 : 0.3 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2C2C2C] text-white/70"
              title={canRegenerate ? "Regenerate" : "Only owners and admins"}
            >
              <FiRefreshCw size={13} aria-hidden />
            </motion.span>
          </div>
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-[#0F0F0F] px-3 py-2 text-xs text-white/40">
            <FiMail size={12} aria-hidden /> or invite by email…
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-lg font-bold text-white">What can I do?</p>
          <p className="text-xs text-[#9A9696]">Switch roles to see how permissions change.</p>
        </div>
        <div className="relative grid grid-cols-3 rounded-full bg-[#1F1F1F] p-1" role="tablist" aria-label="View as role">
          {(["owner", "admin", "member"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={role === r}
              onClick={() => setRole(r)}
              className={`relative h-8 rounded-full text-xs font-medium transition-colors ${role === r ? "text-black" : "text-white/60 hover:text-white"}`}
            >
              {role === r && <motion.span layoutId="role-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{ROLE_LABEL[r]}</span>
            </button>
          ))}
        </div>
        <ul className="flex flex-col gap-1.5">
          {PERMISSIONS.map((p, i) => {
            const allowed = p.roles.includes(role);
            return (
              <li key={p.label} className="flex items-center gap-3 rounded-lg px-2 py-2">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={allowed ? "y" : "n"}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ delay: i * 0.03, type: "spring", stiffness: 500, damping: 25 }}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${allowed ? "bg-green-500/15 text-green-400" : "bg-red-500/10 text-red-400"}`}
                  >
                    {allowed ? <FiCheck size={14} strokeWidth={3} /> : <FiX size={14} strokeWidth={3} />}
                  </motion.span>
                </AnimatePresence>
                <span className={`text-sm transition-colors ${allowed ? "text-white" : "text-white/35 line-through decoration-white/20"}`}>{p.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
