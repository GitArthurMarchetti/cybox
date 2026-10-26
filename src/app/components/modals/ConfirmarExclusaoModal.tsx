"use client"

import { Modal, ModalTitle } from '@/components/ui/modal';
import { useState } from 'react';
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
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-md" bloquearFechamento={isProcessing}>
                        <div className="p-8 text-center">

                            <div className="mx-auto mb-6 w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                                <MdWarning className="text-red-500 text-3xl" />
                            </div>


                            <ModalTitle className="text-2xl font-bold text-white mb-3">
                                {titulo}
                            </ModalTitle>


                            <p className="text-muted mb-2 leading-relaxed">
                                {descricao}
                            </p>


                            {itemNome && (
                                <div className="bg-surface-2 rounded-lg p-4 mb-6 border border-red-500/20">
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


                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-8">
                                <p className="text-amber-400 text-sm">
                                    Esta ação não pode ser desfeita!
                                </p>
                            </div>


                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isProcessing || isLoading}
                                    className="flex-1 px-6 py-3 bg-surface-2 text-white rounded-lg hover:bg-surface-3 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    </Modal>
    );
}