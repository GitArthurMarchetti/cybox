"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import { MdClose } from "react-icons/md"

import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  // Prevents closing with Esc / outside click while an action is running.
  bloquearFechamento?: boolean
}

export function Modal({ isOpen, onClose, children, className, bloquearFechamento = false }: ModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(aberto) => { if (!aberto && !bloquearFechamento) onClose() }}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  className={cn(
                    "pointer-events-auto relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] focus:outline-none before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent",
                    className
                  )}
                  initial={{ scale: 0.95, opacity: 0, y: 16 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 16 }}
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                >
                  {children}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}

interface ModalHeaderProps {
  titulo: React.ReactNode
  subtitulo?: React.ReactNode
  icone?: React.ReactNode
  onClose: () => void
  tom?: "primary" | "danger"
  className?: string
}

export function ModalHeader({ titulo, subtitulo, icone, onClose, tom = "primary", className }: ModalHeaderProps) {
  return (
    <div className={cn("flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-6 sm:py-5", className)}>
      <div className="flex min-w-0 items-center gap-3">
        {icone && (
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
            tom === "danger" ? "border-red-500/30 bg-red-500/10 text-red-400" : "border-primary/30 bg-primary/10 text-primary"
          )}>
            {icone}
          </div>
        )}
        <div className="min-w-0">
          <Dialog.Title className="truncate font-display text-base font-semibold tracking-tight text-white sm:text-lg">{titulo}</Dialog.Title>
          {subtitulo && <p className="truncate text-sm text-subtle">{subtitulo}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-subtle transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <MdClose size={22} />
      </button>
    </div>
  )
}

export const ModalTitle = Dialog.Title
