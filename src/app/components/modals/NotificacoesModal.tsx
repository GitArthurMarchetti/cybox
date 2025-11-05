'use client'

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose, MdNotifications, MdConstruction } from 'react-icons/md';

interface NotificacoesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificacoesModal({ isOpen, onClose }: NotificacoesModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-[#1F1F1F] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-[#2c2c2c]"
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-[#2c2c2c] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#F6CF45] rounded-lg">
                                    <MdNotifications className="text-black" size={20} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Notificações</h2>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-[#2c2c2c] rounded-lg transition-colors duration-300 text-[#8c8888] hover:text-white"
                            >
                                <MdClose size={24} />
                            </button>
                        </div>

                        <div className="p-8 flex flex-col items-center justify-center text-center">
                            <div className="mb-6 p-6 bg-[#F6CF45]/10 rounded-full">
                                <MdConstruction className="text-[#F6CF45]" size={64} />
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-3">Em Breve!</h3>

                            <p className="text-[#b4b4b4] mb-2">
                                Estamos trabalhando nesta funcionalidade.
                            </p>

                            <p className="text-sm text-[#8c8888]">
                                Em breve você poderá receber e gerenciar suas notificações aqui.
                            </p>

                            <button
                                onClick={onClose}
                                className="mt-6 px-6 py-3 bg-[#F6CF45] text-black rounded-lg hover:bg-[#f7d665] transition-colors duration-300 font-medium"
                            >
                                Entendi
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
