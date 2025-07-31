"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDeleteBinLine } from 'react-icons/ri';
import { MdWarning, MdCategory, MdComputer } from 'react-icons/md';
import { FaBuilding } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface ConfirmarExclusaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    titulo: string;
    descricao: string;
    itemNome?: string;
    tipo?: 'categoria' | 'departamento' | 'patrimonio' | 'custom';
    isLoading?: boolean;
}

export default function ConfirmarExclusaoModal({
    isOpen,
    onClose,
    onConfirm,
    titulo,
    descricao,
    itemNome,
    tipo = 'custom',
    isLoading = false
}: ConfirmarExclusaoModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirm = async () => {
        setIsProcessing(true);
        try {
            await onConfirm();
        } finally {
            setIsProcessing(false);
        }
    };

    const getIcon = () => {
        switch (tipo) {
            case 'categoria':
                return <MdCategory className="text-red-400" size={24} />;
            case 'departamento':
                return <FaBuilding className="text-red-400" size={20} />;
            case 'patrimonio':
                return <MdComputer className="text-red-400" size={24} />;
            default:
                return <MdWarning className="text-red-400" size={24} />;
        }
    };

    const getCorDestaque = () => {
        return 'text-red-400';
    };

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
                        <div className="p-8 text-center">
                            {/* Ícone de aviso */}
                            <div className="mx-auto mb-6 w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <MdWarning className="text-red-500 text-3xl" />
                            </div>

                            {/* Título */}
                            <h2 className="text-2xl font-bold text-white mb-3">
                                {titulo}
                            </h2>

                            {/* Descrição */}
                            <p className="text-[#b4b4b4] mb-2 leading-relaxed">
                                {descricao}
                            </p>

                            {/* Nome do item se fornecido */}
                            {itemNome && (
                                <div className="bg-[#2c2c2c] rounded-lg p-4 mb-6 border border-red-500/20">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="flex items-center justify-center">
                                            {getIcon()}
                                        </div>
                                        <span className={`font-medium text-lg ${getCorDestaque()}`}>
                                            {itemNome}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Aviso adicional */}
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-8">
                                <p className="text-amber-400 text-sm">
                                    ⚠️ Esta ação não pode ser desfeita!
                                </p>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isProcessing || isLoading}
                                    className="flex-1 px-6 py-3 bg-[#2c2c2c] text-white rounded-lg hover:bg-[#3c3c3c] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancelar
                                </button>

                                <button
                                    onClick={handleConfirm}
                                    disabled={isProcessing || isLoading}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {(isProcessing || isLoading) ? (
                                        <>
                                            <AiOutlineLoading3Quarters className="animate-spin h-4 w-4" />
                                            Excluindo...
                                        </>
                                    ) : (
                                        <>
                                            <RiDeleteBinLine size={16} />
                                            Excluir
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}