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
  // Impede fechar por Esc/clique fora enquanto uma ação está em andamento.
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
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
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
                    "pointer-events-auto relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl focus:outline-none",
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
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            tom === "danger" ? "bg-red-500/15 text-red-400" : "bg-primary text-primary-foreground"
          )}>
            {icone}
          </div>
        )}
        <div className="min-w-0">
          <Dialog.Title className="truncate text-lg font-bold text-white sm:text-xl">{titulo}</Dialog.Title>
          {subtitulo && <p className="truncate text-sm text-subtle">{subtitulo}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-surface-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <MdClose size={22} />
      </button>
    </div>
  )
}

export const ModalTitle = Dialog.Title
